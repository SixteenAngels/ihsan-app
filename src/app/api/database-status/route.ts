import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const results: any = {
      success: true,
      message: 'Database status check',
      tables: {}
    }

    // Check each table
    const tables = [
      'categories',
      'products', 
      'profiles',
      'addresses',
      'orders',
      'order_items',
      'group_buys',
      'group_buy_participants',
      'reviews',
      'cart_items',
      'notifications'
    ]

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)

        results.tables[table] = {
          exists: !error,
          count: data?.[0]?.count || 0,
          error: error?.message || null
        }
      } catch (err) {
        results.tables[table] = {
          exists: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
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
