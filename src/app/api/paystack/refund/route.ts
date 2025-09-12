import { NextRequest, NextResponse } from 'next/server'

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your-secret-key'

// Refund payment (for disputes or cancellations)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transaction_reference, amount, reason } = body

    // Validate required fields
    if (!transaction_reference) {
      return NextResponse.json(
        { success: false, message: 'Transaction reference is required' },
        { status: 400 }
      )
    }

    // Initiate refund with Paystack
    const refundResponse = await fetch('https://api.paystack.co/refund', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transaction: transaction_reference,
        amount: amount, // Optional: partial refund if specified
        reason: reason || 'Customer dispute'
      })
    })

    const refundData = await refundResponse.json()

    if (!refundData.status) {
      return NextResponse.json(
        { success: false, message: refundData.message || 'Refund failed' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Update escrow transaction status to 'refunded'
    // 2. Log the refund details
    // 3. Send notification to customer
    // 4. Update order status

    return NextResponse.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund_id: refundData.data.id,
        transaction_reference: refundData.data.transaction.reference,
        amount: refundData.data.amount,
        status: refundData.data.status,
        created_at: refundData.data.created_at
      }
    })

  } catch (error) {
    console.error('Paystack refund error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get refund status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const refund_id = searchParams.get('refund_id')

    if (!refund_id) {
      return NextResponse.json(
        { success: false, message: 'Refund ID is required' },
        { status: 400 }
      )
    }

    // Get refund details from Paystack
    const refundResponse = await fetch(`https://api.paystack.co/refund/${refund_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const refundData = await refundResponse.json()

    if (!refundData.status) {
      return NextResponse.json(
        { success: false, message: refundData.message || 'Refund not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Refund details retrieved successfully',
      data: refundData.data
    })

  } catch (error) {
    console.error('Paystack refund status error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
