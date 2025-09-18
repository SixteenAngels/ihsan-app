import { NextRequest, NextResponse } from 'next/server'
import { getVendorStore, updateVendorStore } from '@/lib/vendor-store'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const vendorId = searchParams.get('vendorId') || 'vendor-1'
  return NextResponse.json(getVendorStore(vendorId))
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const vendorId = body.vendorId || 'vendor-1'
    const updated = updateVendorStore(vendorId, body)
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}


