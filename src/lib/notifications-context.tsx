'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'react-toastify'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  data?: any
  action_url?: string
  is_read: boolean
  read_at?: string
  created_at: string
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (notificationIds: string[]) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  refreshNotifications: () => Promise<void>
  sendNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'error', data?: any, actionUrl?: string) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const unreadCount = notifications.filter(n => !n.is_read).length

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/notifications?user_id=${user.id}&limit=50`)
      const data = await response.json()
      
      if (data.success) {
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    await loadNotifications()
  }, [loadNotifications])

  // Mark notifications as read
  const markAsRead = useCallback(async (notificationIds: string[]) => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          notification_ids: notificationIds
        })
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notificationIds.includes(notification.id)
              ? { ...notification, is_read: true, read_at: new Date().toISOString() }
              : notification
          )
        )
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }, [user])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          mark_all_read: true
        })
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => ({
            ...notification,
            is_read: true,
            read_at: new Date().toISOString()
          }))
        )
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [user])

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/notifications?id=${notificationId}&user_id=${user.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [user])

  // Send notification (for admin/manager use)
  const sendNotification = useCallback(async (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    data?: any,
    actionUrl?: string
  ) => {
    if (!user) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          message,
          type,
          data,
          action_url: actionUrl
        })
      })

      const result = await response.json()
      if (result.success) {
        // Add to local state
        setNotifications(prev => [result.notification, ...prev])
        
        // Show toast notification
        if (type === 'success') {
          toast.success(message)
        } else if (type === 'error') {
          toast.error(message)
        } else if (type === 'warning') {
          toast.warn(message)
        } else {
          toast(message)
        }
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }, [user])

  // Load notifications on mount and when user changes
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      loadNotifications()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [user, loadNotifications])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    sendNotification,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
