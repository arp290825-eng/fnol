-- =====================================================
-- CUSTOMER DB (Demographics)
-- =====================================================
-- This table stores customer demographic information
-- and links to all policies belonging to each customer
-- =====================================================

CREATE TABLE Customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    phone_number VARCHAR(20) NOT NULL,
    email_id VARCHAR(100) NOT NULL UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    marital_status VARCHAR(20),
    occupation VARCHAR(100),
    employer_name VARCHAR(100),
    annual_income DECIMAL(12, 2),
    
    -- Address Information
    address_line1 VARCHAR(150) NOT NULL,
    address_line2 VARCHAR(150),
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country VARCHAR(50) DEFAULT 'USA',
    
    -- Customer Metadata
    customer_since DATE NOT NULL,
    customer_status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, SUSPENDED
    risk_profile VARCHAR(20), -- LOW, MEDIUM, HIGH
    credit_score INTEGER,
    preferred_contact_method VARCHAR(20), -- EMAIL, PHONE, SMS
    
    -- Timestamps
    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_email (email_id),
    INDEX idx_phone (phone_number),
    INDEX idx_customer_status (customer_status)
);
