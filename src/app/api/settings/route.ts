import { NextRequest, NextResponse } from 'next/server'
import { getSettings, updateSettings } from '@/lib/settings-store'

export async function GET() {
  return NextResponse.json(getSettings())
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updated = updateSettings(body)
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}


