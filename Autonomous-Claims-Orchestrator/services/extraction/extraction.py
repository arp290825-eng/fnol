#!/usr/bin/env python3
"""
Information Extraction Module for FNOL Claims Processing.

Extracts structured information from:
- Email body (using OpenAI LLM)
- Text documents (classification and key field extraction)
- Images (using OpenAI Vision for damage assessment, summaries)

Follows PEP 8 and proper Python coding conventions.
Output format is compatible with the Next.js Claims Fast Lane app.

Usage:
    python information_extraction.py <claim_id>

Environment variables:
    OPENAI_API_KEY (required for LLM/Vision)
    OPENAI_MODEL (default: gpt-4o for vision support)
"""

import base64
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# Project paths (script lives in services/extraction/)
_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = _PROJECT_ROOT / "data"
INGESTED_DIR = DATA_DIR / "ingested-attachments"

# Supported image extensions for Vision API
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}

# Document type classification
DOCUMENT_TYPES = [
    "PoliceReport",
    "RepairEstimate",
    "Invoice",
    "MedicalRecord",
    "IncidentReport",
    "DamagePhoto",
    "Other",
]


def _load_env() -> None:
    """Load environment variables from .env if present."""
    env_path = _PROJECT_ROOT / ".env"
    if env_path.exists():
        with open(env_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip('"\''))


def _get_openai_client():
    """Get OpenAI client (lazy import)."""
    try:
        from openai import OpenAI
        api_key = os.environ.get("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set")
        return OpenAI(api_key=api_key)
    except ImportError as e:
        raise ImportError("Install openai: pip install openai") from e


def _is_image_file(file_path: str, mime_type: str) -> bool:
    """Check if file is an image suitable for Vision API."""
    path = Path(file_path)
    ext = path.suffix.lower()
    if ext in IMAGE_EXTENSIONS:
        return True
    return mime_type.lower().startswith("image/")


def _read_text_file(file_path: str) -> str:
    """Read text file content safely."""
    path = Path(file_path)
    if not path.exists():
        return ""
    try:
        return path.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def extract_from_email(email_body: str, client: Any) -> Dict[str, Any]:
    """
    Extract structured claim fields from email body using OpenAI LLM.
    Returns fields and per-field confidence for real-time display.
    """
    system_prompt = (
        "You are an expert insurance claims processor. Extract structured claim "
        "information from the provided FNOL email. Be precise and only extract "
        "information that is explicitly stated or can be confidently inferred. "
        "Return valid JSON only. Include a confidence (0.0-1.0) for each extracted field."
    )
    user_prompt = f"""Extract claim fields from this FNOL email:

{email_body}

Return a JSON object with this structure (use null for missing fields):
{{
  "policyNumber": "value or null",
  "claimantName": "value or null",
  "contactEmail": "value or null",
  "contactPhone": "value or null",
  "lossDate": "YYYY-MM-DD or null",
  "lossType": "Collision|Water|Fire|Theft|Liability|Other or null",
  "lossLocation": "value or null",
  "description": "value or null",
  "vehicleInfo": {{}} or null,
  "propertyAddress": "value or null",
  "estimatedAmount": number or null,
  "_confidence": {{
    "policyNumber": 0.0-1.0,
    "claimantName": 0.0-1.0,
    ...one per field, based on how explicitly/inferrably the value appears
  }}
}}

For _confidence: 0.9+ if explicitly stated, 0.7-0.85 if clearly inferred, 0.5-0.7 if uncertain.
Return ONLY valid JSON, no markdown."""

    model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        content = response.choices[0].message.content
        content = re.sub(r"^```(?:json)?\s*", "", content or "")
        content = re.sub(r"\s*```$", "", content)
        data = json.loads(content or "{}")
        # Ensure _confidence exists; compute from presence if missing
        field_conf = data.get("_confidence") or {}
        for k in ("policyNumber", "claimantName", "contactEmail", "contactPhone",
                  "lossDate", "lossType", "lossLocation", "description"):
            if k not in field_conf and k in data and data[k] not in (None, ""):
                field_conf[k] = 0.85
        data["_confidence"] = field_conf
        return data
    except json.JSONDecodeError as e:
        return {"_parse_error": str(e)}
    except Exception as e:
        return {"_error": str(e)}


