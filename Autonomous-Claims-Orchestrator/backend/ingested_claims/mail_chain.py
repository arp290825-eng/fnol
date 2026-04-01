"""
Build a chronological mail chain (oldest → newest) for inbox UI.

Sources:
- Nested message/rfc822 parts (forwards / embedded messages)
- Common reply delimiters (Outlook, Gmail/Apple) when the body contains quoted thread text
"""

from __future__ import annotations

import email
import re
from email import policy
from email.header import decode_header
from email.utils import parseaddr, parsedate_to_datetime
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Small MIME helpers (local to avoid import cycles with email_ingestion)
# ---------------------------------------------------------------------------


def _strip_html(html: str) -> str:
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", html, flags=re.IGNORECASE)
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _html_to_plain_preserve_breaks(html: str) -> str:
    """Strip tags but keep line breaks so Gmail/Outlook reply delimiters can match."""
    text = re.sub(r"<style[^>]*>[\s\S]*?</style>", "", html, flags=re.IGNORECASE)
    text = re.sub(r"<script[^>]*>[\s\S]*?</script>", "", text, flags=re.IGNORECASE)
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"</p\s*>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"</div\s*>", "\n", text, flags=re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r" ?\n ?", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _decode_header_value(header_val: Any) -> str:
    if header_val is None or header_val == "":
        return ""
    if isinstance(header_val, bytes):
        return header_val.decode("utf-8", errors="replace")
    if isinstance(header_val, str):
        return header_val
    try:
        decoded = decode_header(header_val)
        parts: List[str] = []
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
    if addr is None:
        return ""
    if isinstance(addr, (list, tuple)):
        return ", ".join(_format_address(a) for a in addr)
    return _decode_header_value(addr)


def _get_part_text(part: email.message.Message) -> str:
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


def _body_from_simple_part(part: email.message.Message) -> str:
    ct = part.get_content_type()
    if ct == "text/plain":
        return _get_part_text(part)
    if ct == "text/html":
        return _html_to_plain_preserve_breaks(_get_part_text(part))
    return ""


def _extract_from_multipart_alternative(m: email.message.Message) -> str:
    plain, html = "", ""
    for part in m.get_payload():
        if not isinstance(part, email.message.Message):
            continue
        if part.get_content_maintype() == "multipart":
            continue
        disp = (part.get("Content-Disposition") or "").lower()
        if "attachment" in disp:
            continue
        ct = part.get_content_type()
        if ct == "text/plain" and not plain:
            plain = _get_part_text(part)
        elif ct == "text/html" and not html:
            html = _get_part_text(part)
    if plain.strip():
        return plain
    if html.strip():
        return _html_to_plain_preserve_breaks(html)
    return ""


def _extract_body_skip_rfc822(m: email.message.Message) -> str:
    """Main visible body of this message, ignoring nested message/rfc822 parts."""
    if not m.is_multipart():
        return _body_from_simple_part(m)

    collected: List[str] = []
    for part in m.get_payload():
        if not isinstance(part, email.message.Message):
            continue
        if part.get_content_type() == "message/rfc822":
            continue
        if part.get_content_maintype() == "multipart":
            st = part.get_content_subtype()
            if st == "alternative":
                t = _extract_from_multipart_alternative(part)
            else:
                t = _extract_body_skip_rfc822(part)
            if t.strip():
                collected.append(t)
        else:
            disp = (part.get("Content-Disposition") or "").lower()
            if "attachment" in disp or part.get_filename():
                continue
            t = _body_from_simple_part(part)
            if t.strip():
                collected.append(t)

    if collected:
        return "\n\n".join(collected)
    return ""


def _count_attachments(m: email.message.Message) -> int:
    n = 0
    for part in m.walk():
        if part.get_content_disposition() == "attachment":
            n += 1
        elif part.get_filename() and part.get_content_maintype() != "multipart":
            disp = (part.get("Content-Disposition") or "").lower()
            if "attachment" in disp:
                n += 1
    return n


