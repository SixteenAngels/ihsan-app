import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/test-cart-debug - Debug cart table access
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || 'test-user-123'

    // Test 1: Check if cart_items table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('cart_items')
      .select('count')
      .limit(1)

    if (tableError) {
      return NextResponse.json({
        success: false,
        error: 'Table access error',
        details: tableError.message,
        step: 'table_check'
      }, { status: 500 })
    }

    // Test 2: Try to insert a test record
    const testItem = {
      user_id: userId,
      product_id: 'f128b621-267e-453c-bcca-68547a1c9a12', // Use existing product ID
      quantity: 1,
      price: 10.00
    }

    const { data: insertData, error: insertError } = await supabase
      .from('cart_items')
      .insert(testItem)
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: 'Insert error',
        details: insertError.message,
        step: 'insert_test',
        testItem
      }, { status: 500 })
    }

    // Test 3: Try to read the inserted record
    const { data: readData, error: readError } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .limit(5)

    if (readError) {
      return NextResponse.json({
        success: false,
        error: 'Read error',
        details: readError.message,
        step: 'read_test',
        insertData
      }, { status: 500 })
    }

    // Test 4: Clean up test data
    await supabase
      .from('cart_items')
      .delete()
      .eq('id', insertData.id)

    return NextResponse.json({
      success: true,
      message: 'All cart operations working correctly',
      data: {
        tableAccess: 'OK',
        insertTest: 'OK',
        readTest: 'OK',
        cleanupTest: 'OK',
        sampleData: readData
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
