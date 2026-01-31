import { NextResponse } from 'next/server'
import { clearAllIngestedClaims } from '@/lib/ingestedClaims'

/** POST /api/ingested-claims/clear - Clear all ingested claims for fresh start */
export async function POST() {
  try {
    clearAllIngestedClaims()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Clear ingested claims error:', error)
    return NextResponse.json(
      { error: 'Failed to clear claims' },
      { status: 500 }
    )
  }
}
