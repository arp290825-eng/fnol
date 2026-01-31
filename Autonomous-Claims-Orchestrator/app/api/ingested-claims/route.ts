import { NextResponse } from 'next/server'
import { getPolicyNumbers, getAllIngestedClaims } from '@/lib/ingestedClaims'

/** GET /api/ingested-claims - List ingested claims for policy dropdown */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const full = searchParams.get('full') === 'true'

    if (full) {
      const claims = getAllIngestedClaims()
      return NextResponse.json(claims)
    }

    const policies = getPolicyNumbers()
    return NextResponse.json(policies)
  } catch (error) {
    console.error('Error fetching ingested claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingested claims' },
      { status: 500 }
    )
  }
}
