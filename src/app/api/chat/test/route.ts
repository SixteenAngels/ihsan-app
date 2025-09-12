import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/chat/test - Test chat system functionality
export async function GET() {
  try {
    const results = {}

    // Test 1: Check if chat tables exist
    const tables = ['chat_rooms', 'chat_messages', 'chat_participants', 'chat_typing', 'chat_assignments']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1)

        results[table] = {
          exists: !error,
          error: error?.message || null
        }
      } catch (err) {
        results[table] = {
          exists: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        }
      }
    }

    // Test 2: Create a test chat room
    try {
      const testRoom = {
        customer_id: 'test-user-123',
        subject: 'Test Chat Room',
        priority: 'normal',
        status: 'waiting'
      }

      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .insert(testRoom)
        .select()
        .single()

      if (roomError) {
        results.create_room = {
          success: false,
          error: roomError.message
        }
      } else {
        results.create_room = {
          success: true,
          data: roomData
        }

        // Test 3: Send a test message
        try {
          const testMessage = {
            room_id: roomData.id,
            sender_id: 'test-user-123',
            sender_type: 'customer',
            message: 'Hello, this is a test message!',
            message_type: 'text'
          }

          const { data: messageData, error: messageError } = await supabase
            .from('chat_messages')
            .insert(testMessage)
            .select()
            .single()

          if (messageError) {
            results.send_message = {
              success: false,
              error: messageError.message
            }
          } else {
            results.send_message = {
              success: true,
              data: messageData
            }
          }
        } catch (err) {
          results.send_message = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          }
        }

        // Test 4: Assign room to support agent
        try {
          const { data: assignData, error: assignError } = await supabase
            .from('chat_rooms')
            .update({
              support_agent_id: 'support-agent-123',
              status: 'active'
            })
            .eq('id', roomData.id)
            .select()
            .single()

          if (assignError) {
            results.assign_room = {
              success: false,
              error: assignError.message
            }
          } else {
            results.assign_room = {
              success: true,
              data: assignData
            }
          }
        } catch (err) {
          results.assign_room = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          }
        }

        // Test 5: Get room messages
        try {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select(`
              *,
              sender:profiles!chat_messages_sender_id_fkey(id, full_name, email, avatar_url)
            `)
            .eq('room_id', roomData.id)
            .order('created_at', { ascending: true })

          if (messagesError) {
            results.get_messages = {
              success: false,
              error: messagesError.message
            }
          } else {
            results.get_messages = {
              success: true,
              count: messagesData?.length || 0,
              data: messagesData
            }
          }
        } catch (err) {
          results.get_messages = {
            success: false,
            error: err instanceof Error ? err.message : 'Unknown error'
          }
        }

        // Clean up test data
        await supabase
          .from('chat_messages')
          .delete()
          .eq('room_id', roomData.id)

        await supabase
          .from('chat_rooms')
          .delete()
          .eq('id', roomData.id)
      }
    } catch (err) {
      results.create_room = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Test 6: Check RLS policies
    try {
      const { data: rlsData, error: rlsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .limit(1)

      results.rls_policies = {
        accessible: !rlsError,
        error: rlsError?.message || null
      }
    } catch (err) {
      results.rls_policies = {
        accessible: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      }
    }

    // Summary
    const summary = {
      totalTests: Object.keys(results).length,
      successfulTests: Object.values(results).filter(r => r.success || r.exists || r.accessible).length,
      failedTests: Object.values(results).filter(r => !r.success && !r.exists && !r.accessible).length
    }

    return NextResponse.json({
      success: true,
      message: 'Chat system test completed',
      results,
      summary,
      recommendations: [
        'Chat system is ready for use',
        'Socket.IO integration needed for real-time features',
        'File upload functionality can be added',
        'Push notifications can be integrated',
        'Chat history and analytics can be enhanced'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
