"""
Policy Grounding using Local JSON Database Files.

This module implements policy grounding following the policy_grounding_mapping.json structure.
It loads policy data from local JSON files and performs comprehensive policy validation.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

# Path to local data files
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
LOCAL_DATA_DIR = PROJECT_ROOT / "database" / "local_data"
MAPPING_FILE = PROJECT_ROOT / "database" / "policy_grounding_mapping.json"

CUSTOMERS_FILE = LOCAL_DATA_DIR / "customers.json"
POLICIES_FILE = LOCAL_DATA_DIR / "policies.json"
POLICY_DETAILS_FILE = LOCAL_DATA_DIR / "policy_details.json"

# Cache for loaded data
_customers_cache: Optional[List[Dict[str, Any]]] = None
_policies_cache: Optional[List[Dict[str, Any]]] = None
_policy_details_cache: Optional[List[Dict[str, Any]]] = None
_mapping_cache: Optional[Dict[str, Any]] = None


def _load_data() -> None:
    """Load data from JSON files into cache."""
    global _customers_cache, _policies_cache, _policy_details_cache, _mapping_cache
    
    if _customers_cache is None:
        if CUSTOMERS_FILE.exists():
            with open(CUSTOMERS_FILE, 'r') as f:
                _customers_cache = json.load(f)
        else:
            _customers_cache = []
    
    if _policies_cache is None:
        if POLICIES_FILE.exists():
            with open(POLICIES_FILE, 'r') as f:
                _policies_cache = json.load(f)
        else:
            _policies_cache = []
    
    if _policy_details_cache is None:
        if POLICY_DETAILS_FILE.exists():
            with open(POLICY_DETAILS_FILE, 'r') as f:
                _policy_details_cache = json.load(f)
        else:
            _policy_details_cache = []
    
    if _mapping_cache is None:
        if MAPPING_FILE.exists():
            with open(MAPPING_FILE, 'r') as f:
                _mapping_cache = json.load(f)
        else:
            _mapping_cache = {}


def find_customer_by_policy(policy_number: str) -> Optional[Dict[str, Any]]:
    """Find customer by policy number."""
    _load_data()
    
    # Find policy
    policy = next((p for p in _policies_cache if p.get("policy_number") == policy_number), None)
    if not policy:
        return None
    
    # Find customer
    customer_id = policy.get("customer_id")
    customer = next((c for c in _customers_cache if c.get("customer_id") == customer_id), None)
    
    return customer


def get_policy_by_number(policy_number: str) -> Optional[Dict[str, Any]]:
    """Get policy by policy number."""
    _load_data()
    return next((p for p in _policies_cache if p.get("policy_number") == policy_number), None)


def get_policy_details_by_policy_number(policy_number: str) -> List[Dict[str, Any]]:
    """Get all policy details for a specific policy number."""
    _load_data()
    return [pd for pd in _policy_details_cache if pd.get("policy_number") == policy_number and pd.get("is_active", True)]


def _calculate_confidence_score(
    policy_active: bool,
    coverage_applicable: bool,
    clause_compliance: bool,
    documentation_score: float = 0.85,
    deductions: float = 0.0
) -> float:
    """
    Calculate confidence score following mapping JSON formula.
    
    Formula: (policy_active × 0.25) + (coverage_applicable × 0.30) + 
             (clause_compliance × 0.25) + (documentation × 0.20) + deductions
    """
    policy_score = 1.0 if policy_active else 0.0
    coverage_score = 1.0 if coverage_applicable else 0.0
    clause_score = 1.0 if clause_compliance else 0.0
    
    confidence = (
        (policy_score * 0.25) +
        (coverage_score * 0.30) +
        (clause_score * 0.25) +
        (documentation_score * 0.20) +
        deductions
    )
    
    return max(0.0, min(1.0, confidence))  # Clamp between 0 and 1


def _get_recommendation(confidence_score: float) -> Dict[str, Any]:
    """Get recommendation based on confidence score thresholds."""
    _load_data()
    
    thresholds = _mapping_cache.get("database_schema_mapping", {}).get(
        "policy_grounding_workflow", {}
    ).get("step_6_confidence_scoring", {}).get("scoring_algorithm", {}).get("thresholds", {})
    
    if confidence_score >= thresholds.get("auto_approve", {}).get("min_score", 0.90):
        return {
            "recommendation": "AUTO_APPROVE",
            "action": "Proceed with claim approval, apply deductible, process payment",
            "confidence_score": confidence_score
        }
    elif confidence_score >= thresholds.get("manual_review", {}).get("min_score", 0.75):
        return {
            "recommendation": "MANUAL_REVIEW",
            "action": "Flag for adjuster review, provide reasoning, gather additional documentation",
            "confidence_score": confidence_score
        }
    elif confidence_score >= thresholds.get("likely_denial", {}).get("min_score", 0.50):
        return {
            "recommendation": "LIKELY_DENIAL",
            "action": "Review for exceptions, may require escalation, detailed explanation needed",
            "confidence_score": confidence_score
        }
    else:
        return {
            "recommendation": "AUTO_DENY",
            "action": "Deny claim, provide detailed explanation, offer appeal process",
            "confidence_score": confidence_score
        }


def get_policy_grounding_from_local_data(extracted_fields: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Get policy grounding from local JSON data files following mapping JSON workflow.
    
    Implements the 6-step workflow from policy_grounding_mapping.json:
    1. Customer Verification
    2. Policy Retrieval
    3. Policy Details Extraction
    4. Coverage Matching
    5. Clause Validation
    6. Confidence Scoring
    """
    _load_data()
    
    policy_number = str(extracted_fields.get("policyNumber", "")).strip().upper()
    loss_type = str(extracted_fields.get("lossType", "")).strip().lower()
    claim_amount = float(extracted_fields.get("estimatedAmount", 0) or extracted_fields.get("estimatedDamage", 0) or 0)
    loss_date = extracted_fields.get("lossDate")
    
    if not policy_number:
        return []
    
    # Step 1: Customer Verification
    customer = find_customer_by_policy(policy_number)
    if not customer:
        return [{
            "clauseId": "CUSTOMER-NOT-FOUND",
            "title": "Customer Not Found",
            "snippet": f"No customer found for policy {policy_number}",
            "content": "Customer verification failed. Policy number does not match any customer in database.",
            "section": "Customer Verification",
            "score": 0.0,
            "similarity": 0.0,
            "rationale": "Customer not found in database",
            "sourceRef": "Policy Database",
            "sourceDocument": "Customer Records",
            "coverage_applicable": False,
            "confidence_score": 0.0,
            "recommendation": "AUTO_DENY"
        }]
    
    # Step 2: Policy Retrieval
    policy = get_policy_by_number(policy_number)
    if not policy:
        return [{
            "clauseId": "POLICY-NOT-FOUND",
            "title": "Policy Not Found",
            "snippet": f"Policy {policy_number} not found in database",
            "content": "Policy retrieval failed. Policy number does not exist in database.",
            "section": "Policy Retrieval",
            "score": 0.0,
            "similarity": 0.0,
            "rationale": "Policy not found in database",
            "sourceRef": "Policy Database",
            "sourceDocument": "Policy Records",
            "coverage_applicable": False,
            "confidence_score": 0.0,
            "recommendation": "AUTO_DENY"
        }]
    
    # Validate policy status and dates
    policy_status = policy.get("policy_status", "").upper()
    is_active = policy.get("is_active", False)
    effective_date = policy.get("effective_date")
    expiration_date = policy.get("expiration_date")
    
    claim_date = datetime.now().date()
    if loss_date:
        try:
            if isinstance(loss_date, str):
                claim_date = datetime.strptime(loss_date.split("T")[0], "%Y-%m-%d").date()
            else:
                claim_date = loss_date
        except:
            pass
    
    policy_active = False
    if policy_status == "ACTIVE" and is_active:
        if effective_date and expiration_date:
            try:
                eff_date = datetime.strptime(effective_date, "%Y-%m-%d").date() if isinstance(effective_date, str) else effective_date
                exp_date = datetime.strptime(expiration_date, "%Y-%m-%d").date() if isinstance(expiration_date, str) else expiration_date
                policy_active = eff_date <= claim_date <= exp_date
            except:
                policy_active = True  # If date parsing fails, assume active
    
    if not policy_active:
        return [{
            "clauseId": "POLICY-INACTIVE",
            "title": "Policy Not Active or Outside Coverage Period",
            "snippet": f"Policy {policy_number} is not active or claim date is outside coverage period",
            "content": f"Policy status: {policy_status}, Active: {is_active}, Effective: {effective_date}, Expires: {expiration_date}, Claim date: {claim_date}",
            "section": "Policy Status",
            "score": 0.0,
            "similarity": 0.0,
            "rationale": "Policy is not active or claim date outside coverage period",
            "sourceRef": "Policy Database",
            "sourceDocument": "Policy Record",
            "coverage_applicable": False,
            "confidence_score": 0.0,
            "recommendation": "AUTO_DENY"
        }]
    
    # Step 3: Policy Details Extraction
    policy_details = get_policy_details_by_policy_number(policy_number)
    
    if not policy_details:
        return [{
            "clauseId": "NO-COVERAGE-DETAILS",
            "title": "No Coverage Details Found",
            "snippet": f"No coverage details found for policy {policy_number}",
            "content": "Policy exists but no coverage details are available",
            "section": "Coverage",
            "score": 0.5,
            "similarity": 0.5,
            "rationale": "Policy found but no coverage details",
            "sourceRef": "Policy Database",
            "sourceDocument": "Policy Details",
            "coverage_applicable": False,
            "confidence_score": 0.5,
            "recommendation": "LIKELY_DENIAL"
        }]
    
    # Step 4: Coverage Matching (from mapping JSON)
    coverage_mapping = _mapping_cache.get("database_schema_mapping", {}).get(
        "policy_grounding_workflow", {}
    ).get("step_4_coverage_matching", {}).get("coverage_mapping", {})
    
    auto_claims = coverage_mapping.get("AUTO_CLAIMS", {})
    home_claims = coverage_mapping.get("HOME_CLAIMS", {})
    commercial_claims = coverage_mapping.get("COMMERCIAL_CLAIMS", {})
    
    # Map loss type to coverage codes
    applicable_coverage_codes = []
    policy_type = policy.get("policy_type", "").upper()
    
    if policy_type == "AUTO":
        for key, codes in auto_claims.items():
            if key in loss_type:
                # codes is a list like ["COLL", "Collision Coverage"]
                if isinstance(codes, list) and len(codes) > 0:
                    applicable_coverage_codes.append(codes[0])  # First element is coverage code
                elif isinstance(codes, str):
                    applicable_coverage_codes.append(codes)
    elif policy_type in ["HOME", "RENTERS"]:
        for key, codes in home_claims.items():
            if key in loss_type:
                if isinstance(codes, list) and len(codes) > 0:
                    applicable_coverage_codes.append(codes[0])
                elif isinstance(codes, str):
                    applicable_coverage_codes.append(codes)
    elif policy_type == "COMMERCIAL":
        for key, codes in commercial_claims.items():
            if key in loss_type:
                if isinstance(codes, list) and len(codes) > 0:
                    applicable_coverage_codes.append(codes[0])
                elif isinstance(codes, str):
                    applicable_coverage_codes.append(codes)
    
    # Step 5: Clause Validation & Step 6: Confidence Scoring
    results = []
    
    for detail in policy_details:
        coverage_code = detail.get("coverage_code", "")
        coverage_name = detail.get("coverage_name", "")
        
        # Check if coverage is applicable
        is_applicable = coverage_code in applicable_coverage_codes if applicable_coverage_codes else True
        
        # Validate limits
        limit_per_occurrence = detail.get("limit_per_occurrence")
        deductible_amount = detail.get("deductible_amount", 0)
        within_limit = True
        deductions = 0.0
        
        if limit_per_occurrence and claim_amount > limit_per_occurrence:
            within_limit = False
            deductions -= 0.3  # claim_exceeds_limit
        
        if claim_amount <= deductible_amount:
            deductions -= 0.1  # within_deductible_only
        
        # Check exclusions
        exclusions = detail.get("exclusions", "")
        exclusion_triggered = False
        if exclusions and exclusions.strip() and exclusions not in ["Standard exclusions apply", "Exclusions apply as specified in policy terms."]:
            # Simple exclusion check - in production, would use NLP
            exclusion_keywords = ["racing", "intentional", "criminal", "war", "nuclear"]
            if any(keyword in exclusions.lower() and keyword in loss_type.lower() for keyword in exclusion_keywords):
                exclusion_triggered = True
                deductions -= 0.6  # exclusion_found
        
        clause_compliance = within_limit and not exclusion_triggered
        
        # Calculate confidence score
        documentation_score = 0.85  # Default - would be calculated from actual documents
        confidence_score = _calculate_confidence_score(
            policy_active=True,
            coverage_applicable=is_applicable,
            clause_compliance=clause_compliance,
            documentation_score=documentation_score,
            deductions=deductions
        )
        
        # Get recommendation
        recommendation_data = _get_recommendation(confidence_score)
        
        # Build result with production-ready information
        result = {
            "clauseId": detail.get("policy_detail_id", ""),
            "title": coverage_name,
            "snippet": detail.get("clause_text", "")[:200] + ("..." if len(detail.get("clause_text", "")) > 200 else ""),
            "content": detail.get("clause_text", ""),
            "section": detail.get("coverage_category", "Coverage"),
            "score": confidence_score,
            "similarity": confidence_score,
            "rationale": f"Policy {policy_number} - {coverage_name} ({coverage_code}). Coverage {'applicable' if is_applicable else 'not applicable'} to loss type: {loss_type}",
            "sourceRef": "Policy Database",
            "sourceDocument": "Policy Details",
            "coverage_applicable": is_applicable,
            "coverage_code": coverage_code,
            "coverage_name": coverage_name,
            "limit_per_occurrence": limit_per_occurrence,
            "deductible_amount": deductible_amount,
            "within_limit": within_limit,
            "exclusions": exclusions,
            "inclusions": detail.get("inclusions", ""),
            "terms_conditions": detail.get("terms_conditions", ""),
            "policy_number": policy_number,
            "customer_name": f"{customer.get('first_name', '')} {customer.get('last_name', '')}",
            "policy_type": policy.get("policy_type", ""),
            "policy_status": policy_status,
            "confidence_score": confidence_score,
            "recommendation": recommendation_data["recommendation"],
            "recommendation_action": recommendation_data["action"],
            "net_claim_amount": max(0, claim_amount - deductible_amount) if within_limit else 0,
            "exclusion_triggered": exclusion_triggered
        }
        
        results.append(result)
    
    # Sort by confidence score (highest first)
    results.sort(key=lambda x: x.get("confidence_score", 0), reverse=True)
    
    # Return applicable coverages first, then others
    applicable_results = [r for r in results if r.get("coverage_applicable", False)]
    if applicable_results:
        return applicable_results[:10]
    else:
        return results[:5]


def get_complete_policy_info(policy_number: str) -> Dict[str, Any]:
    """
    Get complete policy information including customer, policy, and all details.
    
    Returns a dictionary with:
    - customer: Customer information
    - policy: Policy information
    - policy_details: List of all policy details/coverages
    """
    _load_data()
    
    customer = find_customer_by_policy(policy_number)
    policy = get_policy_by_number(policy_number)
    policy_details = get_policy_details_by_policy_number(policy_number)
    
    return {
        "customer": customer,
        "policy": policy,
        "policy_details": policy_details,
        "policy_number": policy_number
    }
