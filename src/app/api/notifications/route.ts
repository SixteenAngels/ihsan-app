import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/notifications - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const unreadOnly = searchParams.get('unread_only') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase notifications fetch error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      notifications: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error) {
    console.error('Notifications fetch error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      user_id, 
      title, 
      message, 
      type = 'info', 
      data = null,
      action_url = null 
    } = body

    if (!user_id || !title || !message) {
      return NextResponse.json({
        success: false,
        error: 'user_id, title, and message are required'
      }, { status: 400 })
    }

    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type,
        data,
        action_url,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase notification creation error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      notification
    }, { status: 201 })

  } catch (error) {
    console.error('Notification creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// PUT /api/notifications - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notification_ids, user_id, mark_all_read = false } = body

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 })
    }

    let query = supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user_id)

    if (mark_all_read) {
      query = query.eq('is_read', false)
    } else if (notification_ids && notification_ids.length > 0) {
      query = query.in('id', notification_ids)
    } else {
      return NextResponse.json({
        success: false,
        error: 'Either notification_ids or mark_all_read must be provided'
      }, { status: 400 })
    }

    const { error } = await query

    if (error) {
      console.error('Supabase notification update error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read'
    })

  } catch (error) {
    console.error('Notification update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// DELETE /api/notifications - Delete notifications
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const userId = searchParams.get('user_id')

    if (!notificationId || !userId) {
      return NextResponse.json({
        success: false,
        error: 'notification id and user_id are required'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase notification deletion error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted'
    })

  } catch (error) {
    console.error('Notification deletion error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}