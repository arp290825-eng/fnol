/**
 * POST /api/process-claim
 * Delegates to backend process_claim orchestrator (Python).
 */
import { NextRequest, NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

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

    const stdout = await runPython('backend.process_claim', [ingestedClaimId])
    const claimData = JSON.parse(stdout.trim())
    if (claimData.error) {
      return NextResponse.json({ error: claimData.error }, { status: 404 })
    }
    return NextResponse.json(claimData)
  } catch (error) {
    console.error('Process claim error:', error)
    return NextResponse.json(
      { error: 'Claim processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