def _parse_date_header(m: email.message.Message) -> Tuple[str, str]:
    raw = m.get("Date", "") or ""
    display = _decode_header_value(raw).strip()
    iso = ""
    if raw:
        try:
            dt = parsedate_to_datetime(raw)
            if dt:
                iso = dt.isoformat()
        except (TypeError, ValueError, OverflowError):
            pass
    return iso, display


def _message_to_entry(
    m: email.message.Message,
    support_email_lower: Optional[str],
) -> Dict[str, Any]:
    subject = _decode_header_value(m.get("Subject", "") or "(No subject)") or "(No subject)"
    from_a = _format_address(m.get("From", ""))
    to_a = _format_address(m.get("To", ""))
    iso, display = _parse_date_header(m)
    body = _extract_body_skip_rfc822(m).strip()
    _, from_email = parseaddr(from_a)
    outbound = False
    if support_email_lower and from_email:
        outbound = from_email.strip().lower() == support_email_lower
    display_name, _ = parseaddr(from_a)
    from_label = (display_name or from_email or from_a or "Unknown").strip() or "Unknown"
    return {
        "from": from_a,
        "fromLabel": from_label,
        "to": to_a,
        "subject": subject,
        "body": body,
        "dateIso": iso,
        "dateDisplay": display,
        "attachmentCount": _count_attachments(m),
        "isOutbound": outbound,
    }


def _inner_from_rfc822_part(part: email.message.Message) -> Optional[email.message.Message]:
    if part.get_content_type() != "message/rfc822":
        return None
    payload = part.get_payload()
    if isinstance(payload, list) and payload:
        inner = payload[0]
    else:
        inner = payload
    return inner if isinstance(inner, email.message.Message) else None


def _collect_nested_rfc822_messages(root: email.message.Message) -> List[email.message.Message]:
    """Deduplicated inner messages from message/rfc822 parts, in walk (document) order."""
    seen_ids: set = set()
    out: List[email.message.Message] = []
    for part in root.walk():
        inner = _inner_from_rfc822_part(part)
        if inner is None:
            continue
        mid = (inner.get("Message-ID") or "").strip()
        key = mid or id(inner)
        if key in seen_ids:
            continue
        seen_ids.add(key)
        out.append(inner)
    return out


def _body_suggests_reply_thread(text: str) -> bool:
    """Heuristic: stored body may contain quoted history worth re-splitting."""
    if not text or len(text) < 50:
        return False
    t = text.replace("\r\n", "\n")
    if "\nOn " in t:
        return True
    if re.search(r"\nOn .+\n\s*wrote:\s*\n", t, re.IGNORECASE | re.DOTALL):
        return True
    if re.search(r"wrote:\s*\n\s*>", t, re.IGNORECASE):
        return True
    if re.search(r"Original Message", t, re.IGNORECASE):
        return True
    if re.search(r"\n_{32,}", t):
        return True
    if re.search(r"<\s*(!DOCTYPE|/?\s*br|/?\s*p\b|/?\s*div\b)", t, re.IGNORECASE):
        return True
    return False


