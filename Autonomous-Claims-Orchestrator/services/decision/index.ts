/**
 * Decision Microservice
 *
 * Builds decision pack: policy grounding, claim draft, evidence summary,
 * document analysis, and policy assessment.
 */

import { getPolicyGrounding } from '@/lib/policyClauses'
import { CONFIDENCE } from '@/lib/confidence'
import type { ClaimData, ClaimDraft, Document, LossType } from '@/types/claims'
import type { IngestedClaim } from '@/services/ingested-claims'
import type { ExtractionResult } from '@/services/extraction'

function maskEmail(email: string | null): string {
  if (!email) return 'Not found'
  const [user, domain] = email.split('@')
  return `${user.slice(0, 2)}***@${domain}`
}

function maskPhone(phone: string | null): string {
  if (!phone) return 'Not found'
  return phone.replace(/\d(?=\d{4})/g, '*')
}

/** Build claim draft from extraction result */
function buildClaimDraft(
  fields: Record<string, unknown>,
  claim: IngestedClaim,
  extraction: ExtractionResult
): ClaimDraft {
  const now = new Date().toISOString()
  return {
    id: `DRAFT-${Date.now()}`,
    policyNumber: (fields.policyNumber as string)
      ? `***${String(fields.policyNumber).slice(-3)}`
      : 'Not found',
    claimantName: (fields.claimantName as string) || 'Not found',
    contactEmail: maskEmail((fields.contactEmail as string) ?? null),
    contactPhone: maskPhone((fields.contactPhone as string) ?? null),
    lossDate: (fields.lossDate as string) || now.split('T')[0],
    lossType: ((fields.lossType as string) || 'Other') as LossType,
    lossLocation: (fields.lossLocation as string) || 'See description',
    description: (fields.description as string) || 'Claim submitted via email',
    estimatedAmount: (fields.estimatedAmount as number) ?? (fields.estimatedDamage as number) ?? 0,
    vehicleInfo: fields.vehicleInfo as Record<string, unknown> | undefined,
    propertyAddress: fields.propertyAddress as string | undefined,
    attachments: claim.attachments.map((a, i) => ({
      id: `doc_${i}`,
      name: a.name,
      type: extraction.documents[i]?.type || 'Other',
      mimeType: a.mimeType,
      confidence: extraction.documents[i]?.confidence ?? 0.7,
    })),
    coverageFound: !!fields.policyNumber,
    deductible: fields.policyNumber ? 500 : undefined,
    createdAt: now,
    source: 'information_extraction',
    confidence:
      extraction.evidence.length > 0
        ? extraction.evidence.reduce((s, e) => s + e.confidence, 0) / extraction.evidence.length
        : 0,
  }
}

/** Build full decision pack and claim data */
export function buildDecisionPack(
  ingestedClaimId: string,
  claim: IngestedClaim,
  extraction: ExtractionResult
): ClaimData {
  const fields = extraction.extractedFields || {}
  const policyGrounding = getPolicyGrounding(fields)
  const claimDraft = buildClaimDraft(fields, claim, extraction)
  const now = new Date().toISOString()
  const claimId = `CLM-${ingestedClaimId}`

  const ev = extraction.evidence
  const docs = extraction.documents

  return {
    claimId,
    ingestedClaimId,
    decisionPack: {
      id: `DP-${Date.now()}`,
      claimDraft,
      evidence: extraction.evidence,
      documents: extraction.documents.map((d) => ({ ...d, metadata: {} })) as Document[],
      policyGrounding,
      audit: [
        {
          step: 'information_extraction',
          timestamp: now,
          duration: 0,
          agent: 'InformationExtraction',
          status: 'completed' as const,
          details: {
            documentsProcessed: extraction.documents.length,
            errors: extraction.errors,
          },
        },
      ],
      evidenceSummary: {
        totalFields: 8,
        highConfidenceFields: ev.filter((e: { confidence: number }) => e.confidence >= CONFIDENCE.THRESHOLD_HIGH).length,
        lowConfidenceFields: ev.filter((e: { confidence: number }) => e.confidence < CONFIDENCE.THRESHOLD_MEDIUM).length,
        avgConfidence: ev.length > 0 ? ev.reduce((s: number, e: { confidence: number }) => s + e.confidence, 0) / ev.length : 0,
      },
      documentAnalysis: {
        totalDocuments: docs.length,
        documentTypes: docs.map((d: { type: string }) => d.type),
        avgDocumentConfidence:
          docs.length > 0 ? docs.reduce((s: number, d: { confidence: number }) => s + d.confidence, 0) / docs.length : 0,
        missingDocuments: [],
      },
      policyAssessment: {
        clausesFound: policyGrounding.length,
        coverageConfirmed: !!fields.policyNumber && policyGrounding.length > 0,
        topSimilarityScore: (policyGrounding[0]?.score ?? policyGrounding[0]?.similarity ?? 0) as number,
        recommendedActions:
          policyGrounding.length > 0
            ? ['Proceed with claim – policy clauses matched']
            : ['Manual review – no matching policy clauses found'],
      },
      processingSummary: {
        totalTime: 0,
        stepsCompleted: 4,
        stepsWithErrors: extraction.errors.length,
        automationLevel: 0.9,
      },
      createdAt: now,
    },
    auditTrail: [
      {
        step: 'process_claim',
        timestamp: now,
        duration: 0,
        agent: 'ProcessClaimAPI',
        status: 'completed' as const,
        details: { openaiIntegration: 'active', model: 'gpt-4o' },
      },
    ],
    processingMetrics: {
      totalProcessingTime: 0,
      averageHandleTime: 0,
      fieldsAutoPopulated: extraction.evidence.length,
      overrideRate: 0.1,
      ragHitRate: 1.0,
      stepsCompleted: 4,
      stepsFailed: extraction.errors.length,
      successRate: extraction.errors.length === 0 ? 1.0 : 0.9,
    },
    createdAt: now,
    status: 'draft',
  }
}
