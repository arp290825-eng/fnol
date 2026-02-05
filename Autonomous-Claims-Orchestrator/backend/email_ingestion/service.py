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


def _classify_fnol_by_llm(subject: str, body: str) -> bool:
    """LLM-based FNOL classifier."""
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
                    "content": "You are an FNOL classifier. Determine if this email is a First Notice of Loss (FNOL) or insurance claim submission. Reply with ONLY \"yes\" or \"no\".",
                },
                {"role": "user", "content": f"Is this email an FNOL or insurance claim submission?\n\n{text}"},
            ],
            max_tokens=10,
            temperature=0,
        )
        answer = (response.choices[0].message.content or "").strip().lower()
        return answer.startswith("yes")
    except Exception:
        return True


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
    """Extract plain text body from email."""
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
        return _strip_html(body_html)
    if not msg.is_multipart():
        return _get_part_text(msg)
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

    def parse_uids(data: list) -> List[str]:
        if not data or data[0] is None:
            return []
        raw = data[0]
        s = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else str(raw)
        return [u for u in s.split() if u]

    try:
        context = ssl.create_default_context()
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
