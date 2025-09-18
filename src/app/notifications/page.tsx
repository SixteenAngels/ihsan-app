'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Check, Trash2, ExternalLink, Bell } from 'lucide-react'
import { useNotifications } from '@/lib/notifications-context'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, isLoading } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications

  const handleNotificationClick = async (notification: any) => {
    if (!notification.is_read) {
      await markAsRead([notification.id])
    }
    
    if (notification.action_url) {
      window.location.href = notification.action_url
    }
  }

  const handleMarkAllRead = async () => {
    await markAllAsRead()
  }

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      case 'warning':
        return 'text-yellow-600'
      default:
        return 'text-blue-600'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
          <div>
                <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllRead} variant="outline">
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
              </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
                                <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
                          </Button>
                          <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
                          >
              Unread ({unreadCount})
                          </Button>
                        </div>
                      </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
                <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'You\'re all caught up! Check back later for new updates.'
                  : 'We\'ll notify you about important updates, orders, and more.'
                }
              </p>
                  </CardContent>
                </Card>
              ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.is_read ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <span className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                            <h3 className={`font-semibold ${getNotificationColor(notification.type)}`}>
                                {notification.title}
                              </h3>
                            {!notification.is_read && (
                              <Badge variant="secondary" className="text-xs">
                                New
                              </Badge>
                              )}
                            </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                            {notification.action_url && (
                              <span className="flex items-center text-blue-600">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Click to view
                              </span>
                            )}
                          </div>
                        </div>
                            <Button
                          variant="ghost"
                              size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}