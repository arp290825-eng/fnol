"""
Email Ingestion Microservice.

Fetches emails from IMAP, classifies via LLM (FNOL vs non-FNOL),
ingests only FNOL-related content. Uses backend.ingested_claims for storage.
"""

import email
import json
import os
import re
import ssl
import sys
from email import policy
from email.header import decode_header
from typing import Any, Dict, List, Optional, Tuple

import imaplib

from backend.common.config import ENV_FILE
from backend.faq_resolution.service import process_faq_email
from backend.ingested_claims.service import (
    add_dedup_keys_to_set,
    add_faq_answered_id,
    get_existing_message_ids,
    get_faq_answered_id_set,
    is_duplicate_email,
    is_reply_to_existing_claim,
    save_faq_conversation,
    save_ingested_claim,
)


def _norm_key(s: str) -> str:
    """Lowercase + strip for dedup key comparison (mirrors ingested_claims._normalize_key)."""
    return (s or "").strip().lower()


def _strip_angle(mid: str) -> str:
    """Strip angle brackets from a Message-ID (mirrors ingested_claims._inner_message_id)."""
    return mid.replace("<", "").replace(">", "").strip()


def _load_env() -> None:
    """Load env vars from .env if present."""
    if ENV_FILE.exists():
        with open(ENV_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))


def _text(subject: str, body: str) -> str:
    return f"{subject} {body}".lower()


def _primary_message_text(body: str) -> str:
    """
    Text the sender most likely authored (above quoted reply / forward).
    Stops consumer-support templates in quoted threads from tripping keyword gates.
    """
    if not body or not str(body).strip():
        return ""
    b = str(body).replace("\r\n", "\n")
    patterns = [
        re.compile(r"\nOn .{5,220} wrote:\s*\n", re.IGNORECASE | re.DOTALL),
        re.compile(r"\n-{5,}\s*Original Message\s*-{5,}\s*\n", re.IGNORECASE),
        re.compile(r"\nFrom:\s*.+\nSent:\s*.+\nTo:\s*.+", re.IGNORECASE),
        re.compile(r"\n_{32,}\s*\n"),
    ]
    earliest = len(b)
    for pat in patterns:
        m = pat.search(b)
        if m and m.start() < earliest:
            earliest = m.start()
    if earliest >= len(b):
        return b.strip()
    return b[:earliest].strip()


def _has_insurance_or_claim_context(text: str) -> bool:
    """
    Signals that the email is about an insurance / policy claim, not a generic product complaint.

    Note: Do NOT treat bare 'Claims Department' as insurance context — retail/warranty emails use it too.
    """
    patterns = [
        r"\binsurance\b",
        r"\binsurer\b",
        r"\bpolicy\b",
        r"\bpolicies\b",
        r"\binsured\b",
        r"\bcoverage\b",
        r"\bpremium\b",
        r"\bdeductible\b",
        r"\bunderwriter\b",
        r"\badjuster\b",
        r"\binsurance\s+claims?\b",
        r"\bclaims?\s+adjuster\b",
        r"\binsurance\s+claim\b",
        r"\bpolicy\s*#?\s*[A-Za-z0-9]",
        r"\b(policy|claim)\s*(number|no\.?|#|id|ref)\b",
        r"\bfnol\b",
        r"\bfirst notice of loss\b",
        r"\bnotice of loss\b",
    ]
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def _has_explicit_claim_phrasing(text: str) -> bool:
    """Clear intent to file or discuss an insurance claim / FNOL (passes without peril words)."""
    patterns = [
        r"\bfnol\b",
        r"\bfirst notice of loss\b",
        r"\bnotice of loss\b",
        r"\binsurance claim\b",
        r"\bfile\s+(a\s+)?claim\b",
        r"\bsubmit\s+(a\s+)?claim\b",
        r"\breport\s+(a\s+)?claim\b",
        r"\breport\s+(a\s+|an\s+)(car\s+|auto\s+)?accident\b",
        r"\breport\s+an?\s+accident\b",
        r"\bopen\s+(a\s+)?claim\b",
        r"\blodge\s+(a\s+)?claim\b",
        r"\bclaim\s+(number|no\.?|id|reference)\b",
        r"\bclaim(s)?\s*#\s*\w",
        r"\bnew\s+claim\b",
    ]
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def _has_peril_language(text: str) -> bool:
    """Damage / loss / accident wording (too broad alone — needs insurance context)."""
    patterns = [
        r"\bproperty damage\b",
        r"\bvehicle damage\b",
        r"\bauto damage\b",
        r"\bcar damage\b",
        r"\bdamage report\b",
        r"\bdamaged\b",
        r"\bdamage\b",
        r"\bloss report\b",
        r"\blosses\b",
        r"\bloss\b",
        r"\bincident report\b",
        r"\bincidents\b",
        r"\bincident\b",
        r"\baccident report\b",
        r"\baccidents\b",
        r"\baccident\b",
    ]
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def _keyword_surface_text(subject: str, body: str) -> str:
    """Subject + latest non-quoted segment so reply-all threads do not inherit quoted keywords."""
    primary = _primary_message_text(body)
    surface_body = primary.strip() if primary.strip() else body
    return _text(subject, surface_body)


