#!/usr/bin/env python3
"""
Create database directly with at least 100 rows in each table.
Generates realistic insurance data and inserts it directly into MySQL.
"""

import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

try:
    import mysql.connector
    from mysql.connector import Error
    HAS_MYSQL = True
except ImportError:
    print("❌ mysql-connector-python not installed.")
    print("   Install with: pip install mysql-connector-python")
    sys.exit(1)

# Configuration
DB_NAME = "insurance_claims_db"
DB_HOST = "localhost"
DB_PORT = 3306
DB_USER = "root"

# Data generation counts
NUM_CUSTOMERS = 120
NUM_POLICIES = 150  # More policies than customers (some customers have multiple)
NUM_POLICY_DETAILS = 200  # Multiple coverage types per policy

# Sample data
FIRST_NAMES = [
    "Sarah", "Robert", "Michael", "Emily", "David", "Jessica", "James", "Jennifer",
    "John", "Mary", "William", "Patricia", "Richard", "Linda", "Joseph", "Barbara",
    "Thomas", "Elizabeth", "Christopher", "Susan", "Daniel", "Karen", "Matthew", "Nancy",
    "Anthony", "Lisa", "Mark", "Betty", "Donald", "Margaret", "Steven", "Sandra",
    "Paul", "Ashley", "Andrew", "Kimberly", "Joshua", "Donna", "Kenneth", "Michelle",
    "Kevin", "Carol", "Brian", "Amanda", "George", "Dorothy", "Timothy", "Melissa",
    "Ronald", "Deborah", "Jason", "Stephanie", "Edward", "Rebecca", "Jeffrey", "Sharon",
    "Ryan", "Laura", "Jacob", "Cynthia", "Gary", "Kathleen", "Nicholas", "Amy",
    "Eric", "Angela", "Jonathan", "Shirley", "Stephen", "Anna", "Larry", "Brenda",
    "Justin", "Pamela", "Scott", "Emma", "Brandon", "Nicole", "Benjamin", "Helen",
    "Samuel", "Samantha", "Frank", "Katherine", "Gregory", "Christine", "Raymond", "Debra",
    "Alexander", "Rachel", "Patrick", "Carolyn", "Jack", "Janet", "Dennis", "Virginia",
    "Jerry", "Maria", "Tyler", "Heather", "Aaron", "Diane", "Jose", "Julie",
    "Adam", "Joyce", "Nathan", "Victoria", "Henry", "Kelly", "Zachary", "Christina",
    "Douglas", "Joan", "Peter", "Evelyn", "Kyle", "Judith", "Noah", "Megan"
]

LAST_NAMES = [
    "Johnson", "Chen", "Anderson", "Rodriguez", "Thompson", "Martinez", "Wilson", "Brown",
    "Davis", "Miller", "Garcia", "Gonzalez", "Lopez", "Jackson", "Lee", "White",
    "Harris", "Clark", "Lewis", "Robinson", "Walker", "Young", "Hall", "Allen",
    "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
    "Adams", "Nelson", "Baker", "Carter", "Mitchell", "Roberts", "Turner", "Phillips",
    "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris",
    "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera",
    "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray",
    "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett",
    "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell",
    "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster",
    "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers"
]

CITIES = [
    "Springfield", "Chicago", "Atlanta", "Austin", "Boston", "Denver", "Detroit", "Houston",
    "Indianapolis", "Jacksonville", "Kansas City", "Las Vegas", "Los Angeles", "Miami",
    "Milwaukee", "Minneapolis", "Nashville", "New York", "Orlando", "Philadelphia", "Phoenix",
    "Portland", "Raleigh", "Sacramento", "San Antonio", "San Diego", "San Francisco", "Seattle",
    "Tampa", "Washington"
]

