import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/fix-rls-policies - Apply comprehensive RLS policy fixes
export async function POST(request: Request) {
  try {
    // Read the SQL file content
    const fs = await import('fs/promises')
    const path = await import('path')
    
    const sqlFilePath = path.join(process.cwd(), 'FIX_RLS_POLICIES_COMPREHENSIVE.sql')
    const sqlContent = await fs.readFile(sqlFilePath, 'utf-8')
    
    // Split SQL content into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    const results = []
    let successCount = 0
    let errorCount = 0
    
    // Execute each SQL statement
    for (const statement of statements) {
      try {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.error('SQL Error:', error)
            results.push({
              statement: statement.substring(0, 100) + '...',
              error: error.message
            })
            errorCount++
          } else {
            successCount++
          }
        }
      } catch (err) {
        console.error('Execution Error:', err)
        results.push({
          statement: statement.substring(0, 100) + '...',
          error: err instanceof Error ? err.message : 'Unknown error'
        })
        errorCount++
      }
    }
    
    return NextResponse.json({
      success: errorCount === 0,
      message: `RLS policies fix completed. ${successCount} statements executed successfully, ${errorCount} errors.`,
      results: {
        successCount,
        errorCount,
        details: results
      }
    })
    
  } catch (error) {
    console.error('RLS Fix Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET /api/fix-rls-policies - Check RLS policy status
export async function GET() {
  try {
    // Check if we can access the problematic tables
    const tables = ['cart_items', 'orders', 'order_items', 'notifications']
    const results = {}
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)
        
        results[table] = {
          accessible: !error,
          error: error?.message || null
        }
      } catch (err) {
        results[table] = {
          accessible: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'RLS policy status check completed',
      results
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