def _extract_police_report_schema() -> str:
    """Return structured schema for Police Report extraction."""
    return """{
  "incident": {"caseNumber": "...", "date": "...", "time": "...", "location": "..."},
  "reportingOfficer": "...",
  "conditions": {"weather": "...", "roadSurface": "..."},
  "vehicle1": {"driver": "...", "vehicle": "...", "licensePlate": "...", "vin": "...", "damage": "...", "insurance": "..."},
  "vehicle2": {"driver": "...", "vehicle": "...", "licensePlate": "...", "vin": "...", "damage": "...", "insurance": "..."},
  "narrative": "...",
  "contributingFactors": ["..."],
  "citations": ["..."],
  "witnesses": [{"name": "...", "contact": "..."}],
  "injuries": "...",
  "propertyDamage": "..."
}"""


def _extract_repair_estimate_schema() -> str:
    """Return structured schema for Repair Estimate extraction."""
    return """{
  "header": {"date": "...", "estimateNumber": "...", "shop": "..."},
  "customer": {"name": "...", "phone": "...", "email": "..."},
  "vehicle": {"year": "...", "make": "...", "model": "...", "vin": "...", "mileage": "...", "color": "..."},
  "insurance": {"company": "...", "policyNumber": "...", "claimNumber": "..."},
  "damageAssessment": "...",
  "parts": [{"item": "...", "amount": "..."}],
  "labor": [{"operation": "...", "hours": "...", "rate": "...", "amount": "..."}],
  "materials": [{"item": "...", "amount": "..."}],
  "totals": {"partsSubtotal": "...", "laborSubtotal": "...", "materialsSubtotal": "...", "tax": "...", "total": "..."},
  "notes": ["..."]
}"""


def _extract_invoice_schema() -> str:
    """Return structured schema for Invoice extraction."""
    return """{
  "invoiceNumber": "...",
  "invoiceDate": "...",
  "vendor": {"name": "...", "address": "...", "phone": "...", "email": "..."},
  "customer": {"name": "...", "address": "...", "phone": "...", "email": "..."},
  "lineItems": [{"description": "...", "quantity": "...", "unitPrice": "...", "amount": "..."}],
  "subtotal": "...",
  "tax": "...",
  "total": "...",
  "paymentTerms": "...",
  "dueDate": "...",
  "notes": "..."
}"""


def _extract_medical_record_schema() -> str:
    """Return structured schema for Medical Record extraction."""
    return """{
  "patientName": "...",
  "dateOfService": "...",
  "provider": {"name": "...", "facility": "...", "address": "..."},
  "diagnosis": "...",
  "treatment": "...",
  "procedures": ["..."],
  "medications": ["..."],
  "injuries": "...",
  "notes": "..."
}"""


def _extract_incident_report_schema() -> str:
    """Return structured schema for Incident Report extraction."""
    return """{
  "incidentDate": "...",
  "incidentTime": "...",
  "location": "...",
  "reporter": {"name": "...", "contact": "..."},
  "description": "...",
  "witnesses": [{"name": "...", "contact": "..."}],
  "injuries": "...",
  "propertyDamage": "...",
  "actionsTaken": "..."
}"""


