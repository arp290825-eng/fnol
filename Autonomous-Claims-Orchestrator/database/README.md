# Insurance Database Schema for Auto-Resolution Desk

This directory contains the complete database schema and dummy data for the Autonomous Claims Orchestrator system. The database is designed to support policy grounding and auto-resolution of insurance claims.

## Database Structure

The database consists of three main tables:

1. **Customers** - Customer demographic information
2. **Policies** - Policy-level information and KPIs
3. **PolicyDetails** - Detailed coverage information, clauses, and terms

### Key Relationships

- **Policy Number** is the PRIMARY KEY in the Policies table
- **Policy Number** is used as a FOREIGN KEY in PolicyDetails table
- **Customer ID** links Customers to their Policies (One-to-Many relationship)
- **Policy Number** links Policies to their Details (One-to-Many relationship)

## Files Structure

```
database/
├── schema/
│   ├── customers.sql          # Customer table schema
│   ├── policies.sql            # Policy table schema
│   └── policy_details.sql      # Policy Details table schema
├── data/
│   ├── customers_data.sql      # Dummy customer data
│   ├── policies_data.sql       # Dummy policy data (includes AC789456123 and HO456789234)
│   └── policy_details_data.sql # Dummy policy details data
├── policy_grounding_mapping.json  # JSON mapping for database correlation
└── README.md                   # This file
```

## Setup Instructions

### 1. Create Database

```sql
CREATE DATABASE insurance_claims_db;
USE insurance_claims_db;
```

### 2. Create Tables

Execute the schema files in order:

```bash
mysql -u username -p insurance_claims_db < schema/customers.sql
mysql -u username -p insurance_claims_db < schema/policies.sql
mysql -u username -p insurance_claims_db < schema/policy_details.sql
```

### 3. Insert Dummy Data

Execute the data files in order:

```bash
mysql -u username -p insurance_claims_db < data/customers_data.sql
mysql -u username -p insurance_claims_db < data/policies_data.sql
mysql -u username -p insurance_claims_db < data/policy_details_data.sql
```

## Key Policy Numbers

The database includes the following key policy numbers used in demo scenarios:

- **AC789456123** - Auto/Car Insurance for Sarah Johnson (CUST001)
- **HO456789234** - Home Insurance for Robert Chen (CUST002)

## Database Schema Details

### Customers Table

Stores customer demographic information including:
- Personal information (name, DOB, contact details)
- Address information
- Customer metadata (status, risk profile, credit score)
- Timestamps for tracking

**Key Fields:**
- `customer_id` (PRIMARY KEY)
- `email_id` (UNIQUE)
- `phone_number`
- `customer_status`

### Policies Table

Stores policy-level information and business KPIs including:
- Policy identification (number, type, carrier)
- Policy dates (created, effective, expiration, renewal)
- Financial KPIs (premium, payment status)
- Coverage summary (limits, deductibles, claim history)
- Policy-specific fields (vehicle info for auto, property info for home)

**Key Fields:**
- `policy_number` (PRIMARY KEY)
- `customer_id` (FOREIGN KEY)
- `policy_type` (AUTO, HOME, COMMERCIAL, etc.)
- `policy_status`
- `effective_date`, `expiration_date`, `renewal_date`
- `premium_amount`, `payment_status`
- `total_coverage_limit`, `aggregate_deductible`

### PolicyDetails Table

Stores detailed coverage information including:
- Coverage identification (code, name, category)
- Coverage limits (per person, per occurrence, aggregate)
- Deductibles
- Clauses, terms, conditions
- Exclusions and inclusions
- Coverage periods and territories

**Key Fields:**
- `policy_detail_id` (PRIMARY KEY)
- `policy_number` (FOREIGN KEY)
- `coverage_code` (BI, PD, COMP, COLL, DWELLING, etc.)
- `limit_per_occurrence`
- `deductible_amount`
- `clause_text`, `exclusions`, `inclusions`
- `effective_from`, `effective_to`

## Policy Grounding Workflow

The `policy_grounding_mapping.json` file defines the complete workflow for policy grounding:

1. **Customer Verification** - Verify customer exists and is active
2. **Policy Retrieval** - Get active policies for the customer
3. **Policy Details Extraction** - Extract coverage details and clauses
4. **Coverage Matching** - Match claim type to applicable coverage
5. **Clause Validation** - Validate against exclusions, limits, and terms
6. **Confidence Scoring** - Calculate confidence score for auto-resolution

