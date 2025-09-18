// Email service using Resend
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailTemplate {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
}

export interface EmailData {
  to: string | string[]
  subject: string
  template: string
  variables: Record<string, any>
}

export class EmailService {
  // Send a simple email
  static async sendEmail(template: EmailTemplate) {
    try {
      const { data, error } = await resend.emails.send({
        from: template.from || 'Ihsan <noreply@ihsan.com>',
        to: template.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })

      if (error) {
        console.error('Email sending error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (error) {
      console.error('Email service error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send email using template
  static async sendTemplateEmail(emailData: EmailData) {
    const template = this.getEmailTemplate(emailData.template, emailData.variables)
    
    return this.sendEmail({
      to: emailData.to,
      subject: template.subject,
      html: template.html,
      text: template.text
    })
  }

  // Send order confirmation email
  static async sendOrderConfirmation(orderData: {
    customerEmail: string
    customerName: string
    orderNumber: string
    orderTotal: number
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    shippingAddress: any
    estimatedDelivery: string
  }) {
    const template = this.getOrderConfirmationTemplate(orderData)
    
    return this.sendEmail({
      to: orderData.customerEmail,
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: template.html,
      text: template.text
    })
  }

  // Send payment confirmation email
  static async sendPaymentConfirmation(paymentData: {
    customerEmail: string
    customerName: string
    orderNumber: string
    amount: number
    paymentMethod: string
    transactionId: string
  }) {
    const template = this.getPaymentConfirmationTemplate(paymentData)
    
    return this.sendEmail({
      to: paymentData.customerEmail,
      subject: `Payment Confirmed - ${paymentData.orderNumber}`,
      html: template.html,
      text: template.text
    })
  }

  // Send shipping notification email
  static async sendShippingNotification(shippingData: {
    customerEmail: string
    customerName: string
    orderNumber: string
    trackingNumber: string
    carrier: string
    estimatedDelivery: string
  }) {
    const template = this.getShippingNotificationTemplate(shippingData)
    
    return this.sendEmail({
      to: shippingData.customerEmail,
      subject: `Your Order Has Shipped - ${shippingData.orderNumber}`,
      html: template.html,
      text: template.text
    })
  }

  // Send password reset email
  static async sendPasswordReset(resetData: {
    userEmail: string
    userName: string
    resetToken: string
    resetUrl: string
  }) {
    const template = this.getPasswordResetTemplate(resetData)
    
    return this.sendEmail({
      to: resetData.userEmail,
      subject: 'Reset Your Password - Ihsan',
      html: template.html,
      text: template.text
    })
  }

  // Send welcome email
  static async sendWelcomeEmail(welcomeData: {
    userEmail: string
    userName: string
  }) {
    const template = this.getWelcomeTemplate(welcomeData)
    
    return this.sendEmail({
      to: welcomeData.userEmail,
      subject: 'Welcome to Ihsan!',
      html: template.html,
      text: template.text
    })
  }

  // Get email template by name
  private static getEmailTemplate(templateName: string, variables: Record<string, any>) {
    const templates: Record<string, any> = {
      order_confirmation: this.getOrderConfirmationTemplate(variables),
      payment_confirmation: this.getPaymentConfirmationTemplate(variables),
      shipping_notification: this.getShippingNotificationTemplate(variables),
      password_reset: this.getPasswordResetTemplate(variables),
      welcome: this.getWelcomeTemplate(variables)
    }

    return templates[templateName] || { subject: 'Email from Ihsan', html: '', text: '' }
  }

  // Order confirmation template
  private static getOrderConfirmationTemplate(data: any) {
    const itemsHtml = data.items.map((item: any) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">GHS ${item.price.toFixed(2)}</td>
      </tr>
    `).join('')

    return {
      subject: `Order Confirmation - ${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">Ihsan</h1>
              <h2 style="color: #059669;">Order Confirmed!</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Thank you for your order! We've received your order <strong>${data.orderNumber}</strong> and it's being processed.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #e2e8f0;">
                    <th style="padding: 10px; text-align: left;">Item</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr style="background: #e2e8f0; font-weight: bold;">
                    <td colspan="2" style="padding: 10px;">Total</td>
                    <td style="padding: 10px; text-align: right;">GHS ${data.orderTotal.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Shipping Information</h3>
              <p><strong>Delivery Address:</strong><br>
              ${data.shippingAddress.address_line_1}<br>
              ${data.shippingAddress.city}, ${data.shippingAddress.state}<br>
              ${data.shippingAddress.country}</p>
              <p><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
            </div>
            
            <p>We'll send you another email when your order ships.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${data.orderNumber}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Your Order
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Order Confirmation - ${data.orderNumber}
        
        Dear ${data.customerName},
        
        Thank you for your order! We've received your order ${data.orderNumber} and it's being processed.
        
        Order Summary:
        ${data.items.map((item: any) => `${item.name} x${item.quantity} - GHS ${item.price.toFixed(2)}`).join('\n')}
        
        Total: GHS ${data.orderTotal.toFixed(2)}
        
        Shipping Information:
        Delivery Address: ${data.shippingAddress.address_line_1}, ${data.shippingAddress.city}, ${data.shippingAddress.state}, ${data.shippingAddress.country}
        Estimated Delivery: ${new Date(data.estimatedDelivery).toLocaleDateString()}
        
        Track your order: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${data.orderNumber}
        
        If you have any questions, please contact our support team.
      `
    }
  }

  // Payment confirmation template
  private static getPaymentConfirmationTemplate(data: any) {
    return {
      subject: `Payment Confirmed - ${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Confirmed</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">Ihsan</h1>
              <h2 style="color: #059669;">Payment Confirmed!</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Great news! We've received your payment for order <strong>${data.orderNumber}</strong>.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Payment Details</h3>
              <p><strong>Amount:</strong> GHS ${data.amount.toFixed(2)}</p>
              <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
              <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            </div>
            
            <p>Your order is now being processed and will be shipped soon.</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${data.orderNumber}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Order Details
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Payment Confirmed - ${data.orderNumber}
        
        Dear ${data.customerName},
        
        Great news! We've received your payment for order ${data.orderNumber}.
        
        Payment Details:
        Amount: GHS ${data.amount.toFixed(2)}
        Payment Method: ${data.paymentMethod}
        Transaction ID: ${data.transactionId}
        
        Your order is now being processed and will be shipped soon.
        
        View order details: ${process.env.NEXT_PUBLIC_APP_URL}/orders/${data.orderNumber}
      `
    }
  }

  // Shipping notification template
  private static getShippingNotificationTemplate(data: any) {
    return {
      subject: `Your Order Has Shipped - ${data.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Shipped</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">Ihsan</h1>
              <h2 style="color: #059669;">Your Order Has Shipped!</h2>
            </div>
            
            <p>Dear ${data.customerName},</p>
            
            <p>Exciting news! Your order <strong>${data.orderNumber}</strong> has been shipped and is on its way to you.</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Shipping Information</h3>
              <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
              <p><strong>Carrier:</strong> ${data.carrier}</p>
              <p><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/track/${data.trackingNumber}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Your Package
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Your Order Has Shipped - ${data.orderNumber}
        
        Dear ${data.customerName},
        
        Exciting news! Your order ${data.orderNumber} has been shipped and is on its way to you.
        
        Shipping Information:
        Tracking Number: ${data.trackingNumber}
        Carrier: ${data.carrier}
        Estimated Delivery: ${new Date(data.estimatedDelivery).toLocaleDateString()}
        
        Track your package: ${process.env.NEXT_PUBLIC_APP_URL}/track/${data.trackingNumber}
      `
    }
  }

  // Password reset template
  private static getPasswordResetTemplate(data: any) {
    return {
      subject: 'Reset Your Password - Ihsan',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">Ihsan</h1>
              <h2>Reset Your Password</h2>
            </div>
            
            <p>Dear ${data.userName},</p>
            
            <p>We received a request to reset your password for your Ihsan account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetUrl}" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            
            <p style="font-size: 14px; color: #666;">
              If you didn't request this password reset, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Reset Your Password - Ihsan
        
        Dear ${data.userName},
        
        We received a request to reset your password for your Ihsan account.
        
        Reset your password: ${data.resetUrl}
        
        This link will expire in 1 hour for security reasons.
        
        If you didn't request this password reset, please ignore this email.
      `
    }
  }

  // Welcome template
  private static getWelcomeTemplate(data: any) {
    return {
      subject: 'Welcome to Ihsan!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Ihsan</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb;">Welcome to Ihsan!</h1>
            </div>
            
            <p>Dear ${data.userName},</p>
            
            <p>Welcome to Ihsan - your gateway to modern e-commerce in Ghana and Africa!</p>
            
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">What you can do:</h3>
              <ul>
                <li>Shop from thousands of products</li>
                <li>Choose between Air and Sea shipping</li>
                <li>Buy Ready Now items for instant delivery</li>
                <li>Join Group Buys for better prices</li>
                <li>Track your orders in real-time</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/categories" 
                 style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Shopping
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 14px; color: #666;">
              Thank you for choosing Ihsan. We're excited to serve you!
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to Ihsan!
        
        Dear ${data.userName},
        
        Welcome to Ihsan - your gateway to modern e-commerce in Ghana and Africa!
        
        What you can do:
        - Shop from thousands of products
        - Choose between Air and Sea shipping
        - Buy Ready Now items for instant delivery
        - Join Group Buys for better prices
        - Track your orders in real-time
        
        Start shopping: ${process.env.NEXT_PUBLIC_APP_URL}/categories
        
        Thank you for choosing Ihsan. We're excited to serve you!
      `
    }
  }
}
