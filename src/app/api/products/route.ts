import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/products - Get all products with filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const readyNow = searchParams.get('ready_now')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (category) {
      query = query.eq('category_id', category)
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }
    if (readyNow === 'true') {
      query = query.eq('is_ready_now', true)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`)
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

// POST /api/products - Create new product (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, category_id, sku, images, is_featured, is_ready_now, stock_quantity } = body

    // Validate required fields
    if (!name || !description || !price || !category_id || !sku) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description,
        price: parseFloat(price),
        category_id,
        sku,
        images: images || [],
        is_featured: is_featured || false,
        is_ready_now: is_ready_now || false,
        stock_quantity: stock_quantity || 0,
        is_active: true
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
      message: 'Product created successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}