def _has_strong_insurance_fnol_signal(text: str) -> bool:
    """Clear P&C / FNOL signals in the surface text (not consumer warranty templates)."""
    if re.search(r"\b(fnol|first notice of loss|notice of loss)\b", text, re.IGNORECASE):
        return True
    if re.search(r"\binsurance\s+claim\b", text, re.IGNORECASE):
        return True
    if re.search(r"\bpolicy\s*#?\s*[A-Za-z0-9]{4,}", text, re.IGNORECASE):
        return True
    return False


def _thread_smells_like_oem_customer_complaint(full_lc: str) -> bool:
    """
    Retail / manufacturer complaint workflows (RMA, product complaint, doc requests).
    These often say 'claim' meaning support ticket — not P&C insurance FNOL.
    """
    if re.search(r"\bwe\s+have\s+received\s+your\s+complaint\b", full_lc):
        return True
    if re.search(r"\breceived\s+your\s+complaint\s*\(", full_lc):
        return True
    if re.search(r"\bprogress\s+your\s+complaint\b", full_lc):
        return True
    if re.search(r"\bcomplaint\s*\(\s*reference\s*:", full_lc):
        return True
    if re.search(r"\bcomplaint\s+reference\b", full_lc):
        return True
    if re.search(r"\bcmp-ing-\d", full_lc):
        return True
    if re.search(r"\bconsumer\s+electronics\b", full_lc) and re.search(r"\bcomplaint\b", full_lc):
        return True
    if re.search(r"customer\s+support\s+team", full_lc) and re.search(r"\bcomplaint\b", full_lc):
        return True
    if re.search(r"thank\s+you\s+for\s+getting\s+in\s+touch\s+with", full_lc) and re.search(
        r"customer\s+support", full_lc
    ):
        return True
    return False


def _should_reject_consumer_complaint_correspondence(subject: str, body: str) -> bool:
    """
    Reject retail / customer-support complaint threads and document follow-ups unless
    the latest message clearly references insurance / FNOL.
    """
    primary = _primary_message_text(body)
    surface_raw = primary.strip() if primary.strip() else body
    surface = (subject + "\n" + surface_raw).lower()
    full = (subject + "\n" + body).lower()
    primary_lc = surface_raw.lower()
    latest_len = len(surface_raw.strip())

    if _has_strong_insurance_fnol_signal(surface):
        return False

    oem_in_full = _thread_smells_like_oem_customer_complaint(full)
    oem_in_primary = _thread_smells_like_oem_customer_complaint(primary_lc)

    # Whole latest message is (or embeds) a retailer complaint workflow email
    if oem_in_primary:
        if latest_len >= 220 and _has_strong_insurance_fnol_signal(surface):
            return False
        return True

    # Short reply (e.g. "PFA invoice") above quoted OEM thread — reject if thread is OEM
    if oem_in_full and latest_len < 180:
        if _has_strong_insurance_fnol_signal(surface):
            return False
        return True

    # Latest segment sounds like P&C — do not skip if full thread still matches OEM complaint
    if _has_insurance_or_claim_context(surface) and len(surface.strip()) > 40:
        if not oem_in_full:
            return False

    complaint_markers = [
        r"\bcomplaint\s+reference\b",
        r"\byour\s+complaint\s*\(",
        r"\bprogress\s+your\s+complaint\b",
        r"\breceived\s+your\s+complaint\b",
        r"\bwe\s+have\s+received\s+your\s+complaint\b",
        r"\bconsumer\s+electronics\b.*\bsupport\b",
    ]
    if not any(re.search(p, full) for p in complaint_markers):
        return False

    if (
        _has_explicit_claim_phrasing(surface)
        and _has_insurance_or_claim_context(surface)
        and not oem_in_full
    ):
        return False

    # Long P&C narrative may quote OEM email below — do not reject
    if latest_len >= 220 and _has_insurance_or_claim_context(surface) and (
        _has_peril_language(surface) or _has_strong_insurance_fnol_signal(surface)
    ):
        return False

    return True


def _has_relevant_keywords(subject: str, body: str) -> bool:
    """
    Gate for FNOL ingestion: insurance-claim intent, not generic complaints.

    Pass if explicit claim/FNOL phrasing exists, OR (peril language AND insurance/policy context).
    Uses the latest message segment only (not quoted customer-support templates).
    """
    text = _keyword_surface_text(subject, body)
    full_lc = (subject + "\n" + body).lower()
    primary_raw = _primary_message_text(body).strip() or body
    plen = len(primary_raw.strip())
    if _thread_smells_like_oem_customer_complaint(primary_raw.lower()):
        return _has_strong_insurance_fnol_signal(text)
    if _thread_smells_like_oem_customer_complaint(full_lc) and plen < 180:
        return _has_strong_insurance_fnol_signal(text)

    if _has_explicit_claim_phrasing(text):
        return True
    if re.search(r"\bclaims?\b", text) and _has_insurance_or_claim_context(text):
        return True
    if _has_peril_language(text) and _has_insurance_or_claim_context(text):
        return True
    return False


