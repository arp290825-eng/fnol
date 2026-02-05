"""
Process Claim Orchestrator.

Orchestrates extraction + decision + dashboard microservices.
"""

import sys
import time
from typing import Any, Dict

from backend.dashboard.service import save_processed_claim
from backend.decision.service import build_decision_pack
from backend.extraction.service import extract_claim_information
from backend.ingested_claims.service import get_ingested_claim_by_id


def process_claim(ingested_claim_id: str) -> Dict[str, Any]:
    """
    Process an ingested claim end-to-end.

    Args:
        ingested_claim_id: ID of the ingested claim.

    Returns:
        Complete ClaimData dict for frontend.

    Raises:
        ValueError: If claim not found.
    """
    claim = get_ingested_claim_by_id(ingested_claim_id)
    if not claim:
        raise ValueError(f"Claim not found: {ingested_claim_id}")

    extraction_start = time.time()
    extraction = extract_claim_information(
        claim_id=ingested_claim_id,
        email_body=claim.get("emailBody", ""),
        attachments=claim.get("attachments", []),
    )
    extraction_duration_ms = int((time.time() - extraction_start) * 1000)

    claim_data = build_decision_pack(
        ingested_claim_id=ingested_claim_id,
        claim=claim,
        extraction=extraction,
        extraction_duration_ms=extraction_duration_ms,
    )

    total_duration = int((time.time() - extraction_start) * 1000)
    claim_data["processingTime"] = total_duration
    claim_data["processingMetrics"] = claim_data.get("processingMetrics") or {}
    claim_data["processingMetrics"]["totalProcessingTime"] = total_duration
    claim_data["processingMetrics"]["averageHandleTime"] = total_duration / 1000.0

    save_processed_claim(claim_data)
    return claim_data


def main() -> int:
    """CLI entry: process a claim and output JSON."""
    if len(sys.argv) < 2:
        print('{"error": "Usage: python -m backend.process_claim <ingested_claim_id>"}', file=sys.stderr)
        return 1

    ingested_claim_id = sys.argv[1]
    try:
        result = process_claim(ingested_claim_id)
        print(__import__("json").dumps(result, indent=2))
        return 0
    except ValueError as e:
        print(__import__("json").dumps({"error": str(e)}), file=sys.stderr)
        return 1
    except Exception as e:
        print(__import__("json").dumps({"error": f"Processing failed: {e}"}), file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
