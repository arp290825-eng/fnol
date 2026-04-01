"""
FAQ Auto-Resolution Service.

Uses LangChain agents to:
1. Detect if an email is an FAQ query
2. Answer FAQ questions from FAQ.csv
3. For customer-data questions (policy number, expiry, coverage, deductible), fetch from DB and answer
4. Send automated email responses
"""

import csv
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from backend.common.config import ENV_FILE, PROJECT_ROOT

# FAQ CSV file location - Use environment variable with fallback
_FAQ_CSV_FILE_ENV = os.getenv("FAQ_CSV_FILE")
if _FAQ_CSV_FILE_ENV:
    FAQ_CSV_FILE = Path(_FAQ_CSV_FILE_ENV)
else:
    FAQ_CSV_FILE = PROJECT_ROOT / "data" / "FAQ.csv"


def _load_env() -> None:
    """Load env vars from .env if present."""
    if ENV_FILE.exists():
        with open(ENV_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))


def _load_faq_data() -> List[Dict[str, str]]:
    """Load FAQ data from CSV file."""
    faqs: List[Dict[str, str]] = []
    
    if not FAQ_CSV_FILE.exists():
        print(f"Warning: FAQ.csv not found at {FAQ_CSV_FILE}", file=sys.stderr)
        return faqs
    
    try:
        with open(FAQ_CSV_FILE, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                question = row.get("Question", "").strip()
                answer = row.get("Answer", "").strip()
                category = row.get("Category", "").strip()
                if question and answer:
                    faqs.append({
                        "question": question,
                        "answer": answer,
                        "category": category,
                    })
    except Exception as e:
        print(f"Error loading FAQ.csv: {e}", file=sys.stderr)
    
    return faqs


def _is_faq_query(subject: str, body: str) -> bool:
    """
    Use LangChain agent to detect if email is an FAQ query.
    
    Returns True if the email appears to be asking a question that could
    be answered by FAQ, rather than filing a new claim.
    """
    _load_env()
    
    # First, check for strong indicators of FAQ queries
    text = f"{subject} {body}".lower()

    # Loss / FNOL narrative — not FAQ (do this before broad "when" + "policy" heuristics)
    if re.search(
        r"\b(report|reporting)\s+(a\s+|an\s+)?(car\s+|auto\s+)?(accident|collision|crash|incident)\b",
        text,
    ):
        return False
    if re.search(r"\b(car|auto|vehicle)\s+(accident|collision|crash)\b", text):
        return False
    if re.search(r"\bpolice\s+(responded|came|arrived|report)\b", text) or re.search(
        r"\b(ambulance|injur|hospital|towed)\b", text
    ):
        return False
    if re.search(r"\b(damage|damaged)\b", text) and re.search(
        r"\b(accident|collision|crash|hit\s+(by|my)|rear-?end)\b", text
    ):
        return False
    
    # Questions about HOW to file a claim are FAQ, not claim submission (e.g. "How to file a claim?", "How do I file a claim?")
    if re.search(r"\bhow\s+(to|do\s+i|can\s+i)\s+file\s+(a\s+)?claim\b", text):
        return True
    if re.search(r"\bhow\s+(to|do\s+i|can\s+i)\s+submit\s+(a\s+)?claim\b", text):
        return True
    if re.search(r"\bhow\s+(to|do\s+i|can\s+i)\s+(i\s+)?file\b", text) and re.search(r"\bclaim\b", text):
        return True

    # Policy expiry / renewal questions only — NOT narrative "when ... accident" + "policy number" elsewhere
    if re.search(r"\bwhen\b", text) and re.search(r"\b(poli?cy|poicy)\b", text):
        if re.search(
            r"\bwhen\s+(is|does|will|do|are|can)\s+(my\s+)?(the\s+)?poli?cy\b",
            text,
        ) or re.search(r"\bwhen\s+my\s+poli?cy\b", text):
            return True
        if re.search(r"\bwhen\b", text) and re.search(r"\b(expir|expiration|expire|renew)\b", text):
            return True
    if re.search(r"\b(what is my (policy|poicy) number|what is my deductible|is .+ included in my (policy|poicy))\b", text):
        return True
    if re.search(r"\b(help\s+me\s+)?find\s+(my\s+)?(policy|poicy)\s+number\b", text):
        return True

    # FAQ indicators: questions, "how to", "what is", "can I", etc.
    faq_indicators = [
        r"\bhow\s+(do|can|should|to|do I|does)\b",
        r"\bwhat\s+(is|are|does|do|can|should)\b",
        r"\bwhen\s+(do|can|should|does|will)\b",
        r"\bwhere\s+(do|can|should|does)\b",
        r"\bwhy\s+(do|can|should|does|is|are)\b",
        r"\bcan\s+I\b",
        r"\bshould\s+I\b",
        r"\bis\s+it\s+(possible|required|necessary)\b",
        r"\bdo\s+I\s+need\s+to\b",
        r"\bquestion\b",
        r"\bquestions\b",
        r"\binquiry\b",
        r"\bhelp\s+with\b",
        r"\bneed\s+information\b",
        r"\bwant\s+to\s+know\b",
        r"\bexplain\b",
        r"\bclarification\b",
        r"\bunderstand\b",
    ]
    
    # Strong claim indicators that override FAQ detection
    claim_indicators = [
        r"\bfile\s+a\s+claim\b",
        r"\bsubmit\s+a\s+claim\b",
        r"\breport\s+a\s+claim\b",
        r"\bnew\s+claim\b",
        r"\bclaim\s+number\b",
        r"\bincident\s+report\b",
        r"\baccident\s+report\b",
        r"\bdamage\s+report\b",
        r"\battached\s+(document|file|photo|image)\b",
        r"\bsee\s+attachment\b",
    ]
    
    # If strong claim indicators are present, it's likely a claim, not FAQ
    for pattern in claim_indicators:
        if re.search(pattern, text, re.IGNORECASE):
            return False
    
    # Check for FAQ indicators
    has_faq_indicators = False
    for pattern in faq_indicators:
        if re.search(pattern, text, re.IGNORECASE):
            has_faq_indicators = True
            break
    
    # If no FAQ indicators, likely not an FAQ
    if not has_faq_indicators:
        return False
    
    # Use LLM for final classification
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # Without API key, use keyword-based detection
        return has_faq_indicators
    
    try:
        from openai import OpenAI
        import re as regex_module
        
        client = OpenAI(api_key=api_key)
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        
        prompt = f"""You are an email classifier. Determine if this email is asking a question that could be answered by FAQ (frequently asked questions), or if it's filing a new claim/incident.

An FAQ query typically:
- Asks "how to", "what is", "can I", "should I", "when", "where", "why" questions
- Seeks information or clarification about policies, procedures, or coverage
- Does NOT include incident details, damage reports, or claim filing requests
- Does NOT have attachments with claim documents

A claim filing typically:
- Reports a new incident, accident, or loss
- Includes details about damage, loss, or injury
- Requests to file/submit a claim
- May include attachments (photos, documents, reports)

Email Subject: {subject}
Email Body: {body[:2000]}

Respond with ONLY "FAQ" if this is an FAQ query, or "CLAIM" if this is a claim filing."""
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an email classifier. Respond with ONLY 'FAQ' or 'CLAIM'.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=10,
            temperature=0,
        )
        
        answer = (response.choices[0].message.content or "").strip().upper()
        is_faq = answer.startswith("FAQ")
        
        return is_faq
        
    except Exception as e:
        print(f"LLM FAQ detection error: {e}", file=sys.stderr)
        # Fallback to keyword-based detection
        return has_faq_indicators