def _has_strong_keywords(subject: str, body: str) -> bool:
    """
    Strong FNOL indicators for LLM-offline fallback: explicit claim/FNOL or peril + insurance context.
    """
    text = _keyword_surface_text(subject, body)
    full_lc = (subject + "\n" + body).lower()
    primary_raw = _primary_message_text(body).strip() or body
    plen = len(primary_raw.strip())
    if _thread_smells_like_oem_customer_complaint(primary_raw.lower()):
        return _has_strong_insurance_fnol_signal(text)
    if _thread_smells_like_oem_customer_complaint(full_lc) and plen < 180:
        return _has_strong_insurance_fnol_signal(text)

    if _has_explicit_claim_phrasing(text):
        return True
    if re.search(r"\bclaims?\b", text) and _has_insurance_or_claim_context(text):
        return True
    if _has_peril_language(text) and _has_insurance_or_claim_context(text):
        return True
    return False


def _is_clearly_procedural_faq_question(subject: str, body: str) -> bool:
    """
    Return True when the email is clearly a procedural FAQ inquiry — not an FNOL submission.

    Examples that return True: "How do I file a claim?", "When will my policy expire?",
    "What is my deductible?", "Help me find my policy number".

    FNOL narrative words (accident, damage, crash…) anywhere in the latest message
    immediately disqualify the email so genuine FNOLs are never blocked.
    """
    primary = _primary_message_text(body).strip()
    text = f"{subject} {primary}".lower() if primary else f"{subject} {body[:2000]}".lower()

    # If FNOL-narrative words are present anywhere in the latest message, this is NOT a pure FAQ
    if re.search(
        r"\b(report|reporting)\s+(a\s+|an\s+)?(car\s+|auto\s+|vehicle\s+)?(accident|collision|crash|incident)\b",
        text,
    ):
        return False
    if re.search(r"\b(car|auto|vehicle)\s+(accident|collision|crash)\b", text):
        return False
    if re.search(r"\b(police|ambulance)\s+(responded|came|arrived)\b", text):
        return False
    if re.search(r"\b(property|vehicle|car|home|house)\s+damage(d)?\b", text):
        return False
    if re.search(r"\b(was|got|been)\s+(hit|struck|rear-?ended|flooded|damaged|stolen)\b", text):
        return False

    # Procedural: "how do I / how to / how can I file / submit / report a claim"
    if re.search(
        r"\bhow\s+(to|do\s+i|can\s+i|do\s+we)\s+(file|submit|report|open|lodge|start)\s+(a\s+)?claim\b",
        text,
    ):
        return True

    # Short procedural question: "how do I file" + "claim" with no incident narrative
    if (
        re.search(r"\bhow\s+(do\s+i|can\s+i|do\s+we)\b", text)
        and re.search(r"\b(file|submit|open|report)\b", text)
        and re.search(r"\bclaim\b", text)
        and len((primary or body).strip()) < 350
    ):
        return True

    # Policy expiry / renewal inquiry
    if re.search(r"\bwhen\s+(is|does|will|do)\s+(my\s+)?poli?cy\b", text):
        return True
    if re.search(r"\bwhen\s+my\s+poli?cy\b", text):
        return True

    # Deductible lookup
    if re.search(r"\bwhat\s+is\s+my\s+deductible\b", text):
        return True
    if re.search(r"\bhow\s+much\s+is\s+my\s+deductible\b", text):
        return True

    # Policy number lookup
    if re.search(r"\bwhat\s+is\s+my\s+poli?cy\s+number\b", text):
        return True
    if re.search(r"\b(help\s+me\s+)?find\s+my\s+poli?cy\s+number\b", text):
        return True

    # Coverage inclusion query
    if re.search(r"\b(is|are)\s+.{1,60}\s+(included|covered)\s+in\s+my\s+poli?cy\b", text):
        return True

    return False


def should_ingest_incoming_email(subject: str, body: str) -> bool:
    """
    Public entry: same classification as IMAP sync (keywords + optional LLM).
    Use for SendGrid and any path that must not ingest non-claim mail.
    """
    _load_env()
    if _should_reject_consumer_complaint_correspondence(subject, body):
        if os.environ.get("FNOL_VERBOSE_SKIP_LOGS", "false").lower() in ("true", "1", "yes"):
            print(
                f"Skipped: consumer complaint / support correspondence (not insurance FNOL) — {subject[:100]}",
                file=sys.stderr,
            )
        return False
    # Procedural FAQ questions (how to file, policy expiry, etc.) must never be ingested as FNOL
    if _is_clearly_procedural_faq_question(subject, body):
        return False
    return _classify_fnol_by_llm(subject, body)


