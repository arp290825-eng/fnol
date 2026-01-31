/**
 * POST /api/process-claim
 * Orchestrates Extraction + Decision microservices.
 * Runs information_extraction.py, builds decision pack, saves to dashboard.
 */
import { NextRequest, NextResponse } from 'next/server'
import { runExtraction } from '@/services/extraction'
import { buildDecisionPack } from '@/services/decision'
import { getIngestedClaimById } from '@/services/ingested-claims'
import { saveProcessedClaim } from '@/services/dashboard'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingestedClaimId } = body

    if (!ingestedClaimId) {
      return NextResponse.json(
        { error: 'ingestedClaimId is required' },
        { status: 400 }
      )
    }

    const claim = getIngestedClaimById(ingestedClaimId)
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const extraction = await runExtraction(ingestedClaimId)
    const claimData = buildDecisionPack(ingestedClaimId, claim, extraction)

    await saveProcessedClaim(claimData as import('@/types/claims').ClaimData)
    return NextResponse.json(claimData)
  } catch (error) {
    console.error('Process claim error:', error)
    return NextResponse.json(
      { error: 'Claim processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
