import { Server as SocketIOServer, Socket } from 'socket.io'
import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

interface AuthenticatedSocket extends Socket {
  userId?: string
  userRole?: string
  currentRoom?: string
}

interface ChatMessage {
  id: string
  roomId: string
  senderId: string
  senderType: 'customer' | 'agent' | 'system'
  message: string
  messageType: 'text' | 'image' | 'file' | 'system'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  createdAt: string
}

interface TypingIndicator {
  roomId: string
  userId: string
  isTyping: boolean
}

class ChatServer {
  private io: SocketIOServer
  private connectedUsers: Map<string, string> = new Map() // userId -> socketId
  private roomUsers: Map<string, Set<string>> = new Map() // roomId -> Set of userIds

  constructor(io: SocketIOServer) {
    this.io = io
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log('User connected:', socket.id)

      // Handle user authentication
      socket.on('authenticate', async (data: { userId: string, userRole: string }) => {
        try {
          socket.userId = data.userId
          socket.userRole = data.userRole
          this.connectedUsers.set(data.userId, socket.id)
          
          console.log(`User ${data.userId} authenticated as ${data.userRole}`)
          socket.emit('authenticated', { success: true })
        } catch (error) {
          console.error('Authentication error:', error)
          socket.emit('authentication_error', { error: 'Authentication failed' })
        }
      })

      // Handle joining a chat room
      socket.on('join_room', async (data: { roomId: string }) => {
        try {
          if (!socket.userId) {
            socket.emit('error', { message: 'Not authenticated' })
            return
          }

          // Verify user has access to this room
          const hasAccess = await this.verifyRoomAccess(socket.userId, data.roomId)
          if (!hasAccess) {
            socket.emit('error', { message: 'Access denied to this room' })
            return
          }

          // Leave previous room if any
          if (socket.currentRoom) {
            socket.leave(socket.currentRoom)
            this.removeUserFromRoom(socket.currentRoom, socket.userId)
          }

          // Join new room
          socket.join(data.roomId)
          socket.currentRoom = data.roomId
          this.addUserToRoom(data.roomId, socket.userId)

          // Update last seen
          await this.updateLastSeen(socket.userId, data.roomId)

          // Notify room about user joining
          socket.to(data.roomId).emit('user_joined', {
            userId: socket.userId,
            userRole: socket.userRole,
            timestamp: new Date().toISOString()
          })

          // Send room info
          const roomInfo = await this.getRoomInfo(data.roomId)
          socket.emit('room_joined', {
            roomId: data.roomId,
            roomInfo,
            participants: Array.from(this.roomUsers.get(data.roomId) || [])
          })

          console.log(`User ${socket.userId} joined room ${data.roomId}`)
        } catch (error) {
          console.error('Join room error:', error)
          socket.emit('error', { message: 'Failed to join room' })
        }
      })

      // Handle sending messages
      socket.on('send_message', async (data: {
        roomId: string
        message: string
        messageType?: 'text' | 'image' | 'file'
        fileUrl?: string
        fileName?: string
        fileSize?: number
      }) => {
        try {
          if (!socket.userId || !socket.currentRoom) {
            socket.emit('error', { message: 'Not authenticated or not in a room' })
            return
          }

          // Verify user has access to this room
          const hasAccess = await this.verifyRoomAccess(socket.userId, data.roomId)
          if (!hasAccess) {
            socket.emit('error', { message: 'Access denied to this room' })
            return
          }

          // Save message to database
          const messageData = await this.saveMessage({
            roomId: data.roomId,
            senderId: socket.userId,
            senderType: socket.userRole === 'customer' ? 'customer' : 'agent',
            message: data.message,
            messageType: data.messageType || 'text',
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize
          })

          // Broadcast message to room
          this.io.to(data.roomId).emit('new_message', messageData)

          // Update room last message timestamp
          await this.updateRoomLastMessage(data.roomId)

          console.log(`Message sent in room ${data.roomId} by ${socket.userId}`)
        } catch (error) {
          console.error('Send message error:', error)
          socket.emit('error', { message: 'Failed to send message' })
        }
      })

      // Handle typing indicators
      socket.on('typing_start', async (data: { roomId: string }) => {
        try {
          if (!socket.userId || !socket.currentRoom) {
            return
          }

          // Save typing indicator
          await this.setTypingIndicator(socket.userId, data.roomId, true)

          // Broadcast to other users in room
          socket.to(data.roomId).emit('user_typing', {
            userId: socket.userId,
            isTyping: true,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error('Typing start error:', error)
        }
      })

      socket.on('typing_stop', async (data: { roomId: string }) => {
        try {
          if (!socket.userId || !socket.currentRoom) {
            return
          }

          // Remove typing indicator
          await this.setTypingIndicator(socket.userId, data.roomId, false)

          // Broadcast to other users in room
          socket.to(data.roomId).emit('user_typing', {
            userId: socket.userId,
            isTyping: false,
            timestamp: new Date().toISOString()
          })
        } catch (error) {
          console.error('Typing stop error:', error)
        }
      })

      // Handle marking messages as read
      socket.on('mark_read', async (data: { roomId: string, messageIds: string[] }) => {
        try {
          if (!socket.userId) {
            return
          }

          await this.markMessagesAsRead(data.messageIds, socket.userId)
          socket.emit('messages_read', { messageIds: data.messageIds })
        } catch (error) {
          console.error('Mark read error:', error)
        }
      })

      // Handle room status updates
      socket.on('update_room_status', async (data: {
        roomId: string
        status: 'active' | 'closed' | 'waiting'
        priority?: 'low' | 'normal' | 'high' | 'urgent'
      }) => {
        try {
          if (!socket.userId || !['admin', 'manager', 'support_agent'].includes(socket.userRole || '')) {
            socket.emit('error', { message: 'Insufficient permissions' })
            return
          }

          await this.updateRoomStatus(data.roomId, data.status, data.priority)
          
          // Broadcast status update to room
          this.io.to(data.roomId).emit('room_status_updated', {
            roomId: data.roomId,
            status: data.status,
            priority: data.priority,
            updatedBy: socket.userId,
            timestamp: new Date().toISOString()
          })

          console.log(`Room ${data.roomId} status updated to ${data.status}`)
        } catch (error) {
          console.error('Update room status error:', error)
          socket.emit('error', { message: 'Failed to update room status' })
        }
      })

      // Handle disconnection
      socket.on('disconnect', async () => {
        try {
          if (socket.userId) {
            this.connectedUsers.delete(socket.userId)
            
            if (socket.currentRoom) {
              this.removeUserFromRoom(socket.currentRoom, socket.userId)
              
              // Notify room about user leaving
              socket.to(socket.currentRoom).emit('user_left', {
                userId: socket.userId,
                timestamp: new Date().toISOString()
              })

              // Update last seen
              await this.updateLastSeen(socket.userId, socket.currentRoom)
            }
          }
          
          console.log('User disconnected:', socket.id)
        } catch (error) {
          console.error('Disconnect error:', error)
        }
      })
    })
  }

