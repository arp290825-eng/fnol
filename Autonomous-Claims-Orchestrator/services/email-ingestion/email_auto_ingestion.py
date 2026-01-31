#!/usr/bin/env python3
"""
Email Auto-Ingestion Module for FNOL (First Notice of Loss) Claims

Fetches emails from IMAP inbox, classifies via LLM (FNOL vs non-FNOL),
ingests only FNOL-related content. Uses email Message-ID as fallback when policy
number is not found. Saves email content and attachments to the shared data store.
Compatible with the Next.js Claims Fast Lane app - writes to data/ingested-claims.json
and data/ingested-attachments/.

Usage:
    python email_auto_ingestion.py

Environment variables (or .env):
    IMAP_HOST, IMAP_PORT, SENDER_EMAIL, EMAIL_PASSWORD
    OPENAI_API_KEY (required for FNOL classification when FNOL_FILTER_ENABLED=true)
    FNOL_FILTER_ENABLED (set to 'false' to ingest all without LLM)
"""

import imaplib
import email
import json
import os
import re
import ssl
from email import policy
from email.header import decode_header
from pathlib import Path
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

# Paths (script lives in services/email-ingestion/)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = _PROJECT_ROOT / "data"
INGESTED_DIR = DATA_DIR / "ingested-attachments"
CLAIMS_FILE = DATA_DIR / "ingested-claims.json"


def load_env() -> None:
    """Load env vars from .env if present."""
    env_path = _PROJECT_ROOT / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip('"\''))


def extract_policy_number(text: str) -> Optional[str]:
    """Extract policy number from email body or subject."""
    patterns = [
        r"policy\s*#?\s*:?\s*([A-Z0-9]{6,})",
        r"policy\s*number\s*:?\s*([A-Z0-9]{6,})",
        r"Policy\s*#([A-Z0-9]+)",
        r"#([A-Z]{2}\d{6,})",
        r"\b([A-Z]{2}\d{6,})\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match and match.group(1):
            return match.group(1)
    return None


def _classify_fnol_by_llm(subject: str, body: str) -> bool:
    """
    LLM-based FNOL classifier. Assesses email subject + body to decide if it is
    FNOL-related. Only FNOL emails are ingested. When OPENAI_API_KEY is missing,
    ingests all (no filter).
    """
    if os.environ.get("FNOL_FILTER_ENABLED", "true").lower() == "false":
        return True
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return True

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
                    "content": "You are an FNOL classifier. Determine if this email is a First Notice of Loss (FNOL) or insurance claim submission.\n"
                    "FNOL = an insured person notifying their insurer of a loss, incident, or damage to file a claim "
                    "(e.g. accident, water damage, theft, fire, collision, bodily injury, property damage).\n"
                    "Reply with ONLY \"yes\" or \"no\".",
                },
                {
                    "role": "user",
                    "content": f"Is this email an FNOL or insurance claim submission?\n\n{text}",
                },
            ],
            max_tokens=10,
            temperature=0,
        )
        answer = (response.choices[0].message.content or "").strip().lower()
        return answer.startswith("yes")
    except Exception as e:
        print(f"FNOL classifier error: {e}", file=__import__("sys").stderr)
        return True


def strip_html(html: str) -> str:
    """Strip HTML tags for plain text body."""
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", html, flags=re.IGNORECASE)
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _get_part_text(part: email.message.Message) -> str:
    """Extract plain text from a MIME part with proper charset handling."""
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


def decode_header_value(header_val: Any) -> str:
    """Decode MIME-encoded header (Subject, From, To, etc.)."""
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


def format_address(addr: Any) -> str:
    """Format email address for display."""
    if addr is None:
        return ""
    if isinstance(addr, (list, tuple)):
        return ", ".join(format_address(a) for a in addr)
    return decode_header_value(addr)


def build_full_email_body(
    subject: str,
    from_addr: str,
    to_addr: str,
    date_str: str,
    body_text: str,
) -> str:
    """Build full email string with headers (same format as TS module)."""
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


def _normalize_key(s: str) -> str:
    return s.strip().lower()


def _normalized_subject_from(subject: str, from_addr: str) -> str:
    return _normalize_key(f"{subject}|{from_addr}")


def _get_existing_message_ids() -> set:
    """Load Message-IDs and subject|from keys (normalized) for deduplication."""
    if not CLAIMS_FILE.exists():
        return set()
    try:
        claims = json.loads(CLAIMS_FILE.read_text(encoding="utf-8"))
        ids = set()
        for c in claims:
            ids.add(_normalized_subject_from(c.get("subject", ""), c.get("from", "")))
            mid = c.get("messageId", "")
            if mid:
                ids.add(_normalize_key(mid))
                inner = mid.replace("<", "").replace(">", "").strip()
                if inner:
                    ids.add(_normalize_key(inner))
        return ids
    except Exception:
        return set()


