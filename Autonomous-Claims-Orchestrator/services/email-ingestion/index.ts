/**
 * Email Ingestion Microservice
 *
 * Fetches emails from IMAP (Gmail/Outlook), classifies via LLM (FNOL vs non-FNOL),
 * ingests only FNOL-related content. Uses Node.js imapflow - no Python required.
 */

import { ImapFlow } from 'imapflow'
// @ts-expect-error - mailparser has no types
import { simpleParser } from 'mailparser'
import OpenAI from 'openai'
import {
  saveIngestedClaim,
  getExistingMessageIds,
  isDuplicateEmail,
  addDedupKeysToSet,
} from '@/services/ingested-claims'
import type { SyncResult } from './types'

const IMAP_HOST = process.env.IMAP_HOST || 'imap.gmail.com'
const IMAP_PORT = parseInt(process.env.IMAP_PORT || '993', 10)
const IMAP_USER = process.env.SENDER_EMAIL || process.env.IMAP_USER || ''
const IMAP_PASSWORD = (process.env.EMAIL_PASSWORD || process.env.IMAP_PASSWORD || '').replace(/\s/g, '')
const IMAP_MAILBOX = process.env.IMAP_MAILBOX || 'INBOX'
const INCLUDE_READ = process.env.IMAP_SYNC_INCLUDE_READ !== 'false'
const MAX_EMAILS = parseInt(process.env.IMAP_SYNC_MAX_EMAILS || '100', 10)
const FNOL_FILTER_ENABLED = process.env.FNOL_FILTER_ENABLED !== 'false'

async function classifyFnolByLLM(subject: string, body: string): Promise<boolean> {
  if (!FNOL_FILTER_ENABLED) return true
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return true

  try {
    const openai = new OpenAI({ apiKey })
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    const text = `Subject: ${subject}\n\nBody:\n${body.slice(0, 3000)}`

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `You are an FNOL classifier. Determine if this email is a First Notice of Loss (FNOL) or insurance claim submission.
FNOL = an insured person notifying their insurer of a loss, incident, or damage to file a claim (e.g. accident, water damage, theft, fire, collision, bodily injury, property damage).
Reply with ONLY "yes" or "no".`,
        },
        {
          role: 'user',
          content: `Is this email an FNOL or insurance claim submission?\n\n${text}`,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    })

    const answer = (response.choices[0]?.message?.content || '').trim().toLowerCase()
    return answer.startsWith('yes')
  } catch (err) {
    console.error('FNOL classifier error:', err)
    return true
  }
}

function formatAddress(addr: unknown): string {
  if (!addr) return ''
  const arr = Array.isArray(addr) ? addr : [addr]
  return arr
    .map((a: { text?: string; address?: string; value?: { 0?: { address?: string } } }) =>
      a?.text || (a as { address?: string })?.address || (a as { value?: { 0?: { address?: string } } })?.value?.[0]?.address
    )
    .filter(Boolean)
    .join(', ')
}

