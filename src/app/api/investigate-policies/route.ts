import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to get information about existing policies
    const results: any = {
      success: true,
      message: 'Policy investigation',
      tests: {}
    }

    // Test 1: Try to query the policies table
    try {
      const { data, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'profiles')
      
      results.tests.policies = {
        success: !error,
        data: data,
        error: error?.message || null
      }
    } catch (err) {
      results.tests.policies = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 2: Try to disable RLS temporarily
    try {
      const { data, error } = await supabase
        .rpc('exec_sql', { 
          sql: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;' 
        })
      
      results.tests.disableRLS = {
        success: !error,
        data: data,
        error: error?.message || null
      }

      // If RLS was disabled, try to access profiles
      if (!error) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
        
        results.tests.profilesAccess = {
          success: !profilesError,
          data: profilesData,
          error: profilesError?.message || null
        }

        // Re-enable RLS
        await supabase.rpc('exec_sql', { 
          sql: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;' 
        })
      }
    } catch (err) {
      results.tests.disableRLS = {
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
