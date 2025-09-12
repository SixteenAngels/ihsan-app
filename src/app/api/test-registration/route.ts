import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json()

    // Test user registration
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (authError) {
      return NextResponse.json({
        success: false,
        error: authError.message,
        details: authError
      }, { status: 400 })
    }

    // Try to manually insert into profiles table (bypassing the trigger)
    let profileData = null
    let profileError = null
    
    if (authData.user) {
      try {
        // This might fail due to the policy issue, but let's try
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: fullName,
            role: 'customer'
          })
          .select()
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
      auth: {
        user: authData.user,
        session: authData.session,
        error: authError?.message || null
      },
      profile: {
        data: profileData,
        error: profileError?.message || null,
        created: !profileError
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
