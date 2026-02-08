-- =====================================================
-- POLICY DETAILS DB - Dummy Data
-- =====================================================
-- Detailed coverage information, clauses, and terms
-- For policies AC789456123 (Auto) and HO456789234 (Home)
-- =====================================================

-- =====================================================
-- Policy AC789456123 - Auto Insurance Coverage Details
-- =====================================================

-- Bodily Injury Liability Coverage
INSERT INTO PolicyDetails (
    policy_detail_id, policy_number, coverage_code, coverage_name, coverage_category, coverage_description,
    limit_per_person, limit_per_occurrence, limit_per_accident, aggregate_limit, sub_limit,
    deductible_amount, deductible_type, deductible_applicable,
    is_included, is_optional, is_active,
    clause_text, terms_conditions, inclusions, exclusions, limitations,
    effective_from, effective_to, waiting_period_days, grace_period_days,
    coverage_territory, coverage_restrictions, special_conditions, endorsements,
    claim_reporting_deadline_days, claim_filing_deadline_days, documentation_required, coverage_premium
) VALUES
('PD-AC789456123-001', 'AC789456123', 'BI', 'Bodily Injury Liability', 'LIABILITY',
 'Covers medical expenses, lost wages, and legal liability for injuries caused to others in an accident where you are at fault',
 250000.00, NULL, 500000.00, NULL, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage applies when you are legally responsible for causing bodily injury to another person in an auto accident. Coverage includes medical expenses, lost wages, pain and suffering, and legal defense costs.',
 'Coverage applies only when policyholder is at fault. Must report accident within 30 days. Legal defense provided at no additional cost.',
 'Medical expenses, lost wages, pain and suffering, legal defense, funeral expenses',
 'Intentional acts, racing, use of vehicle for hire, driving under influence, damage to your own passengers (unless additional coverage purchased)',
 'Coverage limited to policy limits. No coverage for punitive damages in some states.',
 '2024-01-01', '2024-12-31', 0, 30,
 'USA and Canada', 'Coverage applies only when driving in USA, Canada, or territories. International travel requires additional coverage.',
 'Must maintain valid driver license. All drivers must be listed on policy.',
 NULL,
 30, 365, 'Police report, medical records, witness statements, photos of accident scene',
 450.00),

-- Property Damage Liability Coverage
('PD-AC789456123-002', 'AC789456123', 'PD', 'Property Damage Liability', 'LIABILITY',
 'Covers damage to another person\'s property (vehicles, structures, etc.) when you are at fault in an accident',
 NULL, NULL, 100000.00, NULL, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage pays for damage to another person\'s property caused by your vehicle. This includes damage to other vehicles, buildings, fences, or any other property.',
 'Coverage applies only when policyholder is at fault. Must report accident within 30 days.',
 'Damage to other vehicles, damage to structures, damage to personal property, towing costs for damaged vehicle',
 'Intentional damage, damage to your own property, racing, use of vehicle for hire, damage while committing a crime',
 'Coverage limited to policy limits. Does not cover damage to your own vehicle.',
 '2024-01-01', '2024-12-31', 0, 30,
 'USA and Canada', NULL,
 'Must maintain valid driver license. Vehicle must be used for personal purposes.',
 NULL,
 30, 365, 'Police report, photos of damage, repair estimates, witness statements',
 300.00),

-- Comprehensive Coverage
('PD-AC789456123-003', 'AC789456123', 'COMP', 'Comprehensive Coverage', 'PROPERTY',
 'Covers damage to your vehicle from non-collision events such as theft, vandalism, weather, fire, and animal collisions',
 NULL, NULL, NULL, NULL, NULL,
 375.00, 'PER_CLAIM', 1,
 1, 1, 1,
 'This coverage protects your vehicle from damage caused by events other than collisions. This includes theft, vandalism, fire, weather events (hail, wind, flood), falling objects, and collisions with animals.',
 'Deductible applies to each claim. Must report incident within 30 days. Vehicle must be in operable condition at time of loss.',
 'Theft, vandalism, fire, weather damage (hail, wind, flood), falling objects, animal collisions, glass breakage, natural disasters',
 'Mechanical breakdown, wear and tear, damage from racing, intentional damage, damage while committing a crime, damage to personal property inside vehicle',
 'Coverage limited to actual cash value of vehicle. Does not cover custom equipment unless specifically endorsed.',
 '2024-01-01', '2024-12-31', 0, 30,
 'USA and Canada', 'Coverage applies worldwide for theft. Other perils limited to USA and Canada.',
 'Vehicle must be properly maintained. Must have proof of ownership.',
 NULL,
 30, 365, 'Police report (for theft/vandalism), photos of damage, repair estimates, proof of ownership',
 400.00),

