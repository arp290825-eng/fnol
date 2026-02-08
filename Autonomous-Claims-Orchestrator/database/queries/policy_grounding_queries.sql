-- =====================================================
-- POLICY GROUNDING QUERIES
-- =====================================================
-- Example SQL queries for policy grounding and auto-resolution
-- =====================================================

-- =====================================================
-- Query 1: Complete Policy Grounding for a Claim
-- =====================================================
-- This query retrieves all information needed for policy grounding
-- Use this when processing a new claim
-- =====================================================

SELECT 
    -- Customer Information
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email_id,
    c.phone_number,
    c.customer_status,
    c.risk_profile,
    
    -- Policy Information
    p.policy_number,
    p.policy_type,
    p.policy_subtype,
    p.policy_status,
    p.is_active,
    p.effective_date,
    p.expiration_date,
    p.renewal_date,
    p.valid_upto,
    p.payment_status,
    p.total_coverage_limit,
    p.aggregate_deductible,
    
    -- Coverage Details
    pd.policy_detail_id,
    pd.coverage_code,
    pd.coverage_name,
    pd.coverage_category,
    pd.limit_per_person,
    pd.limit_per_occurrence,
    pd.limit_per_accident,
    pd.aggregate_limit,
    pd.deductible_amount,
    pd.deductible_type,
    pd.deductible_applicable,
    pd.is_included,
    pd.is_active AS coverage_active,
    pd.clause_text,
    pd.terms_conditions,
    pd.inclusions,
    pd.exclusions,
    pd.limitations,
    pd.effective_from AS coverage_effective_from,
    pd.effective_to AS coverage_effective_to,
    pd.claim_reporting_deadline_days,
    pd.claim_filing_deadline_days
    
FROM Customers c
INNER JOIN Policies p ON c.customer_id = p.customer_id
INNER JOIN PolicyDetails pd ON p.policy_number = pd.policy_number
WHERE p.policy_number = ?  -- Replace with actual policy number (e.g., 'AC789456123')
  AND p.policy_status = 'ACTIVE'
  AND p.expiration_date >= CURDATE()
  AND p.effective_date <= CURDATE()
  AND pd.is_active = TRUE
  AND pd.effective_from <= CURDATE()
  AND (pd.effective_to IS NULL OR pd.effective_to >= CURDATE())
ORDER BY pd.coverage_code;

-- =====================================================
-- Query 2: Check if Policy is Active and Valid
-- =====================================================
-- Use this to quickly validate if a policy can accept claims
-- =====================================================

SELECT 
    policy_number,
    policy_type,
    policy_status,
    is_active,
    effective_date,
    expiration_date,
    valid_upto,
    payment_status,
    CASE 
        WHEN policy_status = 'ACTIVE' 
         AND expiration_date >= CURDATE() 
         AND effective_date <= CURDATE()
         AND payment_status IN ('CURRENT', 'PAST_DUE')
        THEN TRUE 
        ELSE FALSE 
    END AS can_accept_claims
FROM Policies
WHERE policy_number = ?;  -- Replace with actual policy number

-- =====================================================
-- Query 3: Find Applicable Coverage for a Claim Type
-- =====================================================
-- Use this to find which coverage applies to a specific claim type
-- =====================================================

SELECT 
    pd.policy_detail_id,
    pd.coverage_code,
    pd.coverage_name,
    pd.coverage_category,
    pd.limit_per_occurrence,
    pd.deductible_amount,
    pd.clause_text,
    pd.exclusions,
    pd.inclusions
FROM PolicyDetails pd
INNER JOIN Policies p ON pd.policy_number = p.policy_number
WHERE pd.policy_number = ?
  AND pd.coverage_code = ?  -- Replace with coverage code (e.g., 'COLL', 'DWELLING')
  AND pd.is_active = TRUE
  AND pd.effective_from <= CURDATE()
  AND (pd.effective_to IS NULL OR pd.effective_to >= CURDATE())
  AND p.policy_status = 'ACTIVE';

-- =====================================================
-- Query 4: Check Exclusions for a Claim
-- =====================================================
-- Use this to verify if a claim falls under any exclusions
-- =====================================================

SELECT 
    pd.coverage_code,
    pd.coverage_name,
    pd.exclusions,
    pd.limitations,
    pd.special_conditions
FROM PolicyDetails pd
INNER JOIN Policies p ON pd.policy_number = p.policy_number
WHERE pd.policy_number = ?
  AND pd.coverage_code = ?
  AND pd.is_active = TRUE
  AND p.policy_status = 'ACTIVE';

-- =====================================================
-- Query 5: Get All Policies for a Customer
-- =====================================================
-- Use this to retrieve all policies belonging to a customer
-- =====================================================

SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    c.email_id,
    p.policy_number,
    p.policy_type,
    p.policy_status,
    p.effective_date,
    p.expiration_date,
    p.premium_amount,
    p.total_coverage_limit
FROM Customers c
INNER JOIN Policies p ON c.customer_id = p.customer_id
WHERE c.customer_id = ?  -- Replace with customer_id
   OR c.email_id = ?      -- Or search by email
   OR c.phone_number = ?  -- Or search by phone
ORDER BY p.policy_type, p.effective_date DESC;

