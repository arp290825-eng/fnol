"""
Email Ingestion Microservice.

Fetches emails from IMAP, classifies via LLM (FNOL vs non-FNOL),
ingests only FNOL-related content. Can run standalone or be invoked by API.
"""

from backend.email_ingestion.service import sync_inbox

__all__ = ["sync_inbox"]
