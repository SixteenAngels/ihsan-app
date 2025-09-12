import { NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

// POST /api/verification/sms/verify - Verify SMS OTP
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone, otp } = body

    if (!phone || !otp) {
      return NextResponse.json({
        success: false,
        error: 'Phone number and OTP are required'
      }, { status: 400 })
    }

    const result = await otpService.verifySMSOTP(phone, otp)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        attemptsRemaining: result.attemptsRemaining,
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
