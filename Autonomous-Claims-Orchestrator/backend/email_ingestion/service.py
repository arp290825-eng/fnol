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
from backend.ingested_claims.service import (
    add_dedup_keys_to_set,
    get_existing_message_ids,
    is_duplicate_email,
    save_ingested_claim,
)


def _load_env() -> None:
    """Load env vars from .env if present."""
    if ENV_FILE.exists():
        with open(ENV_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))


def _has_relevant_keywords(subject: str, body: str) -> bool:
    """Check if email contains relevant keywords: claim, FNOL, or damage."""
    # Combine subject and body for keyword search
    text = f"{subject} {body}".lower()
    
    # Required keywords: must contain at least one of claim, FNOL, damage, loss, or incident
    required_keywords = [
        # Claim-related
        r"\bclaim\b",
        r"\bclaims\b",
        r"\binsurance claim\b",
        r"\bfile a claim\b",
        r"\bsubmit.*claim\b",
        r"\breport.*claim\b",
        r"\bclaim number\b",
        r"\bclaim id\b",
        r"\bclaim reference\b",
        # FNOL-related
        r"\bfnol\b",
        r"\bfirst notice of loss\b",
        r"\bfirst notice\b",
        r"\bnotice of loss\b",
        # Damage-related
        r"\bdamage\b",
        r"\bdamaged\b",
        r"\bproperty damage\b",
        r"\bvehicle damage\b",
        r"\bauto damage\b",
        r"\bcar damage\b",
        r"\bdamage report\b",
        # Loss-related
        r"\bloss\b",
        r"\blosses\b",
        r"\bloss report\b",
        # Incident-related
        r"\bincident\b",
        r"\bincidents\b",
        r"\bincident report\b",
        r"\baccident\b",
        r"\baccidents\b",
        r"\baccident report\b",
    ]
    
    # Check if any required keyword appears (as whole word)
    for pattern in required_keywords:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    
    return False


def _has_strong_keywords(subject: str, body: str) -> bool:
    """Check if email has strong FNOL indicators (claim, FNOL, damage with context)."""
    text = f"{subject} {body}".lower()
    
    # Strong keywords that indicate FNOL/claim
    strong_patterns = [
        r"\bclaim\b",
        r"\bclaims\b",
        r"\bfnol\b",
        r"\bfirst notice of loss\b",
        r"\binsurance claim\b",
        r"\bfile a claim\b",
        r"\bsubmit.*claim\b",
        r"\breport.*claim\b",
        r"\bclaim number\b",
        r"\bdamage\b.*\bclaim\b",
        r"\bclaim\b.*\bdamage\b",
        r"\bproperty damage\b",
        r"\bvehicle damage\b",
        r"\bauto damage\b",
        r"\bcar damage\b",
    ]
    
    for pattern in strong_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False


def _classify_fnol_by_llm(subject: str, body: str) -> bool:
    """LLM-based FNOL classifier - requires claim/FNOL/damage keywords."""
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
    
    # Use LLM for final classification - be very lenient
    try:
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        text = f"Subject: {subject}\n\nBody:\n{body[:3000]}"
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an FNOL classifier. Be VERY lenient. Accept ANY email that mentions: claim, claims, damage, loss, incident, accident, FNOL, or first notice of loss. Only reject: pure spam, completely unrelated marketing with zero claim context, or system-generated emails with no human claim content. If there's ANY mention of claim/damage/loss/incident, say YES. Reply with ONLY \"yes\" or \"no\".",
                },
                {"role": "user", "content": f"Does this email mention a claim, damage, loss, incident, accident, or FNOL? Be VERY lenient - if it mentions any of these, say YES.\n\nSubject: {subject}\n\nBody:\n{body[:3000]}"},
            ],
            max_tokens=10,
            temperature=0,
        )
        answer = (response.choices[0].message.content or "").strip().lower()
        is_fnol = answer.startswith("yes")
        
        # If LLM rejects but email has strong keywords, allow through anyway
        if not is_fnol and has_strong:
            print(f"LLM rejected but strong keywords found - allowing: {subject[:100]}", file=sys.stderr)
            return True
            
        if not is_fnol:
            print(f"LLM rejected email - Subject: {subject[:100]}", file=sys.stderr)
        return is_fnol
    except Exception as e:
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


def sync_inbox() -> Dict[str, Any]:
    """
    Connect to IMAP, fetch emails, filter by FNOL, save claims.

    Returns:
        Dict with success, ingested, scanned, skippedNoFnol, skippedDuplicate, errors.
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
        "errors": [],
    }

    if not user or not password:
        result["errors"].append("IMAP credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.")
        return result

    include_read = os.environ.get("IMAP_SYNC_INCLUDE_READ", "true").lower() in ("true", "1", "yes")
    max_emails = int(os.environ.get("IMAP_SYNC_MAX_EMAILS", "100"))
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
        if "gmail" in host.lower():
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
                uids = uids[-max_emails:] if len(uids) > max_emails else uids
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
        existing_ids = get_existing_message_ids()

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
                
                # Debug: log first few emails being checked
                if len([r for r in result.get("errors", []) if "debug" not in r]) == 0:
                    print(f"DEBUG: Checking email - Subject: '{subject[:80]}'", file=sys.stderr)
                    print(f"DEBUG: Body length: {len(body_text)}, preview: '{body_text[:150]}'", file=sys.stderr)
                    has_keywords = _has_relevant_keywords(subject, body_text)
                    print(f"DEBUG: Has relevant keywords: {has_keywords}", file=sys.stderr)
                
                if not _classify_fnol_by_llm(subject, body_text):
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

                attachment_files: List[Tuple[str, bytes, str]] = []
                if msg.is_multipart():
                    for part in msg.walk():
                        if part.get_content_disposition() == "attachment":
                            filename = part.get_filename() or f"attachment-{len(attachment_files) + 1}"
                            payload = part.get_payload(decode=True)
                            if payload:
                                ct = part.get_content_type() or "application/octet-stream"
                                attachment_files.append((filename, payload, ct))

                save_ingested_claim(
                    from_addr,
                    to_addr,
                    subject,
                    full_body,
                    attachment_files,
                    "imap",
                    message_id=dedup_key,
                    email_message_id_for_display=message_id,
                )
                result["ingested"] += 1
                add_dedup_keys_to_set(existing_ids, subject, from_addr, message_id or "", dedup_key)

                if not include_read:
                    mail.store(uid, "+FLAGS", "\\Seen")

            except Exception as e:
                result["errors"].append(f"Message {uid}: {e}")

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
