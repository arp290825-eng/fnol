"""
Claim Notification Service.

Sends professional, standards-based emails when a claim is processed to review.
Template follows claim status letter best practices: claim ref, status, next steps, contact info.
"""

import os
from email.utils import parseaddr
from typing import Any, Dict, Optional

from backend.common.config import ENV_FILE


def _load_env() -> None:
    """Load env vars from .env if present."""
    if ENV_FILE.exists():
        with open(ENV_FILE, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, _, val = line.partition("=")
                    os.environ.setdefault(key.strip(), val.strip().strip("'\""))


def _extract_email_address(addr: Optional[str]) -> Optional[str]:
    """Extract plain email from 'Name <email@domain.com>' or return as-is if already plain."""
    if not addr or not str(addr).strip():
        return None
    s = str(addr).strip()
    _, email_part = parseaddr(s)
    if email_part:
        return email_part
    if "@" in s:
        return s
    return None


def _claimant_reply_to_email(claim: Dict[str, Any]) -> Optional[str]:
    """Prefer original From; fall back to extracted contact email from the draft."""
    draft = (claim.get("decisionPack") or {}).get("claimDraft") or {}
    for raw in (claim.get("sourceEmailFrom"), draft.get("contactEmail")):
        addr = _extract_email_address(raw if isinstance(raw, str) else None)
        if addr:
            return addr
    return None


def _send_smtp_alternative(
    sender_email: str,
    email_password: str,
    to_addr: str,
    subject: str,
    text_body: str,
    html_body: str,
) -> None:
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    is_gmail = "gmail.com" in sender_email.lower()
    smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com" if is_gmail else "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_secure = os.environ.get("SMTP_SECURE", "false").lower() == "true"

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Claims Department <{sender_email}>"
    msg["To"] = to_addr
    msg["Subject"] = subject
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    if smtp_secure:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
    else:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
    server.login(sender_email, email_password)
    server.send_message(msg)
    server.quit()


def send_fnol_received_acknowledgement_email(ingested_claim: Dict[str, Any]) -> Dict[str, Any]:
    """
    Send immediate acknowledgement when a new FNOL email is ingested (before human/AI processing).

    Set FNOL_RECEIPT_ACK_EMAIL_ENABLED=false to disable. Uses SENDER_EMAIL / EMAIL_PASSWORD / SMTP_*.
    """
    _load_env()

    if os.environ.get("FNOL_RECEIPT_ACK_EMAIL_ENABLED", "true").lower() in ("false", "0", "no"):
        return {"success": True, "message": "FNOL receipt acknowledgement disabled by config."}

    to_addr = _extract_email_address(ingested_claim.get("from"))
    if not to_addr:
        return {"success": False, "error": "No From address on ingested claim."}

    sender_email = os.environ.get("SENDER_EMAIL", "")
    email_password = (os.environ.get("EMAIL_PASSWORD", "") or "").replace(" ", "")

    if not sender_email or not email_password:
        return {
            "success": False,
            "error": "Email credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.",
        }

    ref = ingested_claim.get("id") or "pending"
    policy_display = (ingested_claim.get("policyNumber") or "—").strip() or "—"
    subj_line = (ingested_claim.get("subject") or "").strip() or "(No subject)"
    att_n = len(ingested_claim.get("attachments") or [])

    subject = f"We received your claim notice – Ref: {ref}"

    text_body = f"""Dear Customer,

Thank you for contacting us. This email confirms that we have received your First Notice of Loss (FNOL) and any attachments you included.

Submission reference: {ref}
Policy / reference on file: {policy_display}
Your subject line: {subj_line}
Attachments received: {att_n}

Our team will review your submission. You may receive a further update once your notice has been processed.

If you need to add information, reply to this email or contact us at the address below.

Kind regards,

Claims Department
{sender_email}
"""

    html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
<p>Dear Customer,</p>
<p>Thank you for contacting us. This email confirms that we have <strong>received your First Notice of Loss (FNOL)</strong> and any attachments you included.</p>
<ul>
<li><strong>Submission reference:</strong> {ref}</li>
<li><strong>Policy / reference on file:</strong> {policy_display}</li>
<li><strong>Your subject line:</strong> {subj_line}</li>
<li><strong>Attachments received:</strong> {att_n}</li>
</ul>
<p>Our team will review your submission. You may receive a further update once your notice has been processed.</p>
<p>If you need to add information, reply to this email or contact us below.</p>
<p>Kind regards,<br><br>
<strong>Claims Department</strong><br>
{sender_email}</p>
</body>
</html>"""

    try:
        _send_smtp_alternative(sender_email, email_password, to_addr, subject, text_body, html_body)
        return {
            "success": True,
            "message": "FNOL receipt acknowledgement sent.",
            "subject": subject,
            "textBody": text_body,
            "senderDisplay": f"Claims Department <{sender_email}>",
            "toAddr": to_addr,
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


def send_claim_under_review_email(claim: Dict[str, Any]) -> Dict[str, Any]:
    """
    Send a professional "Your claim is being reviewed" email to the claimant.

    Uses standard claim status format: subject with claim ref, greeting, status,
    claim/policy details, next steps, and professional signature.

    Args:
        claim: Processed claim dict (claimId, sourceEmailFrom, decisionPack.claimDraft, etc.).

    Returns:
        Dict with success (bool) and message or error.
    """
    _load_env()

    to_addr = _claimant_reply_to_email(claim)
    if not to_addr:
        return {
            "success": False,
            "error": "No claimant email (sourceEmailFrom or decisionPack.claimDraft.contactEmail).",
        }

    sender_email = os.environ.get("SENDER_EMAIL", "")
    email_password = (os.environ.get("EMAIL_PASSWORD", "") or "").replace(" ", "")

    if not sender_email or not email_password:
        return {
            "success": False,
            "error": "Email credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.",
        }

    if os.environ.get("CLAIM_UNDER_REVIEW_EMAIL_ENABLED", "true").lower() in ("false", "0", "no"):
        return {"success": True, "message": "Claim under review email disabled by config."}

    claim_id = claim.get("claimId", "")
    draft = (claim.get("decisionPack") or {}).get("claimDraft") or {}
    policy_number = draft.get("policyNumber") or "—"
    claimant_name = (draft.get("claimantName") or "").strip() or "Valued Customer"
    loss_type = (draft.get("lossType") or "").strip() or "your claim"
    loss_date = (draft.get("lossDate") or "").strip() or "the reported date"

    # Subject: Claim #[ref] – Status Update (standard format)
    subject = f"Claim {claim_id} – Your Claim Is Under Review"

    # Plain text body – professional, clear, next steps, contact (per Claimable/industry template)
    text_body = f"""Dear {claimant_name},

Thank you for submitting your claim. This email confirms that we have received your submission and supporting documents, and your claim is now under review.

Claim details
• Claim reference: {claim_id}
• Policy number: {policy_number}
• Claim type: {loss_type}
• Date of loss: {loss_date}

Current status: Under review

Our team is reviewing the information and documentation you provided. We will assess your claim and get back to you with an update.

What happens next
• We will complete our review and send you a status update.
• If we need any additional information or documents, we will contact you by email.
• You may check the status of your claim by replying to this email or contacting us at the details below.

If you have any questions in the meantime, please reply to this email or contact our Claims team using the details in the signature below.

Kind regards,

Claims Department
{sender_email}
"""

    html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
<p>Dear {claimant_name},</p>
<p>Thank you for submitting your claim. This email confirms that we have received your submission and supporting documents, and <strong>your claim is now under review</strong>.</p>
<p><strong>Claim details</strong></p>
<ul>
<li>Claim reference: {claim_id}</li>
<li>Policy number: {policy_number}</li>
<li>Claim type: {loss_type}</li>
<li>Date of loss: {loss_date}</li>
</ul>
<p><strong>Current status:</strong> Under review</p>
<p>Our team is reviewing the information and documentation you provided. We will assess your claim and get back to you with an update.</p>
<p><strong>What happens next</strong></p>
<ul>
<li>We will complete our review and send you a status update.</li>
<li>If we need any additional information or documents, we will contact you by email.</li>
<li>You may check the status of your claim by replying to this email or contacting us at the details below.</li>
</ul>
<p>If you have any questions in the meantime, please reply to this email or contact our Claims team.</p>
<p>Kind regards,<br><br>
<strong>Claims Department</strong><br>
{sender_email}</p>
</body>
</html>"""

    try:
        _send_smtp_alternative(sender_email, email_password, to_addr, subject, text_body, html_body)
        return {"success": True, "message": "Claim under review email sent successfully."}
    except Exception as e:
        return {"success": False, "error": str(e)}


def send_desk_rejection_email(claim: Dict[str, Any], reason: str = "Policy expired or invalid") -> Dict[str, Any]:
    """
    Send a professional desk rejection email when a claim is auto-rejected
    (e.g. expired or invalid policy). Uses standard claim denial letter format.

    Args:
        claim: Processed claim dict (claimId, sourceEmailFrom, decisionPack.claimDraft, policyHolderInfo, etc.).
        reason: Short reason for rejection (e.g. "Policy expired", "Policy not found").

    Returns:
        Dict with success (bool) and message or error.
    """
    _load_env()

    to_addr = _claimant_reply_to_email(claim)
    if not to_addr:
        return {
            "success": False,
            "error": "No claimant email (sourceEmailFrom or decisionPack.claimDraft.contactEmail).",
        }

    sender_email = os.environ.get("SENDER_EMAIL", "")
    email_password = (os.environ.get("EMAIL_PASSWORD", "") or "").replace(" ", "")

    if not sender_email or not email_password:
        return {
            "success": False,
            "error": "Email credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD.",
        }

    if os.environ.get("DESK_REJECTION_EMAIL_ENABLED", "true").lower() in ("false", "0", "no"):
        return {"success": True, "message": "Desk rejection email disabled by config."}

    claim_id = claim.get("claimId", "")
    draft = (claim.get("decisionPack") or {}).get("claimDraft") or {}
    policy_holder = (claim.get("decisionPack") or {}).get("policyHolderInfo") or {}
    policy_number = draft.get("policyNumber") or policy_holder.get("policy_number") or "—"
    claimant_name = (
        (draft.get("claimantName") or "").strip()
        or (policy_holder.get("full_name") or "").strip()
        or "Valued Customer"
    )
    expiration_date = policy_holder.get("expiration_date") or ""
    policy_status = (policy_holder.get("policy_status") or "").upper()

    subject = f"Claim {claim_id} – Unable to Process (Policy Not in Force)"

    text_body = f"""Dear {claimant_name},

Thank you for your recent claim submission. After reviewing your submission, we are unable to process your claim at this time.

Claim reference: {claim_id}
Policy number: {policy_number}

Reason for this decision
Your claim cannot be processed because the policy associated with this submission is not in force. {reason}.
"""
    if expiration_date:
        text_body += f"Our records show the policy expired on {expiration_date}.\n\n"
    text_body += """What you can do
• If you have renewed your policy and believe this is an error, please reply to this email with your current policy number and renewal confirmation.
• To obtain coverage, please contact our customer service team or your agent to discuss renewal options.
• If you have questions about this decision, you may reply to this email or call our claims department.

We regret that we cannot process this claim under the current circumstances. We are here to help with renewal or any other questions.

Kind regards,

Claims Department
"""
    text_body += sender_email

    html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #333; max-width: 600px;">
<p>Dear {claimant_name},</p>
<p>Thank you for your recent claim submission. After reviewing your submission, we are <strong>unable to process your claim</strong> at this time.</p>
<p><strong>Claim reference:</strong> {claim_id}<br>
<strong>Policy number:</strong> {policy_number}</p>
<p><strong>Reason for this decision</strong><br>
Your claim cannot be processed because the policy associated with this submission is not in force. {reason}.</p>
"""
    if expiration_date:
        html_body += f"<p>Our records show the policy expired on {expiration_date}.</p>\n"
    html_body += """<p><strong>What you can do</strong></p>
<ul>
<li>If you have renewed your policy and believe this is an error, please reply to this email with your current policy number and renewal confirmation.</li>
<li>To obtain coverage, please contact our customer service team or your agent to discuss renewal options.</li>
<li>If you have questions about this decision, you may reply to this email or call our claims department.</li>
</ul>
<p>We regret that we cannot process this claim under the current circumstances. We are here to help with renewal or any other questions.</p>
<p>Kind regards,<br><br>
<strong>Claims Department</strong><br>
"""
    html_body += f"{sender_email}</p>\n</body>\n</html>"

    try:
        _send_smtp_alternative(sender_email, email_password, to_addr, subject, text_body, html_body)
        return {"success": True, "message": "Desk rejection email sent successfully."}
    except Exception as e:
        return {"success": False, "error": str(e)}
