import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/orders - Get user's orders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          products (
            id,
            name,
            images
          ),
          product_variants (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
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

// POST /api/orders - Create new order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      shipping_method, 
      shipping_address, 
      billing_address, 
      cart_items,
      notes 
    } = body

    if (!user_id || !shipping_method || !shipping_address || !billing_address || !cart_items?.length) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of cart_items) {
      const price = item.product_variants?.price || item.products?.price || 0
      const totalPrice = price * item.quantity
      subtotal += totalPrice

      orderItems.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: price,
        total_price: totalPrice
      })
    }

    const shippingCost = shipping_method === 'air' ? 50 : 20 // Example shipping costs
    const taxAmount = subtotal * 0.15 // 15% tax
    const totalAmount = subtotal + shippingCost + taxAmount

    // Generate order number
    const orderNumber = `IH-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id,
        status: 'pending',
        shipping_method,
        shipping_cost: shippingCost,
        subtotal,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        currency: 'GHS',
        payment_status: 'pending',
        shipping_address,
        billing_address,
        notes,
        estimated_delivery_date: new Date(Date.now() + (shipping_method === 'air' ? 7 : 21) * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({
        success: false,
        error: orderError.message
      }, { status: 500 })
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId)

    if (itemsError) {
      // Rollback order creation
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({
        success: false,
        error: itemsError.message
      }, { status: 500 })
    }

    // Clear user's cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id)

    return NextResponse.json({
      success: true,
      data: order,
      message: 'Order created successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
