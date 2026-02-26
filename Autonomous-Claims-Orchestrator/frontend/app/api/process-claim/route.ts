/**
 * POST /api/process-claim
 * Proxies to FastAPI backend server.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

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

    // Proxy to FastAPI server
    const response = await fetch(getApiUrl('api/process-claim'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingestedClaimId }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.error || 'Processing failed' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Process claim error:', error)
    return NextResponse.json(
      { error: 'Claim processing failed', details: String(error) },
      { status: 500 }
    )
  }
}
