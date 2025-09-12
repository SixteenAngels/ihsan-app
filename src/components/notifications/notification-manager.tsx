'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { 
  Bell, 
  BellOff, 
  Settings, 
  Smartphone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  User
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface NotificationPreferences {
  push: boolean
  email: boolean
  sms: boolean
  orderUpdates: boolean
  groupBuyUpdates: boolean
  deliveryUpdates: boolean
  marketing: boolean
  security: boolean
}

interface NotificationHistory {
  id: string
  type: 'push' | 'email' | 'sms'
  title: string
  message: string
  timestamp: string
  status: 'sent' | 'delivered' | 'failed' | 'read'
  channel: string
}

export default function NotificationManager() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    push: true,
    email: true,
    sms: false,
    orderUpdates: true,
    groupBuyUpdates: true,
    deliveryUpdates: true,
    marketing: false,
    security: true
  })
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [history, setHistory] = useState<NotificationHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkNotificationSupport()
    loadNotificationHistory()
    loadPreferences()
  }, [])

  const checkNotificationSupport = () => {
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    } else {
      setIsSupported(false)
    }
  }

  const loadNotificationHistory = async () => {
    try {
      // Mock data - replace with actual API call
      const mockHistory: NotificationHistory[] = [
        {
          id: '1',
          type: 'push',
          title: 'Order Confirmed',
          message: 'Your order ORD-001 has been confirmed',
          timestamp: '2024-01-15T10:30:00Z',
          status: 'delivered',
          channel: 'Push Notification'
        },
        {
          id: '2',
          type: 'email',
          title: 'Order Shipped',
          message: 'Your order ORD-001 is on its way',
          timestamp: '2024-01-15T11:00:00Z',
          status: 'sent',
          channel: 'Email'
        },
        {
          id: '3',
          type: 'sms',
          title: 'Order Delivered',
          message: 'Your order ORD-001 has been delivered',
          timestamp: '2024-01-15T14:30:00Z',
          status: 'delivered',
          channel: 'SMS'
        },
        {
          id: '4',
          type: 'push',
          title: 'Group Buy Reminder',
          message: 'Group buy for iPhone 15 Pro ends in 2 hours',
          timestamp: '2024-01-15T16:00:00Z',
          status: 'read',
          channel: 'Push Notification'
        }
      ]
      setHistory(mockHistory)
    } catch (error) {
      console.error('Error loading notification history:', error)
    }
  }

  const loadPreferences = async () => {
    try {
      // Mock data - replace with actual API call
      const savedPreferences = localStorage.getItem('notification-preferences')
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences))
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    }
  }

  const savePreferences = async (newPreferences: NotificationPreferences) => {
    try {
      setPreferences(newPreferences)
      localStorage.setItem('notification-preferences', JSON.stringify(newPreferences))
      
      // Save to backend
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      })

      if (response.ok) {
        toast.success('Preferences saved successfully')
      } else {
        throw new Error('Failed to save preferences')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    }
  }

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      toast.error('Notifications are not supported in this browser')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      
      if (permission === 'granted') {
        toast.success('Notification permission granted')
        setPreferences(prev => ({ ...prev, push: true }))
      } else if (permission === 'denied') {
        toast.error('Notification permission denied')
        setPreferences(prev => ({ ...prev, push: false }))
      }
    } catch (error) {
      console.error('Error requesting permission:', error)
      toast.error('Failed to request notification permission')
    }
  }

  const sendTestNotification = async () => {
    if (permission !== 'granted') {
      toast.error('Notification permission not granted')
      return
    }

    try {
      const notification = new Notification('Ihsan Test Notification', {
        body: 'This is a test notification from Ihsan',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification'
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      toast.success('Test notification sent')
    } catch (error) {
      console.error('Error sending test notification:', error)
      toast.error('Failed to send test notification')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'read':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'read':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'push':
        return <Smartphone className="h-4 w-4" />
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'sms':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
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
          <h1 className="text-4xl font-bold mb-4">Notification Settings</h1>
          <p className="text-xl text-muted-foreground">
            Manage your notification preferences and view notification history
          </p>
        </motion.div>

        {/* Notification Support Status */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {isSupported ? 'Supported' : 'Not Supported'}
                  </div>
                  <div className="text-sm text-muted-foreground">Browser Support</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {permission === 'granted' ? 'Granted' : permission === 'denied' ? 'Denied' : 'Default'}
                  </div>
                  <div className="text-sm text-muted-foreground">Permission</div>
                </div>
                
                <div className="text-center">
                  <Button
                    onClick={permission === 'granted' ? sendTestNotification : requestNotificationPermission}
                    disabled={!isSupported}
                    className="w-full"
                  >
                    {permission === 'granted' ? 'Send Test' : 'Request Permission'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="channels" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="channels">Notification Channels</TabsTrigger>
              <TabsTrigger value="types">Notification Types</TabsTrigger>
            </TabsList>

            {/* Notification Channels */}
            <TabsContent value="channels" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Notification Channels
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Push Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="push-notifications" className="text-base font-medium">
                          Push Notifications
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications on your device
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.push}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, push: checked }
                        savePreferences(newPreferences)
                      }}
                      disabled={permission !== 'granted'}
                    />
                  </div>

                  {/* Email Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="email-notifications" className="text-base font-medium">
                          Email Notifications
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.email}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, email: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="sms-notifications" className="text-base font-medium">
                          SMS Notifications
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Receive notifications via SMS
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={preferences.sms}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, sms: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Types */}
            <TabsContent value="types" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Types
                  </CardTitle>
                  <CardDescription>
                    Choose which types of notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Updates */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="order-updates" className="text-base font-medium">
                          Order Updates
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Order confirmations, shipping updates, delivery notifications
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="order-updates"
                      checked={preferences.orderUpdates}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, orderUpdates: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>

                  {/* Group Buy Updates */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="group-buy-updates" className="text-base font-medium">
                          Group Buy Updates
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Group buy reminders, completion notifications
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="group-buy-updates"
                      checked={preferences.groupBuyUpdates}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, groupBuyUpdates: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>

                  {/* Delivery Updates */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Truck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="delivery-updates" className="text-base font-medium">
                          Delivery Updates
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Real-time delivery tracking, ETA updates
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="delivery-updates"
                      checked={preferences.deliveryUpdates}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, deliveryUpdates: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>

                  {/* Marketing */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="marketing" className="text-base font-medium">
                          Marketing & Promotions
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Special offers, new product announcements
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="marketing"
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, marketing: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="security" className="text-base font-medium">
                          Security & Account
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Login alerts, password changes, account security
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="security"
                      checked={preferences.security}
                      onCheckedChange={(checked) => {
                        const newPreferences = { ...preferences, security: checked }
                        savePreferences(newPreferences)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Notification History */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Notification History
              </CardTitle>
              <CardDescription>
                Recent notifications sent to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(notification.type)}
                        <div>
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {notification.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.timestamp).toLocaleString('en-GH')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(notification.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(notification.status)}
                          <span>{notification.status}</span>
                        </div>
                      </Badge>
                      <Badge variant="outline">
                        {notification.channel}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
