"""CLI entry for ingested_claims microservice."""
import base64
import json
import sys
from backend.ingested_claims.service import (
    clear_all_ingested_claims,
    get_all_ingested_claims,
    get_ingested_claim_by_id,
    get_policy_numbers,
    save_ingested_claim,
)

if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(json.dumps({"error": "Usage: list | list-full | get <id> | clear | save-webhook"}), file=sys.stderr)
        sys.exit(1)

    cmd = args[0].lower()

    if cmd == "save-webhook":
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}), file=sys.stderr)
            sys.exit(1)
        from_addr = payload.get("from", "")
        to_addr = payload.get("to", "")
        subject = payload.get("subject", "")
        email_body = payload.get("emailBody", "")
        raw_attachments = payload.get("attachmentFiles", [])
        attachment_files = []
        for a in raw_attachments:
            name = a.get("name", "attachment")
            content = a.get("buffer")
            if isinstance(content, str):
                content = base64.b64decode(content)
            elif content is None:
                content = b""
            mime = a.get("mimeType", "application/octet-stream")
            attachment_files.append((name, content, mime))
        claim = save_ingested_claim(
            from_addr, to_addr, subject, email_body,
            attachment_files, "sendgrid",
        )
        print(json.dumps({"success": True, "claimId": claim["id"], "policyNumber": claim["policyNumber"]}))
        sys.exit(0)

    if cmd == "list":
        data = get_policy_numbers()
        print(json.dumps(data))
        sys.exit(0)

    if cmd == "list-full":
        data = get_all_ingested_claims()
        print(json.dumps(data))
        sys.exit(0)

    if cmd == "get":
        if len(args) < 2:
            print(json.dumps({"error": "claim id required"}), file=sys.stderr)
            sys.exit(1)
        claim = get_ingested_claim_by_id(args[1])
        print(json.dumps(claim) if claim else "null")
        sys.exit(0)

    if cmd == "clear":
        clear_all_ingested_claims()
        print(json.dumps({"success": True}))
        sys.exit(0)

    print(json.dumps({"error": f"Unknown command: {cmd}"}), file=sys.stderr)
    sys.exit(1)
