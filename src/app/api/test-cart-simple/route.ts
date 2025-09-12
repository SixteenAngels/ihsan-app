import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/test-cart-simple - Simple cart test without RLS
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || 'test-user-123'

    // First, let's check if we can access the table at all
    const { data: allCartItems, error: allError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(5)

    if (allError) {
      return NextResponse.json({
        success: false,
        error: 'Cannot access cart_items table',
        details: allError.message,
        step: 'table_access'
      }, { status: 500 })
    }

    // Now try to filter by user_id
    const { data: userCartItems, error: userError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)

    if (userError) {
      return NextResponse.json({
        success: false,
        error: 'Cannot filter cart_items by user_id',
        details: userError.message,
        step: 'user_filter',
        allItems: allCartItems
      }, { status: 500 })
    }

    // If no items for this user, let's add some test data
    if (!userCartItems || userCartItems.length === 0) {
      const testItem = {
        user_id: userId,
        product_id: 'f128b621-267e-453c-bcca-68547a1c9a12',
        quantity: 2,
        price: 25.00
      }

      const { data: insertData, error: insertError } = await supabase
        .from('cart_items')
        .insert(testItem)
        .select()
        .single()

      if (insertError) {
        return NextResponse.json({
          success: false,
          error: 'Cannot insert test cart item',
          details: insertError.message,
          step: 'insert_test',
          testItem
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: 'Test cart item added successfully',
        data: {
          insertedItem: insertData,
          allItems: allCartItems
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Cart items retrieved successfully',
      data: {
        userItems: userCartItems,
        allItems: allCartItems,
        totalItems: userCartItems.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      step: 'catch_block'
    }, { status: 500 })
  }
}
