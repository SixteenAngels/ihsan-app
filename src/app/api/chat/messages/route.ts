import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/chat/messages - Get messages for a chat room
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('room_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!roomId) {
      return NextResponse.json({
        success: false,
        error: 'Room ID is required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey(id, full_name, email, avatar_url, role)
      `)
      .eq('room_id', roomId)
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
      data: data?.reverse() || [], // Reverse to show oldest first
      pagination: {
        limit,
        offset,
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

// POST /api/chat/messages - Send a message
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      room_id, 
      sender_id, 
      sender_type, 
      message, 
      message_type = 'text',
      file_url,
      file_name,
      file_size
    } = body

    if (!room_id || !sender_id || !message) {
      return NextResponse.json({
        success: false,
        error: 'Room ID, sender ID, and message are required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id,
        sender_id,
        sender_type: sender_type || 'customer',
        message,
        message_type,
        file_url,
        file_name,
        file_size
      })
      .select(`
        *,
        sender:profiles!chat_messages_sender_id_fkey(id, full_name, email, avatar_url, role)
      `)
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    // Update room last message timestamp
    await supabase
      .from('chat_rooms')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', room_id)

    return NextResponse.json({
      success: true,
      data,
      message: 'Message sent successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/chat/messages - Mark messages as read
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { message_ids, user_id } = body

    if (!message_ids || !Array.isArray(message_ids) || !user_id) {
      return NextResponse.json({
        success: false,
        error: 'Message IDs array and user ID are required'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .in('id', message_ids)
      .neq('sender_id', user_id) // Don't mark own messages as read

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Messages marked as read'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
