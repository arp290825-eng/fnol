/**
 * Re-exports from Dashboard microservice (Python-backed).
 * @see services/dashboard
 */

export {
  saveProcessedClaim,
  getProcessedClaimSummaries,
  getProcessedClaimById,
  getCsvContent,
} from '@/services/dashboard'
export type { ProcessedClaimSummary } from '@/services/dashboard/types'
