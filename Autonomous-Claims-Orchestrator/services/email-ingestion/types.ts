/**
 * Email Ingestion Microservice - Type definitions
 */

export interface SyncResult {
  success: boolean
  ingested: number
  scanned: number
  skippedNoFnol: number
  skippedDuplicate?: number
  errors: string[]
  hint?: string
  mailboxUsed?: string
}
