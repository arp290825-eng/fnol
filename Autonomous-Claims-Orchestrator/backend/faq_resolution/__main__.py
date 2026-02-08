"""CLI entry for FAQ resolution microservice."""
import json
import sys
from backend.faq_resolution.service import process_faq_email

if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or args[0] != "process":
        print(json.dumps({"error": "Usage: process"}), file=sys.stderr)
        sys.exit(1)
    
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON: {e}"}), file=sys.stderr)
        sys.exit(1)
    
    from_addr = payload.get("from", "")
    to_addr = payload.get("to", "")
    subject = payload.get("subject", "")
    email_body = payload.get("emailBody", "")
    
    if not from_addr or not subject or not email_body:
        print(json.dumps({"error": "Missing required fields: from, subject, emailBody"}), file=sys.stderr)
        sys.exit(1)
    
    result = process_faq_email(from_addr, to_addr, subject, email_body)
    print(json.dumps(result))
    sys.exit(0 if result.get("answered") or not result.get("is_faq") else 1)
