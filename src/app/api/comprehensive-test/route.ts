import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/comprehensive-test - Comprehensive test of all APIs
export async function GET() {
  try {
    const testResults = {}
    const userId = 'test-user-123'

    // Test 1: Products API (known working)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(3)

      testResults.products = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        sample: data?.[0] || null
      }
    } catch (err) {
      testResults.products = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 2: Cart Items - Basic access
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .limit(5)

      testResults.cart_basic = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        sample: data?.[0] || null
      }
    } catch (err) {
      testResults.cart_basic = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 3: Cart Items - With user filter
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)

      testResults.cart_user_filter = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        data: data
      }
    } catch (err) {
      testResults.cart_user_filter = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 4: Orders - Basic access
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(5)

      testResults.orders_basic = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        sample: data?.[0] || null
      }
    } catch (err) {
      testResults.orders_basic = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 5: Orders - With user filter
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)

      testResults.orders_user_filter = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        data: data
      }
    } catch (err) {
      testResults.orders_user_filter = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 6: Try to insert test data
    try {
      const testCartItem = {
        user_id: userId,
        product_id: 'f128b621-267e-453c-bcca-68547a1c9a12',
        quantity: 1,
        price: 10.00
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert(testCartItem)
        .select()
        .single()

      testResults.cart_insert = {
        success: !error,
        error: error?.message || null,
        data: data,
        testItem: testCartItem
      }
    } catch (err) {
      testResults.cart_insert = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 7: Try to insert test order
    try {
      const testOrder = {
        user_id: userId,
        order_number: 'ORD-TEST-' + Date.now(),
        status: 'pending',
        total_amount: 10.00,
        shipping_address: {
          street: '123 Test Street',
          city: 'Accra',
          region: 'Greater Accra',
          country: 'Ghana'
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .insert(testOrder)
        .select()
        .single()

      testResults.orders_insert = {
        success: !error,
        error: error?.message || null,
        data: data,
        testItem: testOrder
      }
    } catch (err) {
      testResults.orders_insert = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Summary
    const summary = {
      totalTests: Object.keys(testResults).length,
      successfulTests: Object.values(testResults).filter(r => r.success).length,
      failedTests: Object.values(testResults).filter(r => !r.success).length
    }

    return NextResponse.json({
      success: true,
      message: 'Comprehensive API test completed',
      testResults,
      summary,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
