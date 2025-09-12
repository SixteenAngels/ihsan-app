import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/notifications/preferences - Get user notification preferences
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    // Return default preferences if none exist
    const defaultPreferences = {
      push: true,
      email: true,
      sms: false,
      orderUpdates: true,
      groupBuyUpdates: true,
      deliveryUpdates: true,
      marketing: false,
      security: true
    }

    return NextResponse.json({
      success: true,
      data: data || { user_id: userId, ...defaultPreferences }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/notifications/preferences - Update user notification preferences
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { user_id, ...preferences } = body

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Preferences updated successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
