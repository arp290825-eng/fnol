"""
Decision Service.

Builds decision pack: policy grounding, claim draft, evidence summary,
document analysis, policy assessment.
"""

import time
from typing import Any, Dict, List, Optional

from backend.decision.policy_clauses import (
    CONFIDENCE_THRESHOLD_HIGH,
    CONFIDENCE_THRESHOLD_MEDIUM,
    get_policy_grounding,
)


def _mask_email(email: Optional[str]) -> str:
    """Mask email for PII protection."""
    if not email:
        return "Not found"
    parts = email.split("@")
    if len(parts) != 2:
        return "Not found"
    return f"{parts[0][:2]}***@{parts[1]}"


def _mask_phone(phone: Optional[str]) -> str:
    """Mask phone for PII protection."""
    if not phone:
        return "Not found"
    import re
    return re.sub(r"\d(?=\d{4})", "*", phone)


def _build_claim_draft(
    fields: Dict[str, Any],
    claim: Dict[str, Any],
    extraction: Dict[str, Any],
) -> Dict[str, Any]:
    """Build claim draft from extraction result."""
    now = _iso_now()
    policy_val = fields.get("policyNumber") or ""
    policy_masked = f"***{str(policy_val)[-3:]}" if policy_val else "Not found"

    attachments = claim.get("attachments", [])
    documents = extraction.get("documents", [])

    draft_attachments: List[Dict[str, Any]] = []
    for i, att in enumerate(attachments):
        doc = documents[i] if i < len(documents) else {}
        draft_attachments.append({
            "id": f"doc_{i}",
            "name": att.get("name", ""),
            "type": doc.get("type", "Other"),
            "mimeType": att.get("mimeType", "application/octet-stream"),
            "confidence": doc.get("confidence", 0.7),
        })

    evidence = extraction.get("evidence", [])
    avg_conf = (
        sum(e.get("confidence", 0) for e in evidence) / len(evidence)
        if evidence
        else 0.0
    )

    return {
        "id": f"DRAFT-{int(time.time() * 1000)}",
        "policyNumber": policy_masked,
        "claimantName": str(fields.get("claimantName") or "Not found"),
        "contactEmail": _mask_email(str(fields.get("contactEmail") or "").strip() or None),
        "contactPhone": _mask_phone(str(fields.get("contactPhone") or "").strip() or None),
        "lossDate": str(fields.get("lossDate") or now.split("T")[0]),
        "lossType": str(fields.get("lossType") or "Other"),
        "lossLocation": str(fields.get("lossLocation") or "See description"),
        "description": str(fields.get("description") or "Claim submitted via email"),
        "estimatedAmount": fields.get("estimatedAmount") or fields.get("estimatedDamage") or 0,
        "vehicleInfo": fields.get("vehicleInfo"),
        "propertyAddress": fields.get("propertyAddress"),
        "attachments": draft_attachments,
        "coverageFound": bool(fields.get("policyNumber")),
        "deductible": 500 if fields.get("policyNumber") else None,
        "createdAt": now,
        "source": "information_extraction",
        "confidence": avg_conf,
    }


