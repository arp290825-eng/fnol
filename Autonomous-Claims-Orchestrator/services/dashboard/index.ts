/**
 * Dashboard Microservice
 *
 * Manages processed claims history: save, list, retrieve by ID, export CSV.
 */

import fs from 'fs'
import path from 'path'
import type { ClaimData } from '@/types/claims'
import type { ProcessedClaimSummary } from './types'

const DATA_DIR = path.join(process.cwd(), 'data')
const CLAIMS_DIR = path.join(DATA_DIR, 'processed-claims')
const INDEX_FILE = path.join(CLAIMS_DIR, 'claims-index.json')
const CSV_FILE = path.join(CLAIMS_DIR, 'claims-history.csv')

function ensureDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(CLAIMS_DIR)) fs.mkdirSync(CLAIMS_DIR, { recursive: true })
}

type IndexEntry = {
  claimId: string
  ingestedClaimId?: string
  policyNumber?: string
  claimantName?: string
  createdAt: string
  filePath: string
}

function getIndex(): IndexEntry[] {
  ensureDir()
  if (!fs.existsSync(INDEX_FILE)) return []
  try {
    return JSON.parse(fs.readFileSync(INDEX_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function saveIndex(index: IndexEntry[]): void {
  ensureDir()
  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2), 'utf-8')
}

function escapeCsv(val: unknown): string {
  if (val == null || val === undefined) return ''
  const s = String(val)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function appendToCsv(claim: ClaimData): void {
  ensureDir()
  const draft = claim.decisionPack?.claimDraft
  const isNew = !fs.existsSync(CSV_FILE)
  const headers = [
    'claimId',
    'ingestedClaimId',
    'policyNumber',
    'claimantName',
    'contactEmail',
    'contactPhone',
    'lossDate',
    'lossType',
    'lossLocation',
    'description',
    'status',
    'createdAt',
  ]
  const row = [
    claim.claimId ?? '',
    claim.ingestedClaimId ?? '',
    draft?.policyNumber ?? '',
    draft?.claimantName ?? '',
    draft?.contactEmail ?? '',
    draft?.contactPhone ?? '',
    draft?.lossDate ?? '',
    draft?.lossType ?? '',
    (draft?.lossLocation || draft?.location) ?? '',
    draft?.description ?? '',
    claim.status ?? '',
    claim.createdAt ?? new Date().toISOString(),
  ]
  const line = isNew ? headers.map(escapeCsv).join(',') + '\n' : ''
  fs.appendFileSync(CSV_FILE, line + row.map(escapeCsv).join(',') + '\n', 'utf-8')
}

/** Save a processed claim to history and CSV */
export function saveProcessedClaim(claim: ClaimData): void {
  ensureDir()
  const claimId = claim.claimId || `CLM-${Date.now()}`
  const filePath = path.join(CLAIMS_DIR, `${claimId.replace(/[/\\:]/g, '_')}.json`)

  const toSave = { ...claim, claimId }
  fs.writeFileSync(filePath, JSON.stringify(toSave, null, 2), 'utf-8')

  const draft = claim.decisionPack?.claimDraft
  const index = getIndex()
  const existing = index.findIndex((e) => e.claimId === claimId)
  if (existing < 0) appendToCsv(toSave)

  const entry: IndexEntry = {
    claimId,
    ingestedClaimId: claim.ingestedClaimId,
    policyNumber: draft?.policyNumber,
    claimantName: draft?.claimantName,
    createdAt: claim.createdAt || new Date().toISOString(),
    filePath,
  }

  if (existing >= 0) {
    index[existing] = entry
  } else {
    index.unshift(entry)
  }
  saveIndex(index)
}

/** Get list of processed claim summaries for dropdown */
export function getProcessedClaimSummaries(): ProcessedClaimSummary[] {
  const index = getIndex()
  return index.map(({ claimId, ingestedClaimId, policyNumber, claimantName, createdAt }) => ({
    claimId,
    ingestedClaimId,
    policyNumber,
    claimantName,
    createdAt,
  }))
}

/** Get full claim data by ID */
export function getProcessedClaimById(claimId: string): ClaimData | null {
  const index = getIndex()
  const entry = index.find((e) => e.claimId === claimId)
  if (!entry || !fs.existsSync(entry.filePath)) return null
  try {
    return JSON.parse(fs.readFileSync(entry.filePath, 'utf-8')) as ClaimData
  } catch {
    return null
  }
}

/** Get CSV content for export */
export function getCsvContent(): string {
  if (!fs.existsSync(CSV_FILE)) return ''
  return fs.readFileSync(CSV_FILE, 'utf-8')
}
