-- =====================================================
-- POLICY DB - Dummy Data
-- =====================================================
-- Realistic policy data with key KPIs
-- Includes the required policy numbers: AC789456123 and HO456789234
-- =====================================================

INSERT INTO Policies (
    policy_number, customer_id, policy_type, policy_subtype, carrier_name, agent_name, agent_contact,
    created_date, effective_date, expiration_date, renewal_date, valid_upto, cancellation_date,
    policy_status, is_active, is_renewable,
    premium_amount, premium_frequency, last_premium_paid_date, next_premium_due_date,
    total_premium_paid, outstanding_balance, payment_status,
    total_coverage_limit, aggregate_deductible, claim_count, total_claims_paid, loss_ratio,
    vehicle_make, vehicle_model, vehicle_year, vehicle_vin, license_plate, annual_mileage, usage_type,
    property_address, property_type, property_value, year_built, square_footage, number_of_units,
    risk_score, underwriting_notes
) VALUES
-- Policy 1: AC789456123 - Auto Insurance for Sarah Johnson (from demo scenario)
('AC789456123', 'CUST001', 'AUTO', 'FULL_COVERAGE', 'State Farm Insurance', 'John Smith', '(555) 111-2222',
 '2022-03-15', '2024-01-01', '2024-12-31', '2024-12-01', '2024-12-31', NULL,
 'ACTIVE', 1, 1,
 1500.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 4500.00, 0.00, 'CURRENT',
 500000.00, 375.00, 1, 4850.00, 10.78,
 'Honda', 'Civic', 2019, '19XFC2F59KE123456', 'XYZ-789', 12000, 'COMMUTE',
 NULL, NULL, NULL, NULL, NULL, NULL,
 72.5, 'Low risk driver, clean record, good credit score'),

-- Policy 2: HO456789234 - Home Insurance for Robert Chen (from demo scenario)
('HO456789234', 'CUST002', 'HOME', 'HOMEOWNERS', 'Allstate Insurance', 'Mary Johnson', '(555) 222-3333',
 '2021-08-20', '2024-01-01', '2025-12-31', '2025-11-15', '2025-12-31', NULL,
 'ACTIVE', 1, 1,
 1200.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 3600.00, 0.00, 'CURRENT',
 350000.00, 1000.00, 1, 8500.00, 23.61,
 NULL, NULL, NULL, NULL, NULL, NULL,
 '456 Elm Street, Springfield, IL 62704', 'SINGLE_FAMILY', 350000.00, 1995, 2400, 1,
 68.0, 'Well-maintained property, updated electrical, low crime area'),

-- Policy 3: Additional Auto Policy
('AC123456789', 'CUST003', 'AUTO', 'FULL_COVERAGE', 'Progressive Insurance', 'Lisa Brown', '(555) 333-4444',
 '2023-05-10', '2024-01-15', '2025-01-15', '2024-12-15', '2025-01-15', NULL,
 'ACTIVE', 1, 1,
 1800.00, 'ANNUAL', '2024-01-15', '2025-01-15',
 1800.00, 0.00, 'CURRENT',
 750000.00, 500.00, 0, 0.00, 0.00,
 'BMW', 'X5', 2022, '5UXKR6C59N9A12345', 'IL-ABC123', 15000, 'BUSINESS',
 NULL, NULL, NULL, NULL, NULL, NULL,
 75.0, 'High-value vehicle, comprehensive coverage, business use'),

-- Policy 4: Additional Home Policy
('HO987654321', 'CUST003', 'HOME', 'HOMEOWNERS', 'State Farm Insurance', 'John Smith', '(555) 111-2222',
 '2019-06-10', '2024-01-01', '2025-12-31', '2025-11-01', '2025-12-31', NULL,
 'ACTIVE', 1, 1,
 1800.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 9000.00, 0.00, 'CURRENT',
 550000.00, 1500.00, 0, 0.00, 0.00,
 NULL, NULL, NULL, NULL, NULL, NULL,
 '789 Oak Avenue, Chicago, IL 60601', 'CONDO', 550000.00, 2010, 1800, 1,
 70.0, 'Urban location, modern building, good security'),

-- Policy 5: Auto Policy for Emily Rodriguez
('AC555666777', 'CUST004', 'AUTO', 'STANDARD', 'Geico Insurance', 'Tom Davis', '(555) 444-5555',
 '2021-01-05', '2024-01-01', '2024-12-31', '2024-11-15', '2024-12-31', NULL,
 'ACTIVE', 1, 1,
 1100.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 3300.00, 0.00, 'CURRENT',
 300000.00, 500.00, 0, 0.00, 0.00,
 'Toyota', 'Camry', 2020, '4T1B11HK5KU123456', 'IL-DEF456', 10000, 'COMMUTE',
 NULL, NULL, NULL, NULL, NULL, NULL,
 65.0, 'Standard coverage, reliable vehicle, low annual mileage'),

