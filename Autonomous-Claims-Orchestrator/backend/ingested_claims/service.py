"""
Ingested Claims Service.

Manages FNOL claims ingested from email. CRUD, deduplication, attachment handling.
Converted from TypeScript for modular backend architecture.
"""

import datetime as datetime_module
import json
import os
import re
import sys
import threading
from email.utils import parseaddr, parsedate_to_datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

# Serialize claim file writes + duplicate checks (webhook + IMAP sync races)
_CLAIMS_IO_LOCK = threading.Lock()

from backend.common.config import (
    CLAIMS_FILE,
    ensure_data_dir,
    FAQ_ANSWERED_IDS_FILE,
    INGESTED_DIR,
    PROJECT_ROOT,
)

from backend.ingested_claims.mail_chain import build_mail_chain, ensure_mail_chain_on_claim


def _normalize_key(s: str) -> str:
    """Normalize string for deduplication."""
    return s.strip().lower()


def _normalized_subject_from(subject: str, from_addr: str) -> str:
    """Build normalized dedup key from subject and from."""
    return _normalize_key(f"{subject}|{from_addr}")


def _parseaddr_email(from_addr: str) -> str:
    _, em = parseaddr(from_addr or "")
    return (em or "").strip().lower()


_SUBJ_THREAD_PREFIX = re.compile(
    r"^(re|fwd|fw|aw|sv|vs|antwort|wg)\s*:\s*",
    re.IGNORECASE,
)


def normalize_thread_subject(subject: str) -> str:
    """Strip reply/forward prefixes so 'Re: FNOL' matches the original subject."""
    s = (subject or "").strip()
    for _ in range(16):
        m = _SUBJ_THREAD_PREFIX.match(s)
        if not m:
            break
        s = s[m.end() :].strip()
    return _normalize_key(s)


def _inner_message_id(mid: str) -> str:
    return (mid or "").strip().replace("<", "").replace(">", "").strip().lower()


def _message_ids_from_header_value(val: Optional[str]) -> List[str]:
    """Extract Message-ID tokens from In-Reply-To / References (angle brackets optional)."""
    if not val or not str(val).strip():
        return []
    raw = str(val).strip()
    bracketed = re.findall(r"<([^>]+)>", raw)
    if bracketed:
        return [b.strip() for b in bracketed if b.strip()]
    return [raw] if raw else []


def _all_message_id_tokens_for_claim(claim: Dict[str, Any]) -> List[str]:
    mids: List[str] = []
    cm = (claim.get("messageId") or "").strip()
    if cm:
        mids.append(cm)
    for t in claim.get("threadMessageIds") or []:
        if t and str(t).strip():
            mids.append(str(t).strip())
    return mids


def _fallback_policy_display(message_id: Optional[str], claim_id: str) -> str:
    """Use email Message-ID as identifier when policy number not found."""
    if not message_id:
        return claim_id
    if "<" in message_id and "@" in message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        return inner or claim_id
    return claim_id


def extract_policy_number(email_body: str) -> Optional[str]:
    """
    Extract policy number from email body or subject line.

    Checks both explicit keyword patterns (policy #, policy number, policy ref, etc.)
    and standalone alphanumeric codes that match common carrier formats.
    """
    if not email_body or not str(email_body).strip():
        return None

    text = str(email_body)

    # --- Keyword-anchored patterns (highest confidence, checked first) ---
    keyword_patterns = [
        # "Policy #AC123456", "Policy: AC123456", "Policy - AC123456"
        r"poli?cy\s*(?:number|no\.?|#|id|ref(?:erence)?|code)?\s*[:#\-=\s]\s*([A-Z0-9]{4,}(?:[-/][A-Z0-9]+)*)",
        # "Policy Number is AC123456" / "Policy No. was AC123456"
        r"poli?cy\s*(?:number|no\.?)\s+(?:is|was|:)?\s*([A-Z0-9]{4,}(?:[-/][A-Z0-9]+)*)",
        # "Claim #AC123456", "Claim Number: AC123456"
        r"claim\s*(?:number|no\.?|#|id|ref(?:erence)?)?\s*[:#\s]\s*([A-Z0-9]{4,}(?:[-/][A-Z0-9]+)*)",
        # "#AC789456123" (standalone hashtag prefix)
        r"#([A-Z]{1,4}\d{5,})",
    ]
    for pattern in keyword_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match and match.group(1):
            candidate = match.group(1).strip().upper()
            # Sanity: must have at least one digit and min 4 meaningful chars
            if re.search(r"\d", candidate) and len(candidate.replace("-", "").replace("/", "")) >= 4:
                return candidate

    # --- Structural patterns (common carrier formats, no keyword needed) ---
    structural_patterns = [
        # 2-letter prefix + 6+ digits: AC789456123, HO456789234
        r"\b([A-Z]{2}\d{6,})\b",
        # 3-letter prefix + 6+ digits: COM789012345
        r"\b([A-Z]{3}\d{6,})\b",
        # 2–4-letter prefix + hyphen + 5+ digits: HO-456789, POL-2023456
        r"\b([A-Z]{2,4}-\d{5,})\b",
    ]
    for pattern in structural_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match and match.group(1):
            return match.group(1).upper()

    return None


