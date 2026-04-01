"""
Claim notification service.

Sends automated professional emails when claims move to review or are desk-rejected.
"""

from backend.claim_notification.service import (
    send_claim_under_review_email,
    send_desk_rejection_email,
    send_fnol_received_acknowledgement_email,
)

__all__ = [
    "send_claim_under_review_email",
    "send_desk_rejection_email",
    "send_fnol_received_acknowledgement_email",
]
