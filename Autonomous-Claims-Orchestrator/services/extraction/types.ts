/**
 * Extraction Microservice - Type definitions
 */

export interface ExtractionDocument {
  id: string
  name: string
  mimeType: string
  type: string
  content: string
  confidence: number
  keyFields?: Record<string, unknown>
}

export interface ExtractionEvidence {
  field: string
  fieldName?: string
  value: string
  confidence: number
  sourceLocator: string
  rationale: string
}

export interface ExtractionResult {
  extractedFields: Record<string, unknown>
  documents: ExtractionDocument[]
  evidence: ExtractionEvidence[]
  errors: string[]
}
