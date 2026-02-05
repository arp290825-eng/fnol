/**
 * POST /api/sync-inbox
 * Delegates to backend email_ingestion (Python).
 */
import { NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

export async function POST() {
  try {
    const stdout = await runPython('backend.email_ingestion', [])
    const result = JSON.parse(stdout.trim())
    return NextResponse.json({
      success: result.success,
      ingested: result.ingested,
      scanned: result.scanned,
      skippedNoFnol: result.skippedNoFnol ?? 0,
      skippedDuplicate: result.skippedDuplicate ?? 0,
      errors: result.errors ?? [],
      hint: result.hint,
    })
  } catch (error) {
    console.error('Sync inbox error:', error)
    return NextResponse.json(
      {
        success: false,
        ingested: 0,
        scanned: 0,
        skippedNoFnol: 0,
        skippedDuplicate: 0,
        errors: [String(error)],
      },
      { status: 500 }
    )
  }
}