def _is_duplicate_email(
    subject: str,
    from_addr: str,
    message_id: Optional[str],
    date_hdr: str,
    existing_ids: set,
) -> bool:
    """Check if email is a duplicate using normalized dedup keys."""
    if _normalized_subject_from(subject, from_addr) in existing_ids:
        return True
    dedup_key = message_id or f"{subject}|{from_addr}|{date_hdr}"
    if _normalize_key(dedup_key) in existing_ids:
        return True
    if message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        if inner and _normalize_key(inner) in existing_ids:
            return True
    return False


def _add_dedup_keys(
    ids: set,
    subject: str,
    from_addr: str,
    message_id: Optional[str],
    dedup_key: str,
) -> None:
    """Add dedup keys for a newly ingested claim."""
    ids.add(_normalized_subject_from(subject, from_addr))
    ids.add(_normalize_key(dedup_key))
    if message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        if inner:
            ids.add(_normalize_key(inner))


def _fallback_policy_display(message_id: Optional[str], claim_id: str) -> str:
    """Use email Message-ID as identifier when policy number not found."""
    if not message_id:
        return claim_id
    if "<" in message_id and "@" in message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        return inner or claim_id
    return claim_id


def save_ingested_claim(
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
    attachment_files: List[Tuple[str, bytes, str]],
    source: str = "imap",
    message_id: Optional[str] = None,
    email_message_id_for_display: Optional[str] = None,
) -> Dict[str, Any]:
    """Save ingested claim to JSON and attachments to disk.
    message_id: dedup key (stored in claim). email_message_id_for_display: RFC Message-ID for fallback when no policy.
    """
    claim_id = f"ING-{int(datetime.now().timestamp() * 1000)}-{os.urandom(4).hex()}"
    extracted = extract_policy_number(email_body) or extract_policy_number(subject)
    policy_number = extracted or _fallback_policy_display(email_message_id_for_display or message_id, claim_id)

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    claim_dir = INGESTED_DIR / claim_id
    claim_dir.mkdir(parents=True, exist_ok=True)

    attachments = []
    for name, content, mime_type in attachment_files:
        safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
        file_path = claim_dir / safe_name
        file_path.write_bytes(content)
        attachments.append({
            "name": name,
            "path": str(file_path),
            "size": len(content),
            "mimeType": mime_type or "application/octet-stream",
        })

    claim = {
        "id": claim_id,
        "policyNumber": policy_number,
        "from": from_addr,
        "to": to_addr,
        "subject": subject,
        "emailBody": email_body,
        "attachments": attachments,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "source": source,
    }
    if message_id:
        claim["messageId"] = message_id

    claims = []
    if CLAIMS_FILE.exists():
        claims = json.loads(CLAIMS_FILE.read_text(encoding="utf-8"))
    claims.insert(0, claim)
    CLAIMS_FILE.write_text(json.dumps(claims, indent=2), encoding="utf-8")

    return claim


def _extract_raw_message(msg_data: list) -> Optional[bytes]:
    """Extract raw RFC822 message bytes from IMAP fetch response.
    Handles varying response structures from different IMAP servers.
    """
    if not msg_data:
        return None
    for item in msg_data:
        if isinstance(item, tuple) and len(item) >= 2:
            raw = item[1]
            if isinstance(raw, bytes) and len(raw) > 100:
                return raw
        elif isinstance(item, bytes) and len(item) > 100 and b"From:" in item:
            return item
    if isinstance(msg_data[0], tuple) and len(msg_data[0]) >= 2:
        raw = msg_data[0][1]
        if isinstance(raw, bytes):
            return raw
    return None


def _extract_body_text(msg: email.message.Message) -> str:
    """Extract plain text body from email, with fallback to HTML."""
    body_plain = ""
    body_html = ""
    for part in msg.walk():
        if part.get_content_maintype() == "multipart":
            continue
        ct = part.get_content_type()
        if ct == "text/plain":
            body_plain = _get_part_text(part)
        elif ct == "text/html":
            body_html = _get_part_text(part)
    if body_plain.strip():
        return body_plain
    if body_html.strip():
        return strip_html(body_html)
    if not msg.is_multipart():
        return _get_part_text(msg)
    return ""