# ---------------------------------------------------------------------------
# Customer-data FAQ: fetch from DB (policy number, expiry, coverage, deductible)
# ---------------------------------------------------------------------------

def _classify_customer_data_intent(question_text: str) -> Optional[str]:
    """
    Classify if the question is a customer-data query: policy_number, policy_expiry,
    coverage_included, or deductible. Returns intent key or None.
    Tolerates common typos (e.g. "poicy" for "policy").
    """
    text = (question_text or "").lower().strip()
    # Normalize common typos for matching (e.g. "poicy" -> "policy")
    text_norm = re.sub(r"\bpoicy\b", "policy", text, flags=re.IGNORECASE)
    # Help me find my policy number / what is my policy number
    if re.search(r"\b(help\s+me\s+)?find\s+(my\s+)?poli?cy\s+number\b", text_norm):
        return "policy_number"
    if re.search(r"\bwhat\s+is\s+my\s+poli?cy\s+number\b", text_norm):
        return "policy_number"
    if re.search(r"\bpoli?cy\s+number\s+\?\s*$", text_norm):
        return "policy_number"
    # When is my policy expiring / when does my policy expire / when will my policy #... expire
    if re.search(r"\bwhen\s+(is|does|will)\s+(my\s+)?poli?cy\s+.*\bexpir", text_norm):
        return "policy_expiry"
    if re.search(r"\bwhen\s+my\s+poli?cy\s+.*\b(expire|expir)", text_norm):
        return "policy_expiry"
    if re.search(r"\bpoli?cy\s+.*\bexpir", text_norm) and re.search(r"\bwhen\b", text_norm):
        return "policy_expiry"
    # Is X included in my policy (e.g. engine protection)
    if re.search(r"\bis\s+.+\s+(included|covered)\s+in\s+my\s+poli?cy\b", text_norm):
        return "coverage_included"
    if re.search(r"\b(is|does)\s+my\s+poli?cy\s+(include|cover)\b", text_norm):
        return "coverage_included"
    if re.search(r"\bdo\s+i\s+have\s+.+\s+coverage\b", text_norm):
        return "coverage_included"
    # What is my deductible
    if re.search(r"\bwhat\s+is\s+my\s+deductible\b", text_norm):
        return "deductible"
    if re.search(r"\bdeductible\s+\?\s*$", text_norm):
        return "deductible"
    if re.search(r"\bhow\s+much\s+is\s+my\s+deductible\b", text_norm):
        return "deductible"
    return None


