/**
 * POST /api/sync-inbox
 * Delegates to Email Ingestion microservice.
 */
import { NextResponse } from 'next/server'
import { syncInbox } from '@/services/email-ingestion'

export async function POST() {
  try {
    const result = await syncInbox()

    return NextResponse.json({
      success: result.success,
      ingested: result.ingested,
      scanned: result.scanned,
      skippedNoFnol: result.skippedNoFnol,
      skippedDuplicate: result.skippedDuplicate ?? 0,
      errors: result.errors,
      hint: result.hint,
    })
  } catch (error) {
    console.error('Sync inbox error:', error)
    return NextResponse.json(
      { success: false, ingested: 0, scanned: 0, skippedNoFnol: 0, skippedDuplicate: 0, errors: [String(error)] },
      { status: 500 }
    )
  }
}
