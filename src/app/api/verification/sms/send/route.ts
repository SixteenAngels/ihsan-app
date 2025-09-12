import { NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

// POST /api/verification/sms/send - Send SMS OTP
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json({
        success: false,
        error: 'Phone number is required'
      }, { status: 400 })
    }

    const result = await otpService.generateSMSOTP(phone)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        expiresAt: result.expiresAt
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        cooldownUntil: result.cooldownUntil
      }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
