import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Check users in auth.users table
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    // Try to get profiles (this might fail due to the policy issue)
    let profilesData = null
    let profilesError = null
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)
      profilesData = data
      profilesError = error
    } catch (err) {
      profilesError = err
    }

    return NextResponse.json({
      success: true,
      message: 'User check completed',
      auth: {
        users: authUsers?.users || [],
        count: authUsers?.users?.length || 0,
        error: authError?.message || null
      },
      profiles: {
        data: profilesData,
        error: profilesError?.message || null,
        accessible: !profilesError
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