def extract_from_document(
    filename: str,
    content: str,
    client: Any,
) -> Dict[str, Any]:
    """
    Classify document and extract structured key fields using LLM.

    Uses type-specific schemas for PoliceReport and RepairEstimate.

    Args:
        filename: Original filename.
        content: Document text content.
        client: OpenAI client instance.

    Returns:
        Dict with type, confidence, keyFields (structured).
    """
    if not content or not content.strip():
        return {"type": "Other", "confidence": 0.3, "keyFields": {}}

    system_prompt = (
        "You are a document classification and extraction expert for insurance claims. "
        "Classify the document type and extract key fields in a structured format. "
        "Use null for missing fields. For arrays, use empty list if none found."
    )
    user_prompt = f"""Classify and extract structured information from this document:

FILENAME: {filename}
CONTENT:
{content[:4000]}{"..." if len(content) > 4000 else ""}

1. Classify as one of: {", ".join(DOCUMENT_TYPES)}
2. Extract key fields using the structure for the classified type:

For PoliceReport:
{_extract_police_report_schema()}

For RepairEstimate:
{_extract_repair_estimate_schema()}

For Invoice:
{_extract_invoice_schema()}

For MedicalRecord:
{_extract_medical_record_schema()}

For IncidentReport:
{_extract_incident_report_schema()}

For Other: extract relevant keyFields as flat object (e.g. {{"field": "value", "key": "value"}}).
Always return structured keyFields - never raw paragraphs. Use null for missing fields, [] for empty arrays.

Return ONLY valid JSON: {{"type": "...", "confidence": 0.0-1.0, "keyFields": {{}}}}"""

    model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        raw = response.choices[0].message.content or "{}"
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)
        key_fields = data.get("keyFields", {})
        if not isinstance(key_fields, dict):
            key_fields = {}
        return {
            "type": data.get("type", "Other"),
            "confidence": float(data.get("confidence", 0.6)),
            "keyFields": key_fields,
        }
    except Exception:
        return {"type": "Other", "confidence": 0.5, "keyFields": {}}


def analyze_image_with_vision(image_path: str, client: Any) -> Dict[str, Any]:
    """
    Analyze image using OpenAI Vision API. Extracts structured KPIs
    important for Insurance Executives—no paragraph summaries.

    Returns:
        Dict of KPIs (key-value pairs) for vehicle damage, water/property damage, etc.
    """
    path = Path(image_path)
    if not path.exists():
        return {"_error": f"Image not found: {image_path}"}

    try:
        with open(path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
    except Exception as e:
        return {"_error": f"Could not read image: {e}"}

    mime = "image/jpeg"
    if path.suffix.lower() in (".png",):
        mime = "image/png"
    elif path.suffix.lower() in (".gif",):
        mime = "image/gif"
    elif path.suffix.lower() in (".webp",):
        mime = "image/webp"

    system_prompt = """You are an insurance claims assessor. Analyze the image and extract STRUCTURED KPIs (key-value pairs) only.
DO NOT write paragraphs. Output ONLY a JSON object with relevant keys for the image type.
Include "_confidence": 0.0-1.0 (overall confidence in your assessment, based on image clarity and how many KPIs you could determine).

For VEHICLE/CAR DAMAGE, extract: car_color, make_model (if visible), damage_location, damage_type, severity, paint_transfer, structural_damage, airbag_deployment, glass_damage, tire_damage, debris_visible, lighting_conditions.

For WATER/LEAK DAMAGE: leakage_origin, affected_area, water_stain_pattern, severity, mold_mildew_visible, ceiling_wall_floor, plumbing_visible, extent_sqft (if estimable).

For PROPERTY/FIRE DAMAGE: damage_type, affected_area, severity, smoke_damage, structural_impact, salvageable_items.

For OTHER: extract whatever KPIs an insurance executive would need.
Use null for unknown. Return ONLY valid JSON."""

    user_prompt = (
        "Extract KPIs from this claim image. Return ONLY a JSON object with keys appropriate "
        "to the image type (vehicle damage, water damage, property damage, etc.). No paragraphs."
    )

    model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:{mime};base64,{image_data}"},
                        },
                    ],
                },
            ],
            max_tokens=800,
        )
        raw = response.choices[0].message.content or "{}"
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()
        data = json.loads(raw)
        if isinstance(data, dict):
            confidence = data.pop("_confidence", None)
            clean = {k: v for k, v in data.items() if not str(k).startswith("_")}
            if isinstance(confidence, (int, float)):
                clean["_confidence"] = float(confidence)
            elif confidence is not None:
                clean["_confidence"] = 0.85
            return clean
        return {}
    except json.JSONDecodeError as e:
        return {"_parse_error": str(e), "raw": raw[:200]}
    except Exception as e:
        return {"_error": str(e)}


