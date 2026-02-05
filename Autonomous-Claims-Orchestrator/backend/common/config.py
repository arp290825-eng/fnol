"""
Shared configuration for backend services.

Resolves project root and data paths. Used by all microservices.
"""

from pathlib import Path

# Project root: parent of backend/
_BACKEND_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = _BACKEND_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"
INGESTED_DIR = DATA_DIR / "ingested-attachments"
CLAIMS_FILE = DATA_DIR / "ingested-claims.json"
PROCESSED_CLAIMS_DIR = DATA_DIR / "processed-claims"
CLAIMS_INDEX_FILE = PROCESSED_CLAIMS_DIR / "claims-index.json"
CSV_FILE = PROCESSED_CLAIMS_DIR / "claims-history.csv"
ENV_FILE = PROJECT_ROOT / ".env"


def ensure_data_dir() -> None:
    """Ensure data directories exist."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    INGESTED_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_CLAIMS_DIR.mkdir(parents=True, exist_ok=True)