def _classify_fnol_by_llm(subject: str, body: str) -> bool:
    """LLM-based FNOL classifier — keywords on latest message; LLM judges FNOL vs complaint follow-up."""
    # Consumer-complaint / OEM thread gate lives in should_ingest_incoming_email only.

    # First, check for relevant keywords - if none found, reject immediately
    if not _has_relevant_keywords(subject, body):
        return False

    # If filter is disabled but email has relevant keywords, allow through
    if os.environ.get("FNOL_FILTER_ENABLED", "true").lower() == "false":
        return True

    # Check for strong keywords - if present, allow through even without LLM
    has_strong = _has_strong_keywords(subject, body)

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # If no API key but has strong keywords, allow through
        if has_strong:
            return True
        # Otherwise reject
        print("OpenAI API key not configured - email rejected (no strong keywords)", file=sys.stderr)
        return False

    primary = _primary_message_text(body)
    primary_display = primary.strip() if primary.strip() else "(no text above quoted thread — see full body below)"
    llm_user = (
        f"Subject line: {subject}\n\n"
        "=== LATEST message from the sender (decisive) ===\n"
        f"{primary_display[:6000]}\n\n"
        "=== Full email including quoted thread (context only) ===\n"
        "Do NOT treat quoted customer-support or retail complaint templates as the sender filing an insurance FNOL.\n"
        f"{body[:8000]}"
    )

    # LLM: insurance FNOL / claim only (reject product complaints, service complaints, etc.)
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an insurance FNOL (first notice of loss) gate. Reply with ONLY \"yes\" or \"no\". "
                        "Use the LATEST message (first section) to decide intent. Quoted threads are context only.\n"
                        "YES only if the sender is reporting or continuing a **property & casualty / health-plan style "
                        "insurance claim** or FNOL under an insurance policy (auto, home, commercial, etc.).\n"
                        "NO for: replies that only attach invoices/documents for a **product complaint** or "
                        "**retail / manufacturer customer support** ticket; warranty disputes; billing disputes; "
                        "messages whose only insurance-related wording appears inside **quoted** customer-support email; "
                        "FAQ or spam.\n"
                        "NO if the latest message is mostly a **retailer/manufacturer** email about a **complaint** "
                        "(reference CMP-…, \"we have received your complaint\", request for purchase invoice) — "
                        "even if it says \"claim\" meaning a support ticket, not insurance.\n"
                        "A short reply like \"PFA invoice\" above a quoted consumer-support complaint thread is NO."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        "Is the LATEST sender-authored part an insurance FNOL / claim message (not merely a complaint "
                        f"follow-up)?\n\n{llm_user}"
                    ),
                },
            ],
            max_tokens=10,
            temperature=0,
        )
        answer = (response.choices[0].message.content or "").strip().lower()
        is_fnol = answer.startswith("yes")

        kw = _keyword_surface_text(subject, body)
        full_lc = (subject + "\n" + body).lower()
        primary_raw = _primary_message_text(body).strip() or body
        plen = len(primary_raw.strip())
        oem_primary = _thread_smells_like_oem_customer_complaint(primary_raw.lower())
        oem_full = _thread_smells_like_oem_customer_complaint(full_lc)
        allow_llm_override = (
            _has_explicit_claim_phrasing(kw)
            and _has_insurance_or_claim_context(kw)
            and not oem_primary
            and not (oem_full and plen < 180)
        )
        if not is_fnol and allow_llm_override:
            # Procedural FAQ questions (e.g. "how do I file a claim?") must never override
            # the LLM rejection, even if they contain explicit claim phrasing.
            if not _is_clearly_procedural_faq_question(subject, body):
                print(f"LLM rejected but explicit P&C phrasing in latest message - allowing: {subject[:100]}", file=sys.stderr)
                return True

        # Same gate as OPENAI offline path: peril + policy context (or explicit phrasing) — do not let LLM false negatives drop real FNOLs.
        if not is_fnol and has_strong:
            # Procedural FAQ questions must never be forced through by keyword strength alone.
            if not _is_clearly_procedural_faq_question(subject, body):
                print(f"LLM rejected but strong FNOL keyword gate passed - allowing: {subject[:100]}", file=sys.stderr)
                return True

        if not is_fnol:
            print(f"LLM rejected email - Subject: {subject[:100]}", file=sys.stderr)
        return is_fnol
    except Exception as e:
        if _should_reject_consumer_complaint_correspondence(subject, body):
            print(f"LLM error; complaint-correspondence guard rejected — {subject[:100]}", file=sys.stderr)
            return False
        # If LLM fails but has strong keywords, allow through
        if has_strong:
            print(f"LLM error but strong keywords found - allowing: {subject[:100]}", file=sys.stderr)
            return True
        # Otherwise reject
        print(f"LLM classification error: {e} - email rejected", file=sys.stderr)
        return False


def _strip_html(html: str) -> str:
    """Strip HTML tags for plain text body."""
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", html, flags=re.IGNORECASE)
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _get_part_text(part: email.message.Message) -> str:
    """Extract plain text from MIME part."""
    payload = part.get_payload(decode=True)
    if payload is None:
        return ""
    charset = part.get_content_charset() or "utf-8"
    for enc in (charset, "utf-8", "iso-8859-1", "cp1252", "latin-1"):
        try:
            return payload.decode(enc, errors="strict")
        except (LookupError, ValueError, UnicodeDecodeError):
            continue
    return payload.decode("utf-8", errors="replace")


