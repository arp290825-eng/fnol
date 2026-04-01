"""CLI entry for email_ingestion microservice."""
import json
import sys

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "should-ingest":
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}), file=sys.stderr)
            sys.exit(1)
        from backend.email_ingestion.service import should_ingest_incoming_email

        ok = should_ingest_incoming_email(
            payload.get("subject") or "",
            payload.get("emailBody") or "",
        )
        print(json.dumps({"shouldIngest": ok}))
        sys.exit(0)

    from backend.email_ingestion.service import sync_inbox

    r = sync_inbox()
    print(json.dumps(r, indent=2))
    sys.exit(0 if r.get("success") else 1)
