"""
Extraction Microservice.

LLM-based extraction from email, documents, images (Vision API).
Output format compatible with Claims Fast Lane frontend.
"""

import base64
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List

from backend.common.config import CLAIMS_FILE, ENV_FILE, DATA_DIR

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}
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
    if ENV_FILE.exists():
        with open(ENV_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))


def _get_openai_client() -> Any:
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
    p = Path(file_path)
    ext = p.suffix.lower()
    if ext in IMAGE_EXTENSIONS:
        return True
    return (mime_type or "").lower().startswith("image/")


def _read_text_file(file_path: str) -> str:
    """Read text file content safely."""
    p = Path(file_path)
    if not p.exists():
        return ""
    try:
        return p.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def extract_from_email(email_body: str, client: Any) -> Dict[str, Any]:
    """
    Extract structured claim fields from email body using OpenAI LLM.
    Returns fields and per-field confidence.
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
  "_confidence": {{ "policyNumber": 0.0-1.0, ... }}
}}
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
        content = response.choices[0].message.content or "{}"
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
        data = json.loads(content)
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


def _extract_schemas() -> str:
    """Return document extraction schemas for LLM prompt."""
    return """
For PoliceReport: incident, reportingOfficer, vehicle1, vehicle2, narrative.
For RepairEstimate: header, customer, vehicle, parts, labor, totals.
For Invoice: invoiceNumber, vendor, customer, lineItems, total.
For MedicalRecord: patientName, dateOfService, provider, diagnosis, treatment.
For IncidentReport: incidentDate, location, reporter, description, witnesses.
For Other: extract relevant keyFields as flat object.
Return ONLY valid JSON: {"type": "...", "confidence": 0.0-1.0, "keyFields": {}}"""


def extract_from_document(filename: str, content: str, client: Any) -> Dict[str, Any]:
    """Classify document and extract key fields using LLM."""
    if not content or not content.strip():
        return {"type": "Other", "confidence": 0.3, "keyFields": {}}

    user_prompt = f"""Classify and extract from this document:
FILENAME: {filename}
CONTENT:
{content[:4000]}{"..." if len(content) > 4000 else ""}
Classify as one of: {", ".join(DOCUMENT_TYPES)}
{_extract_schemas()}"""

    model = os.environ.get("OPENAI_MODEL", "gpt-4o")
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "Extract structured key fields. Return valid JSON only."},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.1,
            max_tokens=1500,
        )
        raw = response.choices[0].message.content or "{}"
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        data = json.loads(raw)
        key_fields = data.get("keyFields", {}) or {}
        return {
            "type": data.get("type", "Other"),
            "confidence": float(data.get("confidence", 0.6)),
            "keyFields": key_fields if isinstance(key_fields, dict) else {},
        }
    except Exception:
        return {"type": "Other", "confidence": 0.5, "keyFields": {}}


def analyze_image_with_vision(image_path: str, client: Any) -> Dict[str, Any]:
    """Analyze image using OpenAI Vision API. Returns structured KPIs and detailed summary."""
    p = Path(image_path)
    if not p.exists():
        return {"_error": f"Image not found: {image_path}"}
    try:
        image_data = base64.b64encode(p.read_bytes()).decode("utf-8")
    except Exception as e:
        return {"_error": str(e)}

    mime = "image/jpeg"
    if p.suffix.lower() == ".png":
        mime = "image/png"
    elif p.suffix.lower() == ".gif":
        mime = "image/gif"
    elif p.suffix.lower() == ".webp":
        mime = "image/webp"

    system_prompt = (
        "You are a senior insurance claims assessor with expertise in damage evaluation and claim decision-making. "
        "Your role is to provide comprehensive, detailed analysis of claim images to help insurance executives make informed decisions. "
        "Analyze the image thoroughly and provide both structured KPIs and a detailed pointwise summary."
    )
    
    user_prompt = """Analyze this insurance claim image and provide:

1. STRUCTURED KPIs (key-value pairs) - Extract measurable data points:
   - For vehicle damage: damage_location, severity (Minor/Moderate/Severe/Critical), affected_components, estimated_repair_complexity, safety_concerns, etc.
   - For property damage: affected_area, severity, extent_of_damage, structural_impact, water_source (if applicable), mold_risk, etc.
   - For any damage type: visible_hazards, immediate_actions_required, documentation_quality, etc.

