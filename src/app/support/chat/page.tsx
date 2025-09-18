'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'react-toastify'
import { 
  MessageCircle, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  UserPlus,
  Activity,
  TrendingUp
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'
import LiveChat from '@/components/chat/live-chat'

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

export default function SupportAgentDashboard() {
  const [userId] = useState('support-agent-123') // Mock support agent ID
  const [userRole] = useState('support_agent')
  const [waitingRooms, setWaitingRooms] = useState<ChatRoom[]>([])
  const [activeRooms, setActiveRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalRooms: 0,
    waitingRooms: 0,
    activeRooms: 0,
    closedRooms: 0,
    avgResponseTime: '2.5 min'
  })

  useEffect(() => {
    loadSupportData()
  }, [])

  const loadSupportData = async () => {
    try {
      // Load waiting rooms
      const waitingResponse = await fetch(`/api/chat/rooms?user_id=${userId}&user_role=${userRole}`)
      const waitingData = await waitingResponse.json()

      if (waitingData.success) {
        const waiting = waitingData.data.filter((room: ChatRoom) => room.status === 'waiting')
        const active = waitingData.data.filter((room: ChatRoom) => room.status === 'active')
        
        setWaitingRooms(waiting)
        setActiveRooms(active)
        
        setStats(prev => ({
          ...prev,
          totalRooms: waitingData.data.length,
          waitingRooms: waiting.length,
          activeRooms: active.length,
          closedRooms: waitingData.data.filter((room: ChatRoom) => room.status === 'closed').length
        }))
      }
    } catch (error) {
      console.error('Error loading support data:', error)
    }
  }

  const assignRoomToAgent = async (roomId: string) => {
    try {
      const response = await fetch('/api/chat/rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: roomId,
          support_agent_id: userId,
          status: 'active'
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Chat room assigned to you')
        setSelectedRoom(roomId)
        loadSupportData()
      } else {
        toast.error('Failed to assign chat room')
      }
    } catch (error) {
      toast.error('Error assigning chat room')
      console.error('Error assigning chat room:', error)
    }
  }

  const closeRoom = async (roomId: string) => {
    try {
      const response = await fetch('/api/chat/rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_id: roomId,
          status: 'closed'
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Chat room closed')
        loadSupportData()
        if (selectedRoom === roomId) {
          setSelectedRoom(null)
        }
      } else {
        toast.error('Failed to close chat room')
      }
    } catch (error) {
      toast.error('Error closing chat room')
      console.error('Error closing chat room:', error)
    }
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
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={slideInFromLeft} className="text-center">
          <h1 className="text-4xl font-bold mb-4">Support Agent Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage customer support chats and provide assistance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={staggerItem}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{stats.totalRooms}</p>
                    <p className="text-sm text-gray-600">Total Chats</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.waitingRooms}</p>
                    <p className="text-sm text-gray-600">Waiting</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeRooms}</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                    <p className="text-sm text-gray-600">Avg Response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Waiting Rooms */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-yellow-500" />
                Waiting for Assignment ({waitingRooms.length})
              </CardTitle>
              <CardDescription>
                Customer chats waiting for a support agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {waitingRooms.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No waiting chats</p>
                    </div>
                  ) : (
                    waitingRooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={room.customer?.avatar_url} />
                            <AvatarFallback>
                              {room.customer?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{room.customer?.full_name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-600">{room.subject || 'No subject'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getPriorityColor(room.priority)}>
                                {room.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTime(room.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={() => assignRoomToAgent(room.id)}
                          size="sm"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Take Chat
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Active Rooms */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-500" />
                Active Chats ({activeRooms.length})
              </CardTitle>
              <CardDescription>
                Currently active support conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-3">
                  {activeRooms.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No active chats</p>
                    </div>
                  ) : (
                    activeRooms.map((room) => (
                      <div key={room.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={room.customer?.avatar_url} />
                            <AvatarFallback>
                              {room.customer?.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{room.customer?.full_name || 'Unknown User'}</p>
                            <p className="text-sm text-gray-600">{room.subject || 'No subject'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getPriorityColor(room.priority)}>
                                {room.priority}
                              </Badge>
                              <Badge className={getStatusColor(room.status)}>
                                {room.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Last: {formatTime(room.last_message_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            onClick={() => setSelectedRoom(room.id)}
                            size="sm"
                            variant="outline"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Open
                          </Button>
                          <Button 
                            onClick={() => closeRoom(room.id)}
                            size="sm"
                            variant="outline"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Close
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Chat Interface */}
        {selectedRoom && (
          <motion.div variants={staggerItem}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  Chat with the customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LiveChat
                  userId={userId}
                  userRole={userRole}
                  currentRoomId={selectedRoom}
                  onRoomSelect={setSelectedRoom}
                  className="h-[600px]"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
