"""
Process Claim Orchestrator.

Chains extraction, decision, and dashboard microservices to process
an ingested claim end-to-end.
"""

from backend.process_claim.orchestrator import process_claim

__all__ = ["process_claim"]