def _split_reply_thread(text: str) -> List[str]:
    """
    Split a plain-text body into segments (newest first), using common client delimiters.
    Conservative: only split when pattern clearly matches.
    """
    if not text or len(text) < 40:
        return [text] if text else []

    t = text.replace("\r\n", "\n")

    # Outlook / many clients
    parts = re.split(r"\n-{5,}\s*Original Message\s*-{5,}\s*\n", t, flags=re.IGNORECASE)
    if len(parts) > 1:
        return [p.strip() for p in parts if p.strip()]

    # Outlook separator line
    parts = re.split(r"\n_{32,}\s*\n", t)
    if len(parts) > 1:
        return [p.strip() for p in parts if p.strip()]

    # Gmail / Apple Mail — "On ... wrote:" on same line OR "wrote:" on the following line (very common)
    gmailish = re.compile(
        r"\nOn .+? wrote:\s*\n"  # On Tue, … User <a@b.com> wrote:\n
        r"|\nOn .+?\n\s*wrote:\s*\n"  # On Fri, … <email>\n wrote:\n
        r"|\nOn .+?, at .+?, .+ wrote:\s*\n"  # Apple: On Mar 13, 2026, at 11:26 PM, X wrote:\n
        r"|\nLe .+? a écrit\s*:\s*\n"  # French Mail
        r"|\nAm .+? schrieb .+?:\s*\n",  # German Gmail-style
        re.IGNORECASE | re.DOTALL,
    )
    parts = gmailish.split(t)
    if len(parts) > 1:
        return [p.strip() for p in parts if p.strip()]

    return [t.strip()]


def _parse_outlook_headers_from_segment(segment: str) -> Tuple[Dict[str, str], str]:
    """If segment starts with From:/Sent:/To:/Subject:/Date: lines, parse them; return meta + body."""
    lines = segment.split("\n")
    meta: Dict[str, str] = {}
    i = 0
    header_re = re.compile(
        r"^\s*(From|Sent|To|Subject|Date)\s*:\s*(.*)$",
        re.IGNORECASE,
    )
    while i < len(lines):
        m = header_re.match(lines[i])
        if not m:
            break
        key = m.group(1).lower()
        val = m.group(2).strip()
        if key == "from":
            meta["From"] = val
        elif key == "to":
            meta["To"] = val
        elif key == "subject":
            meta["Subject"] = val
        elif key == "date":
            meta["Date"] = val
        elif key == "sent":
            meta["Sent"] = val
        i += 1
    body = "\n".join(lines[i:]).strip()
    return meta, body


def _entries_from_plain_thread(
    from_addr: str,
    to_addr: str,
    subject: str,
    body: str,
    date_iso: str,
    date_display: str,
    attachment_count: int,
    support_email_lower: Optional[str],
) -> List[Dict[str, Any]]:
    segments = _split_reply_thread(body)
    # segments are newest-first; UI wants oldest-first
    segments = list(reversed(segments))
    entries: List[Dict[str, Any]] = []
    n = len(segments)
    for idx, seg in enumerate(segments):
        meta, rest = _parse_outlook_headers_from_segment(seg)
        newest = idx == n - 1
        f = meta.get("From") or (from_addr if newest else "")
        t = meta.get("To") or (to_addr if newest else "")
        subj = meta.get("Subject") or subject
        d_disp = meta.get("Sent") or meta.get("Date") or (date_display if newest else "")
        b = rest if meta else seg
        _, from_email = parseaddr(f)
        outbound = bool(support_email_lower and from_email.strip().lower() == support_email_lower)
        display_name, _ = parseaddr(f)
        from_label = (display_name or from_email or f or "Unknown").strip() or "Unknown"
        entries.append({
            "from": f,
            "fromLabel": from_label,
            "to": t,
            "subject": subj,
            "body": b.strip(),
            "dateIso": date_iso if newest else "",
            "dateDisplay": d_disp,
            "attachmentCount": attachment_count if newest else 0,
            "isOutbound": outbound,
        })
    return entries