-- Policy 6: Home Policy for Emily Rodriguez
('HO111222333', 'CUST004', 'HOME', 'HOMEOWNERS', 'Allstate Insurance', 'Mary Johnson', '(555) 222-3333',
 '2021-01-05', '2024-01-01', '2025-12-31', '2025-11-15', '2025-12-31', NULL,
 'ACTIVE', 1, 1,
 950.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 2850.00, 0.00, 'CURRENT',
 280000.00, 1000.00, 0, 0.00, 0.00,
 NULL, NULL, NULL, NULL, NULL, NULL,
 '321 Pine Street, Springfield, IL 62702', 'SINGLE_FAMILY', 280000.00, 2005, 1800, 1,
 62.0, 'Starter home, first-time buyer, good neighborhood'),

-- Policy 7: Commercial Auto Policy for David Thompson
('CA999888777', 'CUST005', 'AUTO', 'COMMERCIAL', 'Commercial Insurance Group', 'Sarah Lee', '(555) 555-6666',
 '2020-08-15', '2024-01-01', '2024-12-31', '2024-11-20', '2024-12-31', NULL,
 'ACTIVE', 1, 1,
 3200.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 9600.00, 0.00, 'CURRENT',
 1000000.00, 1000.00, 0, 0.00, 0.00,
 'Ford', 'F-250', 2023, '1FTFW1E58NFA12345', 'IL-GHI789', 25000, 'BUSINESS',
 NULL, NULL, NULL, NULL, NULL, NULL,
 80.0, 'Commercial vehicle, high mileage, business use'),

-- Policy 8: High-Value Home Policy for David Thompson
('HO444555666', 'CUST005', 'HOME', 'HOMEOWNERS', 'Chubb Insurance', 'Robert White', '(555) 666-7777',
 '2017-04-12', '2024-01-01', '2025-12-31', '2025-11-01', '2025-12-31', NULL,
 'ACTIVE', 1, 1,
 3500.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 21000.00, 0.00, 'CURRENT',
 850000.00, 2500.00, 0, 0.00, 0.00,
 NULL, NULL, NULL, NULL, NULL, NULL,
 '654 Cedar Lane, Springfield, IL 62703', 'SINGLE_FAMILY', 850000.00, 2015, 4200, 1,
 78.0, 'High-value property, premium coverage, excellent condition'),

-- Policy 9: Auto Policy for Jessica Martinez
('AC777888999', 'CUST006', 'AUTO', 'BASIC', 'State Farm Insurance', 'John Smith', '(555) 111-2222',
 '2022-09-20', '2024-01-01', '2024-12-31', '2024-11-20', '2024-12-31', NULL,
 'ACTIVE', 1, 1,
 900.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 1800.00, 0.00, 'CURRENT',
 250000.00, 1000.00, 0, 0.00, 0.00,
 'Honda', 'Accord', 2018, '1HGCV1F38JA123456', 'IL-JKL012', 8000, 'PLEASURE',
 NULL, NULL, NULL, NULL, NULL, NULL,
 58.0, 'Young driver, basic coverage, older vehicle'),

-- Policy 10: Home Policy for James Wilson
('HO333444555', 'CUST007', 'HOME', 'HOMEOWNERS', 'Allstate Insurance', 'Mary Johnson', '(555) 222-3333',
 '2015-11-30', '2024-01-01', '2025-12-31', '2025-11-15', '2025-12-31', NULL,
 'ACTIVE', 1, 1,
 1100.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 9900.00, 0.00, 'CURRENT',
 320000.00, 1000.00, 0, 0.00, 0.00,
 NULL, NULL, NULL, NULL, NULL, NULL,
 '147 Walnut Street, Springfield, IL 62706', 'SINGLE_FAMILY', 320000.00, 1980, 2000, 1,
 60.0, 'Long-term customer, loyal, well-maintained home'),

-- Policy 11: Commercial Liability Policy for Antonio Martinez (from demo scenario)
('CL789012345', 'CUST008', 'COMMERCIAL', 'GENERAL_LIABILITY', 'Commercial Insurance Group', 'Sarah Lee', '(555) 555-6666',
 '2016-07-22', '2024-01-01', '2024-12-31', '2024-11-20', '2024-12-31', NULL,
 'ACTIVE', 1, 1,
 2500.00, 'ANNUAL', '2024-01-01', '2025-01-01',
 20000.00, 0.00, 'CURRENT',
 1000000.00, 0.00, 1, 15000.00, 0.75,
 NULL, NULL, NULL, NULL, NULL, NULL,
 '258 Main Street, Springfield, IL 62701', 'COMMERCIAL', 450000.00, 1990, 3500, 1,
 85.0, 'Restaurant business, high foot traffic, liability coverage essential');
