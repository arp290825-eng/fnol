"""
Ingested Claims Service.

Manages FNOL claims ingested from email. CRUD, deduplication, attachment handling.
Converted from TypeScript for modular backend architecture.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

from backend.common.config import (
    CLAIMS_FILE,
    ensure_data_dir,
    INGESTED_DIR,
    PROJECT_ROOT,
)


def _normalize_key(s: str) -> str:
    """Normalize string for deduplication."""
    return s.strip().lower()


def _normalized_subject_from(subject: str, from_addr: str) -> str:
    """Build normalized dedup key from subject and from."""
    return _normalize_key(f"{subject}|{from_addr}")


def _fallback_policy_display(message_id: Optional[str], claim_id: str) -> str:
    """Use email Message-ID as identifier when policy number not found."""
    if not message_id:
        return claim_id
    if "<" in message_id and "@" in message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        return inner or claim_id
    return claim_id


def extract_policy_number(email_body: str) -> Optional[str]:
    """Extract policy number from email body using common patterns."""
    patterns = [
        r"policy\s*#?\s*:?\s*([A-Z0-9]{6,})",
        r"policy\s*number\s*:?\s*([A-Z0-9]{6,})",
        r"Policy\s*#([A-Z0-9]+)",
        r"#([A-Z]{2}\d{6,})",
        r"\b([A-Z]{2}\d{6,})\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, email_body, re.IGNORECASE)
        if match and match.group(1):
            return match.group(1)
    return None


def get_existing_message_ids() -> Set[str]:
    """Get existing message IDs for deduplication."""
    claims = _get_claims_data()
    ids: Set[str] = set()
    for c in claims:
        ids.add(_normalized_subject_from(c.get("subject", ""), c.get("from", "")))
        mid = c.get("messageId", "")
        if mid:
            ids.add(_normalize_key(mid))
            inner = mid.replace("<", "").replace(">", "").strip()
            if inner:
                ids.add(_normalize_key(inner))
    return ids


def add_dedup_keys_to_set(
    ids: Set[str],
    subject: str,
    from_addr: str,
    message_id: str,
    dedup_key: str,
) -> None:
    """Add dedup keys for a newly ingested claim."""
    ids.add(_normalized_subject_from(subject, from_addr))
    ids.add(_normalize_key(dedup_key))
    if message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        if inner:
            ids.add(_normalize_key(inner))


def is_duplicate_email(
    subject: str,
    from_addr: str,
    message_id: str,
    date_header: str,
    existing_ids: Set[str],
) -> bool:
    """Check if email is a duplicate."""
    if _normalized_subject_from(subject, from_addr) in existing_ids:
        return True
    dedup_key = message_id or f"{subject}|{from_addr}|{date_header}"
    if _normalize_key(dedup_key) in existing_ids:
        return True
    if message_id:
        inner = message_id.replace("<", "").replace(">", "").strip()
        if inner and _normalize_key(inner) in existing_ids:
            return True
    return False


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

        claims.append({
            "id": claim_id,
            "policyNumber": s["policyNumber"],
            "from": s["from"],
            "to": s["to"],
            "subject": s["subject"],
            "emailBody": email_body,
            "attachments": attachments,
            "createdAt": _iso_now(int(base_ts + i * 3600000)),
            "source": "demo",
        })

    if claims:
        _save_claims_data(claims)


def _iso_now(ms: int) -> str:
    """Convert milliseconds to ISO string."""
    import datetime
    dt = datetime.datetime.utcfromtimestamp(ms / 1000.0)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def save_ingested_claim(
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
    attachment_files: List[Tuple[str, bytes, str]],
    source: str = "sendgrid",
    message_id: Optional[str] = None,
    email_message_id_for_display: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Save ingested claim to JSON and attachments to disk.

    Returns the created claim dict.
    """
    import time
    import uuid

    claim_id = f"ING-{int(time.time() * 1000)}-{uuid.uuid4().hex[:7]}"
    extracted = extract_policy_number(email_body) or extract_policy_number(subject)
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

    claim: Dict[str, Any] = {
        "id": claim_id,
        "policyNumber": policy_number,
        "from": from_addr,
        "to": to_addr,
        "subject": subject,
        "emailBody": email_body,
        "attachments": attachments,
        "createdAt": _iso_now(int(time.time() * 1000)),
        "source": source,
    }
    if message_id:
        claim["messageId"] = message_id

    claims = _get_claims_data()
    claims.insert(0, claim)
    _save_claims_data(claims)
    return claim


def get_all_ingested_claims() -> List[Dict[str, Any]]:
    """Get all ingested claims. Seeds demo if empty."""
    claims = _get_claims_data()
    if not claims:
        _seed_demo_claims()
        claims = _get_claims_data()
    has_real = any(c.get("source") in ("imap", "sendgrid") for c in claims)
    if has_real:
        return [c for c in claims if c.get("source") != "demo"]
    return claims


def get_ingested_claim_by_id(claim_id: str) -> Optional[Dict[str, Any]]:
    """Get a single claim by ID."""
    claims = _get_claims_data()
    return next((c for c in claims if c.get("id") == claim_id), None)


def get_policy_numbers() -> List[Dict[str, str]]:
    """Get policy numbers for dropdown."""
    claims = _get_claims_data()
    if not claims:
        _seed_demo_claims()
        claims = _get_claims_data()
    has_real = any(c.get("source") in ("imap", "sendgrid") for c in claims)
    to_show = [c for c in claims if c.get("source") != "demo"] if has_real else claims
    return [
        {"id": c["id"], "policyNumber": c["policyNumber"], "subject": c["subject"]}
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
