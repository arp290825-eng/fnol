"""
Realistic Policy Clauses Database.

Production-ready policy clauses based on ISO forms and industry standards.
These are used when generating local data files.
"""

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
