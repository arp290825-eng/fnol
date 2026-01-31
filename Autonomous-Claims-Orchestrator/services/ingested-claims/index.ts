/**
 * Ingested Claims Microservice
 *
 * Manages FNOL claims ingested from email (IMAP, SendGrid, demo).
 * Provides CRUD, policy extraction, deduplication, and attachment handling.
 */

import fs from 'fs'
import path from 'path'
import type { IngestedClaim, IngestedAttachment } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const INGESTED_DIR = path.join(DATA_DIR, 'ingested-attachments')
const CLAIMS_FILE = path.join(DATA_DIR, 'ingested-claims.json')

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(INGESTED_DIR)) {
    fs.mkdirSync(INGESTED_DIR, { recursive: true })
  }
}

function getClaimsData(): IngestedClaim[] {
  ensureDataDir()
  if (!fs.existsSync(CLAIMS_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(CLAIMS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveClaimsData(claims: IngestedClaim[]): void {
  ensureDataDir()
  fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), 'utf-8')
}

function normalizeDedupKey(s: string): string {
  return s.trim().toLowerCase()
}

function normalizedSubjectFrom(subject: string, from: string): string {
  return normalizeDedupKey(`${subject}|${from}`)
}

function fallbackPolicyDisplay(messageId: string | undefined, claimId: string): string {
  if (!messageId) return claimId
  if (messageId.includes('<') && messageId.includes('@')) {
    const inner = messageId.replace(/^<|>$/g, '').trim()
    return inner || claimId
  }
  return claimId
}

function seedDemoClaims(): void {
  const scenariosDir = path.join(process.cwd(), 'demo-data', 'scenarios')
  if (!fs.existsSync(scenariosDir)) return

  const scenarios = [
    {
      folder: 'auto-collision',
      policyNumber: 'AC789456123',
      from: 'sarah.johnson@email.com',
      to: 'pranay.nath@aimill.in',
      subject: 'Car Accident Claim - Policy #AC789456123',
    },
    {
      folder: 'commercial-liability',
      policyNumber: 'CL789012345',
      from: 'antonio.martinez@tonysrestaurant.com',
      to: 'pranay.nath@aimill.in',
      subject: 'Commercial Liability Claim - Slip and Fall - Policy #CL789012345',
    },
    {
      folder: 'property-water-damage',
      policyNumber: 'HO456789234',
      from: 'robert.chen@email.com',
      to: 'pranay.nath@aimill.in',
      subject: 'Urgent - Water Damage Claim - Policy #HO456789234',
    },
  ]

  const claims: IngestedClaim[] = []
  const baseTime = Date.now() - 86400000 * 2

  for (let i = 0; i < scenarios.length; i++) {
    const s = scenarios[i]
    const emailPath = path.join(scenariosDir, s.folder, 'email.txt')
    const attachmentsDir = path.join(scenariosDir, s.folder, 'attachments')
    if (!fs.existsSync(emailPath)) continue

    const emailBody = fs.readFileSync(emailPath, 'utf-8')
    const claimId = `DEMO-${s.policyNumber}-${i}`
    const claimDir = path.join(INGESTED_DIR, claimId)
    fs.mkdirSync(claimDir, { recursive: true })

    const attachments: IngestedAttachment[] = []
    if (fs.existsSync(attachmentsDir)) {
      for (const file of fs.readdirSync(attachmentsDir)) {
        const srcPath = path.join(attachmentsDir, file)
        if (fs.statSync(srcPath).isFile()) {
          const destPath = path.join(claimDir, file)
          fs.copyFileSync(srcPath, destPath)
          attachments.push({
            name: file,
            path: destPath,
            size: fs.statSync(destPath).size,
            mimeType: 'text/plain',
          })
        }
      }
    }

    claims.push({
      id: claimId,
      policyNumber: s.policyNumber,
      from: s.from,
      to: s.to,
      subject: s.subject,
      emailBody,
      attachments,
      createdAt: new Date(baseTime + i * 3600000).toISOString(),
      source: 'demo',
    })
  }

  if (claims.length > 0) saveClaimsData(claims)
}

export { type IngestedClaim, type IngestedAttachment }

/** Extract policy number from email body using common patterns */
export function extractPolicyNumber(emailBody: string): string | null {
  const patterns = [
    /policy\s*#?\s*:?\s*([A-Z0-9]{6,})/i,
    /policy\s*number\s*:?\s*([A-Z0-9]{6,})/i,
    /Policy\s*#([A-Z0-9]+)/i,
    /#([A-Z]{2}\d{6,})/,
    /\b([A-Z]{2}\d{6,})\b/,
  ]
  for (const pattern of patterns) {
    const match = emailBody.match(pattern)
    if (match?.[1]) return match[1]
  }
  return null
}

/** Get existing message IDs for deduplication */
export function getExistingMessageIds(): Set<string> {
  const claims = getClaimsData()
  const ids = new Set<string>()
  for (const c of claims) {
    ids.add(normalizedSubjectFrom(c.subject, c.from))
    if (c.messageId) {
      ids.add(normalizeDedupKey(c.messageId))
      const inner = c.messageId.replace(/^<|>$/g, '').trim()
      if (inner) ids.add(normalizeDedupKey(inner))
    }
  }
  return ids
}

/** Add dedup keys for a newly ingested claim */
export function addDedupKeysToSet(
  ids: Set<string>,
  subject: string,
  from: string,
  messageId: string,
  dedupKey: string
): void {
  ids.add(normalizedSubjectFrom(subject, from))
  ids.add(normalizeDedupKey(dedupKey))
  if (messageId) {
    const inner = messageId.replace(/^<|>$/g, '').trim()
    if (inner) ids.add(normalizeDedupKey(inner))
  }
}

/** Check if email is a duplicate */
export function isDuplicateEmail(
  subject: string,
  from: string,
  messageId: string,
  dateHeader: string,
  existingIds: Set<string>
): boolean {
  if (existingIds.has(normalizedSubjectFrom(subject, from))) return true
  const dedupKey = messageId
    ? normalizeDedupKey(messageId)
    : normalizeDedupKey(`${subject}|${from}|${dateHeader}`)
  if (existingIds.has(dedupKey)) return true
  if (messageId) {
    const inner = messageId.replace(/^<|>$/g, '').trim()
    if (inner && existingIds.has(normalizeDedupKey(inner))) return true
  }
  return false
}

/** Save an ingested claim */
export function saveIngestedClaim(
  from: string,
  to: string,
  subject: string,
  emailBody: string,
  attachmentFiles: Array<{ name: string; buffer: Buffer; mimeType: string }>,
  source: 'sendgrid' | 'imap' = 'sendgrid',
  messageId?: string,
  emailMessageIdForDisplay?: string
): IngestedClaim {
  const claimId = `ING-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const extracted = extractPolicyNumber(emailBody) || extractPolicyNumber(subject)
  const policyNumber =
    extracted ?? fallbackPolicyDisplay(emailMessageIdForDisplay ?? messageId, claimId)

  ensureDataDir()
  const claimDir = path.join(INGESTED_DIR, claimId)
  fs.mkdirSync(claimDir, { recursive: true })

  const attachments: IngestedAttachment[] = []
  for (const file of attachmentFiles) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = path.join(claimDir, safeName)
    fs.writeFileSync(filePath, file.buffer)
    attachments.push({
      name: file.name,
      path: filePath,
      size: file.buffer.length,
      mimeType: file.mimeType || 'application/octet-stream',
    })
  }

  const claim: IngestedClaim = {
    id: claimId,
    policyNumber,
    from,
    to,
    subject,
    emailBody,
    attachments,
    createdAt: new Date().toISOString(),
    source,
  }
  if (messageId) claim.messageId = messageId

  const claims = getClaimsData()
  claims.unshift(claim)
  saveClaimsData(claims)
  return claim
}

/** Get all ingested claims */
export function getAllIngestedClaims(): IngestedClaim[] {
  let claims = getClaimsData()
  if (claims.length === 0) {
    seedDemoClaims()
    claims = getClaimsData()
  }
  const hasRealClaims = claims.some((c) => c.source === 'imap' || c.source === 'sendgrid')
  return hasRealClaims ? claims.filter((c) => c.source !== 'demo') : claims
}

/** Get a single claim by ID */
export function getIngestedClaimById(id: string): IngestedClaim | null {
  const claims = getClaimsData()
  return claims.find((c) => c.id === id) ?? null
}

/** Get policy numbers for dropdown */
export function getPolicyNumbers(): Array<{ id: string; policyNumber: string; subject: string }> {
  let claims = getClaimsData()
  if (claims.length === 0) {
    seedDemoClaims()
    claims = getClaimsData()
  }
  const hasRealClaims = claims.some((c) => c.source === 'imap' || c.source === 'sendgrid')
  const toShow = hasRealClaims ? claims.filter((c) => c.source !== 'demo') : claims
  return toShow.map((c) => ({ id: c.id, policyNumber: c.policyNumber, subject: c.subject }))
}

/** Clear all ingested claims */
export function clearAllIngestedClaims(): void {
  ensureDataDir()
  if (fs.existsSync(CLAIMS_FILE)) fs.unlinkSync(CLAIMS_FILE)
  if (fs.existsSync(INGESTED_DIR)) {
    for (const entry of fs.readdirSync(INGESTED_DIR, { withFileTypes: true })) {
      const fullPath = path.join(INGESTED_DIR, entry.name)
      if (entry.isDirectory()) fs.rmSync(fullPath, { recursive: true })
    }
  }
}

/** Read attachment content for processing */
export function readAttachmentContent(claimId: string, attachmentName: string): string {
  const claim = getIngestedClaimById(claimId)
  if (!claim) throw new Error('Claim not found')
  const att = claim.attachments.find((a) => a.name === attachmentName)
  if (!att || !fs.existsSync(att.path)) throw new Error('Attachment not found')
  const ext = path.extname(att.name).toLowerCase()
  if (['.txt', '.csv', '.log'].includes(ext)) {
    return fs.readFileSync(att.path, 'utf-8')
  }
  return `[Document: ${att.name} - content extracted for processing]`
}
