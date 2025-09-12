import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/group-buys - Get active group buys
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('group_buys')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          images,
          price
        ),
        profiles (
          full_name
        ),
        group_buy_participants (
          id,
          quantity,
          joined_at,
          profiles (
            full_name
          )
        )
      `)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (data?.length || 0) === limit
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/group-buys - Create new group buy
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      product_id, 
      name, 
      description, 
      min_quantity, 
      max_quantity, 
      price_tiers,
      start_date,
      end_date,
      created_by 
    } = body

    if (!product_id || !name || !min_quantity || !max_quantity || !price_tiers || !start_date || !end_date || !created_by) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate dates
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    
    if (endDate <= startDate) {
      return NextResponse.json({
        success: false,
        error: 'End date must be after start date'
      }, { status: 400 })
    }

    if (startDate <= new Date()) {
      return NextResponse.json({
        success: false,
        error: 'Start date must be in the future'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('group_buys')
      .insert({
        product_id,
        name,
        description,
        min_quantity,
        max_quantity,
        current_quantity: 0,
        price_tiers,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        is_active: true,
        created_by
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Group buy created successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