def _extract_policy_number_from_body(body: str) -> Optional[str]:
    """Extract policy number from email body if customer mentioned it. Tolerates typo 'poicy'."""
    if not body:
        return None
    # Policy #XXX or Poicy # AC789456123 (typo) or policy number XXX
    m = re.search(r"\b(?:policy|poicy)\s*#?\s*[:\s]*([A-Z0-9]{6,20})\b", body, re.IGNORECASE)
    if m:
        return m.group(1).strip().upper()
    m = re.search(r"\b(?:policy|poicy)\s+number\s*[:\s]*([A-Z0-9]{6,20})\b", body, re.IGNORECASE)
    if m:
        return m.group(1).strip().upper()
    return None


def _answer_customer_data_query(
    intent: str,
    from_addr: str,
    question_text: str,
) -> Optional[str]:
    """
    Answer customer-data FAQ by querying the policy DB.
    Returns answer text or None if customer not found or no data.
    """
    try:
        from backend.decision.policy_grounding_local import (
            find_customer_by_email,
            get_policies_for_customer,
            get_policy_by_number,
            get_policy_details_by_policy_number,
        )
    except ImportError:
        return None

    # Resolve: by email (from_addr) and/or by policy number mentioned in body (e.g. "When will Policy # AC789456123 expire?")
    customer = find_customer_by_email(from_addr)
    policy_number_from_body = _extract_policy_number_from_body(question_text)
    policies = []
    policy_number_used = None

    if customer:
        policies = get_policies_for_customer(customer.get("customer_id", ""))
        if policy_number_from_body:
            for p in policies:
                if (p.get("policy_number") or "").upper() == policy_number_from_body:
                    policy_number_used = p.get("policy_number")
                    break
        if not policy_number_used and policies:
            policy_number_used = policies[0].get("policy_number")

    # If sender not in DB but they gave a policy number, look up that policy directly (from policies.json)
    if not policy_number_used and policy_number_from_body:
        direct = get_policy_by_number(policy_number_from_body)
        if direct:
            policy_number_used = direct.get("policy_number")
            policies = [direct]

    if not policy_number_used and not policies:
        return None

    policy = get_policy_by_number(policy_number_used) if policy_number_used else (policies[0] if policies else None)
    if not policy:
        return None

    details = get_policy_details_by_policy_number(policy.get("policy_number", ""))
    pn = policy.get("policy_number", "")

    if intent == "policy_number":
        if len(policies) == 1:
            return f"Your policy number is {pn} (type: {policy.get('policy_type', 'N/A')})."
        lines = ["We found the following policy/policies associated with your email:"]
        for p in policies[:10]:
            lines.append(f"  - {p.get('policy_number', '')} ({p.get('policy_type', '')})")
        return "\n".join(lines)

    if intent == "policy_expiry":
        exp = policy.get("expiration_date") or policy.get("valid_upto")
        if exp:
            return f"For policy {pn}, your policy expires on {exp}. Please ensure renewal before that date."
        return f"For policy {pn}, we could not retrieve the expiration date. Please contact us with your policy number for details."

    if intent == "coverage_included":
        # Extract coverage name from question (e.g. "engine protection", "engine protection included")
        coverage_keywords = re.sub(r"\b(is|are|included|covered|in|my|policy|the|a|an)\b", " ", question_text, flags=re.IGNORECASE)
        coverage_keywords = re.sub(r"\s+", " ", coverage_keywords).strip().lower()
        if not coverage_keywords or len(coverage_keywords) < 2:
            coverage_keywords = question_text.lower()
        # Search in coverage_name and coverage_description
        for d in details:
            name = (d.get("coverage_name") or "").lower()
            desc = (d.get("coverage_description") or "").lower()
            clause = (d.get("clause_text") or "").lower()
            if coverage_keywords in name or coverage_keywords in desc or coverage_keywords in clause:
                included = d.get("is_included", True)
                if included:
                    return f"Yes. {d.get('coverage_name', '')} is included in your policy {pn}. {d.get('coverage_description', '') or ''}"
                return f"{d.get('coverage_name', '')} is an optional coverage on your policy. Your current status: not included. Contact us to add it."
            # Partial match (e.g. "engine" matches "Engine Protection")
            for word in coverage_keywords.split():
                if len(word) >= 3 and (word in name or word in desc):
                    included = d.get("is_included", True)
                    if included:
                        return f"Yes. {d.get('coverage_name', '')} is included in your policy {pn}."
                    return f"{d.get('coverage_name', '')} is listed on your policy as optional; it is not currently included. Contact us to add it."
        names = ", ".join(d.get("coverage_name", "") for d in details[:5])
        return f"We could not find a coverage matching your question for policy {pn}. Your policy includes: {names}. Reply with a specific coverage name for more detail."

    if intent == "deductible":
        # Policy-level aggregate deductible or from details
        agg = policy.get("aggregate_deductible")
        if agg is not None:
            return f"For policy {pn}, your aggregate deductible is ${float(agg):,.2f}."
        deductibles = [d.get("deductible_amount") or 0 for d in details if d.get("deductible_applicable")]
        if deductibles:
            return f"For policy {pn}, the applicable deductible(s) are: " + ", ".join(f"${float(x):,.2f}" for x in deductibles if x) + " (varies by coverage)."
        return f"For policy {pn}, no deductible applies to the main coverages, or deductible details are not on file. Contact us for exact amounts."

    return None


