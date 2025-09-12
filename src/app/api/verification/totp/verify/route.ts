import { NextResponse } from 'next/server'
import { otpService } from '@/lib/otp-service'

// POST /api/verification/totp/verify - Verify TOTP token
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'TOTP token is required'
      }, { status: 400 })
    }

    // Get user ID from session/auth (mock for now)
    const userId = 'current-user-id' // Replace with actual user ID from auth

    const result = await otpService.verifyTOTP(userId, token)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'TOTP verified successfully'
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
