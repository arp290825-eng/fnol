/**
 * Dashboard Microservice - Type definitions
 */

export interface ProcessedClaimSummary {
  claimId: string
  ingestedClaimId?: string
  policyNumber?: string
  claimantName?: string
  createdAt: string
}
