/**
 * Re-exports from Email Ingestion microservice.
 * @see services/email-ingestion
 */

export { syncInbox as syncInboxFromIMAP } from '@/services/email-ingestion'
export type { SyncResult } from '@/services/email-ingestion/types'
