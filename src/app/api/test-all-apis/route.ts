import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/test-all-apis - Test all problematic APIs and provide fixes
export async function POST(request: Request) {
  try {
    const results = {}
    const fixes = []

    // Test 1: Cart API
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .limit(1)

      results.cart_items = {
        accessible: !error,
        error: error?.message || null,
        count: data?.length || 0
      }

      if (error) {
        fixes.push({
          table: 'cart_items',
          issue: error.message,
          fix: 'RLS policy needs to be updated or table needs to be created'
        })
      }
    } catch (err) {
      results.cart_items = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 2: Orders API
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .limit(1)

      results.orders = {
        accessible: !error,
        error: error?.message || null,
        count: data?.length || 0
      }

      if (error) {
        fixes.push({
          table: 'orders',
          issue: error.message,
          fix: 'RLS policy needs to be updated or table needs to be created'
        })
      }
    } catch (err) {
      results.orders = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 3: Order Items API
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .limit(1)

      results.order_items = {
        accessible: !error,
        error: error?.message || null,
        count: data?.length || 0
      }

      if (error) {
        fixes.push({
          table: 'order_items',
          issue: error.message,
          fix: 'RLS policy needs to be updated or table needs to be created'
        })
      }
    } catch (err) {
      results.order_items = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 4: Notifications API
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .limit(1)

      results.notifications = {
        accessible: !error,
        error: error?.message || null,
        count: data?.length || 0
      }

      if (error) {
        fixes.push({
          table: 'notifications',
          issue: error.message,
          fix: 'RLS policy needs to be updated or table needs to be created'
        })
      }
    } catch (err) {
      results.notifications = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 5: Working APIs for comparison
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(1)

      results.products = {
        accessible: !error,
        error: error?.message || null,
        count: data?.length || 0
      }
    } catch (err) {
      results.products = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Generate SQL fixes
    const sqlFixes = []
    
    if (fixes.length > 0) {
      sqlFixes.push('-- Fix RLS policies for problematic tables')
      sqlFixes.push('')
      
      for (const fix of fixes) {
        sqlFixes.push(`-- Fix ${fix.table}`)
        sqlFixes.push(`DROP POLICY IF EXISTS "${fix.table}_policy" ON ${fix.table};`)
        sqlFixes.push(`CREATE POLICY "${fix.table}_policy" ON ${fix.table}`)
        
        if (fix.table === 'cart_items') {
          sqlFixes.push(`    FOR ALL USING (auth.uid()::text = user_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid()::text AND profiles.role IN ('admin', 'manager')));`)
        } else if (fix.table === 'orders') {
          sqlFixes.push(`    FOR ALL USING (auth.uid()::text = user_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid()::text AND profiles.role IN ('admin', 'manager', 'support_agent', 'delivery_agent')));`)
        } else if (fix.table === 'order_items') {
          sqlFixes.push(`    FOR ALL USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid()::text OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid()::text AND profiles.role IN ('admin', 'manager', 'support_agent', 'delivery_agent')))));`)
        } else if (fix.table === 'notifications') {
          sqlFixes.push(`    FOR ALL USING (auth.uid()::text = user_id OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid()::text AND profiles.role IN ('admin', 'manager', 'support_agent')));`)
        }
        
        sqlFixes.push('')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'API test completed',
      results,
      fixes,
      sqlFixes: sqlFixes.join('\n'),
      summary: {
        totalTables: Object.keys(results).length,
        accessibleTables: Object.values(results).filter(r => r.accessible).length,
        problematicTables: fixes.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
