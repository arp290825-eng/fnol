"""
FastAPI Server for Autonomous Claims Orchestrator.

Provides REST API endpoints for the frontend to interact with backend services.
Deployment-ready with environment variable configuration.
"""

import os
import sys
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

# Add project root to Python path to allow imports
# This allows the script to be run from any location
_project_root = Path(__file__).resolve().parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import backend services
from backend.dashboard.service import (
    clear_all_processed_claims,
    get_dashboard_kpis,
    get_processed_claim_by_id,
    get_processed_claim_summaries,
    save_processed_claim,
)
from backend.email_ingestion.service import sync_inbox
from backend.ingested_claims.service import (
    clear_all_ingested_claims,
    get_all_ingested_claims,
    get_faq_claims,
    get_ingested_claim_by_id,
    get_policy_numbers,
)
from backend.process_claim.orchestrator import process_claim

# Initialize FastAPI app
app = FastAPI(
    title="Autonomous Claims Orchestrator API",
    description="REST API for claims processing, ingestion, and dashboard",
    version="1.0.0",
)

# CORS configuration - allow frontend to access API
# In production, set specific origins instead of "*"
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# One sync at a time so overlapping POSTs cannot double-ingest the same mailbox state
_SYNC_INBOX_LOCK = threading.Lock()


# Request/Response Models
class ProcessClaimRequest(BaseModel):
    ingestedClaimId: str


class SaveClaimRequest(BaseModel):
    claimId: Optional[str] = None
    decisionPack: Dict[str, Any]
    ingestedClaimId: Optional[str] = None
    # Original FNOL From — used for auto acknowledgement when first saved via this API
    sourceEmailFrom: Optional[str] = None
    status: Optional[str] = None
    createdAt: Optional[str] = None
    processingTime: Optional[int] = None
    processingMetrics: Optional[Dict[str, Any]] = None


class SyncInboxResponse(BaseModel):
    success: bool
    ingested: int
    scanned: int
    skippedNoFnol: int
    skippedDuplicate: int
    skippedComplaintCorrespondence: Optional[int] = 0
    mergedFollowUp: Optional[int] = 0
    faqAnswered: Optional[int] = 0
    faqError: Optional[int] = 0
    errors: List[str]
    hint: Optional[str] = None
    uidsTotalInMailbox: Optional[int] = None
    uidsTruncated: Optional[bool] = None


# Health check endpoint
@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy", "service": "autonomous-claims-orchestrator"}


# Process Claim Endpoint
@app.post("/api/process-claim")
async def process_claim_endpoint(request: ProcessClaimRequest) -> Dict[str, Any]:
    """
    Process an ingested claim end-to-end.
    
    Args:
        request: Contains ingestedClaimId
        
    Returns:
        Complete ClaimData dict for frontend
    """
    try:
        if not request.ingestedClaimId:
            raise HTTPException(
                status_code=400, detail="ingestedClaimId is required"
            )
        
        claim_data = process_claim(request.ingestedClaimId)
        
        if claim_data.get("error"):
            raise HTTPException(
                status_code=404, detail=claim_data.get("error")
            )
        
        return claim_data
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Claim processing failed: {str(e)}"
        )


