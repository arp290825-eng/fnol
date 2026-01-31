/**
 * Re-exports from Ingested Claims microservice.
 * @see services/ingested-claims
 */

export {
  extractPolicyNumber,
  getExistingMessageIds,
  addDedupKeysToSet,
  isDuplicateEmail,
  saveIngestedClaim,
  getAllIngestedClaims,
  getIngestedClaimById,
  getPolicyNumbers,
  clearAllIngestedClaims,
  readAttachmentContent,
  type IngestedClaim,
  type IngestedAttachment,
} from '@/services/ingested-claims'
