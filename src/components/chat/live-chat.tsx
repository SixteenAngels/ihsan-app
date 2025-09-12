'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'react-hot-toast'
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  MoreVertical,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Smile,
  Mic,
  MicOff
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

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
  isRead: boolean
  createdAt: string
  sender?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
    role?: string
  }
}

interface ChatRoom {
  id: string
  customer_id: string
  support_agent_id?: string
  status: 'active' | 'closed' | 'waiting'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  subject?: string
  tags: string[]
  created_at: string
  last_message_at: string
  customer?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
  support_agent?: {
    id: string
    full_name: string
    email: string
    avatar_url?: string
  }
}

interface LiveChatProps {
  userId: string
  userRole: string
  currentRoomId?: string
  onRoomSelect?: (roomId: string) => void
  className?: string
}

export default function LiveChat({
  userId,
  userRole,
  currentRoomId,
  onRoomSelect,
  className = ''
}: LiveChatProps) {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadChatRooms()
    initializeSocket()
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [userId, userRole])

  useEffect(() => {
    if (currentRoomId) {
      selectRoom(currentRoomId)
    }
  }, [currentRoomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeSocket = () => {
    // Socket.IO client initialization would go here
    // For now, we'll simulate the connection
    setIsConnected(true)
    console.log('Socket connection initialized')
  }

  const loadChatRooms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/chat/rooms?user_id=${userId}&user_role=${userRole}`)
      const data = await response.json()

      if (data.success) {
        setRooms(data.data)
        
        // Auto-select first room if none selected
        if (!selectedRoom && data.data.length > 0) {
          selectRoom(data.data[0].id)
        }
      } else {
        toast.error('Failed to load chat rooms')
      }
    } catch (error) {
      toast.error('Error loading chat rooms')
      console.error('Error loading chat rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectRoom = async (roomId: string) => {
    try {
      const room = rooms.find(r => r.id === roomId)
      if (!room) return

      setSelectedRoom(room)
      onRoomSelect?.(roomId)

      // Load messages for this room
      const response = await fetch(`/api/chat/messages?room_id=${roomId}`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.data)
      } else {
        toast.error('Failed to load messages')
      }
    } catch (error) {
      toast.error('Error loading messages')
      console.error('Error loading messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return

    try {
      const messageData = {
        room_id: selectedRoom.id,
        sender_id: userId,
        sender_type: userRole === 'customer' ? 'customer' : 'agent',
        message: newMessage.trim(),
        message_type: 'text'
      }

      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })

      const data = await response.json()

      if (data.success) {
        setNewMessage('')
        setMessages(prev => [...prev, data.data])
        
        // Update room list
        loadChatRooms()
      } else {
        toast.error('Failed to send message')
      }
    } catch (error) {
      toast.error('Error sending message')
      console.error('Error sending message:', error)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)
    
    if (!isTyping) {
      setIsTyping(true)
      // Emit typing start event
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      // Emit typing stop event
    }, 1000)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-GH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'normal': return 'bg-blue-100 text-blue-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'waiting': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`flex h-[600px] bg-white rounded-lg shadow-lg ${className}`}>
      {/* Sidebar - Chat Rooms */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Live Chat
            {isConnected && (
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </h3>
          <p className="text-sm text-gray-500">
            {userRole === 'customer' ? 'Customer Support' : 'Support Dashboard'}
          </p>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading chats...</p>
              </div>
            ) : rooms.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No chat rooms available</p>
              </div>
            ) : (
              rooms.map((room) => (
                <motion.div
                  key={room.id}
                  initial="hidden"
                  animate="visible"
                  variants={staggerItem}
                  className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                    selectedRoom?.id === room.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectRoom(room.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={room.customer?.avatar_url} />
                          <AvatarFallback>
                            {room.customer?.full_name?.charAt(0) || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            selectedRoom?.id === room.id ? 'text-white' : 'text-gray-900'
                          }`}>
                            {room.customer?.full_name || 'Unknown User'}
                          </p>
                          <p className={`text-xs truncate ${
                            selectedRoom?.id === room.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {room.subject || 'No subject'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-1">
                        <Badge className={`text-xs ${getPriorityColor(room.priority)}`}>
                          {room.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(room.status)}`}>
                          {room.status}
                        </Badge>
                      </div>
                      <p className={`text-xs ${
                        selectedRoom?.id === room.id ? 'text-white/80' : 'text-gray-400'
                      }`}>
                        {formatTime(room.last_message_at)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedRoom.customer?.avatar_url} />
                    <AvatarFallback>
                      {selectedRoom.customer?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedRoom.customer?.full_name || 'Unknown User'}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(selectedRoom.status)}>
                        {selectedRoom.status}
                      </Badge>
                      <Badge className={getPriorityColor(selectedRoom.priority)}>
                        {selectedRoom.priority}
                      </Badge>
                      {selectedRoom.support_agent && (
                        <span className="text-sm text-gray-500">
                          Agent: {selectedRoom.support_agent.full_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className={`flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[70%] ${message.senderId === userId ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.sender?.avatar_url} />
                        <AvatarFallback>
                          {message.sender?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`ml-2 ${message.senderId === userId ? 'mr-2' : ''}`}>
                        <div className={`rounded-lg px-3 py-2 ${
                          message.senderId === userId
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTime(message.createdAt)}
                          </span>
                          {message.senderId === userId && (
                            <CheckCircle className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {typingUsers.join(', ')} typing...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[40px] max-h-[120px] resize-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsRecording(!isRecording)}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
              <p className="text-gray-500">Choose a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
