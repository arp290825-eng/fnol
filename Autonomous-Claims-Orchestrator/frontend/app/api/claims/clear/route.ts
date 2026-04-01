/**
 * POST /api/claims/clear
 * Clears processed-claims index, CSV, and per-claim JSON (FastAPI proxy).
 */
import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST() {
  try {
    const response = await fetch(getApiUrl('api/claims/clear'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.detail || 'Failed to clear processed claims' },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Clear processed claims error:', error)
    return NextResponse.json(
      { error: 'Failed to clear processed claims' },
      { status: 500 }
    )
  }
}
