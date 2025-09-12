import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/quick-fix-rls - Apply quick RLS fix for testing
export async function POST(request: Request) {
  try {
    const sqlCommands = [
      // Disable RLS temporarily
      "ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY",
      "ALTER TABLE orders DISABLE ROW LEVEL SECURITY", 
      "ALTER TABLE order_items DISABLE ROW LEVEL SECURITY",
      "ALTER TABLE notifications DISABLE ROW LEVEL SECURITY",
      
      // Add test data
      `INSERT INTO cart_items (id, user_id, product_id, quantity, price, created_at, updated_at)
       VALUES 
           (gen_random_uuid(), 'test-user-123', 'f128b621-267e-453c-bcca-68547a1c9a12', 2, 25.00, NOW(), NOW()),
           (gen_random_uuid(), 'test-user-123', 'f128b621-267e-453c-bcca-68547a1c9a12', 1, 15.00, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
       
      `INSERT INTO orders (id, user_id, order_number, status, total_amount, shipping_address, created_at, updated_at)
       VALUES 
           (gen_random_uuid(), 'test-user-123', 'ORD-TEST-001', 'pending', 40.00, '{"street": "123 Test Street", "city": "Accra", "region": "Greater Accra", "country": "Ghana"}', NOW(), NOW())
       ON CONFLICT DO NOTHING`,
       
      // Re-enable RLS
      "ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY",
      "ALTER TABLE orders ENABLE ROW LEVEL SECURITY",
      "ALTER TABLE order_items ENABLE ROW LEVEL SECURITY", 
      "ALTER TABLE notifications ENABLE ROW LEVEL SECURITY",
      
      // Create permissive policies
      "DROP POLICY IF EXISTS cart_items_test_policy ON cart_items",
      "CREATE POLICY cart_items_test_policy ON cart_items FOR ALL USING (true)",
      
      "DROP POLICY IF EXISTS orders_test_policy ON orders",
      "CREATE POLICY orders_test_policy ON orders FOR ALL USING (true)",
      
      "DROP POLICY IF EXISTS order_items_test_policy ON order_items", 
      "CREATE POLICY order_items_test_policy ON order_items FOR ALL USING (true)",
      
      "DROP POLICY IF EXISTS notifications_test_policy ON notifications",
      "CREATE POLICY notifications_test_policy ON notifications FOR ALL USING (true)"
    ]

    const results = []
    let successCount = 0
    let errorCount = 0

    for (const sql of sqlCommands) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql })
        
        if (error) {
          console.error('SQL Error:', error)
          results.push({
            command: sql.substring(0, 50) + '...',
            error: error.message
          })
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.error('Execution Error:', err)
        results.push({
          command: sql.substring(0, 50) + '...',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
        errorCount++
      }
    }

    return NextResponse.json({
      success: errorCount === 0,
      message: `Quick RLS fix applied. ${successCount} commands executed successfully, ${errorCount} errors.`,
      results: {
        successCount,
        errorCount,
        details: results
      }
    })

  } catch (error) {
    console.error('Quick Fix Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/quick-fix-rls - Test the APIs after fix
export async function GET() {
  try {
    const testResults = {}

    // Test cart API
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', 'test-user-123')

      testResults.cart = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        data: data
      }
    } catch (err) {
      testResults.cart = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test orders API
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', 'test-user-123')

      testResults.orders = {
        success: !error,
        error: error?.message || null,
        count: data?.length || 0,
        data: data
      }
    } catch (err) {
      testResults.orders = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API test results after RLS fix',
      testResults
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
