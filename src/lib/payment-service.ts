// Paystack payment service with escrow functionality
import { supabase } from './supabase'

export interface PaymentData {
  amount: number
  currency: string
  email: string
  reference: string
  metadata?: Record<string, any>
  callback_url?: string
}

export interface EscrowPayment {
  id: string
  orderId: string
  customerId: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'released' | 'refunded' | 'failed'
  paystackReference: string
  createdAt: string
  expiresAt: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  authorizationUrl?: string
  reference?: string
  error?: string
}

export interface EscrowReleaseResult {
  success: boolean
  transactionId?: string
  error?: string
}

class PaymentService {
  private paystackSecretKey: string
  private paystackPublicKey: string

  constructor() {
    this.paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || ''
    this.paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || ''
  }

  // Initialize payment with Paystack
  async initializePayment(paymentData: PaymentData): Promise<PaymentResult> {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentData.amount * 100, // Convert to kobo/pesewas
          currency: paymentData.currency,
          email: paymentData.email,
          reference: paymentData.reference,
          metadata: paymentData.metadata,
          callback_url: paymentData.callback_url
        })
      })

      const data = await response.json()

      if (data.status) {
        return {
          success: true,
          authorizationUrl: data.data.authorization_url,
          reference: data.data.reference
        }
      } else {
        return {
          success: false,
          error: data.message || 'Payment initialization failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Verify payment with Paystack
  async verifyPayment(reference: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.status && data.data.status === 'success') {
        return {
          success: true,
          reference: data.data.reference
        }
      } else {
        return {
          success: false,
          error: data.message || 'Payment verification failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Create escrow payment
  async createEscrowPayment(
    orderId: string,
    customerId: string,
    amount: number,
    currency: string = 'GHS',
    metadata?: Record<string, any>
  ): Promise<EscrowPayment> {
    try {
      const reference = `escrow_${orderId}_${Date.now()}`
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

      const escrowPayment: EscrowPayment = {
        id: crypto.randomUUID(),
        orderId,
        customerId,
        amount,
        currency,
        status: 'pending',
        paystackReference: reference,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        metadata
      }

      const { data, error } = await supabase
        .from('escrow_payments')
        .insert(escrowPayment)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create escrow payment: ${error.message}`)
      }

      return data
    } catch (error) {
      throw new Error(`Escrow payment creation failed: ${error}`)
    }
  }

  // Process escrow payment
  async processEscrowPayment(
    escrowId: string,
    customerEmail: string,
    callbackUrl?: string
  ): Promise<PaymentResult> {
    try {
      // Get escrow payment details
      const { data: escrowPayment, error } = await supabase
        .from('escrow_payments')
        .select('*')
        .eq('id', escrowId)
        .single()

      if (error || !escrowPayment) {
        return {
          success: false,
          error: 'Escrow payment not found'
        }
      }

      if (escrowPayment.status !== 'pending') {
        return {
          success: false,
          error: 'Escrow payment is not in pending status'
        }
      }

      // Initialize payment with Paystack
      const paymentResult = await this.initializePayment({
        amount: escrowPayment.amount,
        currency: escrowPayment.currency,
        email: customerEmail,
        reference: escrowPayment.paystackReference,
        metadata: {
          escrowId: escrowPayment.id,
          orderId: escrowPayment.orderId,
          customerId: escrowPayment.customerId,
          ...escrowPayment.metadata
        },
        callback_url: callbackUrl
      })

      if (paymentResult.success) {
        // Update escrow payment status
        await supabase
          .from('escrow_payments')
          .update({ 
            status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', escrowId)
      }

      return paymentResult
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Release escrow payment to merchant
  async releaseEscrowPayment(escrowId: string, reason?: string): Promise<EscrowReleaseResult> {
    try {
      // Get escrow payment details
      const { data: escrowPayment, error } = await supabase
        .from('escrow_payments')
        .select('*')
        .eq('id', escrowId)
        .single()

      if (error || !escrowPayment) {
        return {
          success: false,
          error: 'Escrow payment not found'
        }
      }

      if (escrowPayment.status !== 'paid') {
        return {
          success: false,
          error: 'Escrow payment is not in paid status'
        }
      }

      // Transfer funds to merchant (this would integrate with Paystack Transfer API)
      const transferResult = await this.transferToMerchant(
        escrowPayment.amount,
        escrowPayment.currency,
        escrowPayment.metadata?.merchantAccount || 'default-merchant-account'
      )

      if (transferResult.success) {
        // Update escrow payment status
        await supabase
          .from('escrow_payments')
          .update({ 
            status: 'released',
            released_at: new Date().toISOString(),
            release_reason: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', escrowId)

        return {
          success: true,
          transactionId: transferResult.transactionId
        }
      } else {
        return {
          success: false,
          error: transferResult.error
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Refund escrow payment
  async refundEscrowPayment(escrowId: string, reason?: string): Promise<EscrowReleaseResult> {
    try {
      // Get escrow payment details
      const { data: escrowPayment, error } = await supabase
        .from('escrow_payments')
        .select('*')
        .eq('id', escrowId)
        .single()

      if (error || !escrowPayment) {
        return {
          success: false,
          error: 'Escrow payment not found'
        }
      }

      if (!['paid', 'released'].includes(escrowPayment.status)) {
        return {
          success: false,
          error: 'Escrow payment cannot be refunded'
        }
      }

      // Process refund with Paystack
      const refundResult = await this.processRefund(
        escrowPayment.paystackReference,
        escrowPayment.amount,
        reason
      )

      if (refundResult.success) {
        // Update escrow payment status
        await supabase
          .from('escrow_payments')
          .update({ 
            status: 'refunded',
            refunded_at: new Date().toISOString(),
            refund_reason: reason,
            updated_at: new Date().toISOString()
          })
          .eq('id', escrowId)

        return {
          success: true,
          transactionId: refundResult.transactionId
        }
      } else {
        return {
          success: false,
          error: refundResult.error
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Transfer funds to merchant (mock implementation)
  private async transferToMerchant(
    amount: number,
    currency: string,
    merchantAccount: string
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // This would integrate with Paystack Transfer API
      const response = await fetch('https://api.paystack.co/transfer', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'balance',
          amount: amount * 100,
          currency: currency,
          recipient: merchantAccount,
          reason: 'Escrow payment release'
        })
      })

      const data = await response.json()

      if (data.status) {
        return {
          success: true,
          transactionId: data.data.reference
        }
      } else {
        return {
          success: false,
          error: data.message || 'Transfer failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transfer failed'
      }
    }
  }

  // Process refund (mock implementation)
  private async processRefund(
    reference: string,
    amount: number,
    reason?: string
  ): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      // This would integrate with Paystack Refund API
      const response = await fetch('https://api.paystack.co/refund', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transaction: reference,
          amount: amount * 100,
          reason: reason || 'Customer request'
        })
      })

      const data = await response.json()

      if (data.status) {
        return {
          success: true,
          transactionId: data.data.reference
        }
      } else {
        return {
          success: false,
          error: data.message || 'Refund failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed'
      }
    }
  }

  // Get escrow payment status
  async getEscrowPaymentStatus(escrowId: string): Promise<EscrowPayment | null> {
    try {
      const { data, error } = await supabase
        .from('escrow_payments')
        .select('*')
        .eq('id', escrowId)
        .single()

      if (error) {
        return null
      }

      return data
    } catch (error) {
      return null
    }
  }

  // Get escrow payments by order
  async getEscrowPaymentsByOrder(orderId: string): Promise<EscrowPayment[]> {
    try {
      const { data, error } = await supabase
        .from('escrow_payments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })

      if (error) {
        return []
      }

      return data || []
    } catch (error) {
      return []
    }
  }

  // Auto-release escrow payments (for completed orders)
  async autoReleaseEscrowPayments(): Promise<void> {
    try {
      // Get paid escrow payments for completed orders
      const { data: escrowPayments, error } = await supabase
        .from('escrow_payments')
        .select(`
          *,
          orders (
            id,
            status
          )
        `)
        .eq('status', 'paid')
        .eq('orders.status', 'delivered')

      if (error || !escrowPayments) {
        return
      }

      // Release each escrow payment
      for (const escrowPayment of escrowPayments) {
        await this.releaseEscrowPayment(escrowPayment.id, 'Order delivered - auto-release')
      }
    } catch (error) {
      console.error('Error auto-releasing escrow payments:', error)
    }
  }

  // Get payment statistics
  async getPaymentStats(): Promise<{
    totalEscrowPayments: number
    pendingAmount: number
    releasedAmount: number
    refundedAmount: number
  }> {
    try {
      const { data, error } = await supabase
        .from('escrow_payments')
        .select('status, amount')

      if (error) {
        return {
          totalEscrowPayments: 0,
          pendingAmount: 0,
          releasedAmount: 0,
          refundedAmount: 0
        }
      }

      const stats = data.reduce((acc: any, payment: any) => {
        acc.totalEscrowPayments++
        acc[`${payment.status}Amount`] += payment.amount
        return acc
      }, {
        totalEscrowPayments: 0,
        pendingAmount: 0,
        paidAmount: 0,
        releasedAmount: 0,
        refundedAmount: 0
      })

      return {
        totalEscrowPayments: stats.totalEscrowPayments,
        pendingAmount: stats.pendingAmount,
        releasedAmount: stats.releasedAmount,
        refundedAmount: stats.refundedAmount
      }
    } catch (error) {
      return {
        totalEscrowPayments: 0,
        pendingAmount: 0,
        releasedAmount: 0,
        refundedAmount: 0
      }
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()

// Export types and utilities
export { PaymentService }
