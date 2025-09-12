import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/chat/rooms - Get user's chat rooms
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const userRole = searchParams.get('user_role') || 'customer'

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    let query = supabase
      .from('chat_rooms')
      .select(`
        *,
        customer:profiles!chat_rooms_customer_id_fkey(id, full_name, email, avatar_url),
        support_agent:profiles!chat_rooms_support_agent_id_fkey(id, full_name, email, avatar_url),
        last_message:chat_messages!inner(id, message, sender_type, created_at)
      `)
      .order('last_message_at', { ascending: false })

    if (userRole === 'customer') {
      query = query.eq('customer_id', userId)
    } else if (['admin', 'manager', 'support_agent'].includes(userRole)) {
      // Support agents can see all rooms, or filter by assigned agent
      const assignedOnly = searchParams.get('assigned_only') === 'true'
      if (assignedOnly) {
        query = query.eq('support_agent_id', userId)
      }
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// POST /api/chat/rooms - Create a new chat room
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customer_id, subject, priority = 'normal', tags = [] } = body

    if (!customer_id) {
      return NextResponse.json({
        success: false,
        error: 'Customer ID is required'
      }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({
        customer_id,
        subject,
        priority,
        tags,
        status: 'waiting'
      })
      .select(`
        *,
        customer:profiles!chat_rooms_customer_id_fkey(id, full_name, email, avatar_url)
      `)
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
      message: 'Chat room created successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// PUT /api/chat/rooms - Update chat room
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { room_id, status, priority, support_agent_id } = body

    if (!room_id) {
      return NextResponse.json({
        success: false,
        error: 'Room ID is required'
      }, { status: 400 })
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (priority) updateData.priority = priority
    if (support_agent_id) updateData.support_agent_id = support_agent_id
    
    if (status === 'closed') {
      updateData.closed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('chat_rooms')
      .update(updateData)
      .eq('id', room_id)
      .select(`
        *,
        customer:profiles!chat_rooms_customer_id_fkey(id, full_name, email, avatar_url),
        support_agent:profiles!chat_rooms_support_agent_id_fkey(id, full_name, email, avatar_url)
      `)
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
      message: 'Chat room updated successfully'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