def _decode_header_value(header_val: Any) -> str:
    """Decode MIME-encoded header."""
    if header_val is None or header_val == "":
        return ""
    if isinstance(header_val, bytes):
        try:
            return header_val.decode("utf-8", errors="replace")
        except Exception:
            return header_val.decode("latin-1", errors="replace")
    if isinstance(header_val, str):
        return header_val
    try:
        decoded = decode_header(header_val)
        parts = []
        for part, charset in decoded:
            if part is None:
                continue
            if isinstance(part, bytes):
                ch = charset or "utf-8"
                try:
                    parts.append(part.decode(ch, errors="replace"))
                except (LookupError, ValueError):
                    parts.append(part.decode("utf-8", errors="replace"))
            else:
                parts.append(str(part))
        return "".join(parts).strip()
    except Exception:
        return str(header_val)


def _format_address(addr: Any) -> str:
    """Format email address for display."""
    if addr is None:
        return ""
    if isinstance(addr, (list, tuple)):
        return ", ".join(_format_address(a) for a in addr)
    return _decode_header_value(addr)


def _build_full_email_body(
    subject: str, from_addr: str, to_addr: str, date_str: str, body_text: str
) -> str:
    """Build full email string with headers."""
    lines = []
    if subject:
        lines.append(f"Subject: {subject}")
    if from_addr:
        lines.append(f"From: {from_addr}")
    if to_addr:
        lines.append(f"To: {to_addr}")
    if date_str:
        lines.append(f"Date: {date_str}")
    if lines:
        lines.append("")
    if body_text:
        lines.append(body_text.strip())
    return "\n".join(lines)


def _extract_raw_message(msg_data: list) -> Optional[bytes]:
    """Extract raw RFC822 message bytes from IMAP fetch response."""
    if not msg_data:
        return None
    for item in msg_data:
        if isinstance(item, tuple) and len(item) >= 2:
            raw = item[1]
            if isinstance(raw, bytes) and len(raw) > 100:
                return raw
        elif isinstance(item, bytes) and len(item) > 100 and b"From:" in item:
            return item
    if msg_data and isinstance(msg_data[0], tuple) and len(msg_data[0]) >= 2:
        raw = msg_data[0][1]
        if isinstance(raw, bytes):
            return raw
    return None


def _extract_body_text(msg: email.message.Message) -> str:
    """Extract plain text body from email - ONLY the actual email body, NOT attachments or forwarded content."""
    body_plain = ""
    body_html = ""
    
    # First, try to get the main body from the top-level message
    if not msg.is_multipart():
        # Simple non-multipart message
        ct = msg.get_content_type()
        if ct == "text/plain":
            return _get_part_text(msg)
        elif ct == "text/html":
            return _strip_html(_get_part_text(msg))
        return ""
    
    # For multipart messages, extract only the main body parts
    # Skip parts that are attachments or forwarded content
    for part in msg.walk():
        # Skip multipart containers
        if part.get_content_maintype() == "multipart":
            continue
        
        # Skip parts marked as attachments
        disposition = part.get("Content-Disposition", "")
        if disposition and "attachment" in disposition.lower():
            continue
        
        # Skip parts that are explicitly attachments (even if not marked)
        filename = part.get_filename()
        if filename:
            continue
        
        ct = part.get_content_type()
        
        # Only extract text/plain and text/html that are NOT attachments
        if ct == "text/plain":
            text = _get_part_text(part)
            # Prefer the first non-empty plain text part (usually the main body)
            if text.strip() and not body_plain:
                body_plain = text
        elif ct == "text/html":
            html = _get_part_text(part)
            # Prefer the first non-empty HTML part (usually the main body)
            if html.strip() and not body_html:
                body_html = html
    
    # Return plain text if available, otherwise HTML stripped
    if body_plain.strip():
        return body_plain
    if body_html.strip():
        return _strip_html(body_html)
    
    # Fallback: if no body found, try to get text from the main message
    # This handles edge cases where the structure is unusual
    if msg.is_multipart():
        # Try to get the first text/plain part from the main multipart
        for part in msg.get_payload():
            if isinstance(part, str):
                continue
            if part.get_content_maintype() == "multipart":
                continue
            ct = part.get_content_type()
            disposition = part.get("Content-Disposition", "")
            if "attachment" in disposition.lower():
                continue
            if ct == "text/plain":
                text = _get_part_text(part)
                if text.strip():
                    return text
            elif ct == "text/html":
                html = _get_part_text(part)
                if html.strip():
                    return _strip_html(html)
    
    return ""


def extract_plain_body_from_rfc822(raw: bytes) -> str:
    """Parse raw MIME bytes and return plain text (SendGrid when text/html fields are empty)."""
    if not raw or len(raw) < 20:
        return ""
    try:
        msg = email.message_from_bytes(raw, policy=policy.default)
        return (_extract_body_text(msg) or "").strip()
    except Exception:
        return ""


