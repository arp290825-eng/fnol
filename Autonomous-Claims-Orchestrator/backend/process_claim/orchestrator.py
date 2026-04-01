"""
Process Claim Orchestrator.

Orchestrates extraction + decision + dashboard microservices.
Auto-rejects claims for expired/invalid policies and sends desk rejection email.
"""

import sys
import time
from typing import Any, Dict, Tuple

from backend.claim_notification.service import send_desk_rejection_email
from backend.dashboard.service import save_processed_claim
from backend.decision.service import build_decision_pack
from backend.extraction.service import extract_claim_information
from backend.ingested_claims.service import get_ingested_claim_by_id

# Clause IDs that indicate policy is expired or invalid (auto desk-reject)
AUTO_REJECT_CLAUSE_IDS = frozenset({
    "POLICY-EXPIRED",
    "POLICY-INACTIVE",
    "CLAIM-BEFORE-EFFECTIVE-DATE",
    "CLAIM-AFTER-EXPIRATION",
    "POLICY-NOT-FOUND",
    "CUSTOMER-NOT-FOUND",
})


def _should_auto_reject_for_expired_policy(claim_data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Determine if the claim should be auto-rejected due to expired or invalid policy.

    Returns:
        (should_reject: bool, reason: str)
    """
    pack = claim_data.get("decisionPack") or {}
    policy_grounding = pack.get("policyGrounding") or []
    policy_holder = pack.get("policyHolderInfo") or {}

    # Check policy grounding for expired/invalid indicators
    for pg in policy_grounding:
        clause_id = (pg.get("clauseId") or "").strip()
        if clause_id in AUTO_REJECT_CLAUSE_IDS:
            if clause_id == "POLICY-EXPIRED":
                exp = pg.get("expiration_date") or policy_holder.get("expiration_date")
                return True, f"Policy expired on {exp}." if exp else "Policy has expired."
            if clause_id == "CLAIM-BEFORE-EFFECTIVE-DATE":
                eff = policy_holder.get("effective_date")
                return True, f"Loss date is before the policy effective date ({eff})." if eff else "Loss date is before the policy coverage period."
            if clause_id == "CLAIM-AFTER-EXPIRATION":
                exp = pg.get("expiration_date") or policy_holder.get("expiration_date")
                return True, f"Loss date is after the policy expiration date ({exp})." if exp else "Loss date is outside the policy coverage period."
            if clause_id == "POLICY-INACTIVE":
                return True, "Policy is not active or outside coverage period."
            if clause_id == "POLICY-NOT-FOUND":
                return True, "Policy number was not found in our records."
            if clause_id == "CUSTOMER-NOT-FOUND":
                return True, "No customer record found for this policy."
            return True, "Policy is not in force."

    # Fallback: check policy holder status
    if (policy_holder.get("policy_status") or "").upper() == "EXPIRED":
        exp = policy_holder.get("expiration_date")
        return True, f"Policy expired on {exp}" if exp else "Policy has expired."

    return False, ""


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

    # Auto-reject expired/invalid policy and send desk rejection email
    should_reject, reject_reason = _should_auto_reject_for_expired_policy(claim_data)
    if should_reject:
        claim_data["status"] = "desk_rejected"
        claim_data["deskRejectionReason"] = reject_reason
        try:
            result = send_desk_rejection_email(claim_data, reason=reject_reason)
            if not result.get("success"):
                print(
                    f"Desk rejection email failed: {result.get('error', 'unknown')}",
                    file=sys.stderr,
                )
        except Exception as e:
            print(f"Desk rejection email error: {e}", file=sys.stderr)
        save_processed_claim(claim_data)
        return claim_data

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
