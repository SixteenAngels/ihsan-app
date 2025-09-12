import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/debug-supabase - Debug Supabase connection and table structure
export async function GET() {
  try {
    const results = {}

    // Test 1: Basic connection
    try {
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .limit(1)

      results.connection = {
        success: !error,
        error: error?.message || null
      }
    } catch (err) {
      results.connection = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 2: Check if cart_items table exists by trying to describe it
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .limit(0)

      results.cart_items_table = {
        exists: !error,
        error: error?.message || null
      }
    } catch (err) {
      results.cart_items_table = {
        exists: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 3: Try to get table schema info
    try {
      const { data, error } = await supabase
        .rpc('get_table_info', { table_name: 'cart_items' })

      results.table_info = {
        success: !error,
        data: data,
        error: error?.message || null
      }
    } catch (err) {
      results.table_info = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 4: Check RLS status
    try {
      const { data, error } = await supabase
        .rpc('check_rls_status', { table_name: 'cart_items' })

      results.rls_status = {
        success: !error,
        data: data,
        error: error?.message || null
      }
    } catch (err) {
      results.rls_status = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase debug completed',
      results,
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
