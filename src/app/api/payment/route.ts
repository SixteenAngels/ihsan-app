import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Initialize Paystack (you'll need to add your secret key to environment variables)
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      phone, 
      amount, 
      currency = 'GHS', 
      reference, 
      customerName,
      orderId,
      paymentMethod = 'all' // 'all', 'card', 'mobile_money'
    } = body

    // Validate required fields
    if (!email || !amount || !reference) {
      return NextResponse.json(
        { error: 'Missing required fields: email, amount, reference' },
        { status: 400 }
      )
    }

    // Convert amount to kobo (Paystack expects amount in smallest currency unit)
    const amountInKobo = Math.round(amount * 100)

    // Create or get customer
    let customerId
    try {
      // First, try to find existing customer
      const existingCustomers = await paystack.customer.list({ email })
      if (existingCustomers.data && existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id
      } else {
        // Create new customer
        const customer = await paystack.customer.create({
          email,
          first_name: customerName?.split(' ')[0] || 'Customer',
          last_name: customerName?.split(' ').slice(1).join(' ') || '',
          phone: phone || undefined
        })
        customerId = customer.data.id
      }
    } catch (customerError) {
      console.error('Customer creation error:', customerError)
      // Continue without customer ID if customer creation fails
    }

    // Initialize payment with enhanced options
    const paymentData = {
      email,
      amount: amountInKobo,
      currency,
      reference,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/callback`,
      metadata: {
        order_id: orderId,
        customer_phone: phone,
        customer_name: customerName,
        payment_method: paymentMethod
      },
      // Enhanced payment options
      channels: paymentMethod === 'card' ? ['card'] : 
                paymentMethod === 'mobile_money' ? ['mobile_money'] : 
                ['card', 'mobile_money', 'bank']
    }

    // Add customer if we have one
    if (customerId) {
      (paymentData as any).customer = customerId
    }

    const payment = await paystack.transaction.initialize(paymentData)

    if (payment.status) {
      // Store payment reference in database for tracking
      try {
        const { error: dbError } = await supabase
          .from('payments')
          .insert({
            reference: reference,
            order_id: orderId,
            amount: amount,
            currency: currency,
            status: 'pending',
            customer_email: email,
            customer_phone: phone,
            paystack_reference: payment.data.reference,
            authorization_url: payment.data.authorization_url,
            payment_method: paymentMethod,
            created_at: new Date().toISOString()
          })

        if (dbError) {
          console.error('Database error:', dbError)
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
      }

      return NextResponse.json({
        success: true,
        data: {
          authorization_url: payment.data.authorization_url,
          access_code: payment.data.access_code,
          reference: payment.data.reference,
          payment_method: paymentMethod,
          channels: paymentData.channels
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Payment initialization failed', details: payment.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment API error:', error)
    return NextResponse.json(
      { error: 'Payment processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Verify payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference parameter is required' },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const verification = await paystack.transaction.verify(reference)

    if (verification.status) {
      const paymentData = verification.data

      // Update payment status in database
      try {
        const { error: updateError } = await supabase
          .from('payments')
          .update({
            status: paymentData.status,
            paid_at: paymentData.paid_at,
            updated_at: new Date().toISOString()
          })
          .eq('reference', reference)

        if (updateError) {
          console.error('Database update error:', updateError)
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
      }

      return NextResponse.json({
        success: true,
        data: {
          status: paymentData.status,
          amount: paymentData.amount / 100, // Convert back from kobo
          currency: paymentData.currency,
          reference: paymentData.reference,
          paid_at: paymentData.paid_at,
          customer: paymentData.customer,
          channel: paymentData.channel,
          gateway_response: paymentData.gateway_response
        }
      })
    } else {
      return NextResponse.json(
        { error: 'Payment verification failed', details: verification.message },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}