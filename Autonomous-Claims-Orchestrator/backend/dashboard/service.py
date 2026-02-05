"""
Dashboard Microservice - Processed Claims History.

Manages processed claims: save, list, retrieve by ID, export CSV, KPIs.
Compatible with Claims Fast Lane frontend.
"""

import json
import re
import sys
import time
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional

from backend.common.config import (
    CLAIMS_INDEX_FILE,
    CSV_FILE,
    ensure_data_dir,
    PROCESSED_CLAIMS_DIR,
)


def _get_index() -> List[Dict[str, Any]]:
    """Load claims index."""
    ensure_data_dir()
    if not CLAIMS_INDEX_FILE.exists():
        return []
    try:
        return json.loads(CLAIMS_INDEX_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []


def _save_index(index: List[Dict[str, Any]]) -> None:
    """Save claims index."""
    ensure_data_dir()
    CLAIMS_INDEX_FILE.write_text(json.dumps(index, indent=2), encoding="utf-8")


def _escape_csv(val: Any) -> str:
    """Escape value for CSV."""
    if val is None:
        return ""
    s = str(val)
    if "," in s or '"' in s or "\n" in s:
        return f'"{s.replace(chr(34), chr(34) + chr(34))}"'
    return s


def _append_to_csv(claim: Dict[str, Any]) -> None:
    """Append claim row to CSV."""
    ensure_data_dir()
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
    write_header = not CSV_FILE.exists()
    line = (",".join(_escape_csv(h) for h in headers) + "\n" if write_header else "")
    line += ",".join(_escape_csv(v) for v in row) + "\n"
    with open(CSV_FILE, "a", encoding="utf-8") as f:
        f.write(line)


def save_processed_claim(claim: Dict[str, Any]) -> None:
    """Save a processed claim to history and CSV."""
    ensure_data_dir()
    claim_id = claim.get("claimId") or f"CLM-{int(time.time() * 1000)}"
    safe_id = re.sub(r"[/\\:]", "_", claim_id)
    file_path = PROCESSED_CLAIMS_DIR / f"{safe_id}.json"

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


def get_processed_claim_summaries() -> List[Dict[str, Any]]:
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


def get_processed_claim_by_id(claim_id: str) -> Optional[Dict[str, Any]]:
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


def get_dashboard_kpis() -> Dict[str, Any]:
    """Compute real-time KPIs from all processed claims."""
    index = _get_index()
    if not index:
        return {
            "totalClaims": 0,
            "claimsThisWeek": 0,
            "claimsThisMonth": 0,
            "claimsByLossType": {},
            "coverageMatchRate": 0,
            "avgConfidence": 0,
            "totalDocumentsProcessed": 0,
            "claimsByDate": [],
            "recentClaims": [],
        }

    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)

    total_claims = 0
    claims_this_week = 0
    claims_this_month = 0
    loss_type_counts: Dict[str, int] = defaultdict(int)
    coverage_matched = 0
    confidence_sum = 0.0
    confidence_count = 0
    total_docs = 0
    date_counts: Dict[str, int] = defaultdict(int)
    recent: List[Dict[str, Any]] = []

    for entry in index:
        file_path = entry.get("filePath")
        if not file_path or not Path(file_path).exists():
            continue

        try:
            claim = json.loads(Path(file_path).read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            continue

        total_claims += 1
        created = claim.get("createdAt", "")
        if created:
            try:
                dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
                dt_naive = dt.replace(tzinfo=None) if dt.tzinfo else dt
                date_key = dt_naive.strftime("%Y-%m-%d")
                date_counts[date_key] = date_counts.get(date_key, 0) + 1
                if date_key >= week_ago.strftime("%Y-%m-%d"):
                    claims_this_week += 1
                if date_key >= month_ago.strftime("%Y-%m-%d"):
                    claims_this_month += 1
            except (ValueError, TypeError):
                pass

        dp = claim.get("decisionPack") or {}
        draft = dp.get("claimDraft") or {}
        loss_type = str(draft.get("lossType", "Other")).strip() or "Other"
        loss_type_counts[loss_type] = loss_type_counts.get(loss_type, 0) + 1

        policy_grounding = dp.get("policyGrounding") or []
        if policy_grounding:
            coverage_matched += 1

        evidence = dp.get("evidence") or []
        for e in evidence:
            conf = e.get("confidence")
            if conf is not None:
                confidence_sum += float(conf)
                confidence_count += 1

        docs = dp.get("documents") or []
        total_docs += len(docs)

        if len(recent) < 5:
            recent.append({
                "claimId": claim.get("claimId"),
                "policyNumber": draft.get("policyNumber"),
                "claimantName": draft.get("claimantName"),
                "lossType": loss_type,
                "createdAt": created,
                "policyMatches": len(policy_grounding),
            })

    sorted_dates = sorted(date_counts.keys())[-14:]
    claims_by_date = [{"date": d, "count": date_counts[d]} for d in sorted_dates]

    avg_conf = (confidence_sum / confidence_count) if confidence_count > 0 else 0
    cov_rate = (coverage_matched / total_claims * 100) if total_claims > 0 else 0

    return {
        "totalClaims": total_claims,
        "claimsThisWeek": claims_this_week,
        "claimsThisMonth": claims_this_month,
        "claimsByLossType": dict(loss_type_counts),
        "coverageMatchRate": round(cov_rate, 1),
        "avgConfidence": round(avg_conf * 100, 1),
        "totalDocumentsProcessed": total_docs,
        "claimsByDate": claims_by_date,
        "recentClaims": recent,
    }


def main() -> int:
    """CLI entry point."""
    args = sys.argv[1:]
    if not args:
        print(json.dumps({"error": "Usage: list | get <claimId> | save | csv | stats"}), file=sys.stderr)
        return 1

    cmd = args[0].lower()

    if cmd == "list":
        print(json.dumps(get_processed_claim_summaries()))
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

    if cmd == "stats":
        print(json.dumps(get_dashboard_kpis()))
        return 0

    print(json.dumps({"error": f"Unknown command: {cmd}"}), file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