  private async verifyRoomAccess(userId: string, roomId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select('customer_id, support_agent_id')
        .eq('id', roomId)
        .single()

      if (error || !data) {
        return false
      }

      // Check if user is customer or assigned agent
      if (data.customer_id === userId || data.support_agent_id === userId) {
        return true
      }

      // Check if user is admin/manager/support_agent
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      return profile?.role && ['admin', 'manager', 'support_agent'].includes(profile.role)
    } catch (error) {
      console.error('Verify room access error:', error)
      return false
    }
  }

  private async saveMessage(data: {
    roomId: string
    senderId: string
    senderType: 'customer' | 'agent' | 'system'
    message: string
    messageType: 'text' | 'image' | 'file'
    fileUrl?: string
    fileName?: string
    fileSize?: number
  }): Promise<ChatMessage> {
    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: data.roomId,
        sender_id: data.senderId,
        sender_type: data.senderType,
        message: data.message,
        message_type: data.messageType,
        file_url: data.fileUrl,
        file_name: data.fileName,
        file_size: data.fileSize
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to save message: ${error.message}`)
    }

    return {
      id: message.id,
      roomId: message.room_id,
      senderId: message.sender_id,
      senderType: message.sender_type,
      message: message.message,
      messageType: message.message_type,
      fileUrl: message.file_url,
      fileName: message.file_name,
      fileSize: message.file_size,
      createdAt: message.created_at
    }
  }

  private async setTypingIndicator(userId: string, roomId: string, isTyping: boolean): Promise<void> {
    if (isTyping) {
      await supabase
        .from('chat_typing')
        .upsert({
          room_id: roomId,
          user_id: userId,
          is_typing: true,
          expires_at: new Date(Date.now() + 10000).toISOString() // 10 seconds
        })
    } else {
      await supabase
        .from('chat_typing')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId)
    }
  }

  private async markMessagesAsRead(messageIds: string[], userId: string): Promise<void> {
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .in('id', messageIds)
      .neq('sender_id', userId) // Don't mark own messages as read
  }

  private async updateLastSeen(userId: string, roomId: string): Promise<void> {
    await supabase
      .from('chat_participants')
      .upsert({
        room_id: roomId,
        user_id: userId,
        last_seen: new Date().toISOString(),
        is_active: true
      })
  }

  private async updateRoomLastMessage(roomId: string): Promise<void> {
    await supabase
      .from('chat_rooms')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', roomId)
  }

  private async updateRoomStatus(roomId: string, status: string, priority?: string): Promise<void> {
    const updateData: any = { status }
    if (priority) {
      updateData.priority = priority
    }
    if (status === 'closed') {
      updateData.closed_at = new Date().toISOString()
    }

    await supabase
      .from('chat_rooms')
      .update(updateData)
      .eq('id', roomId)
  }

  private async getRoomInfo(roomId: string): Promise<any> {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        customer:profiles!chat_rooms_customer_id_fkey(id, full_name, email, avatar_url),
        support_agent:profiles!chat_rooms_support_agent_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('id', roomId)
      .single()

    if (error) {
      throw new Error(`Failed to get room info: ${error.message}`)
    }

    return data
  }

  private addUserToRoom(roomId: string, userId: string): void {
    if (!this.roomUsers.has(roomId)) {
      this.roomUsers.set(roomId, new Set())
    }
    this.roomUsers.get(roomId)!.add(userId)
  }

  private removeUserFromRoom(roomId: string, userId: string): void {
    const users = this.roomUsers.get(roomId)
    if (users) {
      users.delete(userId)
      if (users.size === 0) {
        this.roomUsers.delete(roomId)
      }
    }
  }

  // Public methods for external use
  public async getActiveRooms(): Promise<any[]> {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        customer:profiles!chat_rooms_customer_id_fkey(id, full_name, email, avatar_url),
        support_agent:profiles!chat_rooms_support_agent_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })

    return data || []
  }

  public async getWaitingRooms(): Promise<any[]> {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        *,
        customer:profiles!chat_rooms_customer_id_fkey(id, full_name, email, avatar_url)
      `)
      .eq('status', 'waiting')
      .order('created_at', { ascending: true })

    return data || []
  }

  public async assignRoomToAgent(roomId: string, agentId: string): Promise<void> {
    await supabase
      .from('chat_rooms')
      .update({ 
        support_agent_id: agentId,
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId)

    // Notify room about assignment
    this.io.to(roomId).emit('room_assigned', {
      roomId,
      agentId,
      timestamp: new Date().toISOString()
    })
  }
}

export default ChatServer