def _get_faq_answered_ids() -> Set[str]:
    """Get dedup keys for emails we already answered via FAQ (not ingested as claims)."""
    if not FAQ_ANSWERED_IDS_FILE.exists():
        return set()
    try:
        data = json.loads(FAQ_ANSWERED_IDS_FILE.read_text(encoding="utf-8"))
        keys = data if isinstance(data, list) else data.get("ids", [])
        return set(_normalize_key(str(k)) for k in keys if k)
    except (json.JSONDecodeError, OSError):
        return set()


def add_faq_answered_id(subject: str, from_addr: str, message_id: str, dedup_key: str) -> None:
    """Record that we answered this email as FAQ so we don't re-answer or ingest it."""
    ensure_data_dir()
    existing = _get_faq_answered_ids()
    to_add = [_normalize_key(dedup_key)]
    if message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        if inner:
            to_add.append(_normalize_key(inner))
    existing.update(k for k in to_add if k)
    FAQ_ANSWERED_IDS_FILE.write_text(json.dumps(sorted(existing), indent=2), encoding="utf-8")


def get_existing_message_ids() -> Set[str]:
    """
    Build the dedup key set used to skip already-processed emails in sync.

    Keys stored:
    - Normalized Message-ID (with and without angle brackets) for each claim's messageId + threadMessageIds
    - subject|from|date composite key (for emails that have no Message-ID)
    - FAQ-answered IDs (message-ID / composite only)

    NOTE: subject|from alone is intentionally NOT included so that follow-up emails from the
    same sender on the same thread are not mistaken for duplicates — they are handled by
    the thread-merge logic in save_ingested_claim.
    """
    claims = _get_claims_data()
    ids: Set[str] = set()
    for c in claims:
        for mid in _all_message_id_tokens_for_claim(c):
            ids.add(_normalize_key(mid))
            inner = mid.replace("<", "").replace(">", "").strip()
            if inner:
                ids.add(_normalize_key(inner))
        # No-Message-ID composite key (subject|from|date) is stored in the claim's dedup_key /
        # messageId field, so it is already covered by _all_message_id_tokens_for_claim above.
    # NOTE: FAQ-answered IDs are intentionally NOT included here.
    # They are checked separately in the FAQ path of sync_inbox to avoid
    # blocking FNOL re-classification of emails that were previously
    # misidentified as FAQ queries.
    return ids


def get_faq_answered_id_set() -> Set[str]:
    """Return the set of IDs for emails already answered as FAQ (used to skip re-sending replies)."""
    return _get_faq_answered_ids()


def is_reply_to_existing_claim(
    from_addr: str,
    subject: str,
    in_reply_to: Optional[str],
    references: Optional[str],
) -> bool:
    """
    Return True if this email looks like a follow-up / reply to an already-ingested claim.

    Checked BEFORE the FNOL classifier so that follow-up emails — which typically lack incident
    keywords — are not silently dropped as "not FNOL".  The actual merge is done later by
    save_ingested_claim; this function is a cheap read-only pre-check.
    """
    claims = _get_claims_data()
    return _find_claim_for_thread_merge(claims, from_addr, subject, in_reply_to, references) is not None


