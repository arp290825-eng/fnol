-- =====================================================
-- POLICY DETAILS DB (Clauses & Coverage Details)
-- =====================================================
-- This table stores detailed coverage information, clauses,
-- exclusions, and terms for each policy
-- Policy Number is the FOREIGN KEY linking to Policies table
-- =====================================================

CREATE TABLE PolicyDetails (
    policy_detail_id VARCHAR(30) PRIMARY KEY,
    policy_number VARCHAR(20) NOT NULL,
    
    -- Coverage Identification
    coverage_code VARCHAR(20) NOT NULL, -- BI, PD, COMP, COLL, UMBI, DWELLING, PERSONAL_PROPERTY, etc.
    coverage_name VARCHAR(100) NOT NULL,
    coverage_category VARCHAR(50), -- LIABILITY, PROPERTY, MEDICAL, UNINSURED_MOTORIST
    coverage_description TEXT,
    
    -- Coverage Limits (Key KPIs for Claims Processing)
    limit_per_person DECIMAL(12, 2),
    limit_per_occurrence DECIMAL(12, 2),
    limit_per_accident DECIMAL(12, 2),
    aggregate_limit DECIMAL(12, 2),
    sub_limit DECIMAL(12, 2), -- For specific items like jewelry, electronics
    
    -- Deductibles
    deductible_amount DECIMAL(10, 2) DEFAULT 0.00,
    deductible_type VARCHAR(30), -- PER_CLAIM, PER_POLICY, PER_ITEM, PERCENTAGE
    deductible_applicable BOOLEAN DEFAULT TRUE,
    
    -- Coverage Status
    is_included BOOLEAN DEFAULT TRUE,
    is_optional BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Coverage Terms & Clauses
    clause_text TEXT NOT NULL,
    terms_conditions TEXT,
    inclusions TEXT, -- What is specifically covered
    exclusions TEXT, -- What is specifically NOT covered
    limitations TEXT, -- Coverage limitations and restrictions
    
    -- Coverage Period
    effective_from DATE NOT NULL,
    effective_to DATE,
    waiting_period_days INTEGER DEFAULT 0, -- Days before coverage begins
    grace_period_days INTEGER DEFAULT 0, -- Days after expiration for claims
    
    -- Geographic Coverage
    coverage_territory VARCHAR(200) DEFAULT 'USA',
    coverage_restrictions TEXT,
    
    -- Special Conditions
    special_conditions TEXT, -- Any special terms or conditions
    endorsements TEXT, -- Policy endorsements or riders
    cancellation_terms TEXT,
    
    -- Claim Processing Rules
    claim_reporting_deadline_days INTEGER, -- Days to report claim
    claim_filing_deadline_days INTEGER, -- Days to file claim
    documentation_required TEXT, -- Required documents for claims
    
    -- Premium Information
    coverage_premium DECIMAL(10, 2), -- Premium allocated to this coverage
    
    -- Timestamps
    created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (policy_number) REFERENCES Policies(policy_number) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_policy_number (policy_number),
    INDEX idx_coverage_code (coverage_code),
    INDEX idx_coverage_category (coverage_category),
    INDEX idx_effective_dates (effective_from, effective_to),
    INDEX idx_is_active (is_active)
);
