// Notification service for handling push, email, and SMS notifications
import sgMail from '@sendgrid/mail'
import twilio from 'twilio'

// Initialize SendGrid lazily
let sendGridInitialized = false

const initializeSendGrid = () => {
  if (!sendGridInitialized && process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    sendGridInitialized = true
  }
}

// Initialize Twilio lazily
let twilioClient: any = null

const getTwilioClient = () => {
  if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  }
  return twilioClient
}

export interface NotificationTemplate {
  id: string
  name: string
  type: 'push' | 'email' | 'sms'
  subject?: string
  content: string
  variables: string[]
}

export interface NotificationRecipient {
  userId: string
  email?: string
  phone?: string
  pushToken?: string
  preferences: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export interface NotificationData {
  templateId: string
  recipients: NotificationRecipient[]
  variables: Record<string, any>
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduledAt?: string
  metadata?: Record<string, any>
}

export interface NotificationResult {
  success: boolean
  messageId?: string
  error?: string
  channel: 'push' | 'email' | 'sms'
}

class NotificationService {
  private templates: Map<string, NotificationTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  private initializeTemplates() {
    const defaultTemplates: NotificationTemplate[] = [
      {
        id: 'order_confirmed',
        name: 'Order Confirmation',
        type: 'email',
        subject: 'Order Confirmed - {{orderNumber}}',
        content: `
          <h2>Order Confirmed!</h2>
          <p>Dear {{customerName}},</p>
          <p>Your order {{orderNumber}} has been confirmed and is being processed.</p>
          <p><strong>Order Details:</strong></p>
          <ul>
            {{#items}}
            <li>{{name}} - Qty: {{quantity}} - {{price}}</li>
            {{/items}}
          </ul>
          <p><strong>Total: {{totalAmount}}</strong></p>
          <p>We'll notify you when your order is ready for delivery.</p>
          <p>Thank you for choosing Ihsan!</p>
        `,
        variables: ['customerName', 'orderNumber', 'items', 'totalAmount']
      },
      {
        id: 'order_shipped',
        name: 'Order Shipped',
        type: 'push',
        content: 'Your order {{orderNumber}} is on its way! Track your delivery in real-time.',
        variables: ['orderNumber']
      },
      {
        id: 'order_delivered',
        name: 'Order Delivered',
        type: 'sms',
        content: 'Your order {{orderNumber}} has been delivered successfully. Thank you for shopping with Ihsan!',
        variables: ['orderNumber']
      },
      {
        id: 'group_buy_reminder',
        name: 'Group Buy Reminder',
        type: 'push',
        content: 'Group buy for {{productName}} ends in {{timeLeft}}. Join now to save {{discount}}%!',
        variables: ['productName', 'timeLeft', 'discount']
      },
      {
        id: 'delivery_assigned',
        name: 'Delivery Assigned',
        type: 'push',
        content: 'New delivery assigned: {{orderNumber}} to {{customerName}} at {{address}}',
        variables: ['orderNumber', 'customerName', 'address']
      },
      {
        id: 'payment_failed',
        name: 'Payment Failed',
        type: 'email',
        subject: 'Payment Failed - {{orderNumber}}',
        content: `
          <h2>Payment Failed</h2>
          <p>Dear {{customerName}},</p>
          <p>We were unable to process your payment for order {{orderNumber}}.</p>
          <p>Please update your payment method and try again.</p>
          <p><a href="{{paymentLink}}">Update Payment Method</a></p>
          <p>If you need assistance, please contact our support team.</p>
        `,
        variables: ['customerName', 'orderNumber', 'paymentLink']
      },
      {
        id: 'otp_verification',
        name: 'OTP Verification',
        type: 'sms',
        content: 'Your Ihsan verification code is: {{otpCode}}. Valid for 5 minutes.',
        variables: ['otpCode']
      }
    ]

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  async sendNotification(data: NotificationData): Promise<NotificationResult[]> {
    const template = this.templates.get(data.templateId)
    if (!template) {
      throw new Error(`Template ${data.templateId} not found`)
    }

    const results: NotificationResult[] = []

    for (const recipient of data.recipients) {
      try {
        let result: NotificationResult

        switch (template.type) {
          case 'email':
            result = await this.sendEmail(template, recipient, data.variables)
            break
          case 'sms':
            result = await this.sendSMS(template, recipient, data.variables)
            break
          case 'push':
            result = await this.sendPushNotification(template, recipient, data.variables)
            break
          default:
            throw new Error(`Unsupported notification type: ${template.type}`)
        }

        results.push(result)
      } catch (error) {
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          channel: template.type
        })
      }
    }

    return results
  }

  private async sendEmail(
    template: NotificationTemplate,
    recipient: NotificationRecipient,
    variables: Record<string, any>
  ): Promise<NotificationResult> {
    if (!recipient.email || !recipient.preferences.email) {
      throw new Error('Email not available or disabled for recipient')
    }

    initializeSendGrid()

    const processedContent = this.processTemplate(template.content!, variables)
    const processedSubject = template.subject ? this.processTemplate(template.subject, variables) : ''

    const msg = {
      to: recipient.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ihsan.com',
      subject: processedSubject,
      html: processedContent,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      }
    }

