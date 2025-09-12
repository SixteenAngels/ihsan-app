import { NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

// POST /api/verification/totp/generate - Generate TOTP secret
export async function POST(request: Request) {
  try {
    // Get user ID from session/auth (mock for now)
    const userId = 'current-user-id' // Replace with actual user ID from auth

    const result = await otpService.generateTOTP(userId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        secret: result.secret,
        qrCode: result.qrCode,
        message: 'TOTP secret generated successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
