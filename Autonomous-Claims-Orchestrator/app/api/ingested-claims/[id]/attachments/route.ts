import { NextRequest, NextResponse } from 'next/server'
import { getIngestedClaimById } from '@/lib/ingestedClaims'
import fs from 'fs'
import path from 'path'

/**
 * GET /api/ingested-claims/[id]/attachments?name=filename.jpg
 * Serves attachment file for image preview.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const name = request.nextUrl.searchParams.get('name')
    if (!name) {
      return NextResponse.json({ error: 'name query parameter required' }, { status: 400 })
    }

    const claim = getIngestedClaimById(id)
    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    const att = claim.attachments.find((a) => a.name === name)
    if (!att || !fs.existsSync(att.path)) {
      return NextResponse.json({ error: 'Attachment not found' }, { status: 404 })
    }

    const ext = path.extname(att.name).toLowerCase()
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    const isImage = imageExts.includes(ext) || (att.mimeType || '').startsWith('image/')
    if (!isImage) {
      return NextResponse.json({ error: 'Not an image attachment' }, { status: 400 })
    }

    const buffer = fs.readFileSync(att.path)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': att.mimeType || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Attachment serve error:', error)
    return NextResponse.json({ error: 'Failed to serve attachment' }, { status: 500 })
  }
}
