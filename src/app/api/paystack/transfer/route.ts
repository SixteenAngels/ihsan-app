import { NextRequest, NextResponse } from 'next/server'

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_your-secret-key'

// Transfer funds to vendor (release from escrow)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { transaction_id, amount, recipient_code, reason } = body

    // Validate required fields
    if (!transaction_id || !amount || !recipient_code) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create transfer recipient if not exists
    let recipientCode = recipient_code
    
    // If recipient_code is an email, create a transfer recipient first
    if (recipient_code.includes('@')) {
      const recipientResponse = await fetch('https://api.paystack.co/transferrecipient', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'nuban',
          name: 'Vendor Account',
          account_number: '1234567890', // This would be the vendor's account number
          bank_code: '058', // This would be the vendor's bank code
          email: recipient_code
        })
      })

      const recipientData = await recipientResponse.json()
      
      if (recipientData.status) {
        recipientCode = recipientData.data.recipient_code
      }
    }

    // Initiate transfer
    const transferResponse = await fetch('https://api.paystack.co/transfer', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'balance',
        amount: amount, // Amount in kobo/cents
        recipient: recipientCode,
        reason: reason || 'Escrow fund release',
        reference: `escrow_${transaction_id}_${Date.now()}`
      })
    })

    const transferData = await transferResponse.json()

    if (!transferData.status) {
      return NextResponse.json(
        { success: false, message: transferData.message || 'Transfer failed' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Update escrow transaction status to 'completed'
    // 2. Log the transfer details
    // 3. Send notification to vendor
    // 4. Update order status

    return NextResponse.json({
      success: true,
      message: 'Funds released successfully',
      data: {
        transfer_code: transferData.data.transfer_code,
        reference: transferData.data.reference,
        amount: transferData.data.amount,
        status: transferData.data.status,
        created_at: transferData.data.created_at
      }
    })

  } catch (error) {
    console.error('Paystack transfer error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get transfer status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transfer_code = searchParams.get('transfer_code')

    if (!transfer_code) {
      return NextResponse.json(
        { success: false, message: 'Transfer code is required' },
        { status: 400 }
      )
    }

    // Get transfer details from Paystack
    const transferResponse = await fetch(`https://api.paystack.co/transfer/${transfer_code}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    const transferData = await transferResponse.json()

    if (!transferData.status) {
      return NextResponse.json(
        { success: false, message: transferData.message || 'Transfer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Transfer details retrieved successfully',
      data: transferData.data
    })

  } catch (error) {
    console.error('Paystack transfer status error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
