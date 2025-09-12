import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Test API to check cart_items table access
export async function GET(request: Request) {
  try {
    // Test direct access to cart_items table
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Direct cart_items table access failed',
        errorCode: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      message: 'Cart items table accessible',
      count: data?.length || 0
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Cart test API error'
    }, { status: 500 })
  }
}
