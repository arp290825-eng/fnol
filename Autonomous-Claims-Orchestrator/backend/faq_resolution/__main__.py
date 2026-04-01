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
    message_id = payload.get("messageId", "")

    if not from_addr:
        print(json.dumps({"error": "Missing required field: from"}), file=sys.stderr)
        sys.exit(1)

    result = process_faq_email(from_addr, to_addr, subject, email_body, message_id=message_id)
    print(json.dumps(result))
    # Always exit 0 so callers (e.g. SendGrid webhook) can read the JSON and check result["answered"]
    sys.exit(0)
