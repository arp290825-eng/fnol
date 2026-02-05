"""
Extraction Microservice.

LLM-based extraction from email, documents, images (Vision API).
Returns structured claim fields, evidence, document analysis.
"""

from backend.extraction.service import extract_claim_information

__all__ = ["extract_claim_information"]
