"""
Decision Microservice.

Builds decision pack: policy grounding, claim draft, evidence summary,
document analysis, policy assessment.
"""

from backend.decision.service import build_decision_pack

__all__ = ["build_decision_pack"]
