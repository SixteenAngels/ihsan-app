// Notification service for automatic notifications
import { supabase } from '@/lib/supabase'
import { EmailService } from '@/lib/email-service'

export interface NotificationData {
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  data?: any
  action_url?: string
}

export interface NotificationRequest {
  templateId: string
  recipients: string[]
  variables?: Record<string, any>
  priority?: 'low' | 'medium' | 'high'
}

export class NotificationService {
  // Send notification to a specific user
  static async sendNotification(data: NotificationData) {
    try {
      // Store notification in database
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: data.user_id,
          title: data.title,
          message: data.message,
          type: data.type,
          data: data.data,
          action_url: data.action_url,
          is_read: false
        })

      if (error) {
        console.error('Error sending notification:', error)
        return false
      }

      // Send email notification if user has email preferences
      try {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('email, full_name, notification_preferences')
          .eq('id', data.user_id)
          .single()

        if (userProfile?.email && userProfile?.notification_preferences?.email) {
          await EmailService.sendEmail({
            to: userProfile.email,
            subject: data.title,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">${data.title}</h2>
                <p>${data.message}</p>
                ${data.action_url ? `<p><a href="${process.env.NEXT_PUBLIC_APP_URL}${data.action_url}" style="color: #2563eb;">View Details</a></p>` : ''}
              </div>
            `,
            text: `${data.title}\n\n${data.message}${data.action_url ? `\n\nView Details: ${process.env.NEXT_PUBLIC_APP_URL}${data.action_url}` : ''}`
          })
        }
      } catch (emailError) {
        console.error('Email notification failed:', emailError)
        // Don't fail the entire notification if email fails
      }

      return true
    } catch (error) {
      console.error('Notification service error:', error)
      return false
    }
  }

  // Send notification to multiple users
  static async sendBulkNotifications(notifications: NotificationData[]) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(
          notifications.map(notification => ({
            user_id: notification.user_id,
            title: notification.title,
            message: notification.message,
            type: notification.type,
            data: notification.data,
            action_url: notification.action_url,
            is_read: false
          }))
        )

      if (error) {
        console.error('Error sending bulk notifications:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Bulk notification service error:', error)
      return false
    }
  }

  // Order-related notifications
  static async notifyOrderCreated(orderId: string, userId: string, orderNumber: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'Order Confirmed',
      message: `Your order #${orderNumber} has been confirmed and is being processed.`,
      type: 'success',
      data: { order_id: orderId, order_number: orderNumber },
      action_url: `/order-success?order=${orderNumber}`
    })
  }

  static async notifyOrderStatusUpdate(orderId: string, userId: string, orderNumber: string, status: string) {
    const statusMessages = {
      'confirmed': 'Your order has been confirmed and is being prepared.',
      'shipped': 'Your order has been shipped and is on its way.',
      'delivered': 'Your order has been delivered successfully.',
      'cancelled': 'Your order has been cancelled.',
      'refunded': 'Your order has been refunded.'
    }

    const statusIcons = {
      'confirmed': 'success',
      'shipped': 'info',
      'delivered': 'success',
      'cancelled': 'error',
      'refunded': 'warning'
    } as const

    return this.sendNotification({
      user_id: userId,
      title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Order #${orderNumber}: ${statusMessages[status as keyof typeof statusMessages] || 'Status updated.'}`,
      type: statusIcons[status as keyof typeof statusIcons] || 'info',
      data: { order_id: orderId, order_number: orderNumber, status },
      action_url: `/my-account/orders`
    })
  }

  static async notifyPaymentReceived(orderId: string, userId: string, orderNumber: string, amount: number) {
    return this.sendNotification({
      user_id: userId,
      title: 'Payment Received',
      message: `Payment of GHS ${amount.toFixed(2)} for order #${orderNumber} has been received.`,
      type: 'success',
      data: { order_id: orderId, order_number: orderNumber, amount },
      action_url: `/order-success?order=${orderNumber}`
    })
  }

  // Product-related notifications
  static async notifyProductApproved(productId: string, userId: string, productName: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'Product Approved',
      message: `Your product "${productName}" has been approved and is now live.`,
      type: 'success',
      data: { product_id: productId, product_name: productName },
      action_url: `/vendor/products`
    })
  }

  static async notifyProductRejected(productId: string, userId: string, productName: string, reason?: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'Product Rejected',
      message: `Your product "${productName}" was rejected.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'error',
      data: { product_id: productId, product_name: productName, reason },
      action_url: `/vendor/products`
    })
  }

  // Vendor-related notifications
  static async notifyVendorApproved(userId: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'Vendor Account Approved',
      message: 'Congratulations! Your vendor account has been approved. You can now start selling.',
      type: 'success',
      data: { vendor_status: 'approved' },
      action_url: `/vendor`
    })
  }

  static async notifyVendorSuspended(userId: string, reason?: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'Vendor Account Suspended',
      message: `Your vendor account has been suspended.${reason ? ` Reason: ${reason}` : ''}`,
      type: 'error',
      data: { vendor_status: 'suspended', reason },
      action_url: `/support`
    })
  }

  // System notifications
  static async notifySystemMaintenance(userId: string, scheduledTime: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'Scheduled Maintenance',
      message: `System maintenance is scheduled for ${scheduledTime}. Some features may be temporarily unavailable.`,
      type: 'warning',
      data: { maintenance_time: scheduledTime },
      action_url: undefined
    })
  }

  static async notifyNewFeature(userId: string, featureName: string, description: string) {
    return this.sendNotification({
      user_id: userId,
      title: 'New Feature Available',
      message: `${featureName}: ${description}`,
      type: 'info',
      data: { feature_name: featureName },
      action_url: `/features`
    })
  }

  // Admin notifications for important events
  static async notifyAdminNewOrder(orderId: string, orderNumber: string, totalAmount: number) {
    // Get all admin users
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')

    if (!admins || admins.length === 0) return false

    const notifications = admins.map((admin: any) => ({
      user_id: admin.id,
      title: 'New Order Received',
      message: `New order #${orderNumber} worth GHS ${totalAmount.toFixed(2)} has been placed.`,
      type: 'info' as const,
      data: { order_id: orderId, order_number: orderNumber, total_amount: totalAmount },
      action_url: `/admin/orders`
    }))

    return this.sendBulkNotifications(notifications)
  }

  static async notifyAdminNewVendorApplication(userId: string, vendorName: string) {
    // Get all admin and manager users
    const { data: admins } = await supabase
      .from('profiles')
      .select('id')
      .in('role', ['admin', 'manager'])

    if (!admins || admins.length === 0) return false

    const notifications = admins.map((admin: any) => ({
      user_id: admin.id,
      title: 'New Vendor Application',
      message: `${vendorName} has applied to become a vendor.`,
      type: 'info' as const,
      data: { vendor_id: userId, vendor_name: vendorName },
      action_url: `/admin/vendors`
    }))

    return this.sendBulkNotifications(notifications)
  }

  // Send notification using template (for API route)
  static async sendTemplateNotification(request: NotificationRequest) {
    const templates = this.getAllTemplates()
    const template = templates.find(t => t.id === request.templateId)
    
    if (!template) {
      throw new Error(`Template ${request.templateId} not found`)
    }

    const notifications = request.recipients.map(userId => ({
      user_id: userId,
      title: this.replaceVariables(template.title, request.variables || {}),
      message: this.replaceVariables(template.message, request.variables || {}),
      type: template.type,
      data: request.variables,
      action_url: template.action_url
    }))

    return this.sendBulkNotifications(notifications)
  }

  // Get all notification templates
  static getAllTemplates() {
    return [
      {
        id: 'order_created',
        title: 'Order Confirmed',
        message: 'Your order #{order_number} has been confirmed and is being processed.',
        type: 'success' as const,
        action_url: '/orders/{order_id}'
      },
      {
        id: 'order_shipped',
        title: 'Order Shipped',
        message: 'Your order #{order_number} has been shipped and is on its way.',
        type: 'info' as const,
        action_url: '/track/{order_number}'
      },
      {
        id: 'payment_received',
        title: 'Payment Received',
        message: 'Payment for order #{order_number} has been received successfully.',
        type: 'success' as const,
        action_url: '/orders/{order_id}'
      },
      {
        id: 'group_buy_reminder',
        title: 'Group Buy Reminder',
        message: 'Don\'t miss out! The group buy for {product_name} ends soon.',
        type: 'warning' as const,
        action_url: '/group-buy/{group_buy_id}'
      }
    ]
  }

  // Helper method to replace variables in strings
  private static replaceVariables(text: string, variables: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] || match
    })
  }
}