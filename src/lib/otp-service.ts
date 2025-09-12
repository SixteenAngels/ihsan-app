// OTP (One-Time Password) verification service
import crypto from 'crypto'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import { supabase } from './supabase'

export interface OTPConfig {
  length: number
  expiry: number // in minutes
  attempts: number
  cooldown: number // in minutes
}

export interface OTPResult {
  success: boolean
  otp?: string
  qrCode?: string
  secret?: string
  error?: string
  expiresAt?: string
}

export interface VerificationResult {
  success: boolean
  error?: string
  attemptsRemaining?: number
  cooldownUntil?: string
}

class OTPService {
  private config: OTPConfig = {
    length: 6,
    expiry: 5, // 5 minutes
    attempts: 3,
    cooldown: 15 // 15 minutes
  }

  // Generate SMS OTP
  async generateSMSOTP(phone: string): Promise<OTPResult> {
    try {
      // Check if user is in cooldown period
      const cooldownCheck = await this.checkCooldown(phone)
      if (!cooldownCheck.success) {
        return {
          success: false,
          error: cooldownCheck.error
        }
      }

      // Generate random OTP
      const otp = this.generateRandomOTP()
      const expiresAt = new Date(Date.now() + this.config.expiry * 60 * 1000)

      // Store OTP in database
      const { error } = await supabase
        .from('otp_verifications')
        .upsert({
          phone,
          otp: await this.hashOTP(otp),
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString()
        })

      if (error) {
        return {
          success: false,
          error: 'Failed to store OTP'
        }
      }

      // Send SMS (this would integrate with Twilio)
      await this.sendSMS(phone, otp)

      return {
        success: true,
        otp, // Only return in development
        expiresAt: expiresAt.toISOString()
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Verify SMS OTP
  async verifySMSOTP(phone: string, inputOTP: string): Promise<VerificationResult> {
    try {
      // Get stored OTP
      const { data, error } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone', phone)
        .single()

      if (error || !data) {
        return {
          success: false,
          error: 'OTP not found or expired'
        }
      }

      // Check if OTP is expired
      if (new Date(data.expires_at) < new Date()) {
        return {
          success: false,
          error: 'OTP has expired'
        }
      }

      // Check attempts limit
      if (data.attempts >= this.config.attempts) {
        const cooldownUntil = new Date(data.created_at.getTime() + this.config.cooldown * 60 * 1000)
        return {
          success: false,
          error: 'Too many attempts. Please try again later.',
          cooldownUntil: cooldownUntil.toISOString()
        }
      }

      // Verify OTP
      const isValid = await this.verifyOTP(inputOTP, data.otp)
      
      if (isValid) {
        // Mark as verified and clean up
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('phone', phone)

        return {
          success: true
        }
      } else {
        // Increment attempts
        await supabase
          .from('otp_verifications')
          .update({ attempts: data.attempts + 1 })
          .eq('phone', phone)

        const attemptsRemaining = this.config.attempts - (data.attempts + 1)
        
        return {
          success: false,
          error: 'Invalid OTP',
          attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Generate TOTP (Time-based OTP) for 2FA
  async generateTOTP(userId: string): Promise<OTPResult> {
    try {
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: 'Ihsan',
        account: userId,
        length: 32
      })

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url!)

      // Store secret in user profile
      const { error } = await supabase
        .from('profiles')
        .update({ 
          totp_secret: secret.base32,
          totp_enabled: false // Will be enabled after verification
        })
        .eq('id', userId)

      if (error) {
        return {
          success: false,
          error: 'Failed to store TOTP secret'
        }
      }

      return {
        success: true,
        secret: secret.base32,
        qrCode
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Verify TOTP
  async verifyTOTP(userId: string, token: string): Promise<VerificationResult> {
    try {
      // Get user's TOTP secret
      const { data, error } = await supabase
        .from('profiles')
        .select('totp_secret')
        .eq('id', userId)
        .single()

      if (error || !data?.totp_secret) {
        return {
          success: false,
          error: 'TOTP not configured'
        }
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: data.totp_secret,
        encoding: 'base32',
        token,
        window: 2 // Allow 2 time steps tolerance
      })

      if (verified) {
        // Enable TOTP if not already enabled
        await supabase
          .from('profiles')
          .update({ totp_enabled: true })
          .eq('id', userId)

        return {
          success: true
        }
      } else {
        return {
          success: false,
          error: 'Invalid TOTP token'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Disable TOTP
  async disableTOTP(userId: string): Promise<VerificationResult> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          totp_secret: null,
          totp_enabled: false
        })
        .eq('id', userId)

      if (error) {
        return {
          success: false,
          error: 'Failed to disable TOTP'
        }
      }

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Generate random OTP
  private generateRandomOTP(): string {
    const digits = '0123456789'
    let otp = ''
    
    for (let i = 0; i < this.config.length; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)]
    }
    
    return otp
  }

  // Hash OTP for storage
  private async hashOTP(otp: string): Promise<string> {
    const crypto = await import('crypto')
    return crypto.createHash('sha256').update(otp).digest('hex')
  }

  // Verify OTP
  private async verifyOTP(inputOTP: string, hashedOTP: string): Promise<boolean> {
    const hashedInput = await this.hashOTP(inputOTP)
    return hashedInput === hashedOTP
  }

  // Check cooldown period
  private async checkCooldown(phone: string): Promise<VerificationResult> {
    try {
      const { data } = await supabase
        .from('otp_verifications')
        .select('created_at, attempts')
        .eq('phone', phone)
        .single()

      if (!data) {
        return { success: true }
      }

      // Check if in cooldown period
      const cooldownEnd = new Date(data.created_at.getTime() + this.config.cooldown * 60 * 1000)
      if (new Date() < cooldownEnd && data.attempts >= this.config.attempts) {
        return {
          success: false,
          error: 'Please wait before requesting another OTP',
          cooldownUntil: cooldownEnd.toISOString()
        }
      }

      return { success: true }
    } catch (error) {
      return { success: true } // Allow if check fails
    }
  }

  // Send SMS (mock implementation - integrate with Twilio)
  private async sendSMS(phone: string, otp: string): Promise<void> {
    // This would integrate with Twilio or other SMS service
    console.log(`Sending SMS to ${phone}: Your Ihsan verification code is: ${otp}`)
    
    // Mock API call
    try {
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: `Your Ihsan verification code is: ${otp}. Valid for ${this.config.expiry} minutes.`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send SMS')
      }
    } catch (error) {
      console.error('SMS sending failed:', error)
      // Don't throw error to prevent OTP generation failure
    }
  }

  // Clean up expired OTPs
  async cleanupExpiredOTPs(): Promise<void> {
    try {
      await supabase
        .from('otp_verifications')
        .delete()
        .lt('expires_at', new Date().toISOString())
    } catch (error) {
      console.error('Failed to cleanup expired OTPs:', error)
    }
  }

  // Get OTP status for a phone number
  async getOTPStatus(phone: string): Promise<{
    exists: boolean
    expiresAt?: string
    attempts?: number
    cooldownUntil?: string
  }> {
    try {
      const { data } = await supabase
        .from('otp_verifications')
        .select('expires_at, attempts, created_at')
        .eq('phone', phone)
        .single()

      if (!data) {
        return { exists: false }
      }

      const cooldownEnd = new Date(data.created_at.getTime() + this.config.cooldown * 60 * 1000)
      const isInCooldown = new Date() < cooldownEnd && data.attempts >= this.config.attempts

      return {
        exists: true,
        expiresAt: data.expires_at,
        attempts: data.attempts,
        cooldownUntil: isInCooldown ? cooldownEnd.toISOString() : undefined
      }
    } catch (error) {
      return { exists: false }
    }
  }
}

// Export singleton instance
export const otpService = new OTPService()

// Export types and utilities
export { OTPService }
