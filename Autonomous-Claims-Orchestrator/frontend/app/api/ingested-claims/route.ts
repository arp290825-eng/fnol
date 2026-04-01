/**
 * GET /api/ingested-claims
 * Proxies to FastAPI backend server.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Forward all query params (full, source, etc.) to the FastAPI backend
    const qs = searchParams.toString()
    const url = getApiUrl(`api/ingested-claims${qs ? `?${qs}` : ''}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.detail || 'Failed to fetch ingested claims' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching ingested claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ingested claims' },
      { status: 500 }
    )
  }
}
