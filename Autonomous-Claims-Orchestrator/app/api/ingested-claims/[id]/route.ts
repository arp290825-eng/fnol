import { NextRequest, NextResponse } from 'next/server'
import { getIngestedClaimById } from '@/lib/ingestedClaims'

/** GET /api/ingested-claims/[id] - Get single ingested claim with email and attachments */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const claim = getIngestedClaimById(id)

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
      { status: 500 }
    )
  }
}
