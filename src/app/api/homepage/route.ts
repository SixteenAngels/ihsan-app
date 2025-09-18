import { NextRequest, NextResponse } from 'next/server'
import { getHomepageSettings, updateHomepageSettings } from '@/lib/homepage-store'

export async function GET() {
  return NextResponse.json(getHomepageSettings())
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updated = updateHomepageSettings(body)
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}


