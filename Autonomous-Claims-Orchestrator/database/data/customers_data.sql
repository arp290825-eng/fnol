-- =====================================================
-- CUSTOMER DB - Dummy Data
-- =====================================================
-- Realistic customer demographic data
-- =====================================================

INSERT INTO Customers (
    customer_id, first_name, last_name, middle_name, phone_number, email_id,
    date_of_birth, gender, marital_status, occupation, employer_name, annual_income,
    address_line1, address_line2, city, state, postal_code, country,
    customer_since, customer_status, risk_profile, credit_score, preferred_contact_method
) VALUES
-- Customer 1: Sarah Johnson (from auto-collision scenario)
('CUST001', 'Sarah', 'Johnson', NULL, '(555) 123-4567', 'sarah.johnson@email.com',
 '1988-05-22', 'Female', 'Single', 'Marketing Manager', 'Springfield Marketing Group', 75000.00,
 '123 Maple Drive', NULL, 'Springfield', 'IL', '62701', 'USA',
 '2020-03-15', 'ACTIVE', 'LOW', 745, 'EMAIL'),

-- Customer 2: Robert Chen (from property-water-damage scenario)
('CUST002', 'Robert', 'Chen', 'Michael', '(555) 987-6543', 'robert.chen@email.com',
 '1975-11-08', 'Male', 'Married', 'Software Engineer', 'Tech Solutions Inc', 95000.00,
 '456 Elm Street', NULL, 'Springfield', 'IL', '62704', 'USA',
 '2019-08-20', 'ACTIVE', 'LOW', 780, 'PHONE'),

-- Customer 3: Additional customer with multiple policies
('CUST003', 'Michael', 'Anderson', 'James', '(555) 234-5678', 'michael.anderson@email.com',
 '1982-03-14', 'Male', 'Married', 'Financial Advisor', 'Wealth Management Partners', 120000.00,
 '789 Oak Avenue', 'Apt 4B', 'Chicago', 'IL', '60601', 'USA',
 '2018-06-10', 'ACTIVE', 'MEDIUM', 720, 'EMAIL'),

-- Customer 4: Customer with home and auto policies
('CUST004', 'Emily', 'Rodriguez', 'Maria', '(555) 345-6789', 'emily.rodriguez@email.com',
 '1990-09-30', 'Female', 'Married', 'Teacher', 'Springfield Public Schools', 55000.00,
 '321 Pine Street', NULL, 'Springfield', 'IL', '62702', 'USA',
 '2021-01-05', 'ACTIVE', 'LOW', 760, 'SMS'),

-- Customer 5: High-value customer
('CUST005', 'David', 'Thompson', 'William', '(555) 456-7890', 'david.thompson@email.com',
 '1978-12-25', 'Male', 'Married', 'Business Owner', 'Thompson Enterprises', 180000.00,
 '654 Cedar Lane', NULL, 'Springfield', 'IL', '62703', 'USA',
 '2017-04-12', 'ACTIVE', 'MEDIUM', 690, 'PHONE'),

-- Customer 6: Young professional
('CUST006', 'Jessica', 'Martinez', 'Lynn', '(555) 567-8901', 'jessica.martinez@email.com',
 '1995-07-18', 'Female', 'Single', 'Graphic Designer', 'Creative Design Studio', 48000.00,
 '987 Birch Road', NULL, 'Springfield', 'IL', '62705', 'USA',
 '2022-09-20', 'ACTIVE', 'LOW', 710, 'EMAIL'),

-- Customer 7: Retiree
('CUST007', 'James', 'Wilson', 'Robert', '(555) 678-9012', 'james.wilson@email.com',
 '1955-02-10', 'Male', 'Married', 'Retired', NULL, 45000.00,
 '147 Walnut Street', NULL, 'Springfield', 'IL', '62706', 'USA',
 '2015-11-30', 'ACTIVE', 'LOW', 750, 'PHONE'),

-- Customer 8: Commercial customer
('CUST008', 'Antonio', 'Martinez', NULL, '(555) 789-0123', 'antonio.martinez@tonysrestaurant.com',
 '1970-04-05', 'Male', 'Married', 'Restaurant Owner', 'Tony\'s Italian Restaurant', 85000.00,
 '258 Main Street', NULL, 'Springfield', 'IL', '62701', 'USA',
 '2016-07-22', 'ACTIVE', 'MEDIUM', 680, 'EMAIL');
