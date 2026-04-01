"""CLI entry for ingested_claims microservice."""
import base64
import email
import json
import sys
from email import policy
from backend.email_ingestion.service import extract_plain_body_from_rfc822, should_ingest_incoming_email
from backend.ingested_claims.service import (
    append_outbound_mail_entry,
    clear_all_ingested_claims,
    get_all_ingested_claims,
    get_ingested_claim_by_id,
    get_policy_numbers,
    is_reply_to_existing_claim,
    save_faq_conversation,
    save_ingested_claim,
)

if __name__ == "__main__":
    args = sys.argv[1:]
    if not args:
        print(json.dumps({"error": "Usage: list | list-full | get <id> | clear | save-webhook | is-thread-reply"}), file=sys.stderr)
        sys.exit(1)

    cmd = args[0].lower()

    if cmd == "save-faq-webhook":
        """Save FAQ conversation (inbound + outbound) as an inbox thread entry."""
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}))
            sys.exit(0)
        from_addr = payload.get("from", "")
        to_addr = payload.get("to", "")
        subject = payload.get("subject", "")
        inbound_body = payload.get("emailBody", "")
        outbound_body = payload.get("outboundBody", "")
        outbound_subject = payload.get("outboundSubject", "") or f"Re: {subject}"
        sender_display = payload.get("senderDisplay", "Claims Department")
        message_id = payload.get("messageId") or None
        mail_date_header = payload.get("mailDateHeader") or None
        claim = save_faq_conversation(
            from_addr=from_addr,
            to_addr=to_addr,
            subject=subject,
            inbound_body=inbound_body,
            outbound_body=outbound_body,
            outbound_subject=outbound_subject,
            sender_display=sender_display,
            message_id=message_id,
            mail_date_header=mail_date_header,
        )
        if claim:
            print(json.dumps({"success": True, "claimId": claim["id"]}))
        else:
            print(json.dumps({"success": True, "skipped": True, "reason": "duplicate"}))
        sys.exit(0)

    if cmd == "is-thread-reply":
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}))
            sys.exit(0)
        from_addr = payload.get("from", "")
        subject = payload.get("subject", "")
        in_reply_to = payload.get("inReplyTo", "") or ""
        references = payload.get("references", "") or ""
        is_reply = is_reply_to_existing_claim(
            from_addr, subject,
            in_reply_to or None,
            references or None,
        )
        print(json.dumps({"isReply": is_reply}))
        sys.exit(0)

    if cmd == "save-webhook":
        try:
            payload = json.load(sys.stdin)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": f"Invalid JSON: {e}"}), file=sys.stderr)
            sys.exit(1)
        from_addr = payload.get("from", "")
        to_addr = payload.get("to", "")
        subject = payload.get("subject", "")
        email_body = (payload.get("emailBody") or "").strip()
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
        headers_raw = payload.get("headers") or ""
        mail_date_header = None
        message_id_header = ""
        in_reply_to_header = ""
        references_header = ""
        if isinstance(headers_raw, str) and headers_raw.strip():
            for line in headers_raw.replace("\r\n", "\n").split("\n"):
                low = line.lower()
                if low.startswith("date:") and mail_date_header is None:
                    mail_date_header = line.split(":", 1)[1].strip()
                elif low.startswith("message-id:"):
                    message_id_header = line.split(":", 1)[1].strip()
                elif low.startswith("in-reply-to:"):
                    in_reply_to_header = line.split(":", 1)[1].strip()
                elif low.startswith("references:"):
                    references_header = line.split(":", 1)[1].strip()
        raw_rfc822 = None
        raw_b64 = payload.get("rawRfc822")
        if isinstance(raw_b64, str) and raw_b64.strip():
            try:
                raw_rfc822 = base64.b64decode(raw_b64)
            except Exception:
                raw_rfc822 = None

        if raw_rfc822 and len(raw_rfc822) > 50:
            try:
                parsed = email.message_from_bytes(raw_rfc822, policy=policy.default)
                if not (message_id_header or "").strip():
                    mid_raw = (parsed.get("Message-ID") or "").strip()
                    if mid_raw:
                        message_id_header = mid_raw
                if not in_reply_to_header:
                    ir = parsed.get("In-Reply-To")
                    in_reply_to_header = str(ir).strip() if ir else ""
                if not references_header:
                    rf = parsed.get("References")
                    references_header = str(rf).strip() if rf else ""
            except Exception:
                pass
        dedup_mid = message_id_header.strip() or None

        if not email_body and raw_rfc822 and len(raw_rfc822) > 50:
            extracted = extract_plain_body_from_rfc822(raw_rfc822)
            if extracted:
                email_body = extracted

        # Allow thread follow-ups through even if they don't look like FNOL.
        # save_ingested_claim will merge them into the parent thread.
        is_thread_follow_up = is_reply_to_existing_claim(
            from_addr, subject,
            in_reply_to_header or None,
            references_header or None,
        )
        if not is_thread_follow_up and not should_ingest_incoming_email(subject, email_body):
            print(
                json.dumps(
                    {
                        "success": True,
                        "skipped": True,
                        "reason": "not_insurance_fnol",
                        "message": "Email did not pass insurance claim / FNOL classification",
                    }
                )
            )
            sys.exit(0)

        claim, created_new, merged = save_ingested_claim(
            from_addr,
            to_addr,
            subject,
            email_body,
            attachment_files,
            "sendgrid",
            message_id=dedup_mid,
            email_message_id_for_display=dedup_mid,
            mail_date_header=mail_date_header,
            raw_rfc822=raw_rfc822,
            in_reply_to=in_reply_to_header or None,
            references=references_header or None,
        )
        if merged:
            print(
                json.dumps(
                    {
                        "success": True,
                        "merged": True,
                        "claimId": claim["id"],
                        "policyNumber": claim.get("policyNumber"),
                        "message": "Follow-up merged into existing claim thread",
                    }
                )
            )
            sys.exit(0)
        if not created_new:
            cid = (claim or {}).get("id", "")
            print(
                json.dumps(
                    {
                        "success": True,
                        "skipped": True,
                        "reason": "duplicate",
                        "claimId": cid,
                        "message": "Email already ingested in this session or previously",
                    }
                )
            )
            sys.exit(0)
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