-- Collision Coverage
('PD-AC789456123-004', 'AC789456123', 'COLL', 'Collision Coverage', 'PROPERTY',
 'Covers damage to your vehicle from collisions with another vehicle or object, regardless of fault',
 NULL, NULL, NULL, NULL, NULL,
 375.00, 'PER_CLAIM', 1,
 1, 1, 1,
 'This coverage pays for damage to your vehicle resulting from a collision with another vehicle or object, regardless of who is at fault. Coverage includes towing and storage costs.',
 'Deductible applies to each claim. Must report accident within 30 days.',
 'Collision with another vehicle, collision with stationary object, rollover accidents, towing and storage costs',
 'Intentional damage, damage from racing, damage while committing a crime, normal wear and tear',
 'Coverage limited to actual cash value of vehicle. Does not cover custom equipment unless specifically endorsed.',
 '2024-01-01', '2024-12-31', 0, 30,
 'USA and Canada', NULL,
 'Vehicle must be properly maintained. All drivers must be listed on policy.',
 NULL,
 30, 365, 'Police report, photos of damage, repair estimates, witness statements, accident report form',
 350.00),

-- Uninsured/Underinsured Motorist Bodily Injury
('PD-AC789456123-005', 'AC789456123', 'UMBI', 'Uninsured/Underinsured Motorist Bodily Injury', 'MEDICAL',
 'Covers medical expenses and lost wages when you are injured by an uninsured or underinsured driver',
 250000.00, NULL, 500000.00, NULL, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage protects you and your passengers if you are injured in an accident caused by a driver who has no insurance or insufficient insurance to cover your injuries.',
 'Coverage applies when other driver is at fault and uninsured/underinsured. Must report accident within 30 days.',
 'Medical expenses, lost wages, pain and suffering, funeral expenses',
 'Intentional acts, accidents with insured drivers with adequate coverage, hit-and-run where driver cannot be identified (unless additional coverage)',
 'Coverage limited to policy limits. Stacking not allowed in this state.',
 '2024-01-01', '2024-12-31', 0, 30,
 'USA and Canada', NULL,
 'Must report accident promptly. Must cooperate with investigation.',
 NULL,
 30, 365, 'Police report, medical records, proof of other driver\'s insurance status, witness statements',
 200.00);

-- =====================================================
-- Policy HO456789234 - Home Insurance Coverage Details
-- =====================================================

