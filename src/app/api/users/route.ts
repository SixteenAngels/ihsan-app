import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const email = searchParams.get('email')
  const role = searchParams.get('role')
  const vendorStatus = searchParams.get('vendorStatus')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  try {
    // Use 'as any' to avoid deep type instantiation issues on select typing
    let query: any = supabase
      .from('profiles')
      .select('id,email,full_name,phone,avatar_url,role,is_active,created_at,updated_at,vendor_status', { count: 'exact' } as any)

    if (id) query = query.eq('id', id)
    if (email) query = query.eq('email', email)
    if (role) query = query.eq('role', role)
    if (vendorStatus) query = query.eq('vendor_status' as any, vendorStatus as any)

    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data, error, count } = await query.range(from, to)
    if (error) throw error

    if (id || email) {
      const single = data && data[0]
      if (!single) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      return NextResponse.json(single)
    }

    const totalCount = (count ?? (data ? data.length : 0)) as number
    const pages = Math.ceil((totalCount || 0) / limit) || 1
    return NextResponse.json({
      users: data || [],
      pagination: {
        page,
        limit,
        total: totalCount,
        pages,
      },
    })
  } catch (e) {
    return NextResponse.json({ users: [], pagination: { page, limit, total: 0, pages: 1 } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: body.id,
          email: body.email,
          full_name: body.fullName || null,
          phone: body.phone || null,
          avatar_url: body.avatarUrl || null,
          role: body.role || 'customer',
          vendor_status: body.vendorStatus || null,
        } as any,
      ])
      .select('id,email,full_name,phone,avatar_url,role,is_active,created_at,updated_at,vendor_status')
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const patch: any = {
      email: updateData.email,
      full_name: updateData.fullName,
      phone: updateData.phone,
      avatar_url: updateData.avatarUrl,
      role: updateData.role,
      vendor_status: updateData.vendorStatus,
      is_active: (updateData as any).isActive ?? (updateData as any).is_active,
      updated_at: new Date().toISOString(),
    }
    Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k])

    const { data, error } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', id)
      .select('id,email,full_name,phone,avatar_url,role,created_at,updated_at,vendor_status')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  try {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}