'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
  Package,
  Users,
  Truck,
  Shield
} from 'lucide-react'
import NotificationManager from '@/components/notifications/notification-manager'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface Notification {
  id: string
  type: 'order' | 'group_buy' | 'delivery' | 'marketing' | 'security'
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  actionUrl?: string
  metadata?: Record<string, any>
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      // Mock data - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'Order Confirmed',
          message: 'Your order ORD-001 has been confirmed and is being processed.',
          timestamp: '2024-01-15T10:30:00Z',
          isRead: false,
          priority: 'medium',
          actionUrl: '/orders/ORD-001'
        },
        {
          id: '2',
          type: 'delivery',
          title: 'Order Shipped',
          message: 'Your order ORD-001 is on its way! Track your delivery in real-time.',
          timestamp: '2024-01-15T11:00:00Z',
          isRead: false,
          priority: 'high',
          actionUrl: '/track-order/ORD-001'
        },
        {
          id: '3',
          type: 'group_buy',
          title: 'Group Buy Reminder',
          message: 'Group buy for iPhone 15 Pro ends in 2 hours. Join now to save 15%!',
          timestamp: '2024-01-15T16:00:00Z',
          isRead: true,
          priority: 'urgent',
          actionUrl: '/group-buys/iphone-15-pro'
        },
        {
          id: '4',
          type: 'delivery',
          title: 'Order Delivered',
          message: 'Your order ORD-001 has been delivered successfully. Thank you for shopping with Ihsan!',
          timestamp: '2024-01-15T14:30:00Z',
          isRead: true,
          priority: 'medium',
          actionUrl: '/orders/ORD-001'
        },
        {
          id: '5',
          type: 'security',
          title: 'Login Alert',
          message: 'New login detected from a new device. If this wasn\'t you, please secure your account.',
          timestamp: '2024-01-15T09:15:00Z',
          isRead: false,
          priority: 'high',
          actionUrl: '/profile/security'
        },
        {
          id: '6',
          type: 'marketing',
          title: 'Special Offer',
          message: 'Get 20% off on all electronics this weekend! Limited time offer.',
          timestamp: '2024-01-14T18:00:00Z',
          isRead: true,
          priority: 'low',
          actionUrl: '/categories/electronics'
        }
      ]

      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))

      // API call to mark as read
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      toast.error('Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      
      setNotifications(prev => prev.map(notification => 
        ({ ...notification, isRead: true })
      ))
      setUnreadCount(0)

      // API call to mark all as read
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH'
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      // API call to delete notification
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete notification')
      }

      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-5 w-5 text-blue-500" />
      case 'group_buy':
        return <Users className="h-5 w-5 text-green-500" />
      case 'delivery':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'security':
        return <Shield className="h-5 w-5 text-red-500" />
      case 'marketing':
        return <Bell className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const unreadNotifications = notifications.filter(n => !n.isRead)
  const readNotifications = notifications.filter(n => n.isRead)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
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
        <motion.div variants={slideInFromLeft} className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Notifications</h1>
            <p className="text-xl text-muted-foreground">
              Stay updated with your orders and account activity
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {unreadCount} Unread
            </Badge>
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                Mark All Read
              </Button>
            )}
          </div>
        </motion.div>

        {/* Notification Stats */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Bell className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{readNotifications.length}</div>
              <div className="text-sm text-muted-foreground">Read</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">
                {notifications.filter(n => n.priority === 'urgent').length}
              </div>
              <div className="text-sm text-muted-foreground">Urgent</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="unread" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
            </TabsList>

            {/* Unread Notifications */}
            <TabsContent value="unread" className="space-y-4">
              {unreadNotifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">You have no unread notifications.</p>
                  </CardContent>
                </Card>
              ) : (
                unreadNotifications.map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getTypeIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                              {notification.actionUrl && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto"
                                  onClick={() => window.location.href = notification.actionUrl!}
                                >
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* All Notifications */}
            <TabsContent value="all" className="space-y-4">
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BellOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No notifications</h3>
                    <p className="text-muted-foreground">You haven't received any notifications yet.</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {getTypeIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className={`font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h3>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                              {notification.actionUrl && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto"
                                  onClick={() => window.location.href = notification.actionUrl!}
                                >
                                  View Details
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Notification Settings */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationManager />
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
