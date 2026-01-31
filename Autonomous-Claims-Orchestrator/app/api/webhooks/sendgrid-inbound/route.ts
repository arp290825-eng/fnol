import { NextRequest, NextResponse } from 'next/server'
import { saveIngestedClaim } from '@/lib/ingestedClaims'

/**
 * SendGrid Inbound Parse Webhook
 * Receives POST from SendGrid when an email is sent to the configured address.
 * Configure in SendGrid: Settings > Inbound Parse > Add Host & URL
 * URL: https://your-domain.com/api/webhooks/sendgrid-inbound
 *
 * For local dev: use ngrok to expose localhost
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const from = (formData.get('from') as string) || ''
    const to = (formData.get('to') as string) || ''
    const subject = (formData.get('subject') as string) || ''
    const text = (formData.get('text') as string) || ''
    const html = (formData.get('html') as string) || ''
    const emailBody = text || (html ? stripHtml(html) : '')

    const attachmentCount = parseInt((formData.get('attachments') as string) || '0', 10)
    const attachmentFiles: Array< { name: string; buffer: Buffer; mimeType: string }> = []

    for (let i = 1; i <= attachmentCount; i++) {
      const file = formData.get(`attachment${i}`) as File | null
      if (file && file instanceof File && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const mimeType = file.type || 'application/octet-stream'
        attachmentFiles.push({
          name: file.name || `attachment-${i}`,
          buffer,
          mimeType,
        })
      }
    }

    const claim = saveIngestedClaim(from, to, subject, emailBody, attachmentFiles)

    return NextResponse.json(
      { success: true, claimId: claim.id, policyNumber: claim.policyNumber },
      { status: 200 }
    )
  } catch (error) {
    console.error('SendGrid Inbound Parse error:', error)
    return NextResponse.json(
      { error: 'Failed to process incoming email' },
      { status: 500 }
    )
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