2. DETAILED SUMMARY - Provide a comprehensive, pointwise analysis for insurance executives:
   - Executive Summary: Brief overview of what the image shows
   - Damage Assessment: Detailed point-by-point breakdown of all visible damage
   - Severity Analysis: Assessment of damage severity with specific observations
   - Risk Factors: Identify any risks, safety concerns, or potential complications
   - Coverage Implications: Observations relevant to policy coverage decisions
   - Recommended Actions: Specific next steps for claims processing
   - Additional Notes: Any other relevant observations for decision-making

Return a JSON object with this structure:
{
  "_confidence": 0.0-1.0,
  "detailed_summary": "Comprehensive pointwise summary for insurance executives (use bullet points or numbered list format)",
  "damage_location": "value or null",
  "severity": "value or null",
  ... (other structured KPIs)
}

The detailed_summary should be extensive, well-organized, and formatted for easy reading by insurance executives making claim decisions."""

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
                        {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{image_data}"}},
                    ],
                },
            ],
            max_tokens=2500,
            temperature=0.1,
        )
        raw = response.choices[0].message.content or "{}"
        raw = raw.strip()
        if raw.startswith("```"):
            parts = raw.split("```")
            raw = parts[1][4:] if parts[1].startswith("json") else parts[1]
        raw = raw.strip()
        data = json.loads(raw)
        if isinstance(data, dict):
            confidence = data.pop("_confidence", None)
            # Preserve detailed_summary separately
            detailed_summary = data.pop("detailed_summary", "")
            clean = {k: v for k, v in data.items() if not str(k).startswith("_")}
            if isinstance(confidence, (int, float)):
                clean["_confidence"] = float(confidence)
            if detailed_summary:
                clean["detailed_summary"] = detailed_summary
            return clean
        return {}
    except json.JSONDecodeError as e:
        return {"_parse_error": str(e)}
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

    result = {"extractedFields": {}, "documents": [], "evidence": [], "errors": []}

    email_fields = extract_from_email(email_body, client)
    if "_error" in email_fields:
        result["errors"].append(f"Email extraction: {email_fields['_error']}")
        email_fields = {}
    elif "_parse_error" in email_fields:
        result["errors"].append(f"Email parse: {email_fields['_parse_error']}")
        email_fields = {}
    result["extractedFields"] = email_fields

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
                doc_entry["content"] = kpis.get("_error") or kpis.get("_parse_error", "Vision failed")
                doc_entry["confidence"] = 0.5
            else:
                img_conf = kpis.pop("_confidence", None)
                # Extract detailed_summary separately and store in content
                detailed_summary = kpis.pop("detailed_summary", "")
                # Store remaining KPIs in keyFields (excluding internal fields)
                doc_entry["keyFields"] = {k: v for k, v in kpis.items() if not str(k).startswith("_")}
                # Store detailed summary in content field for frontend display
                doc_entry["content"] = detailed_summary if detailed_summary else ""
                doc_entry["confidence"] = float(img_conf) if isinstance(img_conf, (int, float)) else 0.85
            result["documents"].append(doc_entry)
        else:
            content = _read_text_file(path)
            if content:
                classification = extract_from_document(name, content, client)
                doc_entry["type"] = classification.get("type", "Other")
                doc_entry["content"] = content
                doc_entry["confidence"] = classification.get("confidence", 0.7)
                doc_entry["keyFields"] = classification.get("keyFields", {})
            else:
                doc_entry["content"] = f"[Binary/non-text: {name}]"
            result["documents"].append(doc_entry)

    for field, display_name in field_names.items():
        val = email_fields.get(field)
        if val is not None and val != "":
            conf = field_conf.get(field)
            conf = max(0.0, min(1.0, float(conf))) if isinstance(conf, (int, float)) else 0.85
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
        print(json.dumps({"error": "Usage: python -m backend.extraction <claim_id>"}), file=sys.stderr)
        return 1

    claim_id = sys.argv[1]
    if not CLAIMS_FILE.exists():
        print(json.dumps({"error": "No ingested claims found"}), file=sys.stderr)
        return 1

    claims = json.loads(CLAIMS_FILE.read_text(encoding="utf-8"))
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
