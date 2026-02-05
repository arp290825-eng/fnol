/**
 * GET /api/ingested-claims
 * Delegates to backend ingested_claims (Python).
 */
import { NextRequest, NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const full = searchParams.get('full') === 'true'

    const cmd = full ? 'list-full' : 'list'
    const stdout = await runPython('backend.ingested_claims', [cmd])
    const data = JSON.parse(stdout.trim())
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching ingested claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingested claims' },
      { status: 500 }
    )
  }
}