def sync_inbox() -> Dict[str, Any]:
    """
    Connect to IMAP, fetch unread emails, filter by FNOL, save claims.
    Returns: {success, ingested, scanned, skippedNoFnol, errors}
    """
    load_env()

    host = os.environ.get("IMAP_HOST", "imap.gmail.com")
    port = int(os.environ.get("IMAP_PORT", "993"))
    user = os.environ.get("SENDER_EMAIL") or os.environ.get("IMAP_USER", "")
    password = (os.environ.get("EMAIL_PASSWORD") or os.environ.get("IMAP_PASSWORD", "")).replace(" ", "")
    mailbox = os.environ.get("IMAP_MAILBOX", "INBOX")

    result = {"success": False, "ingested": 0, "scanned": 0, "skippedNoFnol": 0, "skippedDuplicate": 0, "errors": []}

    if not user or not password:
        result["errors"].append("IMAP credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.")
        return result

    include_read = os.environ.get("IMAP_SYNC_INCLUDE_READ", "true").lower() in ("true", "1", "yes")
    max_emails = int(os.environ.get("IMAP_SYNC_MAX_EMAILS", "100"))

    try:
        context = ssl.create_default_context()
        mail = imaplib.IMAP4_SSL(host, port, ssl_context=context)
        mail.login(user, password)

        def parse_uids(data: list) -> list:
            if not data or data[0] is None:
                return []
            raw = data[0]
            if isinstance(raw, bytes):
                s = raw.decode("utf-8", errors="replace")
            else:
                s = str(raw)
            return [u for u in s.split() if u]

        uids = []
        mailboxes_to_try = [mailbox]
        if "gmail" in host.lower():
            all_mail = "[Gmail]/All Mail"
            gmail_uk = "[Google Mail]/All Mail"
            if include_read and mailbox.upper() == "INBOX":
                mailboxes_to_try = [all_mail, gmail_uk, "INBOX"]
            elif mailbox.upper() == "INBOX":
                mailboxes_to_try.extend([all_mail, gmail_uk])

        for mbox in mailboxes_to_try:
            try:
                status, _ = mail.select(mbox)
                if status != "OK":
                    continue
                if include_read:
                    _, data = mail.search(None, "ALL")
                else:
                    _, data = mail.search(None, "UNSEEN")
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
                "Inbox empty. For Gmail: enable 'All Mail' in Settings > Labels > Show in IMAP, "
                "or set IMAP_MAILBOX='[Gmail]/All Mail' in .env"
            )
            return result

        result["scanned"] = len(uids)
        existing_ids = _get_existing_message_ids()

        for uid in uids:
            try:
                _, msg_data = mail.fetch(uid, "(RFC822)")
                raw = _extract_raw_message(msg_data)
                if not raw:
                    result["errors"].append(f"Message {uid}: Could not extract raw message")
                    continue
                msg = email.message_from_bytes(raw, policy=policy.default)

                subject = decode_header_value(msg.get("Subject", "(No subject)") or "(No subject)")
                from_addr = format_address(msg.get("From", ""))
                to_addr = format_address(msg.get("To", ""))
                message_id_raw = msg.get("Message-ID", "")
                message_id = decode_header_value(message_id_raw).strip() if message_id_raw else None
                if not message_id and message_id_raw:
                    message_id = str(message_id_raw).strip()
                date_hdr = msg.get("Date", "")
                dedup_key = message_id or f"{subject}|{from_addr}|{date_hdr}"

                if _is_duplicate_email(subject, from_addr, message_id, date_hdr, existing_ids):
                    result["skippedDuplicate"] = result.get("skippedDuplicate", 0) + 1
                    continue

                body_text = _extract_body_text(msg)

                if not _classify_fnol_by_llm(subject, body_text):
                    result["skippedNoFnol"] += 1
                    continue

                date_header = msg.get("Date")
                date_str = ""
                if date_header:
                    try:
                        dt = email.utils.parsedate_to_datetime(date_header)
                        date_str = dt.strftime("%B %d, %Y %I:%M %p")
                    except Exception:
                        date_str = str(date_header)

                full_body = build_full_email_body(subject, from_addr, to_addr, date_str, body_text)

                attachment_files = []
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
                _add_dedup_keys(existing_ids, subject, from_addr, message_id, dedup_key)

                if not include_read:
                    mail.store(uid, "+FLAGS", "\\Seen")

            except Exception as e:
                result["errors"].append(f"Message {uid}: {e}")

        result["success"] = len(result["errors"]) == 0
        mail.logout()

    except Exception as e:
        result["errors"].append(str(e))

    return result


if __name__ == "__main__":
    r = sync_inbox()
    print(json.dumps(r, indent=2))
