"""
Shared configuration for backend services.

Resolves project root and data paths. Used by all microservices.
Supports environment variables for deployment-ready configuration.
"""

import os
from pathlib import Path
from typing import Optional


def _get_path_from_env(env_var: str, fallback: Path) -> Path:
    """
    Get path from environment variable or use fallback.
    
    Args:
        env_var: Environment variable name
        fallback: Fallback path if env var is not set
        
    Returns:
        Path object
    """
    env_value = os.getenv(env_var)
    if env_value:
        return Path(env_value)
    return fallback


def _get_project_root() -> Path:
    """Get project root directory."""
    env_root = os.getenv("PROJECT_ROOT")
    if env_root:
        return Path(env_root)
    
    # Fallback: parent of backend/
    backend_dir = Path(__file__).resolve().parent.parent
    return backend_dir.parent


# ============================================================================
# Core Paths
# ============================================================================

# Project root directory
PROJECT_ROOT = _get_project_root()

# Data directory
DATA_DIR = _get_path_from_env("DATA_DIR", PROJECT_ROOT / "data")

# Ingested attachments directory
INGESTED_DIR = _get_path_from_env("INGESTED_DIR", DATA_DIR / "ingested-attachments")

# Processed claims directory
PROCESSED_CLAIMS_DIR = _get_path_from_env(
    "PROCESSED_CLAIMS_DIR",
    DATA_DIR / "processed-claims"
)

# Environment file
ENV_FILE = _get_path_from_env("ENV_FILE", PROJECT_ROOT / ".env")


# ============================================================================
# File Paths
# ============================================================================

# Ingested claims JSON file
CLAIMS_FILE = DATA_DIR / "ingested-claims.json"

# Processed claims index file
CLAIMS_INDEX_FILE = PROCESSED_CLAIMS_DIR / "claims-index.json"

# Claims history CSV file
CSV_FILE = PROCESSED_CLAIMS_DIR / "claims-history.csv"

# FAQ answered message IDs (dedup only; FAQ emails are not ingested as claims)
FAQ_ANSWERED_IDS_FILE = DATA_DIR / "faq-answered-ids.json"


# ============================================================================
# Utility Functions
# ============================================================================

def ensure_data_dir() -> None:
    """
    Ensure all required data directories exist.
    
    Creates directories if they don't exist:
    - DATA_DIR
    - INGESTED_DIR
    - PROCESSED_CLAIMS_DIR
    """
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    INGESTED_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_CLAIMS_DIR.mkdir(parents=True, exist_ok=True)


def get_config_summary() -> dict:
    """
    Get a summary of current configuration paths.
    
    Returns:
        Dictionary with all configuration paths
    """
    return {
        "PROJECT_ROOT": str(PROJECT_ROOT),
        "DATA_DIR": str(DATA_DIR),
        "INGESTED_DIR": str(INGESTED_DIR),
        "PROCESSED_CLAIMS_DIR": str(PROCESSED_CLAIMS_DIR),
        "ENV_FILE": str(ENV_FILE),
        "CLAIMS_FILE": str(CLAIMS_FILE),
        "CLAIMS_INDEX_FILE": str(CLAIMS_INDEX_FILE),
        "CSV_FILE": str(CSV_FILE),
    }
