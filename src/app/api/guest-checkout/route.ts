import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/guest-checkout - Create guest order
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      guestId,
      items,
      shippingInfo,
      paymentInfo,
      shippingMethod,
      totals
    } = body

    if (!guestId || !items || !shippingInfo || !paymentInfo) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Generate a unique order number
    const orderNumber = `GUEST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create guest order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: null, // No user ID for guests
        guest_id: guestId,
        guest_email: shippingInfo.email,
        guest_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        guest_phone: shippingInfo.phone,
        status: 'pending',
        payment_status: 'pending',
        shipping_method: shippingMethod,
        shipping_address: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postal_code: shippingInfo.postalCode,
          country: 'Ghana'
        },
        subtotal: totals.subtotal,
        shipping_cost: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        payment_method: 'paystack',
        payment_reference: null,
        notes: 'Guest checkout order'
      })
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({
        success: false,
        error: orderError.message,
        details: 'Failed to create guest order'
      }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      variant_name: item.variantName,
      price: item.price,
      quantity: item.quantity,
      total: item.price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      return NextResponse.json({
        success: false,
        error: itemsError.message,
        details: 'Failed to create order items'
      }, { status: 500 })
    }

    // Initialize payment with Paystack (delegate to /api/payment)
    const paymentInit = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: shippingInfo.email,
        amount: totals.total,
        reference: orderNumber,
        orderId: order.id,
        paymentMethod: 'all'
      })
    })
    const paymentResponse = await paymentInit.json()

    return NextResponse.json({
      success: true,
      data: {
        order: {
          id: order.id,
          orderNumber: orderNumber,
          status: 'pending',
          total: totals.total,
          paymentUrl: paymentResponse?.data?.authorization_url || null
        },
        payment: paymentResponse
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Guest checkout failed'
    }, { status: 500 })
  }
}

// GET /api/guest-checkout - Get guest order status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('order_number')
    const guestId = searchParams.get('guest_id')

    if (!orderNumber || !guestId) {
      return NextResponse.json({
        success: false,
        error: 'Order number and guest ID are required'
      }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .eq('order_number', orderNumber)
      .eq('guest_id', guestId)
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Order not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: order
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to fetch guest order'
    }, { status: 500 })
  }
}
