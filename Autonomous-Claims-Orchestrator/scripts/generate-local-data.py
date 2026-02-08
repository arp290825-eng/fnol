#!/usr/bin/env python3
"""
Generate local JSON database files with at least 100 rows each.
Creates Customers, Policies, and PolicyDetails as JSON files.
"""

import json
import random
from datetime import datetime, timedelta
from pathlib import Path

# Configuration
OUTPUT_DIR = Path(__file__).parent.parent / "database" / "local_data"
NUM_CUSTOMERS = 120
NUM_POLICIES = 150
NUM_POLICY_DETAILS = 200

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

COVERAGE_NAMES = {
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

# Realistic production-ready clauses
REALISTIC_CLAUSES = {
    "BI": {
        "clause_text": "We will pay damages for bodily injury or death for which any insured becomes legally responsible because of an auto accident. Damages include prejudgment interest awarded against the insured. We will settle or defend, as we consider appropriate, any claim or suit asking for these damages. In addition to our limit of liability, we will pay all defense costs we incur. Our duty to settle or defend ends when our limit of liability for this coverage has been exhausted by payment of judgments or settlements.",
        "terms_conditions": "Coverage applies only when policyholder is at fault. Must report accident within 30 days. Legal defense provided at no additional cost.",
        "inclusions": "Medical expenses, lost wages, pain and suffering, legal defense, funeral expenses",
        "exclusions": "Intentional acts, racing, use of vehicle for hire, driving under influence, damage to your own passengers (unless additional coverage purchased)"
    },
    "PD": {
        "clause_text": "We will pay for damage to another person's property (vehicles, structures, etc.) when you are at fault in an accident. This coverage pays for damage to another person's property caused by your vehicle. This includes damage to other vehicles, buildings, fences, or any other property.",
        "terms_conditions": "Coverage applies only when policyholder is at fault. Must report accident within 30 days.",
        "inclusions": "Damage to other vehicles, damage to structures, damage to personal property, towing costs for damaged vehicle",
        "exclusions": "Intentional damage, damage to your own property, racing, use of vehicle for hire, damage while committing a crime"
    },
    "COMP": {
        "clause_text": "We will pay for direct and accidental loss to your covered auto caused by events other than collisions. This includes theft, vandalism, fire, weather events (hail, wind, flood), falling objects, and collisions with animals. Our limit of liability for loss will be the lesser of: (1) the actual cash value of the stolen or damaged property; or (2) the amount necessary to repair or replace the property with other property of like kind and quality.",
        "terms_conditions": "Deductible applies to each claim. Must report incident within 30 days. Vehicle must be in operable condition at time of loss.",
        "inclusions": "Theft, vandalism, fire, weather damage (hail, wind, flood), falling objects, animal collisions, glass breakage, natural disasters",
        "exclusions": "Mechanical breakdown, wear and tear, damage from racing, intentional damage, damage while committing a crime, damage to personal property inside vehicle"
    },
    "COLL": {
        "clause_text": "We will pay for direct and accidental loss to your covered auto caused by collision. 'Collision' means the upset of your covered auto or its impact with another vehicle or object. Our limit of liability for loss will be the lesser of: (1) the actual cash value of the stolen or damaged property; or (2) the amount necessary to repair or replace the property with other property of like kind and quality. The deductible shown in the Declarations applies to each loss.",
        "terms_conditions": "Deductible applies to each claim. Must report accident within 30 days.",
        "inclusions": "Collision with another vehicle, collision with stationary object, rollover accidents, towing and storage costs",
        "exclusions": "Intentional damage, damage from racing, damage while committing a crime, normal wear and tear"
    },
    "UMBI": {
        "clause_text": "We will pay compensatory damages which an insured is legally entitled to recover from the owner or operator of an uninsured motor vehicle because of bodily injury sustained by an insured caused by an accident. The owner's or operator's liability for these damages must arise out of the ownership, maintenance or use of the uninsured motor vehicle. Any judgment for damages arising out of a suit brought without our written consent is not binding on us.",
        "terms_conditions": "Coverage applies when other driver is at fault and uninsured/underinsured. Must report accident within 30 days.",
        "inclusions": "Medical expenses, lost wages, pain and suffering, funeral expenses",
        "exclusions": "Intentional acts, accidents with insured drivers with adequate coverage, hit-and-run where driver cannot be identified (unless additional coverage)"
    },
    "DWELLING": {
        "clause_text": "We insure for direct physical loss to property described in Coverages A and B caused by a covered peril. This coverage protects the physical structure of your home, including the foundation, walls, roof, built-in appliances, and attached structures such as garages and decks. Our limit of liability for loss will be the lesser of: (1) the replacement cost of the property; or (2) the amount necessary to repair or replace the property with other property of like kind and quality.",
        "terms_conditions": "Deductible applies to each claim. Must report damage within 60 days. Property must be maintained in good condition.",
        "inclusions": "Fire, wind, hail, lightning, theft, vandalism, water damage from burst pipes, falling objects, weight of snow/ice, explosion",
        "exclusions": "Flood, earthquake, normal wear and tear, intentional damage, damage from neglect, damage from war or nuclear hazard, damage from government action"
    },
    "PERSONAL_PROPERTY": {
        "clause_text": "We insure for direct physical loss to personal property described in Coverage C caused by a covered peril. This coverage protects your personal belongings, including furniture, electronics, clothing, appliances, and other personal items, both inside and outside your home.",
        "terms_conditions": "Deductible applies to each claim. Coverage for items away from home is limited. High-value items may require additional coverage.",
        "inclusions": "Furniture, electronics, clothing, appliances, sports equipment, tools, personal items, items temporarily away from home (up to 10% of limit)",
        "exclusions": "Flood, earthquake, normal wear and tear, intentional damage, damage from animals, damage to vehicles (unless covered by separate policy), jewelry over $2,500 (unless scheduled), cash over $200"
    },
    "LIABILITY": {
        "clause_text": "We will pay damages for which an insured is legally liable because of bodily injury or property damage to others that occurs on your property or as a result of your actions. This coverage protects you if someone is injured on your property or if you accidentally damage someone else's property. It covers legal defense costs and any settlements or judgments up to the policy limit.",
        "terms_conditions": "Coverage applies to incidents on your property or caused by your actions. Must report incident within 30 days.",
        "inclusions": "Bodily injury to others, property damage to others, legal defense costs, medical payments to others, personal injury (libel, slander)",
        "exclusions": "Intentional acts, business activities, professional services, damage to property you own or rent, damage from motor vehicles (unless covered by separate policy), damage from aircraft or watercraft"
    },
    "MED_PAY": {
        "clause_text": "We will pay the necessary medical expenses incurred or medically ascertained within three years of the date of an accident causing bodily injury. Medical expenses means reasonable charges for medical, surgical, x-ray, dental, ambulance, hospital, professional nursing, prosthetic devices and funeral services. This coverage applies to each person who sustains bodily injury.",
        "terms_conditions": "Coverage applies to injuries on your property. Must report incident within 30 days.",
        "inclusions": "Medical expenses, ambulance costs, dental expenses, funeral expenses (if death results from injury)",
        "exclusions": "Injuries to you or household members, injuries to employees, injuries from business activities, injuries from motor vehicles"
    },
    "LOSS_OF_USE": {
        "clause_text": "If a loss covered under this policy makes the residence premises uninhabitable, we cover the necessary increase in living expenses incurred by you so that your household can maintain its normal standard of living. Payment will be for the shortest time required to repair or replace the damage or, if you permanently relocate, the shortest time required for your household to settle elsewhere.",
        "terms_conditions": "Coverage applies only when home is uninhabitable due to covered loss. Must be temporary relocation.",
        "inclusions": "Hotel costs, restaurant meals, laundry costs, storage costs, pet boarding, increased commuting costs",
        "exclusions": "Expenses not related to covered loss, permanent relocation, expenses covered by other insurance, normal living expenses"
    },
    "GEN_LIABILITY": {
        "clause_text": "We will pay those sums that the insured becomes legally obligated to pay as damages because of 'bodily injury' or 'property damage' to which this insurance applies. We will have the right and duty to defend the insured against any 'suit' seeking those damages. However, we will have no duty to defend the insured against any 'suit' seeking damages for 'bodily injury' or 'property damage' to which this insurance does not apply.",
        "terms_conditions": "Coverage applies to business operations. Must report incidents within 24 hours.",
        "inclusions": "Bodily injury to customers, property damage to third parties, legal defense costs, medical payments, advertising injury",
        "exclusions": "Intentional acts, professional services, employment practices, pollution, damage to your own property, workers compensation claims"
    }
}


def generate_customers(count):
    """Generate customer data."""
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
        
        customer = {
            "customer_id": customer_id,
            "first_name": first_name,
            "last_name": last_name,
            "middle_name": None,
            "phone_number": phone,
            "email_id": email,
            "date_of_birth": dob.strftime("%Y-%m-%d"),
            "gender": random.choice(["Male", "Female"]),
            "marital_status": random.choice(["Single", "Married", "Divorced"]),
            "occupation": random.choice(["Engineer", "Teacher", "Manager", "Doctor", "Lawyer", "Sales", "Designer"]),
            "employer_name": f"{random.choice(['Tech', 'Finance', 'Education', 'Healthcare'])} Corp",
            "annual_income": random.randint(40000, 200000),
            "address_line1": f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Elm', 'Pine', 'Maple'])} Street",
            "address_line2": None,
            "city": city,
            "state": state,
            "postal_code": postal,
            "country": "USA",
            "customer_since": customer_since.strftime("%Y-%m-%d"),
            "customer_status": "ACTIVE",
            "risk_profile": random.choice(["LOW", "MEDIUM", "HIGH"]),
            "credit_score": random.randint(600, 850),
            "preferred_contact_method": random.choice(["EMAIL", "PHONE", "SMS"]),
            "created_date": customer_since.strftime("%Y-%m-%d %H:%M:%S"),
            "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        # Special customers for key policies
        if i == 1:  # Sarah Johnson
            customer.update({
                "first_name": "Sarah",
                "last_name": "Johnson",
                "email_id": "sarah.johnson@email.com",
                "phone_number": "(555) 123-4567",
                "address_line1": "123 Maple Drive",
                "city": "Springfield",
                "state": "IL",
                "postal_code": "62701"
            })
        elif i == 2:  # Robert Chen
            customer.update({
                "first_name": "Robert",
                "last_name": "Chen",
                "email_id": "robert.chen@email.com",
                "phone_number": "(555) 987-6543",
                "address_line1": "456 Elm Street",
                "city": "Springfield",
                "state": "IL",
                "postal_code": "62704"
            })
        
        customers.append(customer)
    
    return customers


def generate_policies(customer_ids, count):
    """Generate policy data."""
    policies = []
    policy_numbers = []
    
    # Key policies first
    key_policies = [
        {
            "policy_number": "AC789456123",
            "customer_id": "CUST00001",
            "policy_type": "AUTO",
            "policy_subtype": "FULL_COVERAGE",
            "carrier_name": "State Farm Insurance",
            "agent_name": "John Smith",
            "agent_contact": "(555) 111-2222",
            "created_date": "2022-03-15",
            "effective_date": "2024-01-01",
            "expiration_date": "2024-12-31",
            "renewal_date": "2024-12-01",
            "valid_upto": "2024-12-31",
            "cancellation_date": None,
            "policy_status": "ACTIVE",
            "is_active": True,
            "is_renewable": True,
            "premium_amount": 1500.00,
            "premium_frequency": "ANNUAL",
            "last_premium_paid_date": "2024-01-01",
            "next_premium_due_date": "2025-01-01",
            "total_premium_paid": 4500.00,
            "outstanding_balance": 0.00,
            "payment_status": "CURRENT",
            "total_coverage_limit": 500000.00,
            "aggregate_deductible": 375.00,
            "claim_count": 1,
            "total_claims_paid": 4850.00,
            "loss_ratio": 10.78,
            "vehicle_make": "Honda",
            "vehicle_model": "Civic",
            "vehicle_year": 2019,
            "vehicle_vin": "19XFC2F59KE123456",
            "license_plate": "XYZ-789",
            "annual_mileage": 12000,
            "usage_type": "COMMUTE",
            "property_address": None,
            "property_type": None,
            "property_value": None,
            "year_built": None,
            "square_footage": None,
            "number_of_units": 1,
            "risk_score": 72.5,
            "underwriting_notes": "Low risk driver, clean record, good credit score"
        },
        {
            "policy_number": "HO456789234",
            "customer_id": "CUST00002",
            "policy_type": "HOME",
            "policy_subtype": "HOMEOWNERS",
            "carrier_name": "Allstate Insurance",
            "agent_name": "Mary Johnson",
            "agent_contact": "(555) 222-3333",
            "created_date": "2021-08-20",
            "effective_date": "2024-01-01",
            "expiration_date": "2025-12-31",
            "renewal_date": "2025-11-15",
            "valid_upto": "2025-12-31",
            "cancellation_date": None,
            "policy_status": "ACTIVE",
            "is_active": True,
            "is_renewable": True,
            "premium_amount": 1200.00,
            "premium_frequency": "ANNUAL",
            "last_premium_paid_date": "2024-01-01",
            "next_premium_due_date": "2025-01-01",
            "total_premium_paid": 3600.00,
            "outstanding_balance": 0.00,
            "payment_status": "CURRENT",
            "total_coverage_limit": 350000.00,
            "aggregate_deductible": 1000.00,
            "claim_count": 1,
            "total_claims_paid": 8500.00,
            "loss_ratio": 23.61,
            "vehicle_make": None,
            "vehicle_model": None,
            "vehicle_year": None,
            "vehicle_vin": None,
            "license_plate": None,
            "annual_mileage": None,
            "usage_type": None,
            "property_address": "456 Elm Street, Springfield, IL 62704",
            "property_type": "SINGLE_FAMILY",
            "property_value": 350000.00,
            "year_built": 1995,
            "square_footage": 2400,
            "number_of_units": 1,
            "risk_score": 68.0,
            "underwriting_notes": "Well-maintained property, updated electrical, low crime area"
        }
    ]
    
    for policy in key_policies:
        policies.append(policy)
        policy_numbers.append(policy["policy_number"])
    
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
        
        policy = {
            "policy_number": policy_num,
            "customer_id": customer_id,
            "policy_type": policy_type,
            "policy_subtype": random.choice(["FULL_COVERAGE", "STANDARD", "BASIC"]) if policy_type == "AUTO" else "HOMEOWNERS",
            "carrier_name": random.choice(CARRIERS),
            "agent_name": f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}",
            "agent_contact": f"(555) {random.randint(100, 999)}-{random.randint(1000, 9999)}",
            "created_date": created.strftime("%Y-%m-%d"),
            "effective_date": effective.strftime("%Y-%m-%d"),
            "expiration_date": expiration.strftime("%Y-%m-%d"),
            "renewal_date": (expiration - timedelta(days=30)).strftime("%Y-%m-%d"),
            "valid_upto": expiration.strftime("%Y-%m-%d"),
            "cancellation_date": None,
            "policy_status": "ACTIVE",
            "is_active": True,
            "is_renewable": True,
            "premium_amount": float(premium),
            "premium_frequency": random.choice(["ANNUAL", "MONTHLY", "QUARTERLY"]),
            "last_premium_paid_date": effective.strftime("%Y-%m-%d"),
            "next_premium_due_date": (effective + timedelta(days=365)).strftime("%Y-%m-%d"),
            "total_premium_paid": float(premium * random.randint(1, 5)),
            "outstanding_balance": 0.00,
            "payment_status": "CURRENT",
            "total_coverage_limit": float(random.randint(250000, 1000000)),
            "aggregate_deductible": float(random.randint(250, 2500)),
            "claim_count": random.randint(0, 3),
            "total_claims_paid": float(random.randint(0, 50000)),
            "loss_ratio": round(random.uniform(0, 50), 2),
            "vehicle_make": random.choice(VEHICLE_MAKES) if policy_type == "AUTO" else None,
            "vehicle_model": random.choice(VEHICLE_MODELS) if policy_type == "AUTO" else None,
            "vehicle_year": random.randint(2015, 2024) if policy_type == "AUTO" else None,
            "vehicle_vin": None,
            "license_plate": None,
            "annual_mileage": random.randint(5000, 20000) if policy_type == "AUTO" else None,
            "usage_type": random.choice(["COMMUTE", "BUSINESS", "PLEASURE"]) if policy_type == "AUTO" else None,
            "property_address": f"{random.randint(100, 9999)} {random.choice(['Main', 'Oak', 'Elm'])} St" if policy_type == "HOME" else None,
            "property_type": "SINGLE_FAMILY" if policy_type == "HOME" else None,
            "property_value": float(random.randint(200000, 800000)) if policy_type == "HOME" else None,
            "year_built": random.randint(1980, 2020) if policy_type == "HOME" else None,
            "square_footage": random.randint(1200, 4000) if policy_type == "HOME" else None,
            "number_of_units": 1,
            "risk_score": round(random.uniform(50, 90), 1),
            "underwriting_notes": "Standard policy"
        }
        
        policies.append(policy)
    
    return policies, policy_numbers


def generate_policy_details(policy_numbers, policy_types_map, count):
    """Generate policy details data."""
    details = []
    detail_id_counter = 1
    
    coverage_map = {
        "AUTO": COVERAGE_CODES_AUTO,
        "HOME": COVERAGE_CODES_HOME,
        "COMMERCIAL": COVERAGE_CODES_COMMERCIAL,
        "RENTERS": COVERAGE_CODES_HOME,
        "LIABILITY": ["GEN_LIABILITY"]
    }
    
    # Generate details for each policy
    for policy_num in policy_numbers:
        policy_type = policy_types_map.get(policy_num, "AUTO")
        coverages = coverage_map.get(policy_type, COVERAGE_CODES_AUTO)
        
        num_coverages = random.randint(1, min(5, len(coverages)))
        selected_coverages = random.sample(coverages, num_coverages)
        
        for coverage_code in selected_coverages:
            detail_id = f"PD-{policy_num}-{detail_id_counter:03d}"
            detail_id_counter += 1
            
            limit = random.randint(100000, 1000000) if coverage_code in ["BI", "DWELLING", "LIABILITY"] else random.randint(50000, 500000)
            deductible = random.randint(250, 2000) if coverage_code in ["COMP", "COLL", "DWELLING"] else 0
            
            # Get realistic clause data
            clause_data = REALISTIC_CLAUSES.get(coverage_code, {})
            
            detail = {
                "policy_detail_id": detail_id,
                "policy_number": policy_num,
                "coverage_code": coverage_code,
                "coverage_name": COVERAGE_NAMES.get(coverage_code, coverage_code),
                "coverage_category": "LIABILITY" if "LIABILITY" in coverage_code or coverage_code in ["BI", "PD", "UMBI", "MED_PAY"] else "PROPERTY",
                "coverage_description": f"Covers {COVERAGE_NAMES.get(coverage_code, coverage_code).lower()} as specified in policy terms",
                "limit_per_person": float(limit) if coverage_code in ["BI", "UMBI"] else None,
                "limit_per_occurrence": float(limit) if coverage_code not in ["BI", "UMBI"] else None,
                "limit_per_accident": float(limit) if coverage_code in ["BI", "PD"] else None,
                "aggregate_limit": None,
                "sub_limit": None,
                "deductible_amount": float(deductible),
                "deductible_type": "PER_CLAIM",
                "deductible_applicable": True if deductible > 0 else False,
                "is_included": True,
                "is_optional": False,
                "is_active": True,
                "clause_text": clause_data.get("clause_text", f"Coverage for {COVERAGE_NAMES.get(coverage_code, coverage_code)} as per policy terms and conditions."),
                "terms_conditions": clause_data.get("terms_conditions", "Standard terms and conditions apply as specified in policy documents."),
                "inclusions": clause_data.get("inclusions", "Coverage applies as specified in policy terms."),
                "exclusions": clause_data.get("exclusions", "Exclusions apply as specified in policy terms."),
                "limitations": "Coverage limited to policy limits. Actual cash value applies unless replacement cost coverage is specified.",
                "effective_from": "2024-01-01",
                "effective_to": "2024-12-31",
                "waiting_period_days": 0,
                "grace_period_days": 30,
                "coverage_territory": "USA",
                "coverage_restrictions": None,
                "special_conditions": None,
                "endorsements": None,
                "cancellation_terms": None,
                "claim_reporting_deadline_days": 30,
                "claim_filing_deadline_days": 365,
                "documentation_required": "Police report (if applicable), photos of damage, repair estimates, proof of ownership, witness statements",
                "coverage_premium": float(random.randint(100, 1000))
            }
            
            details.append(detail)
    
    # Add more details to reach count
    while len(details) < count:
        policy_num = random.choice(policy_numbers)
        policy_type = policy_types_map.get(policy_num, "AUTO")
        coverages = coverage_map.get(policy_type, COVERAGE_CODES_AUTO)
        coverage_code = random.choice(coverages)
        
        detail_id = f"PD-{policy_num}-{detail_id_counter:03d}"
        detail_id_counter += 1
        
        limit = random.randint(100000, 1000000)
        deductible = random.randint(250, 2000)
        
        # Get realistic clause data
        clause_data = REALISTIC_CLAUSES.get(coverage_code, {})
        
        detail = {
            "policy_detail_id": detail_id,
            "policy_number": policy_num,
            "coverage_code": coverage_code,
            "coverage_name": COVERAGE_NAMES.get(coverage_code, coverage_code),
            "coverage_category": "LIABILITY" if "LIABILITY" in coverage_code or coverage_code in ["BI", "PD", "UMBI", "MED_PAY"] else "PROPERTY",
            "coverage_description": f"Covers {COVERAGE_NAMES.get(coverage_code, coverage_code).lower()} as specified in policy terms",
            "limit_per_person": float(limit),
            "limit_per_occurrence": float(limit),
            "limit_per_accident": float(limit),
            "aggregate_limit": None,
            "sub_limit": None,
            "deductible_amount": float(deductible),
            "deductible_type": "PER_CLAIM",
            "deductible_applicable": True,
            "is_included": True,
            "is_optional": False,
            "is_active": True,
            "clause_text": clause_data.get("clause_text", f"Coverage for {COVERAGE_NAMES.get(coverage_code, coverage_code)} as per policy terms and conditions."),
            "terms_conditions": clause_data.get("terms_conditions", "Standard terms and conditions apply as specified in policy documents."),
            "inclusions": clause_data.get("inclusions", "Coverage applies as specified in policy terms."),
            "exclusions": clause_data.get("exclusions", "Exclusions apply as specified in policy terms."),
            "limitations": "Coverage limited to policy limits. Actual cash value applies unless replacement cost coverage is specified.",
            "effective_from": "2024-01-01",
            "effective_to": "2024-12-31",
            "waiting_period_days": 0,
            "grace_period_days": 30,
            "coverage_territory": "USA",
            "coverage_restrictions": None,
            "special_conditions": None,
            "endorsements": None,
            "cancellation_terms": None,
            "claim_reporting_deadline_days": 30,
            "claim_filing_deadline_days": 365,
            "documentation_required": "Police report (if applicable), photos of damage, repair estimates, proof of ownership, witness statements",
            "coverage_premium": float(random.randint(100, 1000))
        }
        
        details.append(detail)
    
    return details


def main():
    """Main function."""
    print("=" * 60)
    print("Generating Local JSON Database Files")
    print("=" * 60)
    print()
    
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}")
    print()
    
    # Generate customers
    print(f"Generating {NUM_CUSTOMERS} customers...")
    customers = generate_customers(NUM_CUSTOMERS)
    customers_file = OUTPUT_DIR / "customers.json"
    with open(customers_file, 'w') as f:
        json.dump(customers, f, indent=2)
    print(f"  ✓ Created {customers_file} ({len(customers)} records)")
    
    # Generate policies
    print(f"\nGenerating {NUM_POLICIES} policies...")
    customer_ids = [c["customer_id"] for c in customers]
    policies, policy_numbers = generate_policies(customer_ids, NUM_POLICIES)
    policies_file = OUTPUT_DIR / "policies.json"
    with open(policies_file, 'w') as f:
        json.dump(policies, f, indent=2)
    print(f"  ✓ Created {policies_file} ({len(policies)} records)")
    
    # Create policy type mapping
    policy_types_map = {p["policy_number"]: p["policy_type"] for p in policies}
    
    # Generate policy details
    print(f"\nGenerating {NUM_POLICY_DETAILS} policy details...")
    policy_details = generate_policy_details(policy_numbers, policy_types_map, NUM_POLICY_DETAILS)
    details_file = OUTPUT_DIR / "policy_details.json"
    with open(details_file, 'w') as f:
        json.dump(policy_details, f, indent=2)
    print(f"  ✓ Created {details_file} ({len(policy_details)} records)")
    
    # Summary
    print("\n" + "=" * 60)
    print("Summary")
    print("=" * 60)
    print(f"Customers: {len(customers)} records")
    print(f"Policies: {len(policies)} records")
    print(f"PolicyDetails: {len(policy_details)} records")
    print()
    print(f"Key policies included:")
    print(f"  - AC789456123 (Auto) - {len([p for p in policies if p['policy_number'] == 'AC789456123'])} record(s)")
    print(f"  - HO456789234 (Home) - {len([p for p in policies if p['policy_number'] == 'HO456789234'])} record(s)")
    print()
    print(f"Files created in: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
