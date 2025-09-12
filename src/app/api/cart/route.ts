import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/cart - Get user's cart (supports both authenticated users and guests)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const guestId = searchParams.get('guest_id')

    // Support both authenticated users and guests
    const identifier = userId || guestId
    const isGuest = !userId && guestId

    if (!identifier) {
      return NextResponse.json({
        success: false,
        error: 'User ID or Guest ID is required'
      }, { status: 400 })
    }

    // For guests, we'll use a different approach - store in localStorage/sessionStorage
    // For now, we'll simulate guest cart data
    if (isGuest) {
      // In a real implementation, you might store guest carts in a separate table
      // or use session storage on the client side
      const mockGuestCart = {
        items: [],
        summary: {
          totalItems: 0,
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0
        }
      }

      return NextResponse.json({
        success: true,
        data: mockGuestCart,
        isGuest: true
      })
    }

    // For authenticated users, query the database
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .limit(10)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Cart table query failed'
      }, { status: 500 })
    }

    // Calculate totals
    const cartItems = data || []
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0
      const quantity = parseInt(item.quantity) || 0
      return sum + (quantity * price)
    }, 0)
    const totalItems = cartItems.reduce((sum, item) => {
      const quantity = parseInt(item.quantity) || 0
      return sum + quantity
    }, 0)

    return NextResponse.json({
      success: true,
      data: {
        items: cartItems,
        summary: {
          totalItems,
          subtotal,
          shipping: 0,
          tax: subtotal * 0.15,
          total: subtotal + (subtotal * 0.15)
        }
      },
      isGuest: false
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Cart API error'
    }, { status: 500 })
  }
}

// POST /api/cart - Add item to cart (TEST VERSION)
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

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user_id)
      .eq('product_id', product_id)
      .eq('variant_id', variant_id || null)
      .single()

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
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
        message: 'Cart item quantity updated'
      })
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id,
          product_id,
          variant_id: variant_id || null,
          quantity,
          price: 0 // Will be updated with actual product price
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
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/cart - Update cart item (TEST VERSION)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { item_id, quantity } = body

    if (!item_id || quantity === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Item ID and quantity are required'
      }, { status: 400 })
    }

    if (quantity <= 0) {
      // Remove item
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item_id)

      if (error) {
        return NextResponse.json({
          success: false,
          error: error.message
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart'
      })
    }

    // Update quantity
    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', item_id)
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
      message: 'Cart item updated'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/cart - Clear user's cart (TEST VERSION)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}