def _find_faq_answer(question_text: str, faqs: List[Dict[str, str]]) -> Optional[Dict[str, str]]:
    """
    Find the best matching FAQ answer from FAQ.csv (semantic/LLM or keyword fallback).
    """
    if not faqs:
        return None
    
    _load_env()
    question_lower = (question_text or "").lower()
    q_words = set(re.findall(r"\b\w+\b", question_lower))

    # Only map to "how to file" style FAQs when the user is asking procedurally, not filing with narrative + "claim"
    if re.search(r"\bhow\s+(do\s+i|to|can\s+i)\b", question_lower) and re.search(
        r"\bfile\s+(a\s+)?claim\b", question_lower
    ):
        for faq in faqs:
            faq_q = (faq.get("question") or "").lower()
            if "file" in faq_q and "claim" in faq_q and "how" in faq_q:
                return faq

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # Fallback: simple keyword matching
        for faq in faqs:
            faq_q = (faq.get("question") or "").lower()
            faq_words = set(re.findall(r"\b\w+\b", faq_q))
            common_words = q_words.intersection(faq_words)
            if len(common_words) >= 3:
                return faq
        return None
    
    try:
        from openai import OpenAI
        
        client = OpenAI(api_key=api_key)
        model = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")
        
        # Build context with all FAQ questions
        faq_context = "\n\n".join([
            f"Q{i+1}: {faq['question']}\nA{i+1}: {faq['answer']}"
            for i, faq in enumerate(faqs)
        ])
        
        prompt = f"""You are an FAQ assistant. Given a user question, find the most relevant FAQ answer from the knowledge base below.

User Question: {question_text}

FAQ Knowledge Base:
{faq_context}

Respond with ONLY the number (Q1, Q2, Q3, etc.) of the most relevant FAQ. If no FAQ is relevant, respond with "NONE"."""
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {
                    "role": "system",
                    "content": "You are an FAQ assistant. Respond with ONLY a FAQ number (Q1, Q2, etc.) or 'NONE'.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=10,
            temperature=0,
        )
        
        answer = (response.choices[0].message.content or "").strip().upper()
        
        # Extract FAQ number
        match = re.search(r"Q(\d+)", answer)
        if match:
            idx = int(match.group(1)) - 1
            if 0 <= idx < len(faqs):
                return faqs[idx]
        
        return None
        
    except Exception as e:
        print(f"LLM FAQ matching error: {e}", file=sys.stderr)
        return None