def add_dedup_keys_to_set(
    ids: Set[str],
    subject: str,
    from_addr: str,
    message_id: str,
    dedup_key: str,
) -> None:
    """Add dedup keys for a newly ingested / merged email so it isn't re-processed in the same sync run."""
    ids.add(_normalize_key(dedup_key))
    if message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        if inner:
            ids.add(_normalize_key(inner))
    # Do NOT add subject|from alone — that would block same-thread follow-ups.


def is_duplicate_email(
    subject: str,
    from_addr: str,
    message_id: str,
    date_header: str,
    existing_ids: Set[str],
) -> bool:
    """
    True only if this exact message was already ingested or merged.

    When Message-ID is present: only that ID is checked (same subject/from can be a follow-up).
    Without Message-ID: only the full subject|from|date composite is checked (re-scan of same email).
    subject|from ALONE is never used — that would silently drop thread replies.
    """
    msg = (message_id or "").strip()
    if msg:
        if _normalize_key(msg) in existing_ids:
            return True
        inner = msg.replace("<", "").replace(">", "").strip()
        if inner and _normalize_key(inner) in existing_ids:
            return True
        return False
    # No Message-ID: only exact subject|from|date match counts as a duplicate
    composite_key = f"{subject}|{from_addr}|{date_header}"
    if _normalize_key(composite_key) in existing_ids:
        return True
    return False


def _message_id_already_ingested(message_id: str, existing_ids: Set[str]) -> bool:
    msg = (message_id or "").strip()
    if not msg:
        return False
    if _normalize_key(msg) in existing_ids:
        return True
    inner = _inner_message_id(msg)
    return bool(inner and _normalize_key(inner) in existing_ids)


def _find_claim_by_rfc_message_id(claims: List[Dict[str, Any]], rfc_mid: str) -> Optional[Dict[str, Any]]:
    """Find claim whose messageId / threadMessageIds matches this RFC Message-ID."""
    target = _inner_message_id(rfc_mid)
    if not target:
        return None
    for c in claims:
        if (c.get("source") or "").strip().lower() == "imap_faq":
            continue
        for mid in _all_message_id_tokens_for_claim(c):
            if _inner_message_id(mid) == target:
                return c
    return None


def _find_claim_for_thread_merge(
    claims: List[Dict[str, Any]],
    from_addr: str,
    subject: str,
    in_reply_to: Optional[str],
    references: Optional[str],
) -> Optional[Dict[str, Any]]:
    """Locate existing claim for a follow-up (In-Reply-To / References, else normalized subject + sender)."""
    ref_tokens: List[str] = []
    if in_reply_to:
        ref_tokens.extend(_message_ids_from_header_value(in_reply_to))
    if references:
        ref_tokens.extend(_message_ids_from_header_value(references))
    for tok in ref_tokens:
        hit = _find_claim_by_rfc_message_id(claims, tok)
        if hit:
            return hit

    sender = _parseaddr_email(from_addr)
    if not sender:
        return None
    subj_key = normalize_thread_subject(subject)
    if len(subj_key) < 4:
        return None
    candidates: List[Dict[str, Any]] = []
    for c in claims:
        if (c.get("source") or "").strip().lower() == "imap_faq":
            continue
        if _parseaddr_email(c.get("from", "")) != sender:
            continue
        if normalize_thread_subject(c.get("subject", "")) == subj_key:
            candidates.append(c)
    if not candidates:
        return None
    candidates.sort(key=lambda x: str(x.get("createdAt", "")), reverse=True)
    return candidates[0]


