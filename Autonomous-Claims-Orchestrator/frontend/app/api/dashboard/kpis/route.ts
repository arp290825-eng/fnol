/**
 * GET /api/dashboard/kpis
 * Proxies to FastAPI backend server.
 */
import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET() {
  try {
    // Proxy to FastAPI server
    const response = await fetch(getApiUrl('api/dashboard/kpis'), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.detail || 'Failed to load dashboard KPIs' },
        { status: response.status }
      )
    }

    const kpis = await response.json()
    return NextResponse.json(kpis)
  } catch (error) {
    console.error('Dashboard KPIs error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard KPIs' },
      { status: 500 }
    )
  }
}
