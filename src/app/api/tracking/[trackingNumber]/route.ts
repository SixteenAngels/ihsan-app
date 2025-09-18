import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/tracking/[trackingNumber] - Get tracking information
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params

    if (!trackingNumber) {
      return NextResponse.json({
        success: false,
        error: 'Tracking number is required'
      }, { status: 400 })
    }

    // Get order by tracking number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        tracking_number,
        carrier,
        estimated_delivery,
        created_at
      `)
      .eq('tracking_number', trackingNumber)
      .single()

    if (orderError || !order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 })
    }

    // Get tracking events
    const { data: events, error: eventsError } = await supabase
      .from('tracking_events')
      .select('*')
      .eq('order_id', order.id)
      .order('timestamp', { ascending: true })

    if (eventsError) {
      console.error('Error fetching tracking events:', eventsError)
    }

    // Generate mock tracking events if none exist
    const mockEvents = [
      {
        id: '1',
        status: 'Order Placed',
        location: 'Ihsan Warehouse',
        description: 'Your order has been placed and is being prepared',
        timestamp: order.created_at
      },
      {
        id: '2',
        status: 'Processing',
        location: 'Ihsan Warehouse',
        description: 'Your order is being processed and packed',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        id: '3',
        status: 'Shipped',
        location: 'Ihsan Warehouse',
        description: 'Your order has been shipped',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ]

    if (order.status === 'delivered') {
      mockEvents.push({
        id: '4',
        status: 'Delivered',
        location: 'Delivery Address',
        description: 'Your order has been delivered successfully',
        timestamp: new Date().toISOString()
      })
    } else if (order.status === 'shipped') {
      mockEvents.push({
        id: '4',
        status: 'In Transit',
        location: 'En Route',
        description: 'Your order is on its way to you',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      })
    }

    const trackingData = {
      order_id: order.id,
      order_number: order.order_number,
      status: order.status,
      tracking_number: order.tracking_number,
      carrier: order.carrier || 'Ihsan Logistics',
      estimated_delivery: order.estimated_delivery,
      events: events || mockEvents
    }

    return NextResponse.json({
      success: true,
      tracking: trackingData
    })

  } catch (error) {
    console.error('Tracking fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
