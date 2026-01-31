#!/usr/bin/env python3
"""
Dashboard Microservice - Processed Claims History

Manages processed claims: save, list, retrieve by ID, export CSV.
Shares data format with Next.js app (data/processed-claims/).

Usage:
    python dashboard.py list              # List claim summaries (JSON)
    python dashboard.py get <claimId>     # Get full claim by ID (JSON)
    python dashboard.py save              # Save claim from stdin (JSON)
    python dashboard.py csv               # Get CSV content
"""

import json
import re
import sys
from pathlib import Path
from typing import Any, List, Optional

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = _PROJECT_ROOT / "data"
CLAIMS_DIR = DATA_DIR / "processed-claims"
INDEX_FILE = CLAIMS_DIR / "claims-index.json"
CSV_FILE = CLAIMS_DIR / "claims-history.csv"


def _ensure_dir() -> None:
    """Ensure data directories exist."""
    CLAIMS_DIR.mkdir(parents=True, exist_ok=True)


def _get_index() -> List[dict]:
    """Load claims index."""
    _ensure_dir()
    if not INDEX_FILE.exists():
        return []
    try:
        return json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _save_index(index: List[dict]) -> None:
    """Save claims index."""
    _ensure_dir()
    INDEX_FILE.write_text(json.dumps(index, indent=2), encoding="utf-8")


def _escape_csv(val: Any) -> str:
    """Escape value for CSV."""
    if val is None:
        return ""
    s = str(val)
    if "," in s or '"' in s or "\n" in s:
        return f'"{s.replace(chr(34), chr(34) + chr(34))}"'
    return s


def _append_to_csv(claim: dict[str, Any]) -> None:
    """Append claim row to CSV."""
    _ensure_dir()
    draft = (claim.get("decisionPack") or {}).get("claimDraft") or {}
    headers = [
        "claimId", "ingestedClaimId", "policyNumber", "claimantName",
        "contactEmail", "contactPhone", "lossDate", "lossType",
        "lossLocation", "description", "status", "createdAt",
    ]
    row = [
        claim.get("claimId", ""),
        claim.get("ingestedClaimId", ""),
        draft.get("policyNumber", ""),
        draft.get("claimantName", ""),
        draft.get("contactEmail", ""),
        draft.get("contactPhone", ""),
        draft.get("lossDate", ""),
        draft.get("lossType", ""),
        draft.get("lossLocation") or draft.get("location", ""),
        draft.get("description", ""),
        claim.get("status", ""),
        claim.get("createdAt", ""),
    ]
    line = ",".join(_escape_csv(h) for h in headers) + "\n" if not CSV_FILE.exists() else ""
    line += ",".join(_escape_csv(v) for v in row) + "\n"
    with open(CSV_FILE, "a", encoding="utf-8") as f:
        f.write(line)


def save_processed_claim(claim: dict[str, Any]) -> None:
    """Save a processed claim to history and CSV."""
    _ensure_dir()
    claim_id = claim.get("claimId") or f"CLM-{int(__import__('time').time() * 1000)}"
    safe_id = re.sub(r"[/\\:]", "_", claim_id)
    file_path = CLAIMS_DIR / f"{safe_id}.json"

    to_save = {**claim, "claimId": claim_id}
    file_path.write_text(json.dumps(to_save, indent=2), encoding="utf-8")

    draft = (claim.get("decisionPack") or {}).get("claimDraft") or {}
    index = _get_index()
    existing = next((i for i, e in enumerate(index) if e.get("claimId") == claim_id), -1)

    if existing < 0:
        _append_to_csv(to_save)

    entry = {
        "claimId": claim_id,
        "ingestedClaimId": claim.get("ingestedClaimId"),
        "policyNumber": draft.get("policyNumber"),
        "claimantName": draft.get("claimantName"),
        "createdAt": claim.get("createdAt", ""),
        "filePath": str(file_path),
    }

    if existing >= 0:
        index[existing] = entry
    else:
        index.insert(0, entry)
    _save_index(index)


def get_processed_claim_summaries() -> List[dict]:
    """Get list of processed claim summaries."""
    index = _get_index()
    return [
        {
            "claimId": e.get("claimId"),
            "ingestedClaimId": e.get("ingestedClaimId"),
            "policyNumber": e.get("policyNumber"),
            "claimantName": e.get("claimantName"),
            "createdAt": e.get("createdAt", ""),
        }
        for e in index
    ]


def get_processed_claim_by_id(claim_id: str) -> Optional[dict]:
    """Get full claim data by ID."""
    index = _get_index()
    entry = next((e for e in index if e.get("claimId") == claim_id), None)
    if not entry or not Path(entry["filePath"]).exists():
        return None
    try:
        return json.loads(Path(entry["filePath"]).read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return None


def get_csv_content() -> str:
    """Get CSV content for export."""
    if not CSV_FILE.exists():
        return ""
    return CSV_FILE.read_text(encoding="utf-8")


def main() -> int:
    """CLI entry point."""
    args = sys.argv[1:]
    if not args:
        print(json.dumps({"error": "Usage: list | get <claimId> | save | csv"}), file=sys.stderr)
        return 1

    cmd = args[0].lower()

    if cmd == "list":
        summaries = get_processed_claim_summaries()
        print(json.dumps(summaries))
        return 0

    if cmd == "get":
        if len(args) < 2:
            print(json.dumps({"error": "claimId required"}), file=sys.stderr)
            return 1
        claim = get_processed_claim_by_id(args[1])
        print(json.dumps(claim) if claim is not None else "null")
        return 0

    if cmd == "save":
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}), file=sys.stderr)
            return 1
        if not payload.get("decisionPack"):
            print(json.dumps({"error": "Invalid claim data"}), file=sys.stderr)
            return 1
        save_processed_claim(payload)
        print(json.dumps({"success": True, "claimId": payload.get("claimId")}))
        return 0

    if cmd == "csv":
        print(get_csv_content(), end="")
        return 0

    print(json.dumps({"error": f"Unknown command: {cmd}"}), file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