def extract_claim_information(
    claim_id: str,
    email_body: str,
    attachments: List[Dict[str, Any]],
) -> Dict[str, Any]:
    """
    Main entry: extract information from email and all attachments.

    Args:
        claim_id: Ingested claim ID.
        email_body: Full email text.
        attachments: List of {"name", "path", "mimeType", "size"}.

    Returns:
        Complete extraction result for ClaimData assembly.
    """
    _load_env()
    client = _get_openai_client()

    result = {
        "extractedFields": {},
        "documents": [],
        "evidence": [],
        "errors": [],
    }

    # 1. Extract from email
    email_fields = extract_from_email(email_body, client)
    if "_error" in email_fields:
        result["errors"].append(f"Email extraction: {email_fields['_error']}")
        email_fields = {}
    elif "_parse_error" in email_fields:
        result["errors"].append(f"Email parse: {email_fields['_parse_error']}")
        email_fields = {}

    result["extractedFields"] = email_fields

    # 2. Process each attachment
    doc_sources = []
    for idx, att in enumerate(attachments):
        name = att.get("name", f"attachment_{idx}")
        path = att.get("path", "")
        mime = att.get("mimeType", "")

        doc_entry = {
            "id": f"doc_{idx}",
            "name": name,
            "mimeType": mime,
            "type": "Other",
            "content": "",
            "confidence": 0.7,
            "metadata": {},
        }

        if _is_image_file(path, mime):
            kpis = analyze_image_with_vision(path, client)
            doc_entry["type"] = "DamagePhoto"
            if "_error" in kpis or "_parse_error" in kpis:
                doc_entry["content"] = kpis.get("_error") or kpis.get("_parse_error", "Vision analysis failed")
                doc_entry["confidence"] = 0.5
            else:
                img_conf = kpis.pop("_confidence", None)
                doc_entry["keyFields"] = {k: v for k, v in kpis.items() if not str(k).startswith("_")}
                doc_entry["content"] = ""
                doc_entry["confidence"] = (
                    float(img_conf) if isinstance(img_conf, (int, float)) else
                    min(0.9, 0.6 + 0.03 * len([v for v in doc_entry["keyFields"].values() if v]))  # realtime from KPIs
                )
            doc_sources.append(f"[{name}]\n{json.dumps(kpis) if isinstance(kpis, dict) else str(kpis)}")
        else:
            content = _read_text_file(path)
            if content:
                classification = extract_from_document(name, content, client)
                doc_entry["type"] = classification.get("type", "Other")
                doc_entry["content"] = content
                doc_entry["confidence"] = classification.get("confidence", 0.7)
                doc_entry["keyFields"] = classification.get("keyFields", {})
                doc_sources.append(f"[{name}]\n{content[:1500]}")
            else:
                doc_entry["content"] = f"[Binary/non-text: {name}]"

        result["documents"].append(doc_entry)

    # 3. Build evidence from extracted fields (real-time confidence from extraction)
    field_names = {
        "policyNumber": "Policy Number",
        "claimantName": "Claimant Name",
        "contactEmail": "Contact Email",
        "contactPhone": "Contact Phone",
        "lossDate": "Loss Date",
        "lossType": "Loss Type",
        "lossLocation": "Loss Location",
        "description": "Description",
    }
    field_conf = email_fields.get("_confidence") or {}
    for field, display_name in field_names.items():
        val = email_fields.get(field)
        if val is not None and val != "":
            conf = field_conf.get(field)
            if isinstance(conf, (int, float)):
                conf = max(0.0, min(1.0, float(conf)))
            else:
                conf = 0.85
            result["evidence"].append({
                "field": field,
                "fieldName": display_name,
                "value": str(val),
                "confidence": conf,
                "sourceLocator": "email_content",
                "rationale": "Extracted from email and documents",
            })

    return result


def main() -> int:
    """CLI entry: run extraction for a claim and output JSON."""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python information_extraction.py <claim_id>"}), file=sys.stderr)
        return 1

    claim_id = sys.argv[1]
    claims_file = DATA_DIR / "ingested-claims.json"

    if not claims_file.exists():
        print(json.dumps({"error": "No ingested claims found"}), file=sys.stderr)
        return 1

    claims = json.loads(claims_file.read_text(encoding="utf-8"))
    claim = next((c for c in claims if c.get("id") == claim_id), None)
    if not claim:
        print(json.dumps({"error": f"Claim {claim_id} not found"}), file=sys.stderr)
        return 1

    result = extract_claim_information(
        claim_id=claim_id,
        email_body=claim.get("emailBody", ""),
        attachments=claim.get("attachments", []),
    )
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
