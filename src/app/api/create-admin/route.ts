import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role = 'admin' } = await request.json()

    // Step 1: Create user in Supabase Auth
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
        step: 'auth_creation',
        details: authError
      }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'No user created',
        step: 'auth_creation'
      }, { status: 400 })
    }

    // Step 2: Manually create profile (bypassing the trigger)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: authData.user.email!,
        full_name: fullName,
        role: role
      })
      .select()
      .single()

    if (profileError) {
      return NextResponse.json({
        success: false,
        error: profileError.message,
        step: 'profile_creation',
        authUser: authData.user,
        details: profileError
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully!',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        role: role,
        created_at: authData.user.created_at
      },
      profile: profileData
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