-- Dwelling Coverage
INSERT INTO PolicyDetails (
    policy_detail_id, policy_number, coverage_code, coverage_name, coverage_category, coverage_description,
    limit_per_person, limit_per_occurrence, limit_per_accident, aggregate_limit, sub_limit,
    deductible_amount, deductible_type, deductible_applicable,
    is_included, is_optional, is_active,
    clause_text, terms_conditions, inclusions, exclusions, limitations,
    effective_from, effective_to, waiting_period_days, grace_period_days,
    coverage_territory, coverage_restrictions, special_conditions, endorsements,
    claim_reporting_deadline_days, claim_filing_deadline_days, documentation_required, coverage_premium
) VALUES
('PD-HO456789234-001', 'HO456789234', 'DWELLING', 'Dwelling Coverage', 'PROPERTY',
 'Covers the structure of your home, including walls, roof, foundation, and attached structures',
 NULL, 350000.00, NULL, NULL, NULL,
 1000.00, 'PER_CLAIM', 1,
 1, 0, 1,
 'This coverage protects the physical structure of your home, including the foundation, walls, roof, built-in appliances, and attached structures such as garages and decks.',
 'Deductible applies to each claim. Must report damage within 60 days. Property must be maintained in good condition.',
 'Fire, wind, hail, lightning, theft, vandalism, water damage from burst pipes, falling objects, weight of snow/ice, explosion',
 'Flood, earthquake, normal wear and tear, intentional damage, damage from neglect, damage from war or nuclear hazard, damage from government action',
 'Coverage limited to replacement cost up to policy limit. Does not cover land value. Does not cover damage from excluded perils.',
 '2024-01-01', '2025-12-31', 0, 60,
 'Property location: 456 Elm Street, Springfield, IL 62704', 'Coverage applies only to insured property. Vacancy over 60 days may limit coverage.',
 'Property must be owner-occupied primary residence. Must maintain property in good condition.',
 NULL,
 60, 365, 'Photos of damage, repair estimates, proof of ownership, inspection reports',
 600.00),

-- Personal Property Coverage
('PD-HO456789234-002', 'HO456789234', 'PERSONAL_PROPERTY', 'Personal Property Coverage', 'PROPERTY',
 'Covers your personal belongings inside and outside your home, including furniture, electronics, clothing, and other possessions',
 NULL, 175000.00, NULL, NULL, 2500.00,
 1000.00, 'PER_CLAIM', 1,
 1, 0, 1,
 'This coverage protects your personal belongings, including furniture, electronics, clothing, appliances, and other personal items, both inside and outside your home.',
 'Deductible applies to each claim. Coverage for items away from home is limited. High-value items may require additional coverage.',
 'Furniture, electronics, clothing, appliances, sports equipment, tools, personal items, items temporarily away from home (up to 10% of limit)',
 'Flood, earthquake, normal wear and tear, intentional damage, damage from animals, damage to vehicles (unless covered by separate policy), jewelry over $2,500 (unless scheduled), cash over $200',
 'Coverage limited to actual cash value unless replacement cost endorsement purchased. Jewelry, furs, and collectibles limited to $2,500 unless scheduled.',
 '2024-01-01', '2025-12-31', 0, 60,
 'Worldwide', 'Items away from home limited to 10% of personal property limit. High-value items require scheduling.',
 'Must maintain inventory of high-value items. Must report theft to police within 24 hours.',
 NULL,
 60, 365, 'Inventory of damaged items, receipts or proof of ownership, photos of damaged items, police report (for theft)',
 250.00),

-- Liability Coverage
('PD-HO456789234-003', 'HO456789234', 'LIABILITY', 'Personal Liability Coverage', 'LIABILITY',
 'Covers legal liability for injuries to others or damage to their property that occurs on your property or as a result of your actions',
 NULL, 300000.00, NULL, NULL, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage protects you if someone is injured on your property or if you accidentally damage someone else\'s property. It covers legal defense costs and any settlements or judgments up to the policy limit.',
 'Coverage applies to incidents on your property or caused by your actions. Must report incident within 30 days.',
 'Bodily injury to others, property damage to others, legal defense costs, medical payments to others, personal injury (libel, slander)',
 'Intentional acts, business activities, professional services, damage to property you own or rent, damage from motor vehicles (unless covered by separate policy), damage from aircraft or watercraft',
 'Coverage limited to policy limits. Does not cover punitive damages. Does not cover damage to your own property.',
 '2024-01-01', '2025-12-31', 0, 30,
 'Worldwide', 'Coverage applies worldwide for personal liability. Business activities excluded.',
 'Must maintain property in safe condition. Must cooperate with investigation.',
 NULL,
 30, 365, 'Incident report, medical records (if injury), witness statements, photos, police report (if applicable)',
 200.00),

