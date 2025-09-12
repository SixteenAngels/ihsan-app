import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/reviews - Get product reviews
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 })
    }

    let query = supabase
      .from('reviews')
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    // Calculate average rating
    const { data: ratingData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true)

    const averageRating = ratingData?.length 
      ? ratingData.reduce((sum, review) => sum + review.rating, 0) / ratingData.length
      : 0

    return NextResponse.json({
      success: true,
      data: data || [],
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: count || 0,
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

// POST /api/reviews - Create review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, product_id, order_id, rating, title, comment } = body

    if (!user_id || !product_id || !order_id || !rating) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Check if user already reviewed this product for this order
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('order_id', order_id)
      .single()

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this product for this order'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id,
        product_id,
        order_id,
        rating,
        title: title || null,
        comment: comment || null,
        is_verified: true, // Verified because it's linked to an order
        is_approved: true // Auto-approve for now
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
      message: 'Review submitted successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