function formatDate(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleString('en-US', {
    month: 'long' as const,
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function buildFullEmailBody(opts: {
  subject: string
  from: string
  to: string
  dateStr: string
  bodyText: string
}): string {
  const lines: string[] = []
  if (opts.subject) lines.push(`Subject: ${opts.subject}`)
  if (opts.from) lines.push(`From: ${opts.from}`)
  if (opts.to) lines.push(`To: ${opts.to}`)
  if (opts.dateStr) lines.push(`Date: ${opts.dateStr}`)
  if (lines.length) lines.push('')
  if (opts.bodyText) lines.push(opts.bodyText.trim())
  return lines.join('\n')
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Sync inbox from IMAP and ingest FNOL emails */
export async function syncInbox(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    ingested: 0,
    scanned: 0,
    skippedNoFnol: 0,
    skippedDuplicate: 0,
    errors: [],
  }

  if (!IMAP_USER || !IMAP_PASSWORD) {
    result.errors.push('IMAP credentials not configured. Set SENDER_EMAIL and EMAIL_PASSWORD in .env')
    return result
  }

  const client = new ImapFlow({
    host: IMAP_HOST,
    port: IMAP_PORT,
    secure: true,
    auth: { user: IMAP_USER, pass: IMAP_PASSWORD },
    logger: false,
  })

  const mailboxesToTry: string[] = [IMAP_MAILBOX]
  if (IMAP_HOST.toLowerCase().includes('gmail') && IMAP_MAILBOX.toUpperCase() === 'INBOX') {
    if (INCLUDE_READ) {
      mailboxesToTry.unshift('[Gmail]/All Mail', '[Google Mail]/All Mail')
    } else {
      mailboxesToTry.push('[Gmail]/All Mail', '[Google Mail]/All Mail')
    }
  }

  try {
    await client.connect()

    let uids: number[] = []
    let mailboxUsed = ''

    for (const mbox of mailboxesToTry) {
      try {
        const lock = await client.getMailboxLock(mbox)
        try {
          const searchCriteria = INCLUDE_READ ? { all: true } : { seen: false }
          const searchResult = await client.search(searchCriteria, { uid: true })
          let list = Array.isArray(searchResult) ? searchResult : []
          list = list.slice(-MAX_EMAILS)
          if (list.length > 0) {
            uids = list
            mailboxUsed = mbox
            break
          }
        } finally {
          lock.release()
        }
      } catch {
        continue
      }
    }

    if (uids.length === 0) {
      result.success = true
      result.hint =
        "Inbox empty. For Gmail: enable 'All Mail' in Settings > Labels > Show in IMAP, or set IMAP_MAILBOX='[Gmail]/All Mail' in .env"
      await client.logout()
      return result
    }

    result.scanned = uids.length
    result.mailboxUsed = mailboxUsed
    const existingIds = getExistingMessageIds()
    const lock = await client.getMailboxLock(mailboxUsed || IMAP_MAILBOX)

    try {
      const messages = await client.fetch(
        uids,
        { envelope: true, source: true, uid: true },
        { uid: true }
      )

      for await (const msg of messages) {
        try {
          const rawSource = msg.source
          if (!rawSource) {
            result.errors.push(`Message ${msg.uid}: No source data`)
            continue
          }

          const rawBuffer = Buffer.isBuffer(rawSource) ? rawSource : Buffer.from(rawSource as Buffer)
          const parsed = await simpleParser(rawBuffer)

          const subject = parsed.subject || '(No subject)'
          const from = formatAddress(parsed.from) || ''
          const to = formatAddress(parsed.to) || ''
          const messageId = parsed.messageId || ''
          const dateHeader = parsed.date ? String(parsed.date) : ''
          const dedupKey = messageId || `${subject}|${from}|${dateHeader}`

          if (isDuplicateEmail(subject, from, messageId, dateHeader, existingIds)) {
            result.skippedDuplicate = (result.skippedDuplicate ?? 0) + 1
            continue
          }

          const bodyText = parsed.text || (parsed.html ? stripHtml(parsed.html) : '')
          const isFnol = await classifyFnolByLLM(subject, bodyText)
          if (!isFnol) {
            result.skippedNoFnol++
            continue
          }

          const dateStr = parsed.date ? formatDate(parsed.date) : ''
          const emailBody = buildFullEmailBody({ subject, from, to, dateStr, bodyText })

          const attachmentFiles: Array<{ name: string; buffer: Buffer; mimeType: string }> = []
          if (parsed.attachments?.length) {
            for (const att of parsed.attachments) {
              const content = att.content
              const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content || [])
              const filename = att.filename || `attachment-${attachmentFiles.length + 1}`
              const mimeType = att.contentType || 'application/octet-stream'
              attachmentFiles.push({ name: filename, buffer, mimeType })
            }
          }

          saveIngestedClaim(
            from,
            to,
            subject,
            emailBody,
            attachmentFiles,
            'imap',
            dedupKey,
            messageId || undefined
          )
          result.ingested++
          addDedupKeysToSet(existingIds, subject, from, messageId, dedupKey)

          if (!INCLUDE_READ) {
            await client.messageFlagsAdd(msg.uid, ['\\Seen'], { uid: true })
          }
        } catch (err) {
          result.errors.push(
            `Failed to process message ${msg.uid}: ${err instanceof Error ? err.message : String(err)}`
          )
        }
      }

      result.success = result.errors.length === 0
    } finally {
      lock.release()
    }

    await client.logout()
  } catch (err) {
    result.errors.push(err instanceof Error ? err.message : String(err))
    try {
      await client.logout()
    } catch {
      // ignore
    }
  }

  return result
}