STATES = ["IL", "CA", "TX", "NY", "FL", "PA", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA", "TN", "IN", "MO", "MD", "WI"]

POLICY_TYPES = ["AUTO", "HOME", "COMMERCIAL", "RENTERS", "LIABILITY"]
CARRIERS = ["State Farm Insurance", "Allstate Insurance", "Progressive Insurance", "Geico Insurance", 
            "Chubb Insurance", "Commercial Insurance Group", "Farmers Insurance", "Liberty Mutual"]

COVERAGE_CODES_AUTO = ["BI", "PD", "COMP", "COLL", "UMBI", "UMPD"]
COVERAGE_CODES_HOME = ["DWELLING", "PERSONAL_PROPERTY", "LIABILITY", "MED_PAY", "LOSS_OF_USE"]
COVERAGE_CODES_COMMERCIAL = ["GEN_LIABILITY", "PROPERTY", "BIZ_INT"]

VEHICLE_MAKES = ["Honda", "Toyota", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", "Audi", "Lexus", "Nissan", "Hyundai"]
VEHICLE_MODELS = ["Civic", "Accord", "Camry", "Corolla", "F-150", "Silverado", "X5", "C-Class", "A4", "RX"]


def get_password():
    """Get database password from user."""
    import getpass
    return getpass.getpass("Enter MySQL password (or press Enter for no password): ")


def create_database(connection, cursor):
    """Create database if it doesn't exist."""
    try:
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute(f"USE {DB_NAME}")
        print(f"✓ Database '{DB_NAME}' created/selected")
        return True
    except Error as e:
        print(f"❌ Error creating database: {e}")
        return False


def create_tables(cursor):
    """Create all tables."""
    print("\nCreating tables...")
    
    # Customers table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Customers (
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
            address_line1 VARCHAR(150) NOT NULL,
            address_line2 VARCHAR(150),
            city VARCHAR(50) NOT NULL,
            state VARCHAR(50) NOT NULL,
            postal_code VARCHAR(10) NOT NULL,
            country VARCHAR(50) DEFAULT 'USA',
            customer_since DATE NOT NULL,
            customer_status VARCHAR(20) DEFAULT 'ACTIVE',
            risk_profile VARCHAR(20),
            credit_score INTEGER,
            preferred_contact_method VARCHAR(20),
            created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email_id),
            INDEX idx_phone (phone_number),
            INDEX idx_customer_status (customer_status)
        )
    """)
    print("  ✓ Customers table created")
    
    # Policies table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Policies (
            policy_number VARCHAR(20) PRIMARY KEY,
            customer_id VARCHAR(20) NOT NULL,
            policy_type VARCHAR(30) NOT NULL,
            policy_subtype VARCHAR(50),
            carrier_name VARCHAR(100) NOT NULL,
            agent_name VARCHAR(100),
            agent_contact VARCHAR(50),
            created_date DATE NOT NULL,
            effective_date DATE NOT NULL,
            expiration_date DATE NOT NULL,
            renewal_date DATE,
            valid_upto DATE NOT NULL,
            cancellation_date DATE,
            policy_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
            is_active BOOLEAN DEFAULT 1,
            is_renewable BOOLEAN DEFAULT 1,
            premium_amount DECIMAL(10, 2) NOT NULL,
            premium_frequency VARCHAR(20) NOT NULL,
            last_premium_paid_date DATE,
            next_premium_due_date DATE,
            total_premium_paid DECIMAL(12, 2) DEFAULT 0.00,
            outstanding_balance DECIMAL(10, 2) DEFAULT 0.00,
            payment_status VARCHAR(20) DEFAULT 'CURRENT',
            total_coverage_limit DECIMAL(12, 2),
            aggregate_deductible DECIMAL(10, 2),
            claim_count INTEGER DEFAULT 0,
            total_claims_paid DECIMAL(12, 2) DEFAULT 0.00,
            loss_ratio DECIMAL(5, 2),
            vehicle_make VARCHAR(50),
            vehicle_model VARCHAR(50),
            vehicle_year INTEGER,
            vehicle_vin VARCHAR(17),
            license_plate VARCHAR(20),
            annual_mileage INTEGER,
            usage_type VARCHAR(30),
            property_address VARCHAR(200),
            property_type VARCHAR(50),
            property_value DECIMAL(12, 2),
            year_built INTEGER,
            square_footage INTEGER,
            number_of_units INTEGER DEFAULT 1,
            risk_score DECIMAL(5, 2),
            underwriting_notes TEXT,
            created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (customer_id) REFERENCES Customers(customer_id) ON DELETE CASCADE,
            INDEX idx_customer_id (customer_id),
            INDEX idx_policy_type (policy_type),
            INDEX idx_policy_status (policy_status),
            INDEX idx_expiration_date (expiration_date)
        )
    """)
    print("  ✓ Policies table created")
    
    # PolicyDetails table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS PolicyDetails (
            policy_detail_id VARCHAR(30) PRIMARY KEY,
            policy_number VARCHAR(20) NOT NULL,
            coverage_code VARCHAR(20) NOT NULL,
            coverage_name VARCHAR(100) NOT NULL,
            coverage_category VARCHAR(50),
            coverage_description TEXT,
            limit_per_person DECIMAL(12, 2),
            limit_per_occurrence DECIMAL(12, 2),
            limit_per_accident DECIMAL(12, 2),
            aggregate_limit DECIMAL(12, 2),
            sub_limit DECIMAL(12, 2),
            deductible_amount DECIMAL(10, 2) DEFAULT 0.00,
            deductible_type VARCHAR(30),
            deductible_applicable BOOLEAN DEFAULT 1,
            is_included BOOLEAN DEFAULT 1,
            is_optional BOOLEAN DEFAULT 0,
            is_active BOOLEAN DEFAULT 1,
            clause_text TEXT NOT NULL,
            terms_conditions TEXT,
            inclusions TEXT,
            exclusions TEXT,
            limitations TEXT,
            effective_from DATE NOT NULL,
            effective_to DATE,
            waiting_period_days INTEGER DEFAULT 0,
            grace_period_days INTEGER DEFAULT 0,
            coverage_territory VARCHAR(200) DEFAULT 'USA',
            coverage_restrictions TEXT,
            special_conditions TEXT,
            endorsements TEXT,
            cancellation_terms TEXT,
            claim_reporting_deadline_days INTEGER,
            claim_filing_deadline_days INTEGER,
            documentation_required TEXT,
            coverage_premium DECIMAL(10, 2),
            created_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (policy_number) REFERENCES Policies(policy_number) ON DELETE CASCADE,
            INDEX idx_policy_number (policy_number),
            INDEX idx_coverage_code (coverage_code),
            INDEX idx_is_active (is_active)
        )
    """)
    print("  ✓ PolicyDetails table created")


def generate_customers(cursor, count):
    """Generate and insert customers."""
    print(f"\nGenerating {count} customers...")
    
    customers = []
    for i in range(1, count + 1):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        customer_id = f"CUST{i:05d}"
        email = f"{first_name.lower()}.{last_name.lower()}@email.com"
        phone = f"(555) {random.randint(200, 999)}-{random.randint(1000, 9999)}"
        city = random.choice(CITIES)
        state = random.choice(STATES)
        postal = f"{random.randint(10000, 99999)}"
        
        dob = datetime.now() - timedelta(days=random.randint(18*365, 70*365))
        customer_since = datetime.now() - timedelta(days=random.randint(30, 3650))
        
        customers.append((
            customer_id, first_name, last_name, None, phone, email,
            dob.date(), random.choice(["Male", "Female"]), random.choice(["Single", "Married", "Divorced"]),
            random.choice(["Engineer", "Teacher", "Manager", "Doctor", "Lawyer", "Sales", "Designer"]),
            f"{random.choice(['Tech', 'Finance', 'Education', 'Healthcare'])} Corp",
            random.randint(40000, 200000),
            f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Elm', 'Pine', 'Maple'])} Street",
            None, city, state, postal, "USA",
            customer_since.date(), "ACTIVE",
            random.choice(["LOW", "MEDIUM", "HIGH"]),
            random.randint(600, 850),
            random.choice(["EMAIL", "PHONE", "SMS"])
        ))
    
    insert_query = """
        INSERT INTO Customers (
            customer_id, first_name, last_name, middle_name, phone_number, email_id,
            date_of_birth, gender, marital_status, occupation, employer_name, annual_income,
            address_line1, address_line2, city, state, postal_code, country,
            customer_since, customer_status, risk_profile, credit_score, preferred_contact_method
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(insert_query, customers)
    print(f"  ✓ Inserted {len(customers)} customers")
    return [c[0] for c in customers]  # Return customer IDs


def generate_policies(cursor, customer_ids, count):
    """Generate and insert policies."""
    print(f"\nGenerating {count} policies...")
    
    policies = []
    policy_numbers = []
    
    # Ensure we have the key policy numbers
    key_policies = [
        ("AC789456123", "CUST001", "AUTO"),
        ("HO456789234", "CUST002", "HOME")
    ]
    
    for policy_num, cust_id, ptype in key_policies:
        if cust_id in customer_ids:
            effective = datetime(2024, 1, 1)
            expiration = datetime(2024, 12, 31) if ptype == "AUTO" else datetime(2025, 12, 31)
            premium = 1500.00 if ptype == "AUTO" else 1200.00
            
            policies.append((
                policy_num, cust_id, ptype, "FULL_COVERAGE" if ptype == "AUTO" else "HOMEOWNERS",
                "State Farm Insurance" if ptype == "AUTO" else "Allstate Insurance",
                "John Smith", "(555) 111-2222",
                datetime(2022, 3, 15).date(), effective.date(), expiration.date(),
                (expiration - timedelta(days=30)).date(), expiration.date(), None,
                "ACTIVE", 1, 1,
                premium, "ANNUAL", effective.date(), (effective + timedelta(days=365)).date(),
                premium * 3, 0.00, "CURRENT",
                500000.00 if ptype == "AUTO" else 350000.00,
                375.00 if ptype == "AUTO" else 1000.00,
                1 if policy_num == "AC789456123" else 1, 4850.00 if policy_num == "AC789456123" else 8500.00,
                10.78 if policy_num == "AC789456123" else 23.61,
                "Honda" if ptype == "AUTO" else None, "Civic" if ptype == "AUTO" else None,
                2019 if ptype == "AUTO" else None, "19XFC2F59KE123456" if ptype == "AUTO" else None,
                "XYZ-789" if ptype == "AUTO" else None, 12000 if ptype == "AUTO" else None,
                "COMMUTE" if ptype == "AUTO" else None,
                None if ptype == "AUTO" else "456 Elm Street, Springfield, IL 62704",
                None if ptype == "AUTO" else "SINGLE_FAMILY",
                350000.00 if ptype == "HOME" else None, 1995 if ptype == "HOME" else None,
                2400 if ptype == "HOME" else None, 1,
                72.5 if ptype == "AUTO" else 68.0,
                "Low risk driver" if ptype == "AUTO" else "Well-maintained property"
            ))
            policy_numbers.append(policy_num)
    
    # Generate remaining policies
    for i in range(len(policies), count):
        customer_id = random.choice(customer_ids)
        policy_type = random.choice(POLICY_TYPES)
        policy_num = f"{policy_type[:2]}{random.randint(100000000, 999999999)}"
        
        while policy_num in policy_numbers:
            policy_num = f"{policy_type[:2]}{random.randint(100000000, 999999999)}"
        policy_numbers.append(policy_num)
        
        created = datetime.now() - timedelta(days=random.randint(30, 1095))
        effective = datetime.now() - timedelta(days=random.randint(0, 90))
        expiration = effective + timedelta(days=365)
        
        premium = random.randint(800, 3000)
        
        # Auto-specific fields
        vehicle_make = random.choice(VEHICLE_MAKES) if policy_type == "AUTO" else None
        vehicle_model = random.choice(VEHICLE_MODELS) if policy_type == "AUTO" else None
        vehicle_year = random.randint(2015, 2024) if policy_type == "AUTO" else None
        
        # Home-specific fields
        property_address = f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Elm'])} St" if policy_type == "HOME" else None
        property_value = random.randint(200000, 800000) if policy_type == "HOME" else None
        
        policies.append((
            policy_num, customer_id, policy_type, 
            random.choice(["FULL_COVERAGE", "STANDARD", "BASIC"]) if policy_type == "AUTO" else "HOMEOWNERS",
            random.choice(CARRIERS), f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
            f"(555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            created.date(), effective.date(), expiration.date(),
            (expiration - timedelta(days=30)).date(), expiration.date(), None,
            "ACTIVE", 1, 1,
            premium, random.choice(["ANNUAL", "MONTHLY", "QUARTERLY"]),
            effective.date(), (effective + timedelta(days=365)).date(),
            premium * random.randint(1, 5), 0.00, "CURRENT",
            random.randint(250000, 1000000), random.randint(250, 2500),
            random.randint(0, 3), random.randint(0, 50000), random.uniform(0, 50),
            vehicle_make, vehicle_model, vehicle_year, None, None,
            random.randint(5000, 20000) if policy_type == "AUTO" else None,
            random.choice(["COMMUTE", "BUSINESS", "PLEASURE"]) if policy_type == "AUTO" else None,
            property_address, "SINGLE_FAMILY" if policy_type == "HOME" else None,
            property_value, random.randint(1980, 2020) if policy_type == "HOME" else None,
            random.randint(1200, 4000) if policy_type == "HOME" else None, 1,
            random.uniform(50, 90), "Standard policy"
        ))
    
    insert_query = """
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
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(insert_query, policies)
    print(f"  ✓ Inserted {len(policies)} policies")
    return policy_numbers


def generate_policy_details(cursor, policy_numbers, count):
    """Generate and insert policy details."""
    print(f"\nGenerating {count} policy details...")
    
    details = []
    detail_id_counter = 1
    
    # Coverage mappings
    coverage_map = {
        "AUTO": COVERAGE_CODES_AUTO,
        "HOME": COVERAGE_CODES_HOME,
        "COMMERCIAL": COVERAGE_CODES_COMMERCIAL,
        "RENTERS": COVERAGE_CODES_HOME,
        "LIABILITY": ["GEN_LIABILITY"]
    }
    
    coverage_names = {
        "BI": "Bodily Injury Liability",
        "PD": "Property Damage Liability",
        "COMP": "Comprehensive Coverage",
        "COLL": "Collision Coverage",
        "UMBI": "Uninsured/Underinsured Motorist",
        "DWELLING": "Dwelling Coverage",
        "PERSONAL_PROPERTY": "Personal Property Coverage",
        "LIABILITY": "Personal Liability Coverage",
        "MED_PAY": "Medical Payments to Others",
        "LOSS_OF_USE": "Loss of Use Coverage",
        "GEN_LIABILITY": "General Liability"
    }
    
    # Get policy types
    cursor.execute("SELECT policy_number, policy_type FROM Policies")
    policy_info = {row[0]: row[1] for row in cursor.fetchall()}
    
    for policy_num in policy_numbers:
        policy_type = policy_info.get(policy_num, "AUTO")
        coverages = coverage_map.get(policy_type, COVERAGE_CODES_AUTO)
        
        # Add 2-5 coverage types per policy
        num_coverages = random.randint(2, min(5, len(coverages)))
        selected_coverages = random.sample(coverages, num_coverages)
        
        for coverage_code in selected_coverages:
            detail_id = f"PD-{policy_num}-{detail_id_counter:03d}"
            detail_id_counter += 1
            
            limit = random.randint(100000, 1000000) if coverage_code in ["BI", "DWELLING", "LIABILITY"] else random.randint(50000, 500000)
            deductible = random.randint(250, 2000) if coverage_code in ["COMP", "COLL", "DWELLING"] else 0
            
            details.append((
                detail_id, policy_num, coverage_code, coverage_names.get(coverage_code, coverage_code),
                "LIABILITY" if "LIABILITY" in coverage_code else "PROPERTY",
                f"Coverage for {coverage_names.get(coverage_code, coverage_code)}",
                limit if coverage_code in ["BI", "UMBI"] else None,
                limit if coverage_code not in ["BI", "UMBI"] else None,
                limit if coverage_code in ["BI", "PD"] else None,
                None, None,
                deductible, "PER_CLAIM", 1 if deductible > 0 else 0,
                1, 0, 1,
                f"Standard clause for {coverage_names.get(coverage_code, coverage_code)}",
                "Standard terms and conditions apply",
                "Standard inclusions",
                "Standard exclusions apply",
                "Coverage limited to policy limits",
                datetime(2024, 1, 1).date(), datetime(2024, 12, 31).date(),
                0, 30,
                "USA", None, None, None,
                30, 365, "Standard documentation required",
                random.randint(100, 1000)
            ))
    
    # Add more details to reach count
    while len(details) < count:
        policy_num = random.choice(policy_numbers)
        policy_type = policy_info.get(policy_num, "AUTO")
        coverages = coverage_map.get(policy_type, COVERAGE_CODES_AUTO)
        coverage_code = random.choice(coverages)
        
        detail_id = f"PD-{policy_num}-{detail_id_counter:03d}"
        detail_id_counter += 1
        
        limit = random.randint(100000, 1000000)
        deductible = random.randint(250, 2000)
        
        details.append((
            detail_id, policy_num, coverage_code, coverage_names.get(coverage_code, coverage_code),
            "LIABILITY", f"Additional coverage for {coverage_code}",
            limit, limit, limit, None, None,
            deductible, "PER_CLAIM", 1,
            1, 0, 1,
            f"Additional clause for {coverage_code}",
            "Terms apply", "Inclusions", "Exclusions", "Limitations",
            datetime(2024, 1, 1).date(), datetime(2024, 12, 31).date(),
            0, 30, "USA", None, None, None,
            30, 365, "Documentation required",
            random.randint(100, 1000)
        ))
    
    insert_query = """
        INSERT INTO PolicyDetails (
            policy_detail_id, policy_number, coverage_code, coverage_name, coverage_category, coverage_description,
            limit_per_person, limit_per_occurrence, limit_per_accident, aggregate_limit, sub_limit,
            deductible_amount, deductible_type, deductible_applicable,
            is_included, is_optional, is_active,
            clause_text, terms_conditions, inclusions, exclusions, limitations,
            effective_from, effective_to, waiting_period_days, grace_period_days,
            coverage_territory, coverage_restrictions, special_conditions, endorsements,
            claim_reporting_deadline_days, claim_filing_deadline_days, documentation_required, coverage_premium
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(insert_query, details)
    print(f"  ✓ Inserted {len(details)} policy details")


def main():
    """Main function."""
    print("=" * 60)
    print("Direct Database Creation with 100+ Rows Each")
    print("=" * 60)
    print()
    
    password = get_password()
    
    try:
        # Connect to MySQL
        print("Connecting to MySQL...")
        connection = mysql.connector.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=password if password else None
        )
        cursor = connection.cursor()
        print("✓ Connected to MySQL")
        
        # Create database
        if not create_database(connection, cursor):
            sys.exit(1)
        
        # Create tables
        create_tables(cursor)
        connection.commit()
        
        # Clear existing data
        print("\nClearing existing data...")
        cursor.execute("SET FOREIGN_KEY_CHECKS=0")
        cursor.execute("TRUNCATE TABLE PolicyDetails")
        cursor.execute("TRUNCATE TABLE Policies")
        cursor.execute("TRUNCATE TABLE Customers")
        cursor.execute("SET FOREIGN_KEY_CHECKS=1")
        print("  ✓ Cleared existing data")
        
        # Generate and insert data
        customer_ids = generate_customers(cursor, NUM_CUSTOMERS)
        connection.commit()
        
        policy_numbers = generate_policies(cursor, customer_ids, NUM_POLICIES)
        connection.commit()
        
        generate_policy_details(cursor, policy_numbers, NUM_POLICY_DETAILS)
        connection.commit()
        
        # Verify counts
        print("\n" + "=" * 60)
        print("Verification")
        print("=" * 60)
        cursor.execute("SELECT COUNT(*) FROM Customers")
        customer_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM Policies")
        policy_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM PolicyDetails")
        details_count = cursor.fetchone()[0]
        
        print(f"Customers: {customer_count}")
        print(f"Policies: {policy_count}")
        print(f"PolicyDetails: {details_count}")
        
        # Check key policies
        cursor.execute("SELECT COUNT(*) FROM Policies WHERE policy_number IN ('AC789456123', 'HO456789234')")
        key_policies = cursor.fetchone()[0]
        print(f"\nKey policies (AC789456123, HO456789234): {key_policies}")
        
        cursor.close()
        connection.close()
        
        print("\n" + "=" * 60)
        print("✓ Database creation complete!")
        print("=" * 60)
        
    except Error as e:
        print(f"❌ Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
