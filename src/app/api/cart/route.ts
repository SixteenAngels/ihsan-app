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
      .from('cart_items')
      .select(`
        id,
        product_id,
        variant_id,
        quantity,
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
      console.error('Supabase cart fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform the data to match our CartItem interface
    const items = data?.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.products?.name || 'Unknown Product',
      price: item.product_variants?.price || item.products?.price || 0,
      originalPrice: item.products?.compare_price || undefined,
      quantity: item.quantity,
      image: item.products?.images?.[0] || '/api/placeholder/200/200',
      slug: item.products?.slug || '',
      vendor: item.products?.brand || undefined,
      category: item.products?.categories?.name || undefined
    })) || []

    return NextResponse.json({
      success: true,
      items
    })

  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, variant_id, quantity = 1, user_id } = body

    if (!product_id || !user_id) {
      return NextResponse.json({ error: 'Product ID and User ID are required' }, { status: 400 })
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)
      .single()

    if (existingItem) {
      // Update existing item quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)

      if (updateError) {
        console.error('Supabase cart update error:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    } else {
      // Add new item to cart
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id,
          product_id,
          variant_id: variant_id || null,
          quantity
        })

      if (insertError) {
        console.error('Supabase cart insert error:', insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Item added to cart successfully'
    })

  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, variant_id, quantity, user_id } = body

    if (!product_id || !user_id || quantity === undefined) {
      return NextResponse.json({ error: 'Product ID, User ID, and quantity are required' }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 })
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)

    if (error) {
      console.error('Supabase cart update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart item updated successfully'
    })

  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')
    const variant_id = searchParams.get('variant_id')
    const user_id = searchParams.get('user_id')

    if (!product_id || !user_id) {
      return NextResponse.json({ error: 'Product ID and User ID are required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)

    if (error) {
      console.error('Supabase cart delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart successfully'
    })

  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}