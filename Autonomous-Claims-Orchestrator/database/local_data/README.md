# Local Policy Database - Policy Grounding

## Overview

The policy grounding system now uses **local JSON data files** to check policy details for each customer. This ensures that policy grounding checks the **actual policy details** of the person making the claim, not just generic policy clauses.

## How It Works

### 1. Policy Grounding Flow

When a claim is processed:

1. **Extract Policy Number** from the claim
2. **Find Customer** by policy number in `customers.json`
3. **Get Policy Information** from `policies.json`
4. **Retrieve Policy Details** (coverage, clauses, limits, exclusions) from `policy_details.json`
5. **Match Coverage** based on loss type (collision, water damage, etc.)
6. **Validate Coverage** - Check if:
   - Policy is active
   - Claim date is within coverage period
   - Claim amount is within limits
   - No exclusions apply
7. **Return Policy Grounding Results** with:
   - Applicable coverage types
   - Coverage limits
   - Deductibles
   - Exclusions and inclusions
   - Clauses and terms

### 2. Data Files

- **`customers.json`** - 120 customers with demographic information
- **`policies.json`** - 150 policies linked to customers
- **`policy_details.json`** - 360 policy details (coverage types, clauses, limits)

### 3. Key Features

✅ **Customer-Specific**: Checks the actual policy for the specific customer  
✅ **Coverage Matching**: Matches loss type to applicable coverage codes  
✅ **Limit Validation**: Checks if claim amount is within coverage limits  
✅ **Exclusion Checking**: Reviews exclusions to determine if claim is covered  
✅ **Date Validation**: Ensures claim is within policy effective dates  
✅ **Deductible Calculation**: Includes deductible information in results  

## Implementation

The policy grounding is implemented in:
- **`backend/decision/policy_grounding_local.py`** - Main module that loads and queries local data
- **`backend/decision/service.py`** - Uses local data first, falls back to generic clauses if needed

## Example Usage

```python
from backend.decision.policy_grounding_local import get_policy_grounding_from_local_data

# Extract claim fields
extracted_fields = {
    "policyNumber": "AC789456123",
    "lossType": "collision",
    "estimatedAmount": 5000.00,
    "lossDate": "2024-03-15"
}

# Get policy grounding
policy_grounding = get_policy_grounding_from_local_data(extracted_fields)

# Results include:
# - Coverage codes (COLL, COMP, BI, PD, etc.)
# - Coverage limits
# - Deductibles
# - Exclusions
# - Clauses
# - Whether coverage is applicable
```

## Policy Grounding Results

Each result includes:

```json
{
  "clauseId": "PD-AC789456123-004",
  "title": "Collision Coverage",
  "coverage_code": "COLL",
  "coverage_name": "Collision Coverage",
  "limit_per_occurrence": 500000.00,
  "deductible_amount": 375.00,
  "within_limit": true,
  "coverage_applicable": true,
  "exclusions": "Standard exclusions apply",
  "inclusions": "Standard inclusions",
  "policy_number": "AC789456123",
  "customer_name": "Sarah Johnson",
  "score": 0.9
}
```

## Key Policy Numbers

The database includes these key policy numbers from demo scenarios:

- **AC789456123** - Auto insurance for Sarah Johnson
- **HO456789234** - Home insurance for Robert Chen

## Benefits

1. **Accurate**: Uses actual policy data, not generic clauses
2. **Customer-Specific**: Each customer's policy details are checked
3. **Complete**: Includes limits, deductibles, exclusions, and terms
4. **Fast**: Local JSON files load quickly
5. **No Database Required**: Works without MySQL setup

## Updating Data

To update the local data files:

```bash
python3 scripts/generate-local-data.py
```

This will regenerate all JSON files with fresh data.
