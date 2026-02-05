/**
 * GET/POST /api/claims
 * Delegates to backend dashboard (Python).
 */
import { NextRequest, NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'
import type { ClaimData } from '@/types/claims'

/** GET /api/claims - List processed claim summaries */
export async function GET() {
  try {
    const stdout = await runPython('backend.dashboard', ['list'])
    const summaries = JSON.parse(stdout.trim())
    return NextResponse.json(summaries)
  } catch (error) {
    console.error('List claims error:', error)
    return NextResponse.json(
      { error: 'Failed to list claims' },
      { status: 500 }
    )
  }
}

/** POST /api/claims - Save a processed claim */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ClaimData
    if (!body?.decisionPack) {
      return NextResponse.json(
        { error: 'Invalid claim data' },
        { status: 400 }
      )
    }
    const input = JSON.stringify(body)
    const stdout = await runPython('backend.dashboard', ['save'], input)
    const parsed = JSON.parse(stdout.trim())
    if (parsed.error) {
      throw new Error(parsed.error)
    }
    return NextResponse.json({
      success: true,
      claimId: body.claimId,
    })
  } catch (error) {
    console.error('Save claim error:', error)
    return NextResponse.json(
      { error: 'Failed to save claim' },
      { status: 500 }
    )
  }
}
