import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const testEmail = `test-${Date.now()}@ihsan.com`
    const testPassword = 'testpassword123'
    
    // Test user registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    })

    if (authError) {
      return NextResponse.json({
        success: false,
        error: authError.message,
        step: 'registration_failed',
        details: authError
      }, { status: 400 })
    }

    // Check if profile was created automatically
    let profileData = null
    let profileError = null
    
    if (authData.user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        profileData = data
        profileError = error
      } catch (err) {
        profileError = err
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User registration test completed',
      registration: {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at
        } : null,
        session: authData.session ? 'Session created' : 'No session',
        error: authError?.message || null
      },
      profile: {
        data: profileData,
        error: profileError?.message || null,
        created: !profileError && profileData
      },
      testEmail: testEmail
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