-- Medical Payments to Others
('PD-HO456789234-004', 'HO456789234', 'MED_PAY', 'Medical Payments to Others', 'MEDICAL',
 'Covers medical expenses for guests injured on your property, regardless of fault',
 NULL, 5000.00, NULL, NULL, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage pays for medical expenses if someone is injured on your property, regardless of who is at fault. This is a no-fault coverage that helps pay for immediate medical expenses.',
 'Coverage applies to injuries on your property. Must report incident within 30 days.',
 'Medical expenses, ambulance costs, dental expenses, funeral expenses (if death results from injury)',
 'Injuries to you or household members, injuries to employees, injuries from business activities, injuries from motor vehicles',
 'Coverage limited to $5,000 per person per incident. Does not cover lost wages or pain and suffering.',
 '2024-01-01', '2025-12-31', 0, 30,
 'Property location and surrounding areas', 'Coverage applies only to injuries on insured property or adjacent areas.',
 'Must maintain property in safe condition.',
 NULL,
 30, 365, 'Medical bills, incident report, witness statements',
 50.00),

-- Loss of Use / Additional Living Expenses
('PD-HO456789234-005', 'HO456789234', 'LOSS_OF_USE', 'Loss of Use Coverage', 'PROPERTY',
 'Covers additional living expenses if you cannot live in your home due to a covered loss',
 NULL, 70000.00, NULL, NULL, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage pays for additional living expenses if your home becomes uninhabitable due to a covered loss. This includes hotel costs, restaurant meals, and other expenses above your normal living costs.',
 'Coverage applies only when home is uninhabitable due to covered loss. Must be temporary relocation.',
 'Hotel costs, restaurant meals, laundry costs, storage costs, pet boarding, increased commuting costs',
 'Expenses not related to covered loss, permanent relocation, expenses covered by other insurance, normal living expenses',
 'Coverage limited to 20% of dwelling coverage limit. Time limit may apply (typically 12-24 months).',
 '2024-01-01', '2025-12-31', 0, 60,
 'Reasonable distance from property', 'Coverage applies only during period of uninhabitability due to covered loss.',
 'Must make reasonable efforts to minimize expenses. Must keep receipts.',
 NULL,
 60, 365, 'Receipts for expenses, proof of uninhabitability, repair timeline estimates',
 100.00);

-- =====================================================
-- Additional Policy Details for Other Policies
-- =====================================================

-- Sample details for commercial liability policy CL789012345
INSERT INTO PolicyDetails (
    policy_detail_id, policy_number, coverage_code, coverage_name, coverage_category, coverage_description,
    limit_per_person, limit_per_occurrence, limit_per_accident, aggregate_limit, sub_limit,
    deductible_amount, deductible_type, deductible_applicable,
    is_included, is_optional, is_active,
    clause_text, terms_conditions, inclusions, exclusions, limitations,
    effective_from, effective_to, waiting_period_days, grace_period_days,
    coverage_territory, coverage_restrictions, special_conditions, endorsements,
    claim_reporting_deadline_days, claim_filing_deadline_days, documentation_required, coverage_premium
) VALUES
('PD-CL789012345-001', 'CL789012345', 'GEN_LIABILITY', 'General Liability', 'LIABILITY',
 'Covers legal liability for bodily injury and property damage to third parties arising from business operations',
 NULL, 1000000.00, NULL, 2000000.00, NULL,
 0.00, 'PER_CLAIM', 0,
 1, 0, 1,
 'This coverage protects your business from claims of bodily injury or property damage to third parties that occur on your premises or as a result of your business operations.',
 'Coverage applies to business operations. Must report incidents within 24 hours.',
 'Bodily injury to customers, property damage to third parties, legal defense costs, medical payments, advertising injury',
 'Intentional acts, professional services, employment practices, pollution, damage to your own property, workers compensation claims',
 'Coverage limited to policy limits. Aggregate limit applies to all claims during policy period.',
 '2024-01-01', '2024-12-31', 0, 0,
 'Business premises and operations', 'Coverage applies to business operations at insured location.',
 'Must maintain safe business premises. Must comply with health and safety regulations.',
 NULL,
 24, 365, 'Incident report, witness statements, medical records, photos, police report (if applicable)',
 2500.00);
