"""
Policy Clauses Module.

ISO form references and market-standard language for insurance policies.
Clauses align with ISO Personal Auto Policy (PAP), ISO HO-3, and ISO CGL forms.
"""

import re
from typing import Any, Dict, List, Optional

POLICY_CLAUSES: List[Dict[str, Any]] = [
    {
        "clauseId": "PAP-D-001",
        "formRef": "ISO PAP 2018",
        "title": "Part D – Coverage for Damage to Your Auto (Collision)",
        "section": "Part D – Physical Damage",
        "content": 'We will pay for direct and accidental loss to your covered auto caused by collision. "Collision" means the upset of your covered auto or its impact with another vehicle or object. Our limit of liability for loss will be the lesser of: (1) the actual cash value of the stolen or damaged property; or (2) the amount necessary to repair or replace the property with other property of like kind and quality. The deductible shown in the Declarations applies to each loss.',
        "lossTypes": ["collision", "autocollision", "auto"],
        "productTypes": ["auto", "ac"],
    },
    {
        "clauseId": "PAP-A-002",
        "formRef": "ISO PAP 2018",
        "title": "Part A – Liability Coverage (Bodily Injury)",
        "section": "Part A – Liability",
        "content": "We will pay damages for bodily injury or death for which any insured becomes legally responsible because of an auto accident. Damages include prejudgment interest awarded against the insured. We will settle or defend, as we consider appropriate, any claim or suit asking for these damages. In addition to our limit of liability, we will pay all defense costs we incur. Our duty to settle or defend ends when our limit of liability for this coverage has been exhausted by payment of judgments or settlements.",
        "lossTypes": ["collision", "autocollision", "liability", "bodily injury"],
        "productTypes": ["auto", "ac", "cl"],
    },
    {
        "clauseId": "PAP-C-003",
        "formRef": "ISO PAP 2018",
        "title": "Part C – Uninsured Motorists Coverage",
        "section": "Part C – Uninsured Motorists",
        "content": "We will pay compensatory damages which an insured is legally entitled to recover from the owner or operator of an uninsured motor vehicle because of bodily injury sustained by an insured caused by an accident. The owner's or operator's liability for these damages must arise out of the ownership, maintenance or use of the uninsured motor vehicle. Any judgment for damages arising out of a suit brought without our written consent is not binding on us.",
        "lossTypes": ["collision", "autocollision"],
        "productTypes": ["auto", "ac"],
    },
    {
        "clauseId": "HO3-I-004",
        "formRef": "ISO HO-3 2011",
        "title": "Section I – Accidental Discharge or Overflow of Water",
        "section": "Section I – Perils Insured Against (Coverage A & B)",
        "content": "We insure for direct physical loss to property described in Coverages A and B caused by: (8) Accidental discharge or overflow of water or steam from within a plumbing, heating, air conditioning or automatic fire protective sprinkler system or from within a household appliance, on the residence premises. This includes the cost to tear out and replace any part of a building necessary to repair the system or appliance from which the water or steam escaped. We do not cover loss to the system or appliance from which the water or steam escaped, or loss caused by or resulting from freezing except as provided in the Freezing of Plumbing peril. We do not cover loss from constant or repeated seepage or leakage over a period of 14 or more days.",
        "lossTypes": ["water", "propertydamage", "property"],
        "productTypes": ["home", "ho", "property"],
    },
    {
        "clauseId": "HO3-I-005",
        "formRef": "ISO HO-3 2011",
        "title": "Section I – Windstorm or Hail",
        "section": "Section I – Perils Insured Against",
        "content": "We insure for direct physical loss to property described in Coverages A and B caused by: (1) Windstorm or hail. This includes damage to roofs, siding, and other exterior surfaces. Tree limb or debris impact to the roof resulting in water intrusion is covered when windstorm or hail is the proximate cause of the damage. We do not cover loss to the interior of a building or the property inside it unless the wind or hail first damages the building, allowing the wind or hail to enter.",
        "lossTypes": ["water", "propertydamage", "property", "storm"],
        "productTypes": ["home", "ho", "property"],
    },
    {
        "clauseId": "HO3-I-006",
        "formRef": "ISO HO-3 2011",
        "title": "Section I – Deductible",
        "section": "Section I – Conditions",
        "content": "Our payment for loss will be the amount of loss minus your deductible. The deductible applies per occurrence. For loss caused by windstorm or hail, a separate windstorm or hail deductible may apply as shown in the Declarations. This deductible is calculated as a percentage of the Coverage A limit of liability. For all other covered perils, the deductible shown in the Declarations applies. No deductible applies to loss from theft.",
        "lossTypes": ["water", "fire", "theft", "propertydamage", "collision"],
        "productTypes": ["home", "ho", "auto", "ac"],
    },
    {
        "clauseId": "HO3-I-007",
        "formRef": "ISO HO-3 2011",
        "primaryPeril": "fire",
        "title": "Section I – Fire or Lightning",
        "section": "Section I – Perils Insured Against",
        "content": "We insure for direct physical loss to property described in Coverages A and B caused by: (2) Fire or lightning. This includes loss from smoke, scorching, or other damage caused by fire or lightning. We also cover loss from water or other substances used to extinguish the fire. We cover the cost of debris removal resulting from a loss we cover. We do not cover loss caused by fire resulting from agricultural smudging or industrial operations.",
        "lossTypes": ["fire"],
        "productTypes": ["home", "ho", "property"],
    },
    {
        "clauseId": "HO3-I-008",
        "formRef": "ISO HO-3 2011",
        "primaryPeril": "theft",
        "title": "Section I – Theft",
        "section": "Section I – Perils Insured Against",
        "content": "We insure for direct physical loss to property described in Coverages A and B caused by: (11) Theft, including attempted theft. We also cover loss of property from a known place when it is likely that the property has been stolen. We do not cover loss caused by theft committed by an insured. Proof of loss may require you to furnish a copy of the police report. We may require you to submit to examination under oath.",
        "lossTypes": ["theft"],
        "productTypes": ["home", "ho", "property"],
    },
    {
        "clauseId": "CGL-A-009",
        "formRef": "ISO CG 00 01",
        "title": "Coverage A – Bodily Injury and Property Damage Liability",
        "section": "Coverage A – Insuring Agreement",
        "content": 'We will pay those sums that the insured becomes legally obligated to pay as damages because of "bodily injury" or "property damage" to which this insurance applies. We will have the right and duty to defend the insured against any "suit" seeking those damages. However, we will have no duty to defend the insured against any "suit" seeking damages for "bodily injury" or "property damage" to which this insurance does not apply. We may, at our discretion, investigate any "occurrence" and settle any claim or "suit" that may result. Our duty to settle or defend ends when we have used up the applicable limit of insurance in the payment of judgments or settlements.',
        "lossTypes": ["liability", "slip and fall", "bodily injury"],
        "productTypes": ["commercial", "cl"],
    },
    {
        "clauseId": "CGL-A-010",
        "formRef": "ISO CG 00 01",
        "title": "Coverage A – Premises and Operations",
        "section": "Coverage A – Bodily Injury and Property Damage",
        "content": 'This insurance applies to "bodily injury" and "property damage" only if: (1) The "bodily injury" or "property damage" is caused by an "occurrence" that takes place in the "coverage territory"; (2) The "bodily injury" or "property damage" occurs during the policy period; and (3) Prior to the policy period, no insured listed under Paragraph 1. of Section II – Who Is An Insured and no "employee" authorized by you to give or receive notice of an "occurrence" or claim, knew that the "bodily injury" or "property damage" had occurred. "Occurrence" means an accident, including continuous or repeated exposure to substantially the same general harmful conditions. Premises liability, including slip, trip and fall incidents on your premises, falls within this coverage.',
        "lossTypes": ["liability", "slip and fall", "premises"],
        "productTypes": ["commercial", "cl"],
    },
    {
        "clauseId": "GEN-011",
        "formRef": "Standard Conditions",
        "title": "Duties in the Event of Loss",
        "section": "Conditions – Notice and Cooperation",
        "content": "You must see that the following are done in the event of loss: (a) Give prompt notice to us or our agent; (b) Give a description of how, when and where the loss occurred; (c) Take all reasonable steps to protect the property from further damage, and keep a record of your expenses for consideration in the settlement of the claim; (d) As often as we reasonably require, show the damaged property and provide us with records and documents we request; (e) Submit to examination under oath if we require it.",
        "lossTypes": ["collision", "water", "fire", "theft", "liability", "propertydamage", "other"],
        "productTypes": ["auto", "home", "commercial", "ac", "ho", "cl"],
    },
    {
        "clauseId": "GEN-012",
        "formRef": "Standard Conditions",
        "title": "Loss Payment",
        "section": "Conditions – Settlement",
        "content": "We will pay for covered loss within 30 days after we receive your proof of loss, if you have complied with all of the terms of this policy and: (a) We have reached agreement with you on the amount of loss; or (b) An appraisal award has been made. We will pay only for the actual cash value of the damage until actual repair or replacement is complete. Once actual repair or replacement is complete, we will pay the amount you actually spend that is necessary to complete the repair or replacement.",
        "lossTypes": ["collision", "water", "fire", "theft", "liability", "other"],
        "productTypes": ["auto", "home", "commercial", "ac", "ho", "cl"],
    },
]

