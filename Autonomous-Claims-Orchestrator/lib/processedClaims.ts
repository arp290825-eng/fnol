/**
 * Re-exports from Dashboard microservice.
 * @see services/dashboard
 */

export {
  saveProcessedClaim,
  getProcessedClaimSummaries,
  getProcessedClaimById,
  getCsvContent,
} from '@/services/dashboard'
export type { ProcessedClaimSummary } from '@/services/dashboard/types'