### Confidence Score Calculation

The confidence score is calculated using weighted components:

```
confidence_score = (policy_active × 0.25) + 
                   (coverage_applicable × 0.30) + 
                   (clause_compliance × 0.25) + 
                   (documentation × 0.20) + 
                   deductions
```

**Score Thresholds:**
- **0.90 - 1.0**: AUTO_APPROVE - Proceed with automatic approval
- **0.75 - 0.89**: MANUAL_REVIEW - Flag for adjuster review
- **0.50 - 0.74**: LIKELY_DENIAL - Review for exceptions
- **< 0.50**: AUTO_DENY - Deny claim automatically

## Example Queries

### Get Customer with All Policies

```sql
SELECT c.*, p.policy_number, p.policy_type, p.policy_status
FROM Customers c
LEFT JOIN Policies p ON c.customer_id = p.customer_id
WHERE c.customer_id = 'CUST001';
```

### Get Policy with All Coverage Details

```sql
SELECT p.*, pd.coverage_code, pd.coverage_name, pd.limit_per_occurrence, pd.deductible_amount
FROM Policies p
LEFT JOIN PolicyDetails pd ON p.policy_number = pd.policy_number
WHERE p.policy_number = 'AC789456123' AND pd.is_active = TRUE;
```

### Policy Grounding Query (Complete Hierarchy)

```sql
SELECT 
    c.customer_id, c.first_name, c.last_name, c.email_id, c.phone_number,
    p.policy_number, p.policy_type, p.policy_status, p.effective_date, p.expiration_date,
    pd.coverage_code, pd.coverage_name, pd.limit_per_occurrence, pd.deductible_amount,
    pd.clause_text, pd.exclusions, pd.inclusions
FROM Customers c
INNER JOIN Policies p ON c.customer_id = p.customer_id
INNER JOIN PolicyDetails pd ON p.policy_number = pd.policy_number
WHERE p.policy_number = 'AC789456123'
  AND p.policy_status = 'ACTIVE'
  AND p.expiration_date >= CURDATE()
  AND pd.is_active = TRUE
  AND pd.effective_from <= CURDATE()
  AND (pd.effective_to IS NULL OR pd.effective_to >= CURDATE());
```

## Coverage Codes Reference

### Auto Insurance Coverage Codes
- **BI** - Bodily Injury Liability
- **PD** - Property Damage Liability
- **COMP** - Comprehensive Coverage
- **COLL** - Collision Coverage
- **UMBI** - Uninsured/Underinsured Motorist Bodily Injury

### Home Insurance Coverage Codes
- **DWELLING** - Dwelling Coverage
- **PERSONAL_PROPERTY** - Personal Property Coverage
- **LIABILITY** - Personal Liability Coverage
- **MED_PAY** - Medical Payments to Others
- **LOSS_OF_USE** - Loss of Use / Additional Living Expenses

### Commercial Insurance Coverage Codes
- **GEN_LIABILITY** - General Liability
- **PROPERTY** - Commercial Property
- **BIZ_INT** - Business Interruption

## Business KPIs Tracked

### Policy-Level KPIs
- Premium amount and frequency
- Payment status and outstanding balance
- Total coverage limits
- Aggregate deductibles
- Claim count and total claims paid
- Loss ratio (claims paid / premiums collected)
- Policy status and renewal dates

### Coverage-Level KPIs
- Coverage limits (per person, per occurrence, aggregate)
- Deductible amounts and types
- Coverage effective dates
- Claim reporting and filing deadlines
- Coverage premiums

## Notes

- All dates are in YYYY-MM-DD format
- Monetary values are in USD (DECIMAL type)
- Policy numbers follow the format: [TYPE][NUMBER] (e.g., AC789456123, HO456789234)
- Customer IDs follow the format: CUST[XXX]
- Policy Detail IDs follow the format: PD-[POLICY_NUMBER]-[XXX]

## Integration with Auto-Resolution Desk

The database is designed to support the auto-resolution desk by:

1. **Policy Grounding**: Quickly retrieve policy and coverage information for any claim
2. **Coverage Validation**: Check if claim type matches available coverage
3. **Exclusion Checking**: Verify if claim falls under any exclusions
4. **Limit Verification**: Ensure claim amount is within coverage limits
5. **Confidence Scoring**: Calculate confidence score for automated decision-making

The JSON mapping file (`policy_grounding_mapping.json`) provides the complete workflow and decision tree for implementing the auto-resolution logic.
