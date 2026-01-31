import { NextRequest, NextResponse } from 'next/server'
import { saveProcessedClaim, getProcessedClaimSummaries } from '@/services/dashboard'
import { ClaimData } from '@/types/claims'

/** GET /api/claims - List all processed claims for dropdown */
export async function GET() {
  try {
    const summaries = getProcessedClaimSummaries()
    return NextResponse.json(summaries)
  } catch (error) {
    console.error('List claims error:', error)
    return NextResponse.json({ error: 'Failed to list claims' }, { status: 500 })
  }
}

/** POST /api/claims - Save a processed claim to history and CSV */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ClaimData
    if (!body?.decisionPack) {
      return NextResponse.json({ error: 'Invalid claim data' }, { status: 400 })
    }
    saveProcessedClaim(body)
    return NextResponse.json({ success: true, claimId: body.claimId })
  } catch (error) {
    console.error('Save claim error:', error)
    return NextResponse.json({ error: 'Failed to save claim' }, { status: 500 })
  }
}
