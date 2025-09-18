import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notification-service'
import { EmailService } from '@/lib/email-service'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const customerId = searchParams.get('customerId')
  const vendorId = searchParams.get('vendorId')
    const status = searchParams.get('status')
  const escrowStatus = searchParams.get('escrowStatus')
  const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

  try {
    let query = supabase
      .from('orders')
      .select('id,order_number,user_id,status,subtotal,tax_amount,shipping_cost,total_amount,payment_status,created_at,escrow_status,order_items(product_id,quantity,unit_price,vendor_id))', { count: 'exact' } as any)

    if (id) query = query.eq('id', id)
    if (customerId) query = query.eq('user_id', customerId)
    if (status) query = query.eq('status', status)
    if (escrowStatus) query = query.eq('escrow_status' as any, escrowStatus as any)

    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data, error, count } = await query.range(from, to)
    if (error) throw error

    if (id) {
      const one = data && data[0]
      if (!one) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      return NextResponse.json(one)
    }

    let rows = data || []
    if (vendorId) {
      rows = rows.filter((o: any) => (o.order_items || []).some((it: any) => it.vendor_id === vendorId))
    }

    return NextResponse.json({
      orders: rows,
      pagination: {
        page,
        limit,
        total: count ?? rows.length,
        pages: Math.ceil(((count ?? rows.length) || 0) / limit) || 1,
      },
    })
  } catch (e) {
    return NextResponse.json({ orders: [], pagination: { page, limit, total: 0, pages: 1 } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          order_number: body.order_number,
          user_id: body.user_id,
          status: body.status || 'pending',
          shipping_method: body.shipping_method || 'air',
          shipping_cost: body.shipping_cost || 0,
          subtotal: body.subtotal || 0,
          tax_amount: body.tax_amount || 0,
          total_amount: body.total_amount || 0,
          currency: body.currency || 'GHS',
          payment_status: body.payment_status || 'pending',
          payment_method: body.payment_method || null,
          shipping_address: body.shipping_address,
          billing_address: body.billing_address,
        } as any,
      ])
      .select('id,order_number')
      .single()

    if (orderError) {
      console.error('Supabase order creation error:', orderError)
      return NextResponse.json({ error: orderError.message }, { status: 500 })
    }

    // Create order items
    if (body.items && body.items.length > 0) {
      const orderItems = body.items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        console.error('Supabase order items creation error:', itemsError)
        // Don't fail the entire request, just log the error
      }
    }

    // Send notification to user about order creation
    if (body.user_id) {
      await NotificationService.notifyOrderCreated(
        order.id,
        body.user_id,
        order.order_number
      )

      // Send order confirmation email
      try {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', body.user_id)
          .single()

        if (userProfile?.email) {
          await EmailService.sendOrderConfirmation({
            customerEmail: userProfile.email,
            customerName: userProfile.full_name || 'Customer',
            orderNumber: order.order_number,
            orderTotal: body.total_amount || 0,
            items: body.items || [],
            shippingAddress: body.shipping_address,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
          })
        }
      } catch (emailError) {
        console.error('Order confirmation email failed:', emailError)
        // Don't fail the order creation if email fails
      }
    }

    // Send notification to admins about new order
    await NotificationService.notifyAdminNewOrder(
      order.id,
      order.order_number,
      body.total_amount || 0
    )

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const patch: any = {
      status: updateData.status,
      payment_status: updateData.paymentStatus,
      escrow_status: updateData.escrowStatus,
      subtotal: updateData.subtotal,
      tax_amount: updateData.tax,
      shipping_cost: updateData.shipping,
      total_amount: updateData.total,
      updated_at: new Date().toISOString(),
    }
    Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k])

    const { data, error } = await supabase
      .from('orders')
      .update(patch)
      .eq('id', id)
      .select('id,order_number,user_id,status,subtotal,tax_amount,shipping_cost,total_amount,payment_status,created_at,escrow_status')
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
  try {
    const { error } = await supabase.from('orders').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'Order deleted successfully' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 })
  }
}