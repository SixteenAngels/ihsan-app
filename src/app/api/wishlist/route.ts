import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        product_id,
        variant_id,
        created_at,
        products (
          id,
          name,
          slug,
          price,
          compare_price,
          images,
          brand,
          categories (
            name
          )
        ),
        product_variants (
          id,
          name,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase wishlist fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match our WishlistItem interface
    const items = data?.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.products?.name || 'Unknown Product',
      price: item.product_variants?.price || item.products?.price || 0,
      originalPrice: item.products?.compare_price || undefined,
      image: item.products?.images?.[0] || '/api/placeholder/200/200',
      slug: item.products?.slug || '',
      vendor: item.products?.brand || undefined,
      category: item.products?.categories?.name || undefined,
      added_at: item.created_at
    })) || []

    return NextResponse.json({
      success: true,
      items
    })

  } catch (error) {
    console.error('Wishlist fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, variant_id, user_id } = body

    if (!product_id || !user_id) {
      return NextResponse.json({ error: 'Product ID and User ID are required' }, { status: 400 })
    }

    // Check if item already exists in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)
      .single()

    if (existingItem) {
      return NextResponse.json({
        success: true,
        message: 'Item already in wishlist'
      })
    }

    // Add new item to wishlist
    const { error: insertError } = await supabase
      .from('wishlist_items')
      .insert({
        user_id,
        product_id,
        variant_id: variant_id || null
      })

    if (insertError) {
      console.error('Supabase wishlist insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist successfully'
    })

  } catch (error) {
    console.error('Wishlist add error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, variant_id, user_id } = body

    if (!product_id || !user_id) {
      return NextResponse.json({ error: 'Product ID and User ID are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)

    if (error) {
      console.error('Supabase wishlist delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist successfully'
    })

  } catch (error) {
    console.error('Wishlist delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
