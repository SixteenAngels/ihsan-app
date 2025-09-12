import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/cart-simple - Simplified cart API for testing
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    console.log('Testing cart API for user:', userId)

    // Simple query to get cart items
    const { data, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .limit(10)

    console.log('Cart query result:', { data, error })

    if (error) {
      console.error('Cart query error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: 'Cart table query failed',
        debug: {
          userId,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details
        }
      }, { status: 500 })
    }

    // Return simple response
    return NextResponse.json({
      success: true,
      data: {
        items: data || [],
        count: data?.length || 0,
        userId
      }
    })

  } catch (error) {
    console.error('Cart API error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Cart API error',
      debug: {
        errorType: typeof error,
        errorMessage: error instanceof Error ? error.message : String(error)
      }
    }, { status: 500 })
  }
}