def _merge_follow_up_into_claim(
    claim: Dict[str, Any],
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
    attachment_files: List[Tuple[str, bytes, str]],
    raw_rfc822: Optional[bytes],
    mail_date_header: Optional[str],
    new_rfc_message_id: Optional[str],
) -> None:
    """Append follow-up content to an existing claim (mail chain + body + attachments + thread ids)."""
    claim_id = claim["id"]
    claim_dir = INGESTED_DIR / claim_id
    claim_dir.mkdir(parents=True, exist_ok=True)

    for name, content, mime_type in attachment_files:
        safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", name)
        file_path = claim_dir / safe_name
        file_path.write_bytes(content)
        claim.setdefault("attachments", []).append({
            "name": name,
            "path": str(file_path),
            "size": len(content),
            "mimeType": mime_type or "application/octet-stream",
        })

    hdr_iso, hdr_disp = _parse_mail_date_header(mail_date_header)
    date_iso = hdr_iso or (claim.get("createdAt") or "")
    support = (os.environ.get("SENDER_EMAIL") or "").strip().lower() or None
    new_chain = build_mail_chain(
        raw_rfc822=raw_rfc822,
        from_addr=from_addr,
        to_addr=to_addr,
        subject=subject,
        email_body=email_body,
        date_iso=date_iso,
        date_display=hdr_disp or "",
        top_level_attachment_count=len(attachment_files),
        support_email_lower=support,
    )
    newest = new_chain[-1] if new_chain else None
    if newest:
        chain = claim.setdefault("mailChain", [])
        prev_body = (chain[-1].get("body") or "").strip() if chain else ""
        if prev_body != (newest.get("body") or "").strip():
            chain.append(newest)

    sep = "\n\n----------\nFollow-up\n----------\n\n"
    claim["emailBody"] = (claim.get("emailBody") or "").rstrip() + sep + email_body

    tids = claim.setdefault("threadMessageIds", [])
    root_mid = (claim.get("messageId") or "").strip()
    if root_mid and _inner_message_id(root_mid) not in {_inner_message_id(x) for x in tids}:
        tids.append(root_mid)
    nm = (new_rfc_message_id or "").strip()
    if nm and _inner_message_id(nm) not in {_inner_message_id(x) for x in tids + [root_mid]}:
        tids.append(nm)


def _find_existing_duplicate_claim(
    subject: str,
    from_addr: str,
    message_id: str,
    date_header: str,
) -> Optional[Dict[str, Any]]:
    """Return an existing ingested claim row if this message matches, else None."""
    norm_sf = _normalized_subject_from(subject, from_addr)
    dedup_key = message_id or f"{subject}|{from_addr}|{date_header}"
    dk_norm = _normalize_key(dedup_key)
    msg_inner = message_id.replace("<", "").replace(">", "").strip() if message_id else ""
    for c in _get_claims_data():
        if (c.get("source") or "").strip().lower() == "imap_faq":
            continue
        if _normalized_subject_from(c.get("subject", ""), c.get("from", "")) == norm_sf:
            return c
        cm = (c.get("messageId") or "").strip()
        if not cm:
            continue
        if _normalize_key(cm) == dk_norm:
            return c
        ci = cm.replace("<", "").replace(">", "").strip()
        if msg_inner and ci and _normalize_key(ci) == _normalize_key(msg_inner):
            return c
    return None


