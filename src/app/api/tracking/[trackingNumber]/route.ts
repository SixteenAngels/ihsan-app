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

    const trackingData = {
      order_id: order.id,
      order_number: order.order_number,
      status: order.status,
      tracking_number: order.tracking_number,
      carrier: order.carrier || 'Ihsan Logistics',
      estimated_delivery: order.estimated_delivery,
      events: events || []
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