    try {
      const response = await sgMail.send(msg)
      return {
        success: true,
        messageId: response[0].headers['x-message-id'],
        channel: 'email'
      }
    } catch (error) {
      throw new Error(`Email sending failed: ${error}`)
    }
  }

  private async sendSMS(
    template: NotificationTemplate,
    recipient: NotificationRecipient,
    variables: Record<string, any>
  ): Promise<NotificationResult> {
    if (!recipient.phone || !recipient.preferences.sms) {
      throw new Error('Phone number not available or SMS disabled for recipient')
    }

    const client = getTwilioClient()
    if (!client) {
      throw new Error('Twilio not configured')
    }

    const processedContent = this.processTemplate(template.content, variables)

    try {
      const message = await client.messages.create({
        body: processedContent,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: recipient.phone
      })

      return {
        success: true,
        messageId: message.sid,
        channel: 'sms'
      }
    } catch (error) {
      throw new Error(`SMS sending failed: ${error}`)
    }
  }

  private async sendPushNotification(
    template: NotificationTemplate,
    recipient: NotificationRecipient,
    variables: Record<string, any>
  ): Promise<NotificationResult> {
    if (!recipient.pushToken || !recipient.preferences.push) {
      throw new Error('Push token not available or push notifications disabled for recipient')
    }

    const processedContent = this.processTemplate(template.content, variables)

    try {
      // This would integrate with OneSignal, FCM, or other push notification service
      // For now, we'll simulate the API call
      const response = await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: recipient.pushToken,
          title: 'Ihsan',
          body: processedContent,
          data: variables
        })
      })

      if (!response.ok) {
        throw new Error('Push notification failed')
      }

      const result = await response.json()
      return {
        success: true,
        messageId: result.messageId,
        channel: 'push'
      }
    } catch (error) {
      throw new Error(`Push notification failed: ${error}`)
    }
  }

  private processTemplate(content: string, variables: Record<string, any>): string {
    let processed = content

    // Replace simple variables {{variableName}}
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      processed = processed.replace(regex, String(value))
    })

    // Handle array variables {{#items}}...{{/items}}
    processed = processed.replace(/{{#(\w+)}}(.*?){{\/\1}}/gs, (match, arrayName, template) => {
      const array = variables[arrayName]
      if (!Array.isArray(array)) return ''

      return array.map(item => {
        let itemTemplate = template
        Object.entries(item).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g')
          itemTemplate = itemTemplate.replace(regex, String(value))
        })
        return itemTemplate
      }).join('')
    })

    return processed
  }

  async sendBulkNotification(
    templateId: string,
    recipients: NotificationRecipient[],
    variables: Record<string, any>,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<NotificationResult[]> {
    return this.sendNotification({
      templateId,
      recipients,
      variables,
      priority
    })
  }

  async scheduleNotification(
    templateId: string,
    recipients: NotificationRecipient[],
    variables: Record<string, any>,
    scheduledAt: string,
    priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
  ): Promise<void> {
    // This would integrate with a job queue system like Bull, Agenda, or similar
    // For now, we'll store it in the database for processing
    console.log(`Scheduling notification ${templateId} for ${scheduledAt}`)
  }

  getTemplate(templateId: string): NotificationTemplate | undefined {
    return this.templates.get(templateId)
  }

  getAllTemplates(): NotificationTemplate[] {
    return Array.from(this.templates.values())
  }

  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template)
  }

  updateTemplate(templateId: string, updates: Partial<NotificationTemplate>): void {
    const template = this.templates.get(templateId)
    if (template) {
      this.templates.set(templateId, { ...template, ...updates })
    }
  }

  deleteTemplate(templateId: string): void {
    this.templates.delete(templateId)
  }

  // Utility methods for common notification scenarios
  async notifyOrderConfirmation(orderData: any): Promise<NotificationResult[]> {
    return this.sendBulkNotification(
      'order_confirmed',
      [{ userId: orderData.customerId, email: orderData.customerEmail, preferences: { email: true, sms: false, push: true } }],
      {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        items: orderData.items,
        totalAmount: orderData.totalAmount
      }
    )
  }

  async notifyOrderShipped(orderData: any): Promise<NotificationResult[]> {
    return this.sendBulkNotification(
      'order_shipped',
      [{ userId: orderData.customerId, pushToken: orderData.pushToken, preferences: { email: false, sms: false, push: true } }],
      {
        orderNumber: orderData.orderNumber
      }
    )
  }

  async notifyOrderDelivered(orderData: any): Promise<NotificationResult[]> {
    return this.sendBulkNotification(
      'order_delivered',
      [{ userId: orderData.customerId, phone: orderData.customerPhone, preferences: { email: false, sms: true, push: false } }],
      {
        orderNumber: orderData.orderNumber
      }
    )
  }

  async notifyGroupBuyReminder(groupBuyData: any): Promise<NotificationResult[]> {
    return this.sendBulkNotification(
      'group_buy_reminder',
      groupBuyData.participants.map((p: any) => ({
        userId: p.userId,
        pushToken: p.pushToken,
        preferences: { email: false, sms: false, push: true }
      })),
      {
        productName: groupBuyData.productName,
        timeLeft: groupBuyData.timeLeft,
        discount: groupBuyData.discount
      }
    )
  }

  async notifyDeliveryAgent(deliveryData: any): Promise<NotificationResult[]> {
    return this.sendBulkNotification(
      'delivery_assigned',
      [{ userId: deliveryData.agentId, pushToken: deliveryData.pushToken, preferences: { email: false, sms: false, push: true } }],
      {
        orderNumber: deliveryData.orderNumber,
        customerName: deliveryData.customerName,
        address: deliveryData.address
      }
    )
  }

  async sendOTP(phone: string, otpCode: string): Promise<NotificationResult[]> {
    return this.sendBulkNotification(
      'otp_verification',
      [{ userId: 'temp', phone, preferences: { email: false, sms: true, push: false } }],
      { otpCode }
    )
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// Export types and utilities
export { NotificationService }
