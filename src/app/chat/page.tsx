'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-toastify'
import { 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'
import LiveChat from '@/components/chat/live-chat'

export default function CustomerChatPage() {
  const [userId] = useState('test-user-123') // Mock user ID
  const [userRole] = useState('customer')
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [newRoomData, setNewRoomData] = useState({
    subject: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    message: ''
  })

  const createNewChatRoom = async () => {
    if (!newRoomData.subject.trim() || !newRoomData.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setIsCreatingRoom(true)
      
      // Create chat room
      const roomResponse = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: userId,
          subject: newRoomData.subject,
          priority: newRoomData.priority
        }),
      })

      const roomData = await roomResponse.json()

      if (roomData.success) {
        // Send initial message
        const messageResponse = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            room_id: roomData.data.id,
            sender_id: userId,
            sender_type: 'customer',
            message: newRoomData.message,
            message_type: 'text'
          }),
        })

        const messageData = await messageResponse.json()

        if (messageData.success) {
          toast.success('Chat room created successfully! A support agent will be with you shortly.')
          setNewRoomData({ subject: '', priority: 'normal', message: '' })
        } else {
          toast.error('Failed to send initial message')
        }
      } else {
        toast.error('Failed to create chat room')
      }
    } catch (error) {
      toast.error('Error creating chat room')
      console.error('Error creating chat room:', error)
    } finally {
      setIsCreatingRoom(false)
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
          <h1 className="text-4xl font-bold mb-4">Customer Support</h1>
          <p className="text-xl text-muted-foreground">
            Get help with your orders, products, or any questions you have
          </p>
        </motion.div>

        {/* Quick Help Options */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Quick Help Options
              </CardTitle>
              <CardDescription>
                Choose how you'd like to get help
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Live Chat</h3>
                    <p className="text-sm text-gray-600">Chat with our support team</p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Available</Badge>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Phone Support</h3>
                    <p className="text-sm text-gray-600">Call us directly</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">+233 24 123 4567</Badge>
                  </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="text-center">
                    <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h3 className="font-semibold mb-1">Email Support</h3>
                    <p className="text-sm text-gray-600">Send us an email</p>
                    <Badge className="mt-2 bg-purple-100 text-purple-800">support@ihsan.com</Badge>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create New Chat */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Start a New Chat
              </CardTitle>
              <CardDescription>
                Create a new support ticket to get help with your issue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subject *</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={newRoomData.subject}
                  onChange={(e) => setNewRoomData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              
              <div>
                <label htmlFor="priority-select" className="block text-sm font-medium mb-2">Priority</label>
                <select
                  id="priority-select"
                  className="w-full p-2 border rounded-md"
                  value={newRoomData.priority}
                  onChange={(e) => setNewRoomData(prev => ({ ...prev, priority: e.target.value as any }))}
                  aria-label="Select priority level for your support request"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="normal">Normal - Standard support</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="urgent">Urgent - Critical problem</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Initial Message *</label>
                <Textarea
                  placeholder="Describe your issue in detail..."
                  value={newRoomData.message}
                  onChange={(e) => setNewRoomData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={createNewChatRoom}
                disabled={isCreatingRoom || !newRoomData.subject.trim() || !newRoomData.message.trim()}
                className="w-full"
              >
                {isCreatingRoom ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Chat...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Chat Interface */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Your Chats
              </CardTitle>
              <CardDescription>
                Continue your existing conversations or start a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LiveChat
                userId={userId}
                userRole={userRole}
                className="h-[600px]"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Support Information */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Support Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Business Hours</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Response Times</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Live Chat: Usually within 2 minutes</p>
                    <p>Email: Within 24 hours</p>
                    <p>Phone: Immediate during business hours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
