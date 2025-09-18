import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/reviews - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '20')
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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase reviews fetch error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      reviews: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (data?.length || 0) === limit
      }
    })

  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      product_id, 
      user_id, 
      rating, 
      title, 
      comment 
    } = body

    if (!product_id || !user_id || !rating || !title || !comment) {
      return NextResponse.json({
        success: false,
        error: 'product_id, user_id, rating, title, and comment are required'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', product_id)
      .eq('user_id', user_id)
      .single()

    if (existingReview) {
      return NextResponse.json({
        success: false,
        error: 'You have already reviewed this product'
      }, { status: 400 })
    }

    // Check if user has purchased this product (for verified purchase badge)
    const { data: orderItems } = await supabase
      .from('order_items')
      .select(`
        id,
        orders!inner (
          user_id,
          status
        )
      `)
      .eq('product_id', product_id)
      .eq('orders.user_id', user_id)
      .eq('orders.status', 'delivered')

    const isVerifiedPurchase = orderItems && orderItems.length > 0

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id,
        user_id,
        rating,
        title,
        comment,
        is_verified_purchase: isVerifiedPurchase,
        helpful_count: 0
      })
      .select(`
        *,
        profiles (
          full_name,
          avatar_url
        )
      `)
      .single()

    if (error) {
      console.error('Supabase review creation error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      review
    }, { status: 201 })

  } catch (error) {
    console.error('Review creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/reviews - Update a review
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      review_id, 
      user_id, 
      rating, 
      title, 
      comment 
    } = body

    if (!review_id || !user_id) {
      return NextResponse.json({
        success: false,
        error: 'review_id and user_id are required'
      }, { status: 400 })
    }

    const updateData: any = {}
    if (rating !== undefined) updateData.rating = rating
    if (title !== undefined) updateData.title = title
    if (comment !== undefined) updateData.comment = comment

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', review_id)
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) {
      console.error('Supabase review update error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      review: data
    })

  } catch (error) {
    console.error('Review update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/reviews - Delete a review
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('id')
    const userId = searchParams.get('user_id')

    if (!reviewId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'review id and user_id are required'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase review deletion error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted'
    })

  } catch (error) {
    console.error('Review deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}