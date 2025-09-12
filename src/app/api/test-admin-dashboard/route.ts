import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test admin dashboard functionality
    const results: any = {
      success: true,
      message: 'Admin dashboard test',
      tests: {}
    }

    // Test 1: Check if we can access admin users
    try {
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name, role, created_at')
        .limit(10)
      
      results.tests.users = {
        success: !usersError,
        data: users,
        count: users?.length || 0,
        error: usersError?.message || null
      }
    } catch (err) {
      results.tests.users = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 2: Check if we can access orders
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, status, total_amount, created_at')
        .limit(5)
      
      results.tests.orders = {
        success: !ordersError,
        data: orders,
        count: orders?.length || 0,
        error: ordersError?.message || null
      }
    } catch (err) {
      results.tests.orders = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 3: Check if we can access products
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, stock_quantity, is_active')
        .limit(5)
      
      results.tests.products = {
        success: !productsError,
        data: products,
        count: products?.length || 0,
        error: productsError?.message || null
      }
    } catch (err) {
      results.tests.products = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
