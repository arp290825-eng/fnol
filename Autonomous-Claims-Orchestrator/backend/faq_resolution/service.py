"""
FAQ Auto-Resolution Service.

Uses LangChain agents to:
1. Detect if an email is an FAQ query
2. Answer FAQ questions from FAQ.csv
3. Send automated email responses
"""

import csv
import json
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from backend.common.config import ENV_FILE, PROJECT_ROOT

# FAQ CSV file location
FAQ_CSV_FILE = PROJECT_ROOT / "data" / "FAQ.csv"


def _load_env() -> None:
    """Load env vars from .env if present."""
    if ENV_FILE.exists():
        with open(ENV_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip("'\"""))


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


def _find_faq_answer(question_text: str, faqs: List[Dict[str, str]]) -> Optional[Dict[str, str]]:
    """
    Find the best matching FAQ answer using semantic similarity.
    
    Uses LangChain/OpenAI to find the most relevant FAQ entry.
    """
    if not faqs:
        return None
    
    _load_env()
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        # Fallback: simple keyword matching
        question_lower = question_text.lower()
        for faq in faqs:
            faq_q = faq["question"].lower()
            # Simple word overlap check
            q_words = set(question_lower.split())
            faq_words = set(faq_q.split())
            common_words = q_words.intersection(faq_words)
            if len(common_words) >= 3:  # At least 3 common words
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
        # Fallback: return first FAQ (better than nothing)
        return faqs[0] if faqs else None


def _send_faq_response_email(
    to_addr: str,
    original_subject: str,
    original_body: str,
    faq_answer: str,
    faq_question: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Send FAQ response email using SMTP.
    
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
        }
        
    except Exception as e:
        raise Exception(f"Failed to send FAQ response email: {e}")


def process_faq_email(
    from_addr: str,
    to_addr: str,
    subject: str,
    email_body: str,
) -> Dict[str, Any]:
    """
    Main entry point for FAQ processing.
    
    Detects if email is FAQ, finds answer, and sends response.
    
    Returns:
        Dict with:
        - is_faq: bool - whether email was identified as FAQ
        - answered: bool - whether FAQ was answered and email sent
        - answer: str - the FAQ answer (if found)
        - error: str - error message (if any)
    """
    try:
        # Check if this is an FAQ query
        is_faq = _is_faq_query(subject, email_body)
        
        if not is_faq:
            return {
                "is_faq": False,
                "answered": False,
                "answer": None,
                "error": None,
            }
        
        # Load FAQ data
        faqs = _load_faq_data()
        if not faqs:
            return {
                "is_faq": True,
                "answered": False,
                "answer": None,
                "error": "FAQ database is empty. Please ensure FAQ.csv exists with FAQ data.",
            }
        
        # Find matching FAQ answer
        # Use subject + first part of body as the question
        question_text = f"{subject} {email_body[:500]}"
        faq_match = _find_faq_answer(question_text, faqs)
        
        if not faq_match:
            # No matching FAQ found - send generic response
            generic_answer = """Thank you for your inquiry. We have received your question and our team will review it.

Unfortunately, we couldn't find a direct answer in our FAQ database. A representative will contact you shortly with more information.

If this is regarding a new claim or incident, please ensure you include:
- Policy number
- Incident details
- Date and location of incident
- Any relevant documentation or photos

For urgent matters, please call our claims hotline at 1-800-CLAIMS."""
            
            _send_faq_response_email(
                from_addr,
                subject,
                email_body,
                generic_answer,
            )
            
            return {
                "is_faq": True,
                "answered": True,
                "answer": generic_answer,
                "error": None,
            }
        
        # Send FAQ response
        _send_faq_response_email(
            from_addr,
            subject,
            email_body,
            faq_match["answer"],
            faq_match["question"],
        )
        
        return {
            "is_faq": True,
            "answered": True,
            "answer": faq_match["answer"],
            "faq_question": faq_match["question"],
            "error": None,
        }
        
    except Exception as e:
        return {
            "is_faq": True,
            "answered": False,
            "answer": None,
            "error": str(e),
        }
