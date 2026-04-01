/**
 * SendGrid Inbound Parse Webhook
 * Processing order:
 *  1. Thread-reply check — if this email replies to an existing claim thread, merge immediately.
 *  2. FNOL gate — loss reports get ingest + receipt, bypassing FAQ.
 *  3. FAQ check — auto-reply if it matches a known FAQ query.
 *  4. save-webhook — ingest / thread-merge via Python.
 */
import { NextRequest, NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

/** Extract In-Reply-To value from raw SendGrid headers string. */
function parseInReplyTo(headersRaw: string): string {
  const match = headersRaw.match(/^In-Reply-To:\s*(.+)$/im)
  return match ? match[1].trim() : ''
}

/** Extract References value from raw SendGrid headers string. */
function parseReferences(headersRaw: string): string {
  const match = headersRaw.match(/^References:\s*(.+)$/im)
  return match ? match[1].trim() : ''
}

/** Check whether this email is a reply to an already-ingested claim thread. */
async function runIsThreadReply(
  from: string,
  subject: string,
  inReplyTo: string,
  references: string
): Promise<boolean> {
  if (!inReplyTo && !references) return false
  try {
    const payload = JSON.stringify({ from, subject, inReplyTo, references })
    const stdout = await runPython('backend.ingested_claims', ['is-thread-reply'], payload)
    const parsed = JSON.parse(stdout.trim()) as { isReply?: boolean }
    return parsed.isReply === true
  } catch {
    return false
  }
}

/** FNOL gate: same classifier as ingest — true => skip FAQ, go to save-webhook. */
async function runShouldIngestGate(
  subject: string,
  emailBody: string
): Promise<boolean | null> {
  try {
    const payload = JSON.stringify({ subject, emailBody })
    const stdout = await runPython('backend.email_ingestion', ['should-ingest'], payload)
    const parsed = JSON.parse(stdout.trim()) as { shouldIngest?: boolean; error?: string }
    if (typeof parsed.shouldIngest === 'boolean') return parsed.shouldIngest
    return null
  } catch {
    return null
  }
}

async function runFaqProcess(
  from: string,
  to: string,
  subject: string,
  emailBody: string,
  messageId?: string
): Promise<{
  is_faq?: boolean
  answered?: boolean
  already_answered?: boolean
  skip_claim_ingestion?: boolean
  outbound_body?: string
  outbound_subject?: string
  error?: string
} | null> {
  try {
    const payload = JSON.stringify({
      from, to, subject, emailBody,
      ...(messageId ? { messageId } : {}),
    })
    const stdout = await runPython('backend.faq_resolution', ['process'], payload)
    return JSON.parse(stdout.trim()) as {
      is_faq?: boolean
      answered?: boolean
      already_answered?: boolean
      skip_claim_ingestion?: boolean
      outbound_body?: string
      outbound_subject?: string
      error?: string
    }
  } catch {
    return null
  }
}

/** Save FAQ conversation (inbound + auto-reply) as an inbox thread so both sides are visible. */
async function saveFaqConversation(
  from: string,
  to: string,
  subject: string,
  emailBody: string,
  outboundBody: string,
  outboundSubject: string,
  senderDisplay: string,
  messageId?: string
): Promise<void> {
  try {
    const payload = JSON.stringify({
      from,
      to,
      subject,
      emailBody,
      outboundBody,
      outboundSubject,
      senderDisplay,
      ...(messageId ? { messageId } : {}),
    })
    await runPython('backend.ingested_claims', ['save-faq-webhook'], payload)
  } catch {
    // Non-fatal — FAQ was answered; just couldn't persist the thread
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const from = (formData.get('from') as string) || ''
    const to = (formData.get('to') as string) || ''
    const subject = (formData.get('subject') as string) || ''
    const text = (formData.get('text') as string) || ''
    const html = (formData.get('html') as string) || ''
    const headers = (formData.get('headers') as string) || ''
    const emailBody = text || (html ? stripHtml(html) : '')

    // Extract Message-ID once — used for FAQ dedup and conversation persistence.
    const msgIdHeader = headers.match(/^Message-ID:\s*(.+)$/im)?.[1]?.trim()

    // Step 1 — Thread-reply check: if this is a follow-up on an existing claim, merge directly.
    // Follow-up emails don't repeat incident keywords so they'd fail the FNOL classifier below.
    const inReplyToHdr = parseInReplyTo(headers)
    const referencesHdr = parseReferences(headers)
    const isThreadReply = await runIsThreadReply(from, subject, inReplyToHdr, referencesHdr)
    if (isThreadReply) {
      // Skip both FNOL and FAQ checks — go straight to save-webhook for thread merge.
    } else {
      // Step 2 — FNOL gate: real loss reports must never get an FAQ auto-reply.
      const isFnol = await runShouldIngestGate(subject, emailBody)
      if (isFnol === true) {
        // Skip FAQ; save-webhook sends FNOL receipt acknowledgement
      } else {
        // Step 3 — FAQ check (message_id passed so process_faq_email can skip re-replies)
        const faqResult = await runFaqProcess(from, to, subject, emailBody, msgIdHeader)
        const skipIngestForFaq =
          faqResult != null &&
          (faqResult.skip_claim_ingestion === true ||
            (faqResult.skip_claim_ingestion === undefined &&
              faqResult.is_faq === true &&
              faqResult.answered === true))
        if (skipIngestForFaq) {
          if (!faqResult?.already_answered) {
            // Persist FAQ conversation so both inbound + auto-reply appear in the inbox thread.
            const senderEnv = process.env.SENDER_EMAIL || ''
            const senderDisplay = senderEnv ? `Claims Department <${senderEnv}>` : 'Claims Department'
            await saveFaqConversation(
              from, to, subject, emailBody,
              faqResult?.outbound_body ?? '',
              faqResult?.outbound_subject ?? `Re: ${subject}`,
              senderDisplay,
              msgIdHeader,
            )
          }
          return NextResponse.json(
            {
              success: true,
              faqAnswered: true,
              alreadyAnswered: faqResult?.already_answered ?? false,
              message: faqResult?.already_answered ? 'FAQ already answered, skipped re-reply' : 'FAQ reply sent',
            },
            { status: 200 }
          )
        }
      }
    }

    const attachmentCount = parseInt((formData.get('attachments') as string) || '0', 10)
    const attachmentFiles: Array<{ name: string; buffer: string; mimeType: string }> = []

    for (let i = 1; i <= attachmentCount; i++) {
      const file = formData.get(`attachment${i}`) as File | null
      if (file && file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        attachmentFiles.push({
          name: file.name || `attachment-${i}`,
          buffer: buffer.toString('base64'),
          mimeType: file.type || 'application/octet-stream',
        })
      }
    }

    const rawField = formData.get('email')
    let rawRfc822: string | undefined
    if (rawField instanceof File && rawField.size > 0) {
      const buf = Buffer.from(await rawField.arrayBuffer())
      rawRfc822 = buf.toString('base64')
    } else if (typeof rawField === 'string' && rawField.length > 0) {
      rawRfc822 = Buffer.from(rawField, 'utf-8').toString('base64')
    }

    const inReplyTo = parseInReplyTo(headers)
    const references = parseReferences(headers)

    const payload = JSON.stringify({
      from,
      to,
      subject,
      emailBody,
      attachmentFiles,
      headers,
      ...(inReplyTo ? { inReplyTo } : {}),
      ...(references ? { references } : {}),
      ...(rawRfc822 ? { rawRfc822 } : {}),
    })

    const stdout = await runPython('backend.ingested_claims', ['save-webhook'], payload)
    const result = JSON.parse(stdout.trim()) as {
      success?: boolean
      skipped?: boolean
      reason?: string
      message?: string
      claimId?: string
      policyNumber?: string
    }
    if (result.skipped) {
      return NextResponse.json(
        {
          success: true,
          skipped: true,
          reason: result.reason,
          message: result.message,
          ...(result.claimId ? { claimId: result.claimId } : {}),
        },
        { status: 200 }
      )
    }
    return NextResponse.json(
      {
        success: true,
        claimId: result.claimId,
        policyNumber: result.policyNumber,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('SendGrid Inbound Parse error:', error)
    return NextResponse.json(
      { error: 'Failed to process incoming email' },
      { status: 500 }
    )
  }
}
