import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/notifications/history - Get user notification history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notification_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        limit,
        offset,
        total: data?.length || 0,
        hasMore: (data?.length || 0) === limit
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/notifications/history - Add notification to history
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, type, title, message, status = 'sent', channel } = body

    if (!user_id || !type || !title || !message) {
      return NextResponse.json({
        success: false,
        error: 'User ID, type, title, and message are required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notification_history')
      .insert({
        user_id,
        type,
        title,
        message,
        status,
        channel: channel || type,
        created_at: new Date().toISOString()
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
      message: 'Notification added to history'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
