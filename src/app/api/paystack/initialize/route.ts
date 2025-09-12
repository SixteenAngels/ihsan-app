import { NextRequest, NextResponse } from 'next/server'

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your-secret-key'
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_your-public-key'

// Initialize Paystack payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, reference, callback_url, metadata } = body

    // Validate required fields
    if (!amount || !email || !reference) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Initialize Paystack payment
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount, // Amount in kobo/cents
        email: email,
        reference: reference,
        callback_url: callback_url,
        metadata: metadata
      })
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json(
        { success: false, message: paystackData.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment initialized successfully',
      data: paystackData.data
    })

  } catch (error) {
    console.error('Paystack initialization error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Verify Paystack payment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')

    if (!reference) {
      return NextResponse.json(
        { success: false, message: 'Reference is required' },
        { status: 400 }
      )
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json(
        { success: false, message: paystackData.message || 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Check if payment was successful
    if (paystackData.data.status === 'success') {
      // Here you would typically:
      // 1. Update your database with payment confirmation
      // 2. Create escrow transaction record
      // 3. Send confirmation emails
      // 4. Update order status

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          reference: paystackData.data.reference,
          amount: paystackData.data.amount,
          status: paystackData.data.status,
          paid_at: paystackData.data.paid_at,
          customer: paystackData.data.customer,
          metadata: paystackData.data.metadata
        }
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Payment not successful' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Paystack verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
