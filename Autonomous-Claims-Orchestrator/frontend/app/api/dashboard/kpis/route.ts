/**
 * GET /api/dashboard/kpis
 * Delegates to backend dashboard (Python).
 */
import { NextResponse } from 'next/server'
import { runPython } from '@/lib/backend'

export async function GET() {
  try {
    const stdout = await runPython('backend.dashboard', ['stats'])
    const kpis = JSON.parse(stdout.trim())
    return NextResponse.json(kpis)
  } catch (error) {
    console.error('Dashboard KPIs error:', error)
    return NextResponse.json(
      { error: 'Failed to load dashboard KPIs' },
      { status: 500 }
    )
  }
}
