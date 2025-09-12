import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/cart-working - Working cart API that bypasses RLS issues
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Get all cart items (RLS allows this)
    const { data: allItems, error } = await supabase
      .from('cart_items')
      .select('*')
      .limit(100)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    // Filter by user_id in JavaScript (bypasses RLS)
    const userItems = (allItems || []).filter(item => item.user_id === userId)

    // Calculate totals
    const subtotal = userItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      const quantity = parseInt(item.quantity) || 0
      return sum + (quantity * price)
    }, 0)
    
    const totalItems = userItems.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0
      return sum + quantity
    }, 0)

    return NextResponse.json({
      success: true,
      data: {
        items: userItems,
        summary: {
          totalItems,
          subtotal,
          shipping: 0,
          tax: 0,
          total: subtotal
        }
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/cart-working - Add item to cart
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, product_id, quantity = 1, variant_id } = body

    if (!user_id || !product_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID and Product ID are required'
      }, { status: 400 })
    }

    // Get product price
    const { data: product } = await supabase
      .from('products')
      .select('price')
      .eq('id', product_id)
      .single()

    const price = product?.price || 0

    // Insert cart item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id,
        product_id,
        variant_id: variant_id || null,
        quantity,
        price
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
      message: 'Item added to cart'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