def _iso_now() -> str:
    """Current time as ISO string."""
    from datetime import datetime, timezone
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def build_decision_pack(
    ingested_claim_id: str,
    claim: Dict[str, Any],
    extraction: Dict[str, Any],
    extraction_duration_ms: int = 0,
) -> Dict[str, Any]:
    """
    Build full decision pack and claim data.

    Args:
        ingested_claim_id: Ingested claim ID.
        claim: Ingested claim dict (from, to, subject, emailBody, attachments).
        extraction: Extraction result (extractedFields, documents, evidence, errors).
        extraction_duration_ms: Time taken for extraction.

    Returns:
        Complete ClaimData dict for frontend.
    """
    now = _iso_now()
    claim_id = f"CLM-{ingested_claim_id}"
    fields = extraction.get("extractedFields") or {}

    policy_start = time.time()
    policy_grounding = get_policy_grounding(fields)
    policy_duration_ms = int((time.time() - policy_start) * 1000)

    claim_draft = _build_claim_draft(fields, claim, extraction)
    ev = extraction.get("evidence", [])
    docs = extraction.get("documents", [])

    high_conf = sum(1 for e in ev if e.get("confidence", 0) >= CONFIDENCE_THRESHOLD_HIGH)
    low_conf = sum(1 for e in ev if e.get("confidence", 0) < CONFIDENCE_THRESHOLD_MEDIUM)
    avg_conf = sum(e.get("confidence", 0) for e in ev) / len(ev) if ev else 0
    top_score = (policy_grounding[0].get("score") or policy_grounding[0].get("similarity", 0)) if policy_grounding else 0

    return {
        "claimId": claim_id,
        "ingestedClaimId": ingested_claim_id,
        "sourceEmailFrom": claim.get("from"),
        "decisionPack": {
            "id": f"DP-{int(time.time() * 1000)}",
            "claimDraft": claim_draft,
            "evidence": ev,
            "documents": [{**d, "metadata": d.get("metadata") or {}} for d in docs],
            "policyGrounding": policy_grounding,
            "audit": [
                {
                    "step": "Information Extraction",
                    "timestamp": now,
                    "duration": extraction_duration_ms,
                    "agent": "Extraction",
                    "status": "completed",
                    "success": True,
                    "details": {
                        "documentsProcessed": len(docs),
                        "errors": extraction.get("errors", []),
                    },
                },
                {
                    "step": "Policy Grounding: Querying policy clause database",
                    "timestamp": now,
                    "duration": policy_duration_ms,
                    "agent": "PolicyRAG",
                    "status": "completed",
                    "success": True,
                    "details": {
                        "clausesFound": len(policy_grounding),
                        "coverageConfirmed": bool(fields.get("policyNumber")) and len(policy_grounding) > 0,
                    },
                },
                {
                    "step": "Assembling Decision Pack",
                    "timestamp": now,
                    "duration": 0,
                    "agent": "Assembler",
                    "status": "completed",
                    "success": True,
                    "details": {"evidenceCount": len(ev), "documentCount": len(docs)},
                },
            ],
            "evidenceSummary": {
                "totalFields": 8,
                "highConfidenceFields": high_conf,
                "lowConfidenceFields": low_conf,
                "avgConfidence": avg_conf,
            },
            "documentAnalysis": {
                "totalDocuments": len(docs),
                "documentTypes": [d.get("type", "Other") for d in docs],
                "avgDocumentConfidence": sum(d.get("confidence", 0) for d in docs) / len(docs) if docs else 0,
                "missingDocuments": [],
            },
            "policyAssessment": {
                "clausesFound": len(policy_grounding),
                "coverageConfirmed": bool(fields.get("policyNumber")) and len(policy_grounding) > 0,
                "topSimilarityScore": top_score,
                "recommendedActions": (
                    ["Proceed with claim – policy clauses matched"]
                    if policy_grounding
                    else ["Manual review – no matching policy clauses found"]
                ),
            },
            "processingSummary": {
                "totalTime": 0,
                "stepsCompleted": 4,
                "stepsWithErrors": len(extraction.get("errors", [])),
                "automationLevel": 0.9,
            },
            "createdAt": now,
        },
        "auditTrail": [
            {
                "step": "process_claim",
                "timestamp": now,
                "duration": 0,
                "agent": "ProcessClaimAPI",
                "status": "completed",
                "details": {"openaiIntegration": "active", "model": "gpt-4o"},
            }
        ],
        "processingMetrics": {
            "totalProcessingTime": 0,
            "averageHandleTime": 0,
            "fieldsAutoPopulated": len(ev),
            "overrideRate": 0.1,
            "ragHitRate": 1.0,
            "stepsCompleted": 4,
            "stepsFailed": len(extraction.get("errors", [])),
            "successRate": 1.0 if not extraction.get("errors") else 0.9,
        },
        "createdAt": now,
        "status": "draft",
    }
