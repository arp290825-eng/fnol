import { NextResponse } from 'next/server'
import { getCsvContent } from '@/services/dashboard'

/** GET /api/claims/export - Download claims history as CSV */
export async function GET() {
  try {
    const csv = getCsvContent()
    if (!csv) {
      return new NextResponse('claimId,ingestedClaimId,policyNumber,claimantName,contactEmail,contactPhone,lossDate,lossType,lossLocation,description,status,createdAt\n', {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="claims-history.csv"',
        },
      })
    }
    return new NextResponse(csv.trim() || 'claimId,ingestedClaimId,policyNumber,claimantName,contactEmail,contactPhone,lossDate,lossType,lossLocation,description,status,createdAt\n', {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="claims-history.csv"',
      },
    })
  } catch (error) {
    console.error('Export CSV error:', error)
    return NextResponse.json({ error: 'Failed to export CSV' }, { status: 500 })
  }
}
