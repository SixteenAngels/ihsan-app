import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test if we can create a user with Supabase Auth
    const testEmail = `test-${Date.now()}@ihsan.com`
    const testPassword = 'testpassword123'
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'User registration test',
      auth: {
        user: authData.user ? {
          id: authData.user.id,
          email: authData.user.email,
          created_at: authData.user.created_at
        } : null,
        session: authData.session ? 'Session created' : 'No session',
        error: authError?.message || null
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
