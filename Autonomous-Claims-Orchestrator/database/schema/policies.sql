-- =====================================================
-- POLICY DB (Customer Policy)
-- =====================================================
-- This table stores policy-level information and KPIs
-- Policy Number is the PRIMARY KEY
-- =====================================================

CREATE TABLE Policies (
    policy_number VARCHAR(20) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    
    -- Policy Identification
    policy_type VARCHAR(30) NOT NULL, -- AUTO, HOME, RENTERS, COMMERCIAL, LIABILITY
    policy_subtype VARCHAR(50), -- COMPREHENSIVE, COLLISION, DWELLING, etc.
    carrier_name VARCHAR(100) NOT NULL,
    agent_name VARCHAR(100),
    agent_contact VARCHAR(50),
    
    -- Policy Dates (Key KPIs)
    created_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    renewal_date DATE,
    valid_upto DATE NOT NULL,
    cancellation_date DATE,
    
    -- Policy Status
    policy_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED, LAPSED, PENDING
    is_active BOOLEAN DEFAULT TRUE,
    is_renewable BOOLEAN DEFAULT TRUE,
    
    -- Financial KPIs
    premium_amount DECIMAL(10, 2) NOT NULL,
    premium_frequency VARCHAR(20) NOT NULL, -- MONTHLY, QUARTERLY, SEMI_ANNUAL, ANNUAL
    last_premium_paid_date DATE,
    next_premium_due_date DATE,
    total_premium_paid DECIMAL(12, 2) DEFAULT 0.00,
    outstanding_balance DECIMAL(10, 2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'CURRENT', -- CURRENT, PAST_DUE, DELINQUENT
    
    -- Coverage Summary KPIs
    total_coverage_limit DECIMAL(12, 2),
    aggregate_deductible DECIMAL(10, 2),
    claim_count INTEGER DEFAULT 0,
    total_claims_paid DECIMAL(12, 2) DEFAULT 0.00,
    loss_ratio DECIMAL(5, 2), -- (Total Claims Paid / Total Premium Collected) * 100
    
    -- Policy-Specific Fields (Varies by type)
    -- For Auto Policies
    vehicle_make VARCHAR(50),
    vehicle_model VARCHAR(50),
    vehicle_year INTEGER,
    vehicle_vin VARCHAR(17),
    license_plate VARCHAR(20),
    annual_mileage INTEGER,
    usage_type VARCHAR(30), -- COMMUTE, BUSINESS, PLEASURE
    
    -- For Home Policies
    property_address VARCHAR(200),
    property_type VARCHAR(50), -- SINGLE_FAMILY, CONDO, TOWNHOUSE, APARTMENT
    property_value DECIMAL(12, 2),
    year_built INTEGER,
    square_footage INTEGER,
    number_of_units INTEGER DEFAULT 1,
    
    -- Risk Assessment
    risk_score DECIMAL(5, 2),
    underwriting_notes TEXT,
    
    -- Timestamps
    created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_customer_id (customer_id),
    INDEX idx_policy_type (policy_type),
    INDEX idx_policy_status (policy_status),
    INDEX idx_expiration_date (expiration_date),
    INDEX idx_renewal_date (renewal_date),
    INDEX idx_effective_date (effective_date)
);
