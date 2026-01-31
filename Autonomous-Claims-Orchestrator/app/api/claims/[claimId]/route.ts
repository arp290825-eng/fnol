import { NextRequest, NextResponse } from 'next/server'
import { getProcessedClaimById } from '@/services/dashboard'

/** GET /api/claims/[claimId] - Load a processed claim by ID */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ claimId: string }> }
) {
  try {
    const { claimId } = await params
    if (!claimId) {
      return NextResponse.json({ error: 'claimId required' }, { status: 400 })
    }
    const claim = getProcessedClaimById(decodeURIComponent(claimId))
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }
    return NextResponse.json(claim)
  } catch (error) {
    console.error('Load claim error:', error)
    return NextResponse.json({ error: 'Failed to load claim' }, { status: 500 })
  }
}
