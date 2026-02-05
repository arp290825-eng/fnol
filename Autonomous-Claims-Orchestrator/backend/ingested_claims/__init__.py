"""
Ingested Claims Microservice.

Manages FNOL claims ingested from email (IMAP, SendGrid, demo).
Provides CRUD, policy extraction, deduplication.
"""

from backend.ingested_claims.service import (
    add_dedup_keys_to_set,
    clear_all_ingested_claims,
    extract_policy_number,
    get_all_ingested_claims,
    get_existing_message_ids,
    get_ingested_claim_by_id,
    get_policy_numbers,
    is_duplicate_email,
    read_attachment_content,
    save_ingested_claim,
)

__all__ = [
    "add_dedup_keys_to_set",
    "clear_all_ingested_claims",
    "extract_policy_number",
    "get_all_ingested_claims",
    "get_existing_message_ids",
    "get_ingested_claim_by_id",
    "get_policy_numbers",
    "is_duplicate_email",
    "read_attachment_content",
    "save_ingested_claim",
]
