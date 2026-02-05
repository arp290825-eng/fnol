/**
 * GET /api/ingested-claims/[id]
 * Delegates to backend ingested_claims (Python).
 */
import { NextRequest, NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const stdout = await runPython('backend.ingested_claims', ['get', id])
    const trimmed = stdout.trim()
    if (trimmed === 'null') {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }
    const claim = JSON.parse(trimmed)
    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
      { status: 500 }
    )
  }
}