CONFIDENCE_THRESHOLD_HIGH = 0.8
CONFIDENCE_THRESHOLD_MEDIUM = 0.6


def _infer_product_types(policy_number: str) -> List[str]:
    """Infer product types from policy number prefix."""
    p = (policy_number or "").upper().replace("*", "").strip()
    if p.startswith("AC") or p.startswith("AUTO"):
        return ["auto", "ac"]
    if p.startswith("HO") or p.startswith("HP") or p.startswith("PROP"):
        return ["home", "ho", "property"]
    if p.startswith("CL") or p.startswith("GL") or p.startswith("COM"):
        return ["commercial", "cl"]
    return ["auto", "home", "commercial", "ac", "ho", "cl"]


def _infer_loss_types(loss_type: str, description: str = "") -> List[str]:
    """Infer loss types from claim text."""
    types_set: set = set()
    lt = (loss_type or "").lower()
    desc = (description or "").lower()
    combined = f"{lt} {desc}"

    if re.search(r"\b(collision|auto|autocollision|accident|vehicle|car)\b", combined):
        types_set.update(["collision", "autocollision", "auto"])
    if re.search(r"\b(water|leak|flood|storm|roof|intrusion|ceiling|pipe)\b", combined):
        types_set.update(["water", "propertydamage", "property"])
    if re.search(r"\b(fire|smoke)\b", combined):
        types_set.update(["fire", "propertydamage"])
    if re.search(r"\b(theft|stolen)\b", combined):
        types_set.update(["theft", "propertydamage"])
    if re.search(r"\b(liability|slip|fall|premises|customer|restaurant|business)\b", combined):
        types_set.update(["liability", "slip and fall", "premises"])
    if re.search(r"\b(property|home|house|property damage)\b", combined):
        types_set.update(["property", "propertydamage"])

    if not types_set:
        if lt:
            types_set.add(lt.replace(" ", ""))
        types_set.add("other")
    return list(types_set)


