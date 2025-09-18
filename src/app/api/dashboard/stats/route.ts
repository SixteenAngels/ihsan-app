import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/dashboard/stats - Get dashboard statistics (Admin only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get total counts
    const [
      { count: totalUsers },
      { count: totalProducts },
      { count: totalOrders },
      revenueQuery
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').eq('payment_status', 'paid')
    ])

    // Get recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        profiles (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get top products
    const { data: topProducts } = await supabase
      .from('order_items')
      .select(`
        quantity,
        products (
          id,
          name,
          images
        )
      `)
      .gte('created_at', startDate.toISOString())

    // Calculate revenue
    const totalRevenueRows = (revenueQuery?.data as Array<{ total_amount: number }> | null) || []
    const revenue = totalRevenueRows.reduce((sum, row) => sum + (row.total_amount || 0), 0)

    // Get order status distribution
    const { data: orderStatuses } = await supabase
      .from('orders')
      .select('status')
      .gte('created_at', startDate.toISOString())

    const statusDistribution = orderStatuses?.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {}) || {}

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers: totalUsers || 0,
          totalProducts: totalProducts || 0,
          totalOrders: totalOrders || 0,
          totalRevenue: revenue
        },
        recentOrders: recentOrders || [],
        orderStatusDistribution: statusDistribution,
        period: parseInt(period)
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
