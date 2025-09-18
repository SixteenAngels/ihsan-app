import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { NotificationService } from '@/lib/notification-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const status = searchParams.get('status')

    if (!reference) {
      return NextResponse.redirect(new URL('/checkout?error=missing_reference', request.url))
    }

    if (status === 'cancelled') {
      return NextResponse.redirect(new URL('/checkout?error=payment_cancelled', request.url))
    }

    // Verify payment with Paystack
    const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)
    
    try {
      const verification = await paystack.transaction.verify(reference)
      
      if (verification.data.status === 'success') {
        // Update order status to paid
        const { error: updateError } = await supabase
          .from('orders')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            payment_reference: reference,
            updated_at: new Date().toISOString()
          })
          .eq('order_number', reference)

        if (updateError) {
          console.error('Error updating order:', updateError)
          return NextResponse.redirect(new URL(`/order-success?order=${reference}&error=update_failed`, request.url))
        }

        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            order_id: reference,
            amount: verification.data.amount / 100, // Convert from kobo
            currency: verification.data.currency,
            status: 'completed',
            payment_method: verification.data.channel,
            reference: reference,
            gateway_response: verification.data.gateway_response,
            paid_at: verification.data.paid_at
          })

        if (paymentError) {
          console.error('Error creating payment record:', paymentError)
        }

        // Send payment notification to user
        const { data: orderData } = await supabase
          .from('orders')
          .select('user_id, total_amount')
          .eq('order_number', reference)
          .single()

        if (orderData) {
          await NotificationService.notifyPaymentReceived(
            reference,
            orderData.user_id,
            reference,
            orderData.total_amount
          )
        }

        return NextResponse.redirect(new URL(`/order-success?order=${reference}`, request.url))
      } else {
        return NextResponse.redirect(new URL(`/checkout?error=payment_failed&reference=${reference}`, request.url))
      }
    } catch (verificationError) {
      console.error('Payment verification error:', verificationError)
      return NextResponse.redirect(new URL(`/checkout?error=verification_failed&reference=${reference}`, request.url))
    }

  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(new URL('/checkout?error=callback_error', request.url))
  }
}