def _compute_similarity(
    clause: Dict[str, Any],
    loss_types: List[str],
    product_types: List[str],
) -> float:
    """Compute similarity score for clause matching."""
    claim_loss_set = set(t.lower() for t in loss_types)
    primary_peril = clause.get("primaryPeril")
    if primary_peril:
        required = primary_peril.lower()
        if required not in claim_loss_set and not any(
            required in lt or lt in required for lt in claim_loss_set
        ):
            return 0.0

    score = 0.5
    clause_loss = [t.lower() for t in clause.get("lossTypes", [])]
    clause_product = [t.lower() for t in clause.get("productTypes", [])]
    for lt in loss_types:
        if any(c in lt or lt in c for c in clause_loss):
            score += 0.28
            break
    for pt in product_types:
        if any(c in pt or pt in c for c in clause_product):
            score += 0.2
            break
    return min(0.97, score)


def get_policy_grounding(extracted_fields: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Get policy grounding (matching clauses) based on extracted claim fields.

    Returns list of policy hits with clauseId, title, snippet, score, rationale.
    """
    policy_number = str(extracted_fields.get("policyNumber", "")).replace("*", "").strip()
    loss_type = str(extracted_fields.get("lossType", "Other")).strip()
    description = str(extracted_fields.get("description", ""))

    product_types = _infer_product_types(policy_number) if policy_number else ["auto", "home", "commercial", "ac", "ho", "cl"]
    loss_types = _infer_loss_types(loss_type, description)

    scored: List[Dict[str, Any]] = []
    for clause in POLICY_CLAUSES:
        similarity = _compute_similarity(clause, loss_types, product_types)
        rationale_parts = [clause["formRef"]]
        if loss_type:
            rationale_parts.append(f"Loss type: {loss_type}")
        if policy_number:
            rationale_parts.append("Product type applicable")
        rationale = " • ".join(rationale_parts)
        content = clause.get("content", "")
        snippet = content[:140] + ("..." if len(content) > 140 else "")
        scored.append({
            **clause,
            "similarity": similarity,
            "rationale": rationale,
            "snippet": snippet,
        })

    scored.sort(key=lambda x: x["similarity"], reverse=True)
    hits = [s for s in scored[:6] if s["similarity"] >= 0.6]

    return [
        {
            "clauseId": c["clauseId"],
            "title": c["title"],
            "snippet": c["snippet"],
            "content": c.get("content"),
            "section": c.get("section"),
            "score": c["similarity"],
            "similarity": c["similarity"],
            "rationale": c["rationale"],
            "sourceRef": c["formRef"],
            "sourceDocument": "Policy Schedule",
        }
        for c in hits
    ]