-- =====================================================
-- Query 6: Calculate Net Claim Amount After Deductible
-- =====================================================
-- Use this to calculate the approved amount after applying deductible
-- =====================================================

SELECT 
    pd.policy_number,
    pd.coverage_code,
    pd.coverage_name,
    pd.limit_per_occurrence,
    pd.deductible_amount,
    ? AS claim_amount,  -- Replace with actual claim amount
    CASE 
        WHEN ? > pd.deductible_amount THEN ? - pd.deductible_amount
        ELSE 0
    END AS net_claim_amount,
    CASE 
        WHEN ? > pd.limit_per_occurrence THEN pd.limit_per_occurrence - pd.deductible_amount
        WHEN ? > pd.deductible_amount THEN ? - pd.deductible_amount
        ELSE 0
    END AS approved_amount
FROM PolicyDetails pd
INNER JOIN Policies p ON pd.policy_number = p.policy_number
WHERE pd.policy_number = ?
  AND pd.coverage_code = ?
  AND pd.is_active = TRUE
  AND p.policy_status = 'ACTIVE';

-- =====================================================
-- Query 7: Policy Grounding for Auto Collision Claim
-- =====================================================
-- Specific query for auto collision claims (like AC789456123)
-- =====================================================

SELECT 
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email_id,
    c.phone_number,
    p.policy_number,
    p.policy_type,
    p.vehicle_make,
    p.vehicle_model,
    p.vehicle_year,
    p.license_plate,
    pd.coverage_code,
    pd.coverage_name,
    pd.limit_per_occurrence,
    pd.deductible_amount,
    pd.clause_text,
    pd.exclusions
FROM Customers c
INNER JOIN Policies p ON c.customer_id = p.customer_id
INNER JOIN PolicyDetails pd ON p.policy_number = pd.policy_number
WHERE p.policy_number = 'AC789456123'
  AND pd.coverage_code = 'COLL'
  AND p.policy_status = 'ACTIVE'
  AND pd.is_active = TRUE;

-- =====================================================
-- Query 8: Policy Grounding for Home Water Damage Claim
-- =====================================================
-- Specific query for home water damage claims (like HO456789234)
-- =====================================================

SELECT 
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email_id,
    c.phone_number,
    p.policy_number,
    p.policy_type,
    p.property_address,
    p.property_type,
    pd.coverage_code,
    pd.coverage_name,
    pd.limit_per_occurrence,
    pd.deductible_amount,
    pd.clause_text,
    pd.exclusions,
    pd.inclusions
FROM Customers c
INNER JOIN Policies p ON c.customer_id = p.customer_id
INNER JOIN PolicyDetails pd ON p.policy_number = pd.policy_number
WHERE p.policy_number = 'HO456789234'
  AND pd.coverage_code IN ('DWELLING', 'PERSONAL_PROPERTY', 'LOSS_OF_USE')
  AND p.policy_status = 'ACTIVE'
  AND pd.is_active = TRUE;

-- =====================================================
-- Query 9: Check Claim Reporting Deadline
-- =====================================================
-- Use this to verify if a claim is being reported within deadline
-- =====================================================

SELECT 
    pd.policy_number,
    pd.coverage_code,
    pd.claim_reporting_deadline_days,
    pd.claim_filing_deadline_days,
    DATE_ADD(?, INTERVAL pd.claim_reporting_deadline_days DAY) AS reporting_deadline,
    DATE_ADD(?, INTERVAL pd.claim_filing_deadline_days DAY) AS filing_deadline,
    CASE 
        WHEN CURDATE() <= DATE_ADD(?, INTERVAL pd.claim_reporting_deadline_days DAY)
        THEN TRUE
        ELSE FALSE
    END AS within_reporting_deadline
FROM PolicyDetails pd
INNER JOIN Policies p ON pd.policy_number = p.policy_number
WHERE pd.policy_number = ?
  AND pd.coverage_code = ?
  AND pd.is_active = TRUE;
-- Replace ? with claim_date (occurrence date)

-- =====================================================
-- Query 10: Get Policy Summary for Dashboard
-- =====================================================
-- Use this to get a summary view of a policy for display
-- =====================================================

SELECT 
    p.policy_number,
    p.policy_type,
    p.policy_status,
    c.first_name || ' ' || c.last_name AS customer_name,
    p.effective_date,
    p.expiration_date,
    p.premium_amount,
    p.premium_frequency,
    p.payment_status,
    p.total_coverage_limit,
    p.aggregate_deductible,
    p.claim_count,
    p.total_claims_paid,
    p.loss_ratio,
    COUNT(pd.policy_detail_id) AS number_of_coverages
FROM Policies p
INNER JOIN Customers c ON p.customer_id = c.customer_id
LEFT JOIN PolicyDetails pd ON p.policy_number = pd.policy_number AND pd.is_active = TRUE
WHERE p.policy_number = ?
GROUP BY p.policy_number, p.policy_type, p.policy_status, c.first_name, c.last_name,
         p.effective_date, p.expiration_date, p.premium_amount, p.premium_frequency,
         p.payment_status, p.total_coverage_limit, p.aggregate_deductible,
         p.claim_count, p.total_claims_paid, p.loss_ratio;
