/**
 * Decision Microservice - Type definitions
 */

import type { PolicyHit } from '@/types/claims'
import type { ExtractionResult } from '@/services/extraction/types'
import type { IngestedClaim } from '@/services/ingested-claims'

export interface DecisionInput {
  ingestedClaimId: string
  claim: IngestedClaim
  extraction: ExtractionResult
}

export { type PolicyHit, type IngestedClaim, type ExtractionResult }