def sync_inbox() -> Dict[str, Any]:
    """
    Connect to IMAP, fetch emails, filter by FNOL, save claims.

    Returns:
        Dict with success, ingested, scanned, uidsTotalInMailbox, skipped*, mergedFollowUp, errors, hint.
    """
    _load_env()

    host = os.environ.get("IMAP_HOST", "imap.gmail.com")
    port = int(os.environ.get("IMAP_PORT", "993"))
    user = os.environ.get("SENDER_EMAIL") or os.environ.get("IMAP_USER", "")
    password = (os.environ.get("EMAIL_PASSWORD") or os.environ.get("IMAP_PASSWORD", "")).replace(" ", "")
    mailbox = os.environ.get("IMAP_MAILBOX", "INBOX")

    result: Dict[str, Any] = {
        "success": False,
        "ingested": 0,
        "scanned": 0,
        "skippedNoFnol": 0,
        "skippedDuplicate": 0,
        "skippedComplaintCorrespondence": 0,
        "mergedFollowUp": 0,
        "faqAnswered": 0,
        "faqError": 0,
        "errors": [],
    }

    if not user or not password:
        result["errors"].append("IMAP credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.")
        return result

    include_read = os.environ.get("IMAP_SYNC_INCLUDE_READ", "true").lower() in ("true", "1", "yes")
    # 0 = scan every UID in the folder (default). Set IMAP_SYNC_MAX_EMAILS=2000 to cap at newest N for speed.
    max_emails = int(os.environ.get("IMAP_SYNC_MAX_EMAILS", "0"))
    gmail_try_all_mail = os.environ.get("IMAP_GMAIL_TRY_ALL_MAIL", "true").lower() in ("true", "1", "yes")
    # SSL verification: set IMAP_SSL_VERIFY=false to disable certificate verification
    ssl_verify = os.environ.get("IMAP_SSL_VERIFY", "false").lower() not in ("false", "0", "no")

    def parse_uids(data: list) -> List[str]:
        if not data or data[0] is None:
            return []
        raw = data[0]
        s = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else str(raw)
        return [u for u in s.split() if u]

    try:
        # Create SSL context
        # By default, disable certificate verification to handle common SSL issues
        # Set IMAP_SSL_VERIFY=true in .env to enable strict verification
        context = ssl.create_default_context()
        if not ssl_verify:
            context.check_hostname = False
            context.verify_mode = ssl.CERT_NONE
        mail = imaplib.IMAP4_SSL(host, port, ssl_context=context)
        mail.login(user, password)

        mailboxes_to_try = [mailbox]
        if "gmail" in host.lower() and gmail_try_all_mail:
            if include_read and mailbox.upper() == "INBOX":
                mailboxes_to_try = ["[Gmail]/All Mail", "[Google Mail]/All Mail", "INBOX"]
            elif mailbox.upper() == "INBOX":
                mailboxes_to_try.extend(["[Gmail]/All Mail", "[Google Mail]/All Mail"])

        uids: List[str] = []
        for mbox in mailboxes_to_try:
            try:
                status, _ = mail.select(mbox)
                if status != "OK":
                    continue
                _, data = mail.search(None, "ALL" if include_read else "UNSEEN")
                uids = parse_uids(data)
                result["uidsTotalInMailbox"] = len(uids)
                if max_emails > 0 and len(uids) > max_emails:
                    uids = uids[-max_emails:]
                    result["uidsTruncated"] = True
                else:
                    result["uidsTruncated"] = False
                if uids:
                    result["mailboxUsed"] = mbox
                    break
            except Exception:
                continue

        if not uids:
            result["success"] = True
            result["hint"] = (
                "Inbox empty. For Gmail: enable 'All Mail' in IMAP settings, "
                "or set IMAP_MAILBOX='[Gmail]/All Mail' in .env"
            )
            mail.logout()
            return result

        result["scanned"] = len(uids)
        if result.get("uidsTruncated") and max_emails > 0:
            result["hint"] = (
                f"Only the newest {max_emails} of {result.get('uidsTotalInMailbox', '?')} messages were scanned "
                f"(IMAP_SYNC_MAX_EMAILS). Set IMAP_SYNC_MAX_EMAILS=0 to scan the entire folder."
            )
        # Claim IDs: only ingested claim Message-IDs — used to skip already-ingested emails.
        # FAQ IDs: emails already answered as FAQ — checked ONLY in the FAQ path so that
        #          a previously mis-classified email can still be re-evaluated as FNOL.
        existing_ids = get_existing_message_ids()
        faq_ids = get_faq_answered_id_set()
        debug_first_message = True

        for uid in uids:
            try:
                _, msg_data = mail.fetch(uid, "(RFC822)")
                raw = _extract_raw_message(list(msg_data) if hasattr(msg_data, "__iter__") else msg_data)
                if not raw:
                    result["errors"].append(f"Message {uid}: Could not extract raw message")
                    continue
                msg = email.message_from_bytes(raw, policy=policy.default)

                subject = _decode_header_value(msg.get("Subject", "(No subject)") or "(No subject)")
                from_addr = _format_address(msg.get("From", ""))
                to_addr = _format_address(msg.get("To", ""))
                message_id_raw = msg.get("Message-ID", "")
                message_id = _decode_header_value(message_id_raw).strip() if message_id_raw else None
                if not message_id and message_id_raw:
                    message_id = str(message_id_raw).strip()
                date_hdr = msg.get("Date", "")
                dedup_key = message_id or f"{subject}|{from_addr}|{date_hdr}"

                if is_duplicate_email(subject, from_addr, message_id or "", date_hdr, existing_ids):
                    result["skippedDuplicate"] = result.get("skippedDuplicate", 0) + 1
                    continue

                body_text = _extract_body_text(msg)
                if not (body_text or "").strip():
                    body_text = extract_plain_body_from_rfc822(raw) or ""
                if not (body_text or "").strip():
                    for part in msg.walk():
                        if part.get_content_disposition() == "attachment":
                            continue
                        if part.get_content_type() == "text/html":
                            html = _get_part_text(part)
                            if html.strip():
                                body_text = _strip_html(html)
                                break

                # Extract threading headers early — needed before FNOL classification.
                in_reply = _decode_header_value(msg.get("In-Reply-To", "") or "")
                refs_hdr = _decode_header_value(msg.get("References", "") or "")

                if debug_first_message:
                    debug_first_message = False
                    print(
                        "DEBUG: Sample (first non-duplicate message only; every UID in the scan list is still processed):",
                        file=sys.stderr,
                    )
                    print(f"  Subject: '{subject[:80]}'", file=sys.stderr)
                    print(f"  Body length: {len(body_text)}, preview: '{body_text[:150]}'", file=sys.stderr)
                    print(
                        f"  Has claim-related keywords: {_has_relevant_keywords(subject, body_text)}",
                        file=sys.stderr,
                    )
                    print(f"  In-Reply-To: {in_reply[:80] if in_reply else '(none)'}", file=sys.stderr)

                # ---------------------------------------------------------------
                # STEP 1 — Thread-reply fast path (runs BEFORE FNOL classifier).
                #
                # Follow-up emails ("Here are the docs", "Any update?") do not
                # repeat incident keywords so they would fail the FNOL check below.
                # If this email is a reply to an already-ingested claim thread we
                # merge it immediately and skip all further classification.
                # ---------------------------------------------------------------
                if is_reply_to_existing_claim(from_addr, subject, in_reply or None, refs_hdr or None):
                    date_str = ""
                    if msg.get("Date"):
                        try:
                            dt = email.utils.parsedate_to_datetime(msg.get("Date"))
                            date_str = dt.strftime("%B %d, %Y %I:%M %p")
                        except Exception:
                            date_str = str(msg.get("Date", ""))
                    full_body = _build_full_email_body(subject, from_addr, to_addr, date_str, body_text)
                    attachment_files: List[Tuple[str, bytes, str]] = []
                    if msg.is_multipart():
                        for part in msg.walk():
                            if part.get_content_disposition() == "attachment":
                                fname = part.get_filename() or f"attachment-{len(attachment_files) + 1}"
                                payload = part.get_payload(decode=True)
                                if payload:
                                    attachment_files.append((fname, payload, part.get_content_type() or "application/octet-stream"))
                    _, created_new, merged = save_ingested_claim(
                        from_addr, to_addr, subject, full_body, attachment_files, "imap",
                        message_id=dedup_key, email_message_id_for_display=message_id,
                        raw_rfc822=raw, mail_date_header=date_hdr,
                        in_reply_to=in_reply or None, references=refs_hdr or None,
                    )
                    if created_new:
                        result["ingested"] += 1
                        print(f"Thread-reply created new claim: {subject[:60]}", file=sys.stderr)
                    elif merged:
                        result["mergedFollowUp"] = result.get("mergedFollowUp", 0) + 1
                        print(f"Thread-reply merged into existing claim: {subject[:60]}", file=sys.stderr)
                    else:
                        result["skippedDuplicate"] = result.get("skippedDuplicate", 0) + 1
                    add_dedup_keys_to_set(existing_ids, subject, from_addr, message_id or "", dedup_key)
                    continue

                # ---------------------------------------------------------------
                # STEP 2 — FNOL classifier for standalone (non-reply) emails.
                # Same order as SendGrid webhook: FNOL first, then FAQ.
                # ---------------------------------------------------------------
                fnol_ok = should_ingest_incoming_email(subject, body_text)
                if not fnol_ok:
                    if _should_reject_consumer_complaint_correspondence(subject, body_text):
                        result["skippedComplaintCorrespondence"] = (
                            result.get("skippedComplaintCorrespondence", 0) + 1
                        )
                        continue
                    try:
                        # Skip FAQ re-send if we already answered this exact message.
                        norm_dk = _norm_key(dedup_key)
                        mid_inner = _strip_angle(message_id) if message_id else ""
                        already_faq_answered = (
                            norm_dk in faq_ids
                            or (message_id and _norm_key(message_id) in faq_ids)
                            or (mid_inner and _norm_key(mid_inner) in faq_ids)
                        )
                        if already_faq_answered:
                            result["skippedDuplicate"] = result.get("skippedDuplicate", 0) + 1
                            continue
                        faq_result = process_faq_email(from_addr, to_addr, subject, body_text)
                        skip_ingest_for_faq = faq_result.get("skip_claim_ingestion") is True or (
                            faq_result.get("skip_claim_ingestion") is None
                            and faq_result.get("is_faq", False)
                            and faq_result.get("answered", False)
                        )
                        if skip_ingest_for_faq:
                            if faq_result.get("answered", False):
                                result["faqAnswered"] = result.get("faqAnswered", 0) + 1
                                print(f"FAQ answered, reply sent to: {from_addr}", file=sys.stderr)
                                add_faq_answered_id(subject, from_addr, message_id or "", dedup_key)
                                faq_ids.update({norm_dk, _norm_key(message_id or "")})
                                add_dedup_keys_to_set(existing_ids, subject, from_addr, message_id or "", dedup_key)
                                # Save FAQ conversation so both inbound + auto-reply appear in inbox.
                                try:
                                    _sender = (os.environ.get("SENDER_EMAIL") or "").strip()
                                    _sender_display = f"Claims Department <{_sender}>" if _sender else "Claims Department"
                                    _faq_body = faq_result.get("answer") or ""
                                    _faq_q = faq_result.get("faq_question") or ""
                                    if _faq_q:
                                        _outbound = f"Thank you for your inquiry regarding: {_faq_q}\n\n{_faq_body}\n\n---\nThis is an automated response from our FAQ system."
                                    else:
                                        _outbound = f"Thank you for your inquiry.\n\n{_faq_body}\n\n---\nThis is an automated response from our FAQ system."
                                    save_faq_conversation(
                                        from_addr=from_addr,
                                        to_addr=to_addr,
                                        subject=subject,
                                        inbound_body=body_text,
                                        outbound_body=_outbound,
                                        outbound_subject=f"Re: {subject}",
                                        sender_display=_sender_display,
                                        message_id=message_id,
                                        mail_date_header=date_hdr,
                                    )
                                except Exception as _faq_save_err:
                                    print(f"FAQ conversation save error (non-fatal): {_faq_save_err}", file=sys.stderr)
                            else:
                                result["faqError"] = result.get("faqError", 0) + 1
                                print(
                                    f"FAQ query detected but reply not sent: {faq_result.get('error', 'Unknown error')}",
                                    file=sys.stderr,
                                )
                            continue
                    except Exception as e:
                        print(f"FAQ processing error (continuing with normal flow): {e}", file=sys.stderr)
                    result["skippedNoFnol"] = result.get("skippedNoFnol", 0) + 1
                    continue

                date_str = ""
                if msg.get("Date"):
                    try:
                        dt = email.utils.parsedate_to_datetime(msg.get("Date"))
                        date_str = dt.strftime("%B %d, %Y %I:%M %p")
                    except Exception:
                        date_str = str(msg.get("Date", ""))

                full_body = _build_full_email_body(subject, from_addr, to_addr, date_str, body_text)

                attachment_files = []
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_disposition() == "attachment":
                            filename = part.get_filename() or f"attachment-{len(attachment_files) + 1}"
                            payload = part.get_payload(decode=True)
                            if payload:
                                ct = part.get_content_type() or "application/octet-stream"
                                attachment_files.append((filename, payload, ct))

                _, created_new, merged = save_ingested_claim(
                    from_addr,
                    to_addr,
                    subject,
                    full_body,
                    attachment_files,
                    "imap",
                    message_id=dedup_key,
                    email_message_id_for_display=message_id,
                    raw_rfc822=raw,
                    mail_date_header=date_hdr,
                    in_reply_to=in_reply or None,
                    references=refs_hdr or None,
                )
                if created_new:
                    result["ingested"] += 1
                elif merged:
                    result["mergedFollowUp"] = result.get("mergedFollowUp", 0) + 1
                else:
                    result["skippedDuplicate"] = result.get("skippedDuplicate", 0) + 1
                add_dedup_keys_to_set(existing_ids, subject, from_addr, message_id or "", dedup_key)

                if not include_read:
                    mail.store(uid, "+FLAGS", "\\Seen")

            except Exception as e:
                result["errors"].append(f"Message {uid}: {e}")

        print(
            "IMAP sync summary — "
            f"mailbox={result.get('mailboxUsed', '?')} "
            f"uids_in_folder={result.get('uidsTotalInMailbox', '?')} "
            f"uids_scanned={result.get('scanned', 0)} "
            f"truncated={result.get('uidsTruncated', False)} "
            f"ingested={result.get('ingested', 0)} "
            f"merged_follow_ups={result.get('mergedFollowUp', 0)} "
            f"duplicate={result.get('skippedDuplicate', 0)} "
            f"skipped_complaint_cmp={result.get('skippedComplaintCorrespondence', 0)} "
            f"skipped_no_fnol={result.get('skippedNoFnol', 0)} "
            f"faq_answered={result.get('faqAnswered', 0)}",
            file=sys.stderr,
        )
        result["success"] = len(result["errors"]) == 0
        mail.logout()

    except Exception as e:
        result["errors"].append(str(e))

    return result


def main() -> int:
    """CLI entry point."""
    r = sync_inbox()
    print(json.dumps(r, indent=2))
    return 0 if r.get("success") else 1


if __name__ == "__main__":
    sys.exit(main())