def _send_faq_response_email(
    to_addr: str,
    original_subject: str,
    original_body: str,
    faq_answer: str,
    faq_question: Optional[str] = None,
    original_message_id: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Send FAQ response email using SMTP.

    Passes original_message_id as In-Reply-To and References so the reply
    lands in the same email thread as the customer's original message.

    Returns dict with success status and message ID.
    """
    _load_env()
    
    sender_email = os.environ.get("SENDER_EMAIL", "")
    email_password = os.environ.get("EMAIL_PASSWORD", "").replace(" ", "")
    
    if not sender_email or not email_password:
        raise ValueError("Email credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.")
    
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        # Determine SMTP settings
        is_gmail = "gmail.com" in sender_email.lower()
        smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com" if is_gmail else "smtp.gmail.com")
        smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        smtp_secure = os.environ.get("SMTP_SECURE", "false").lower() == "true"
        
        # Create email
        msg = MIMEMultipart("alternative")
        msg["From"] = f"Claims Department <{sender_email}>"
        msg["To"] = to_addr
        msg["Subject"] = f"Re: {original_subject}"

        # Thread the reply under the customer's original message
        if original_message_id:
            mid = original_message_id.strip()
            if not mid.startswith("<"):
                mid = f"<{mid}>"
            msg["In-Reply-To"] = mid
            msg["References"] = mid
        
        # Build email body
        if faq_question:
            text_body = f"""Thank you for your inquiry regarding: {faq_question}

{faq_answer}

---
This is an automated response from our FAQ system. If you need further assistance or if this doesn't answer your question, please reply to this email.

Original Message:
{original_body[:500]}"""
        else:
            text_body = f"""Thank you for your inquiry.

{faq_answer}

---
This is an automated response from our FAQ system. If you need further assistance or if this doesn't answer your question, please reply to this email.

Original Message:
{original_body[:500]}"""
        
        html_body = text_body.replace("\n", "<br>")
        
        # Add parts
        part1 = MIMEText(text_body, "plain")
        part2 = MIMEText(html_body, "html")
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        if smtp_secure:
            server = smtplib.SMTP_SSL(smtp_host, smtp_port)
        else:
            server = smtplib.SMTP(smtp_host, smtp_port)
            server.starttls()
        
        server.login(sender_email, email_password)
        server.send_message(msg)
        server.quit()
        
        return {
            "success": True,
            "message": "FAQ response email sent successfully",
            "textBody": text_body,
            "subject": f"Re: {original_subject}",
        }

    except Exception as e:
        raise Exception(f"Failed to send FAQ response email: {e}")


def process_faq_email(
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
    message_id: str = "",
) -> Dict[str, Any]:
    """
    Main entry point for FAQ processing.
    Answers come from data/FAQ.csv for generic questions; reply is sent to from_addr (sender).

    Returns:
        Dict with:
        - is_faq: bool - whether email was identified as FAQ
        - answered: bool - whether FAQ was answered and email sent
        - already_answered: bool - True when this Message-ID was already replied to (dedup skip)
        - skip_claim_ingestion: bool - if True, webhook must not run FNOL ingest (definitive FAQ reply)
        - answer: str - the FAQ answer (if found)
        - error: str - error message (if any)
    """
    def _record_answered() -> None:
        """Persist this message-ID so neither IMAP nor SendGrid re-replies."""
        if not message_id or not message_id.strip():
            return
        try:
            from backend.ingested_claims.service import add_faq_answered_id
            add_faq_answered_id(subject, from_addr, message_id.strip(), "")
        except Exception as _err:
            print(f"Warning: could not persist FAQ answered ID: {_err}", file=sys.stderr)

    try:
        _load_env()

        # --- Dedup: never re-reply to an email we have already answered ---
        if message_id and message_id.strip():
            try:
                from backend.ingested_claims.service import get_faq_answered_id_set
                _mid_inner = message_id.strip().replace("<", "").replace(">", "").strip()
                _answered = get_faq_answered_id_set()
                if _mid_inner.lower() in _answered or message_id.strip().lower() in _answered:
                    print(
                        f"FAQ dedup: already answered {message_id!r}, skipping re-reply",
                        file=sys.stderr,
                    )
                    return {
                        "is_faq": True,
                        "answered": False,
                        "already_answered": True,
                        "skip_claim_ingestion": True,
                        "answer": None,
                        "error": None,
                    }
            except Exception as _dup_err:
                print(f"Warning: FAQ dedup check failed: {_dup_err}", file=sys.stderr)

        # Check if this is an FAQ query
        is_faq = _is_faq_query(subject, email_body)
        
        if not is_faq:
            return {
                "is_faq": False,
                "answered": False,
                "skip_claim_ingestion": False,
                "answer": None,
                "error": None,
            }
        
        # Ensure email can be sent before doing any FAQ lookup (so we don't "answer" but fail to send)
        sender_email = os.environ.get("SENDER_EMAIL", "")
        email_password = (os.environ.get("EMAIL_PASSWORD", "") or "").replace(" ", "")
        if not sender_email or not email_password:
            return {
                "is_faq": True,
                "answered": False,
                "skip_claim_ingestion": False,
                "answer": None,
                "error": "FAQ reply not sent: SENDER_EMAIL and EMAIL_PASSWORD must be set in .env to send auto-replies.",
            }
        
        # Try customer-data FAQ first (policy number, expiry, coverage, deductible) — fetch from DB
        question_text = f"{subject} {email_body[:500]}"
        customer_data_intent = _classify_customer_data_intent(question_text)
        if customer_data_intent:
            customer_answer = _answer_customer_data_query(customer_data_intent, from_addr, question_text)
            if customer_answer:
                sent = _send_faq_response_email(
                    from_addr, subject, email_body, customer_answer, question_text[:200],
                    original_message_id=message_id or None,
                )
                _record_answered()
                return {
                    "is_faq": True,
                    "answered": True,
                    "skip_claim_ingestion": True,
                    "answer": customer_answer,
                    "faq_type": "customer_data",
                    "customer_data_intent": customer_data_intent,
                    "outbound_body": sent.get("textBody", ""),
                    "outbound_subject": sent.get("subject", f"Re: {subject}"),
                    "error": None,
                }
            # Customer not found or no data — send clear message so they know we tried
            no_record_msg = (
                "We could not find a policy associated with the email address you used. "
                "Please ensure you are writing from the email we have on file for your policy, "
                "or include your policy number in your message. If you need to update your contact email, please call our customer service line."
            )
            sent = _send_faq_response_email(
                from_addr, subject, email_body, no_record_msg, question_text[:200],
                original_message_id=message_id or None,
            )
            _record_answered()
            return {
                "is_faq": True,
                "answered": True,
                "skip_claim_ingestion": True,
                "answer": no_record_msg,
                "faq_type": "customer_data_no_match",
                "customer_data_intent": customer_data_intent,
                "outbound_body": sent.get("textBody", ""),
                "outbound_subject": sent.get("subject", f"Re: {subject}"),
                "error": None,
            }
        
        # Load FAQ data from data/FAQ.csv only (generic questions like "How do I file a claim?")
        faqs = _load_faq_data()
        if not faqs:
            return {
                "is_faq": True,
                "answered": False,
                "skip_claim_ingestion": False,
                "answer": None,
                "error": "FAQ database is empty. Please ensure FAQ.csv exists with FAQ data.",
            }
        
        # Find matching FAQ answer from FAQ.csv (subject + first part of body)
        faq_match = _find_faq_answer(question_text, faqs)
        
        if not faq_match:
            # FAQ-ish wording but no CSV match: do not auto-reply or block FNOL ingest (was swallowing real claims).
            return {
                "is_faq": True,
                "answered": False,
                "skip_claim_ingestion": False,
                "answer": None,
                "faq_type": "no_csv_match",
                "error": None,
            }
        
        # Send FAQ response
        sent = _send_faq_response_email(
            from_addr, subject, email_body, faq_match["answer"], faq_match["question"],
            original_message_id=message_id or None,
        )
        _record_answered()

        return {
            "is_faq": True,
            "answered": True,
            "skip_claim_ingestion": True,
            "answer": faq_match["answer"],
            "faq_question": faq_match["question"],
            "outbound_body": sent.get("textBody", ""),
            "outbound_subject": sent.get("subject", f"Re: {subject}"),
            "error": None,
        }
        
    except Exception as e:
        return {
            "is_faq": True,
            "answered": False,
            "skip_claim_ingestion": False,
            "answer": None,
            "error": str(e),
        }
