/**
 * GET /api/claims/[claimId]
 * Delegates to backend dashboard (Python).
 */
import { NextRequest, NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params
    if (!claimId) {
      return NextResponse.json(
        { error: 'claimId required' },
        { status: 400 }
      )
    }
    const stdout = await runPython('backend.dashboard', ['get', decodeURIComponent(claimId)])
    const trimmed = stdout.trim()
    if (trimmed === 'null') {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }
    const claim = JSON.parse(trimmed)
    return NextResponse.json(claim)
  } catch (error) {
    console.error('Load claim error:', error)
    return NextResponse.json(
      { error: 'Failed to load claim' },
      { status: 500 }
    )
  }
}
