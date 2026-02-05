"""
Dashboard Microservice.

Processed claims history: save, list, retrieve by ID, export CSV, KPIs.
"""

from backend.dashboard.service import (
    get_csv_content,
    get_dashboard_kpis,
    get_processed_claim_by_id,
    get_processed_claim_summaries,
    save_processed_claim,
)

__all__ = [
    "get_csv_content",
    "get_dashboard_kpis",
    "get_processed_claim_by_id",
    "get_processed_claim_summaries",
    "save_processed_claim",
]