# Ingested Claims Endpoints
@app.get("/api/ingested-claims")
async def get_ingested_claims(full: bool = False, source: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Get list of ingested claims.

    Args:
        full: If True, return full claim data; if False, return summaries.
        source: Filter by source. Use 'faq' to return FAQ auto-resolution conversations.

    Returns:
        List of ingested claims
    """
    try:
        if source == "faq":
            return get_faq_claims()
        if full:
            claims = get_all_ingested_claims()
        else:
            claims = get_policy_numbers()
        return claims
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch ingested claims: {str(e)}"
        )


@app.get("/api/ingested-claims/{claim_id}")
async def get_ingested_claim_by_id_endpoint(claim_id: str) -> Dict[str, Any]:
    """
    Get a specific ingested claim by ID.
    
    Args:
        claim_id: The ingested claim ID to retrieve
        
    Returns:
        Full ingested claim data
    """
    try:
        if not claim_id:
            raise HTTPException(status_code=400, detail="claimId required")
        
        claim = get_ingested_claim_by_id(claim_id)
        
        if claim is None:
            raise HTTPException(status_code=404, detail="Ingested claim not found")
        
        return claim
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load ingested claim: {str(e)}"
        )


@app.post("/api/ingested-claims/clear")
async def clear_ingested_claims() -> Dict[str, Any]:
    """
    Clear all ingested claims.
    
    Returns:
        Success status
    """
    try:
        clear_all_ingested_claims()
        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear ingested claims: {str(e)}"
        )


@app.post("/api/claims/clear")
async def clear_processed_claims() -> Dict[str, Any]:
    """Clear processed-claims index, CSV, and all stored processed claim JSON files."""
    try:
        clear_all_processed_claims()
        return {"success": True}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to clear processed claims: {str(e)}",
        )


# Processed Claims Endpoints
@app.get("/api/claims")
async def get_claims_list() -> List[Dict[str, Any]]:
    """
    Get list of processed claim summaries.
    
    Returns:
        List of processed claim summaries
    """
    try:
        summaries = get_processed_claim_summaries()
        return summaries
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list claims: {str(e)}"
        )


@app.post("/api/claims")
async def save_claim(request: SaveClaimRequest) -> Dict[str, Any]:
    """
    Save a processed claim.
    
    Args:
        request: Claim data with decisionPack
        
    Returns:
        Success status and claimId
    """
    try:
        if not request.decisionPack:
            raise HTTPException(
                status_code=400, detail="decisionPack is required"
            )
        
        # Convert Pydantic model to dict
        claim_data = request.model_dump(exclude_none=True)
        
        save_processed_claim(claim_data)
        
        return {
            "success": True,
            "claimId": claim_data.get("claimId"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save claim: {str(e)}"
        )


# Get Claim by ID Endpoint
@app.get("/api/claims/{claim_id}")
async def get_claim_by_id(claim_id: str) -> Dict[str, Any]:
    """
    Get a processed claim by ID.
    
    Args:
        claim_id: The claim ID to retrieve
        
    Returns:
        Full claim data
    """
    try:
        if not claim_id:
            raise HTTPException(status_code=400, detail="claimId required")
        
        claim = get_processed_claim_by_id(claim_id)
        
        if claim is None:
            raise HTTPException(status_code=404, detail="Claim not found")
        
        return claim
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load claim: {str(e)}"
        )


# Dashboard KPIs Endpoint
@app.get("/api/dashboard/kpis")
async def get_dashboard_kpis_endpoint() -> Dict[str, Any]:
    """
    Get dashboard KPIs and statistics.
    
    Returns:
        Dictionary with KPI metrics
    """
    try:
        kpis = get_dashboard_kpis()
        return kpis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load dashboard KPIs: {str(e)}"
        )


# Sync Inbox Endpoint
@app.post("/api/sync-inbox")
async def sync_inbox_endpoint() -> SyncInboxResponse:
    """
    Sync email inbox and ingest new claims.
    
    Returns:
        Sync results with counts and errors
    """
    try:
        with _SYNC_INBOX_LOCK:
            result = sync_inbox()

        return SyncInboxResponse(
            success=result.get("success", False),
            ingested=result.get("ingested", 0),
            scanned=result.get("scanned", 0),
            skippedNoFnol=result.get("skippedNoFnol", 0),
            skippedDuplicate=result.get("skippedDuplicate", 0),
            skippedComplaintCorrespondence=result.get("skippedComplaintCorrespondence", 0),
            mergedFollowUp=result.get("mergedFollowUp", 0),
            faqAnswered=result.get("faqAnswered", 0),
            faqError=result.get("faqError", 0),
            errors=result.get("errors", []),
            hint=result.get("hint"),
            uidsTotalInMailbox=result.get("uidsTotalInMailbox"),
            uidsTruncated=result.get("uidsTruncated"),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to sync inbox: {str(e)}"
        )


# Root endpoint
@app.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint with API information."""
    return {
        "message": "Autonomous Claims Orchestrator API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn
    
    # Get configuration from environment variables
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8020"))
    
    uvicorn.run(
        "backend.fastapi_server:app",
        host=host,
        port=port,
        reload=os.getenv("API_RELOAD", "false").lower() == "true",
    )
