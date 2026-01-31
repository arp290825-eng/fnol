/**
 * Ingested Claims Service - Type definitions
 */

export interface IngestedAttachment {
  name: string
  path: string
  size: number
  mimeType: string
}

export interface IngestedClaim {
  id: string
  policyNumber: string
  from: string
  to: string
  subject: string
  emailBody: string
  attachments: IngestedAttachment[]
  createdAt: string
  source: 'sendgrid' | 'demo' | 'imap'
  messageId?: string
}
