import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, role = 'customer', fullName, phone } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user already exists in profiles
    const { data: existingProfiles, error: existingCheckError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existingCheckError) {
      console.error('Existing user check error:', existingCheckError)
      return NextResponse.json(
        { error: 'Failed to check existing user', details: existingCheckError.message },
        { status: 500 }
      )
    }

    if (existingProfiles && existingProfiles.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Generate a random password
    const randomPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + '!'

    // Create user with Supabase Auth Admin API
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName || '',
        phone: phone || '',
        role: role,
        invited: true
      }
    })

    if (createError) {
      console.error('User creation error:', createError)
      const message = createError.message || 'Failed to create user'
      const isDuplicate = /already|exists|registered/i.test(message)
      return NextResponse.json(
        { error: message },
        { status: isDuplicate ? 409 : 500 }
      )
    }

    if (!newUser.user) {
      return NextResponse.json(
        { error: 'User creation failed - no user returned' },
        { status: 500 }
      )
    }

    // The profile will be created automatically by the trigger
    // But let's also create it manually to ensure it exists
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        email: email,
        full_name: fullName || '',
        phone: phone || '',
        role: role,
        is_active: true
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't fail the request if profile creation fails
      // The trigger should handle it
    }

    // Send invitation email (optional - you can implement this)
    try {
      // You can integrate with your email service here
      // For now, we'll just log the temporary password
      console.log(`User ${email} created with temporary password: ${randomPassword}`)
      
      // In production, you should send this password securely via email
      // and ask the user to change it on first login
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      // Don't fail the request if email sending fails
    }

    return NextResponse.json({
      success: true,
      data: {
        user_id: newUser.user.id,
        email: email,
        role: role,
        message: 'User created successfully'
      }
    })

  } catch (error) {
    console.error('User invitation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role')
    const vendorStatus = searchParams.get('vendorStatus')
    const search = searchParams.get('search')

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (role) {
      query = query.eq('role', role)
    }

    if (vendorStatus) {
      query = query.eq('vendor_status', vendorStatus)
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: users, error, count } = await query

    if (error) {
      console.error('Users fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch users', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        users: users || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    })

  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, role, vendorStatus, isActive } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    
    if (role !== undefined) updateData.role = role
    if (vendorStatus !== undefined) updateData.vendor_status = vendorStatus
    if (isActive !== undefined) updateData.is_active = isActive

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('User update error:', error)
      return NextResponse.json(
        { error: 'Failed to update user', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data,
        message: 'User updated successfully'
      }
    })

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('User deletion error:', authError)
      return NextResponse.json(
        { error: 'Failed to delete user', details: authError.message },
        { status: 500 }
      )
    }

    // The profile will be deleted automatically by the CASCADE constraint

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
