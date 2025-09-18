import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderNumber = id

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        status,
        shipping_method,
        shipping_cost,
        subtotal,
        tax_amount,
        total_amount,
        currency,
        payment_status,
        payment_method,
        shipping_address,
        billing_address,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          variant_id,
          quantity,
          unit_price,
          products (
            name,
            slug,
            images
          ),
          product_variants (
            name,
            price
          )
        )
      `)
      .eq('order_number', orderNumber)
      .single()

    if (orderError) {
      console.error('Supabase order fetch error:', orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Transform the order data to include product names
    const transformedOrder = {
      ...order,
      items: order.order_items?.map((item: any) => ({
        product_name: item.product_variants?.name || item.products?.name || 'Unknown Product',
        quantity: item.quantity,
        unit_price: item.unit_price,
        product_id: item.product_id,
        variant_id: item.variant_id,
        image: item.products?.images?.[0] || '/api/placeholder/100/100'
      })) || []
    }

    return NextResponse.json({
      success: true,
      order: transformedOrder
    })

  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderNumber = id
    const body = await request.json()
    const { status, payment_status, shipping_method, tracking_number } = body

    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) updateData.status = status
    if (payment_status) updateData.payment_status = payment_status
    if (shipping_method) updateData.shipping_method = shipping_method
    if (tracking_number) updateData.tracking_number = tracking_number

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_number', orderNumber)
      .select()
      .single()

    if (error) {
      console.error('Supabase order update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: data
    })

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}