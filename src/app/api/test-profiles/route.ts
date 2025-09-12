import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Try different approaches to access profiles
    const results: any = {
      success: true,
      message: 'Profiles access test',
      tests: {}
    }

    // Test 1: Try to access profiles with service role
    try {
      const serviceSupabase = supabase
      const { data, error } = await serviceSupabase
        .from('profiles')
        .select('*')
        .limit(1)
      
      results.tests.serviceRole = {
        success: !error,
        data: data,
        error: error?.message || null
      }
    } catch (err) {
      results.tests.serviceRole = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 2: Try to check if profiles table exists
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      results.tests.count = {
        success: !error,
        data: data,
        error: error?.message || null
      }
    } catch (err) {
      results.tests.count = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 3: Try to check table structure
    try {
      const { data, error } = await supabase
        .rpc('get_table_info', { table_name: 'profiles' })
      
      results.tests.tableInfo = {
        success: !error,
        data: data,
        error: error?.message || null
      }
    } catch (err) {
      results.tests.tableInfo = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
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
