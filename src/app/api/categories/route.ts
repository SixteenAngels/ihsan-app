import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/categories - Get all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parent_id')
    const includeProducts = searchParams.get('include_products') === 'true'

    let selectQuery = '*'
    if (includeProducts) {
      selectQuery = `
        *,
        products (
          id,
          name,
          slug,
          price,
          images,
          is_featured,
          is_ready_now
        )
      `
    }

    let query = supabase
      .from('categories')
      .select(selectQuery)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (parentId) {
      query = query.eq('parent_id', parentId)
    } else {
      query = query.is('parent_id', null) // Only top-level categories
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/categories - Create category (Admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, parent_id, sort_order, image_url } = body

    if (!name) {
      return NextResponse.json({
        success: false,
        error: 'Category name is required'
      }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description,
        parent_id: parent_id || null,
        sort_order: sort_order || 0,
        image_url: image_url || null,
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
      message: 'Category created successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