def _get_claims_data() -> List[Dict[str, Any]]:
    """Load ingested claims from JSON."""
    ensure_data_dir()
    if not CLAIMS_FILE.exists():
        return []
    try:
        return json.loads(CLAIMS_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _save_claims_data(claims: List[Dict[str, Any]]) -> None:
    """Save ingested claims to JSON."""
    ensure_data_dir()
    CLAIMS_FILE.write_text(json.dumps(claims, indent=2), encoding="utf-8")


def _seed_demo_claims() -> None:
    """Seed demo claims from demo-data/scenarios."""
    scenarios_dir = PROJECT_ROOT / "demo-data" / "scenarios"
    if not scenarios_dir.exists():
        return

    scenarios = [
        {
            "folder": "auto-collision",
            "policyNumber": "AC789456123",
            "from": "sarah.johnson@email.com",
            "to": "pranay.nath@aimill.in",
            "subject": "Car Accident Claim - Policy #AC789456123",
        },
        {
            "folder": "commercial-liability",
            "policyNumber": "CL789012345",
            "from": "antonio.martinez@tonysrestaurant.com",
            "to": "pranay.nath@aimill.in",
            "subject": "Commercial Liability Claim - Slip and Fall - Policy #CL789012345",
        },
        {
            "folder": "property-water-damage",
            "policyNumber": "HO456789234",
            "from": "robert.chen@email.com",
            "to": "pranay.nath@aimill.in",
            "subject": "Urgent - Water Damage Claim - Policy #HO456789234",
        },
    ]

    import datetime

    base_ts = (datetime.datetime.utcnow() - datetime.timedelta(days=2)).timestamp() * 1000
    claims: List[Dict[str, Any]] = []

    for i, s in enumerate(scenarios):
        email_path = scenarios_dir / s["folder"] / "email.txt"
        attachments_dir = scenarios_dir / s["folder"] / "attachments"
        if not email_path.exists():
            continue

        email_body = email_path.read_text(encoding="utf-8")
        claim_id = f"DEMO-{s['policyNumber']}-{i}"
        claim_dir = INGESTED_DIR / claim_id
        claim_dir.mkdir(parents=True, exist_ok=True)

        attachments: List[Dict[str, Any]] = []
        if attachments_dir.exists():
            for f in attachments_dir.iterdir():
                if f.is_file():
                    dest = claim_dir / f.name
                    dest.write_bytes(f.read_bytes())
                    attachments.append({
                        "name": f.name,
                        "path": str(dest),
                        "size": dest.stat().st_size,
                        "mimeType": "text/plain",
                    })

        created = _iso_now(int(base_ts + i * 3600000))
        support = (os.environ.get("SENDER_EMAIL") or "").strip().lower() or None
        mail_chain = build_mail_chain(
            raw_rfc822=None,
            from_addr=s["from"],
            to_addr=s["to"],
            subject=s["subject"],
            email_body=email_body,
            date_iso=created,
            date_display="",
            top_level_attachment_count=len(attachments),
            support_email_lower=support,
        )
        claims.append({
            "id": claim_id,
            "policyNumber": s["policyNumber"],
            "from": s["from"],
            "to": s["to"],
            "subject": s["subject"],
            "emailBody": email_body,
            "attachments": attachments,
            "createdAt": created,
            "source": "demo",
            "mailChain": mail_chain,
        })

    if claims:
        _save_claims_data(claims)


def _iso_now(ms: int) -> str:
    """Convert milliseconds to ISO string."""
    import datetime
    dt = datetime.datetime.utcfromtimestamp(ms / 1000.0)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def _parse_mail_date_header(mail_date_header: Optional[str]) -> Tuple[str, str]:
    """Return (iso_utc_or_empty, human_display_or_empty) from RFC 2822 Date header."""
    if not mail_date_header or not str(mail_date_header).strip():
        return "", ""
    try:
        dt = parsedate_to_datetime(str(mail_date_header).strip())
        if not dt:
            return "", ""
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=datetime_module.timezone.utc)
        iso = dt.astimezone(datetime_module.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
        disp = dt.astimezone(datetime_module.timezone.utc).strftime("%a, %d %b %Y, %H:%M")
        return iso, disp
    except (TypeError, ValueError, OverflowError):
        return "", ""


def save_ingested_claim(
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
    attachment_files: List[Tuple[str, bytes, str]],
    source: str = "sendgrid",
    message_id: Optional[str] = None,
    email_message_id_for_display: Optional[str] = None,
    raw_rfc822: Optional[bytes] = None,
    mail_date_header: Optional[str] = None,
    in_reply_to: Optional[str] = None,
    references: Optional[str] = None,
) -> Tuple[Optional[Dict[str, Any]], bool, bool]:
    """
    Save ingested claim to JSON and attachments to disk.

    Returns (claim_dict, created_new, merged_follow_up).
    merged_follow_up is True when this message was appended to an existing claim (same thread).
    """
    import time
    import uuid

    mid = (message_id or "").strip()
    date_h = (mail_date_header or "").strip()
    rfc_mid = (email_message_id_for_display or mid or "").strip()

    with _CLAIMS_IO_LOCK:
        claims = _get_claims_data()
        existing_ids = get_existing_message_ids()

        if rfc_mid and _message_id_already_ingested(rfc_mid, existing_ids):
            dup = _find_claim_by_rfc_message_id(claims, rfc_mid)
            if dup is None:
                dup = _find_existing_duplicate_claim(subject, from_addr, mid, date_h)
            return dup, False, False

        parent = _find_claim_for_thread_merge(claims, from_addr, subject, in_reply_to, references)
        if parent is not None:
            _merge_follow_up_into_claim(
                parent,
                from_addr,
                to_addr,
                subject,
                email_body,
                attachment_files,
                raw_rfc822,
                mail_date_header,
                rfc_mid or None,
            )
            if source in ("imap", "sendgrid", "imap_faq"):
                claims = [c for c in claims if c.get("source") != "demo"]
            _save_claims_data(claims)
            return parent, False, True

        if is_duplicate_email(subject, from_addr, mid, date_h, existing_ids):
            dup = _find_existing_duplicate_claim(subject, from_addr, mid, date_h)
            return dup, False, False

        claim_id = f"ING-{int(time.time() * 1000)}-{uuid.uuid4().hex[:7]}"
        extracted = extract_policy_number(email_body) or extract_policy_number(subject)
        if not extracted:
            # No policy number found in body or subject — use sender email as the identifier
            # so the claim can later be grounded by customer email lookup.
            sender_em = _parseaddr_email(from_addr)
            extracted = sender_em or None
        policy_number = extracted or _fallback_policy_display(
            email_message_id_for_display or message_id, claim_id
        )

        ensure_data_dir()
        claim_dir = INGESTED_DIR / claim_id
        claim_dir.mkdir(parents=True, exist_ok=True)

        attachments: List[Dict[str, Any]] = []
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

        created_at = _iso_now(int(time.time() * 1000))
        hdr_iso, hdr_disp = _parse_mail_date_header(mail_date_header)
        date_iso = hdr_iso or created_at
        date_display = hdr_disp
        support = (os.environ.get("SENDER_EMAIL") or "").strip().lower() or None
        mail_chain = build_mail_chain(
            raw_rfc822=raw_rfc822,
            from_addr=from_addr,
            to_addr=to_addr,
            subject=subject,
            email_body=email_body,
            date_iso=date_iso,
            date_display=date_display,
            top_level_attachment_count=len(attachments),
            support_email_lower=support,
        )

        stored_mid = mid or (email_message_id_for_display or "").strip()
        claim = {
            "id": claim_id,
            "policyNumber": policy_number,
            "from": from_addr,
            "to": to_addr,
            "subject": subject,
            # emailBody must always be the original email body text, NOT extracted document content
            "emailBody": email_body,
            "attachments": attachments,
            "createdAt": created_at,
            "source": source,
            "mailChain": mail_chain,
        }
        if stored_mid:
            claim["messageId"] = stored_mid

        claims = _get_claims_data()

        # If this is a real email or FAQ-answered (not demo), remove all demo claims
        if source in ("imap", "sendgrid", "imap_faq"):
            claims = [c for c in claims if c.get("source") != "demo"]

        claims.insert(0, claim)
        _save_claims_data(claims)

    if source in ("imap", "sendgrid"):
        try:
            from backend.claim_notification.service import send_fnol_received_acknowledgement_email

            ack = send_fnol_received_acknowledgement_email(claim)
            if ack.get("success"):
                # Append the outbound ack as a mail-chain entry so the thread is complete in the inbox.
                append_outbound_mail_entry(
                    claim_id=claim["id"],
                    sender_display=ack.get("senderDisplay", "Claims Department"),
                    to_addr=ack.get("toAddr") or claim.get("from") or "",
                    subject=ack.get("subject", "We received your claim notice"),
                    body_text=ack.get("textBody", ""),
                )
            else:
                print(
                    f"FNOL receipt acknowledgement skipped or failed: {ack.get('error', ack.get('message', 'unknown'))}",
                    file=sys.stderr,
                )
        except Exception as e:
            print(f"FNOL receipt acknowledgement error (ingest saved): {e}", file=sys.stderr)

    return claim, True, False


def append_outbound_mail_entry(
    claim_id: str,
    sender_display: str,
    to_addr: str,
    subject: str,
    body_text: str,
    date_iso: Optional[str] = None,
) -> bool:
    """
    Append an outbound (system-sent) email as a mail-chain entry to an existing claim.
    Returns True if the claim was found and updated, False otherwise.
    """
    import datetime as _dt
    now_iso = date_iso or _dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    entry: Dict[str, Any] = {
        "from": sender_display,
        "fromLabel": sender_display,
        "to": to_addr,
        "subject": subject,
        "body": body_text,
        "dateIso": now_iso,
        "dateDisplay": "",
        "attachmentCount": 0,
        "isOutbound": True,
    }
    with _CLAIMS_IO_LOCK:
        claims = _get_claims_data()
        for c in claims:
            if c.get("id") == claim_id:
                chain = c.setdefault("mailChain", [])
                # Avoid exact duplicate outbound entries (idempotent re-sends)
                last_body = (chain[-1].get("body") or "").strip() if chain else ""
                if last_body != body_text.strip():
                    chain.append(entry)
                    _save_claims_data(claims)
                return True
    return False


def save_faq_conversation(
    from_addr: str,
    to_addr: str,
    subject: str,
    inbound_body: str,
    outbound_body: str,
    outbound_subject: str,
    sender_display: str,
    message_id: Optional[str] = None,
    mail_date_header: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """
    Create a claim record (source='imap_faq') that holds both the customer's FAQ email and
    the automated reply so they appear together as a thread in the inbox.

    Returns the created claim dict, or None if already stored (dedup by message_id).
    """
    import datetime as _dt
    import time
    import uuid

    with _CLAIMS_IO_LOCK:
        claims = _get_claims_data()
        existing_ids = get_existing_message_ids()

        # Dedup: if we already have this message_id don't create a duplicate entry
        mid = (message_id or "").strip()
        if mid and _message_id_already_ingested(mid, existing_ids):
            return None

        claim_id = f"FAQ-{int(time.time() * 1000)}-{uuid.uuid4().hex[:7]}"
        created_at = _iso_now(int(time.time() * 1000))
        hdr_iso, hdr_disp = _parse_mail_date_header(mail_date_header)
        date_iso = hdr_iso or created_at
        now_iso = _dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")

        inbound_entry: Dict[str, Any] = {
            "from": from_addr,
            "fromLabel": from_addr,
            "to": to_addr,
            "subject": subject,
            "body": inbound_body,
            "dateIso": date_iso,
            "dateDisplay": hdr_disp or "",
            "attachmentCount": 0,
            "isOutbound": False,
        }
        outbound_entry: Dict[str, Any] = {
            "from": sender_display,
            "fromLabel": sender_display,
            "to": from_addr,
            "subject": outbound_subject,
            "body": outbound_body,
            "dateIso": now_iso,
            "dateDisplay": "",
            "attachmentCount": 0,
            "isOutbound": True,
        }

        claim: Dict[str, Any] = {
            "id": claim_id,
            "policyNumber": extract_policy_number(inbound_body) or extract_policy_number(subject) or "FAQ",
            "from": from_addr,
            "to": to_addr,
            "subject": subject,
            "emailBody": inbound_body,
            "attachments": [],
            "createdAt": created_at,
            "source": "imap_faq",
            "mailChain": [inbound_entry, outbound_entry],
        }
        if mid:
            claim["messageId"] = mid

        claims = [c for c in claims if c.get("source") != "demo"]
        claims.insert(0, claim)
        _save_claims_data(claims)
        return claim


def get_faq_claims() -> List[Dict[str, Any]]:
    """Return FAQ conversation claims (source=imap_faq with ≥2 mail-chain entries) for the FAQ inbox."""
    claims = _get_claims_data()
    support = (os.environ.get("SENDER_EMAIL") or "").strip().lower() or None
    result = []
    for c in claims:
        if (c.get("source") or "").strip().lower() != "imap_faq":
            continue
        if len(c.get("mailChain") or []) < 2:
            continue
        ensure_mail_chain_on_claim(c, support_email_lower=support)
        result.append({
            "id": c["id"],
            "policyNumber": c.get("policyNumber", "FAQ"),
            "subject": c.get("subject", ""),
            "from": c.get("from", ""),
            "createdAt": c.get("createdAt", ""),
            "source": c.get("source", ""),
        })
    return result


def get_all_ingested_claims() -> List[Dict[str, Any]]:
    """Get all ingested claims. Seeds demo only if no real emails exist."""
    claims = _get_claims_data()

    # has_any_real: counts imap_faq too — used only to decide whether to seed demo claims
    has_any_real = any(c.get("source") in ("imap", "sendgrid", "imap_faq") for c in claims)
    # has_real: imap/sendgrid only — drives demo suppression in display
    has_real = any(c.get("source") in ("imap", "sendgrid") for c in claims)

    # Only seed demo claims if there are NO real emails at all
    if not has_any_real and not claims:
        _seed_demo_claims()
        claims = _get_claims_data()

    # imap_faq records are stored only for dedup/conversation tracking; never shown as claims
    if has_real:
        return [
            c for c in claims
            if c.get("source") not in ("demo", "imap_faq")
        ]

    return [
        c for c in claims
        if c.get("source") not in ("imap_faq",)
    ]


def get_ingested_claim_by_id(claim_id: str) -> Optional[Dict[str, Any]]:
    """
    Get a single claim by ID.
    imap_faq entries with a real conversation (≥2 chain entries) are returned; dedup-only are hidden.
    """
    claims = _get_claims_data()
    claim = next((c for c in claims if c.get("id") == claim_id), None)
    if claim and (claim.get("source") or "").strip().lower() == "imap_faq":
        if len(claim.get("mailChain") or []) < 2:
            return None
    if claim:
        support = (os.environ.get("SENDER_EMAIL") or "").strip().lower() or None
        ensure_mail_chain_on_claim(claim, support_email_lower=support)
    return claim


def get_policy_numbers() -> List[Dict[str, str]]:
    """Get policy numbers for dropdown. Only shows demo if no real emails exist."""
    claims = _get_claims_data()

    # has_any_real: counts imap_faq too — used only to decide whether to seed demo claims
    has_any_real = any(c.get("source") in ("imap", "sendgrid", "imap_faq") for c in claims)
    # has_real: imap/sendgrid only — drives demo suppression in display
    has_real = any(c.get("source") in ("imap", "sendgrid") for c in claims)

    # Only seed demo claims if there are NO real emails at all
    if not has_any_real and not claims:
        _seed_demo_claims()
        claims = _get_claims_data()
        # Re-check after seeding
        has_real = any(c.get("source") in ("imap", "sendgrid") for c in claims)

    # imap_faq records are stored only for dedup; never shown in the policy/claims dropdown
    to_show = [c for c in claims if c.get("source") not in ("demo", "imap_faq")] if has_real else [c for c in claims if c.get("source") not in ("imap_faq",)]
    return [
        {
            "id": c["id"],
            "policyNumber": c["policyNumber"],
            "subject": c["subject"],
            "from": c.get("from", ""),
            "createdAt": c.get("createdAt", ""),
            "source": c.get("source", ""),
        }
        for c in to_show
    ]


def clear_all_ingested_claims() -> None:
    """Clear all ingested claims."""
    ensure_data_dir()
    if CLAIMS_FILE.exists():
        CLAIMS_FILE.unlink()
    if INGESTED_DIR.exists():
        for entry in INGESTED_DIR.iterdir():
            if entry.is_dir():
                import shutil
                shutil.rmtree(entry)


def read_attachment_content(claim_id: str, attachment_name: str) -> str:
    """Read attachment content for processing."""
    claim = get_ingested_claim_by_id(claim_id)
    if not claim:
        raise ValueError("Claim not found")
    att = next((a for a in claim.get("attachments", []) if a.get("name") == attachment_name), None)
    if not att or not Path(att["path"]).exists():
        raise ValueError("Attachment not found")
    ext = Path(att["name"]).suffix.lower()
    if ext in (".txt", ".csv", ".log"):
        return Path(att["path"]).read_text(encoding="utf-8")
    return f"[Document: {attachment_name} - content extracted for processing]"