def build_mail_chain(
    *,
    raw_rfc822: Optional[bytes],
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
    date_iso: str = "",
    date_display: str = "",
    top_level_attachment_count: int = 0,
    support_email_lower: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Build mailChain list (oldest → newest). Prefer MIME structure when raw bytes are available.
    """
    if raw_rfc822 and len(raw_rfc822) > 50:
        try:
            msg = email.message_from_bytes(raw_rfc822, policy=policy.default)
            nested = _collect_nested_rfc822_messages(msg)
            chain: List[Dict[str, Any]] = []
            for inner in nested:
                chain.append(_message_to_entry(inner, support_email_lower))
            root_entry = _message_to_entry(msg, support_email_lower)
            root_entry["body"] = _extract_body_skip_rfc822(msg).strip()
            root_entry["attachmentCount"] = top_level_attachment_count
            root_mid = (msg.get("Message-ID") or "").strip()
            if chain and root_mid:
                last_mid = (nested[-1].get("Message-ID") or "").strip()
                if last_mid and last_mid == root_mid:
                    chain.pop()
            chain.append(root_entry)
            if chain:
                # No nested message/rfc822: quoted thread is usually plain text in one MIME body — split it.
                if len(nested) == 0 and len(chain) == 1:
                    only = chain[0]
                    split_plain = _entries_from_plain_thread(
                        only.get("from") or from_addr,
                        only.get("to") or to_addr,
                        only.get("subject") or subject,
                        only.get("body") or "",
                        only.get("dateIso") or date_iso,
                        (only.get("dateDisplay") or "") or date_display,
                        top_level_attachment_count,
                        support_email_lower,
                    )
                    if len(split_plain) > 1:
                        return split_plain
                return chain
        except Exception:
            pass

    body_for_split = email_body
    if email_body and "Subject:" in email_body[:400] and "\n" in email_body:
        # Strip synthetic header block from IMAP full_body if present
        lines = email_body.split("\n")
        start = 0
        for i, line in enumerate(lines[:12]):
            if line.strip() == "":
                start = i + 1
                break
        if start > 0:
            body_for_split = "\n".join(lines[start:]).strip()

    # HTML inbound (SendGrid): normalize so "On … wrote" appears on its own line
    _html_like = re.compile(
        r"<\s*(!DOCTYPE|/?\s*(html|head|body|div|p|br|table|span|font)\b)",
        re.IGNORECASE,
    )
    if body_for_split and _html_like.search(body_for_split):
        html_as_text = _html_to_plain_preserve_breaks(body_for_split)
        if "\nOn " in html_as_text or re.search(r"\nwrote:\s*\n", html_as_text, re.I):
            body_for_split = html_as_text

    split_entries = _entries_from_plain_thread(
        from_addr,
        to_addr,
        subject,
        body_for_split,
        date_iso,
        date_display,
        top_level_attachment_count,
        support_email_lower,
    )
    if len(split_entries) >= 1:
        return split_entries

    _, em = parseaddr(from_addr)
    outbound = bool(support_email_lower and em.strip().lower() == support_email_lower)
    dn, _ = parseaddr(from_addr)
    label = (dn or em or from_addr or "Unknown").strip() or "Unknown"
    return [{
        "from": from_addr,
        "fromLabel": label,
        "to": to_addr,
        "subject": subject,
        "body": body_for_split.strip(),
        "dateIso": date_iso,
        "dateDisplay": date_display,
        "attachmentCount": top_level_attachment_count,
        "isOutbound": outbound,
    }]


def ensure_mail_chain_on_claim(claim: Dict[str, Any], support_email_lower: Optional[str] = None) -> None:
    """Mutate claim to always include mailChain; rebuild single-segment rows when body looks like a thread."""
    mc = claim.get("mailChain")
    body = (claim.get("emailBody") or "")
    if isinstance(mc, list) and len(mc) > 1:
        return
    if isinstance(mc, list) and len(mc) == 1 and not _body_suggests_reply_thread(body):
        return
    chain = build_mail_chain(
        raw_rfc822=None,
        from_addr=claim.get("from", "") or "",
        to_addr=claim.get("to", "") or "",
        subject=claim.get("subject", "") or "",
        email_body=claim.get("emailBody", "") or "",
        date_iso=claim.get("createdAt", "") or "",
        date_display="",
        top_level_attachment_count=len(claim.get("attachments") or []),
        support_email_lower=support_email_lower,
    )
    claim["mailChain"] = chain
