/**
 * POST /api/ingested-claims/clear
 * Delegates to backend ingested_claims (Python).
 */
import { NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

export async function POST() {
  try {
    await runPython('backend.ingested_claims', ['clear'])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear ingested claims error:', error)
    return NextResponse.json(
      { error: 'Failed to clear claims' },
      { status: 500 }
    )
  }
}
