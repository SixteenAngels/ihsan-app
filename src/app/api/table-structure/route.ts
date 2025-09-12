import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/table-structure - Check table structure
export async function GET() {
  try {
    const results = {}

    // Check cart_items table structure
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .limit(1)

      results.cart_items = {
        success: !error,
        error: error?.message || null,
        sampleData: data?.[0] || null,
        columns: data?.[0] ? Object.keys(data[0]) : []
      }
    } catch (err) {
      results.cart_items = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Check orders table structure
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1)

      results.orders = {
        success: !error,
        error: error?.message || null,
        sampleData: data?.[0] || null,
        columns: data?.[0] ? Object.keys(data[0]) : []
      }
    } catch (err) {
      results.orders = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Check if we can insert into cart_items
    try {
      const testData = {
        user_id: 'test-user-123',
        product_id: 'f128b621-267e-453c-bcca-68547a1c9a12',
        quantity: 1,
        price: 10.00
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert(testData)
        .select()
        .single()

      results.cart_insert_test = {
        success: !error,
        error: error?.message || null,
        insertedData: data,
        testData
      }

      // Clean up
      if (data?.id) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('id', data.id)
      }
    } catch (err) {
      results.cart_insert_test = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Table structure check completed',
      results
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
