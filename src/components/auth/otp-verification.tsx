'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'react-toastify'
import { 
  Shield, 
  Smartphone, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  QrCode,
  Key,
  AlertCircle
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface OTPVerificationProps {
  phone?: string
  email?: string
  onVerificationSuccess?: (method: 'sms' | 'totp') => void
  onVerificationFailed?: (error: string) => void
  className?: string
}

export default function OTPVerification({
  phone,
  email,
  onVerificationSuccess,
  onVerificationFailed,
  className = ''
}: OTPVerificationProps) {
  const [activeTab, setActiveTab] = useState<'sms' | 'totp'>('sms')
  const [phoneNumber, setPhoneNumber] = useState(phone || '')
  const [otpCode, setOtpCode] = useState('')
  const [totpToken, setTotpToken] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null)
  const [totpSecret, setTotpSecret] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [isTotpEnabled, setIsTotpEnabled] = useState(false)
  const [showQrDialog, setShowQrDialog] = useState(false)

  useEffect(() => {
    if (otpSent && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [otpSent, timeRemaining])

  useEffect(() => {
    checkTOTPStatus()
  }, [])

  const checkTOTPStatus = async () => {
    try {
      const response = await fetch('/api/verification/totp/status')
      if (response.ok) {
        const data = await response.json()
        setIsTotpEnabled(data.enabled)
        if (data.secret) {
          setTotpSecret(data.secret)
        }
      }
    } catch (error) {
      console.error('Error checking TOTP status:', error)
    }
  }

  const sendSMSOTP = async () => {
    if (!phoneNumber) {
      toast.error('Please enter your phone number')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/verification/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber }),
      })

      const data = await response.json()

      if (data.success) {
        setOtpSent(true)
        setTimeRemaining(300) // 5 minutes
        toast.success('OTP sent to your phone')
      } else {
        toast.error(data.error || 'Failed to send OTP')
        if (data.cooldownUntil) {
          setCooldownUntil(data.cooldownUntil)
        }
      }
    } catch (error) {
      toast.error('Failed to send OTP')
      console.error('Error sending OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifySMSOTP = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/verification/sms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          otp: otpCode 
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Phone number verified successfully!')
        onVerificationSuccess?.('sms')
        setOtpSent(false)
        setOtpCode('')
      } else {
        toast.error(data.error || 'Invalid OTP')
        if (data.attemptsRemaining !== undefined) {
          setAttemptsRemaining(data.attemptsRemaining)
        }
        if (data.cooldownUntil) {
          setCooldownUntil(data.cooldownUntil)
        }
      }
    } catch (error) {
      toast.error('Failed to verify OTP')
      console.error('Error verifying OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateTOTP = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/verification/totp/generate', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setTotpSecret(data.secret)
        setQrCode(data.qrCode)
        setShowQrDialog(true)
        toast.success('TOTP secret generated. Scan the QR code with your authenticator app.')
      } else {
        toast.error(data.error || 'Failed to generate TOTP')
      }
    } catch (error) {
      toast.error('Failed to generate TOTP')
      console.error('Error generating TOTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTOTP = async () => {
    if (!totpToken || totpToken.length !== 6) {
      toast.error('Please enter a valid 6-digit TOTP token')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/verification/totp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: totpToken }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('TOTP verified successfully!')
        onVerificationSuccess?.('totp')
        setIsTotpEnabled(true)
        setTotpToken('')
        setShowQrDialog(false)
      } else {
        toast.error(data.error || 'Invalid TOTP token')
      }
    } catch (error) {
      toast.error('Failed to verify TOTP')
      console.error('Error verifying TOTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const disableTOTP = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/verification/totp/disable', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('TOTP disabled successfully')
        setIsTotpEnabled(false)
        setTotpSecret(null)
        setQrCode(null)
      } else {
        toast.error(data.error || 'Failed to disable TOTP')
      }
    } catch (error) {
      toast.error('Failed to disable TOTP')
      console.error('Error disabling TOTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resendOTP = async () => {
    setIsResending(true)
    try {
      await sendSMSOTP()
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isCooldownActive = cooldownUntil && new Date(cooldownUntil) > new Date()

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={slideInFromLeft} className="text-center">
          <h2 className="text-3xl font-bold mb-4">Verify Your Identity</h2>
          <p className="text-xl text-muted-foreground">
            Choose your preferred verification method
          </p>
        </motion.div>

        {/* Verification Methods */}
        <motion.div variants={staggerItem}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sms' | 'totp')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sms" className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                SMS Verification
              </TabsTrigger>
              <TabsTrigger value="totp" className="flex items-center">
                <Key className="h-4 w-4 mr-2" />
                Authenticator App
              </TabsTrigger>
            </TabsList>

            {/* SMS Verification */}
            <TabsContent value="sms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    SMS Verification
                  </CardTitle>
                  <CardDescription>
                    We'll send a verification code to your phone number
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Phone Number Input */}
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+233 24 123 4567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={otpSent}
                    />
                  </div>

                  {/* Send OTP Button */}
                  {!otpSent && (
                    <Button
                      onClick={sendSMSOTP}
                      disabled={isLoading || !phoneNumber || !!isCooldownActive}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Smartphone className="h-4 w-4 mr-2" />
                          Send Verification Code
                        </>
                      )}
                    </Button>
                  )}

                  {/* OTP Input */}
                  {otpSent && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {timeRemaining > 0 ? (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              Code expires in {formatTime(timeRemaining)}
                            </span>
                          ) : (
                            <span className="text-red-500">Code expired</span>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resendOTP}
                          disabled={isResending || timeRemaining > 0}
                        >
                          {isResending ? 'Resending...' : 'Resend'}
                        </Button>
                      </div>

                      <Button
                        onClick={verifySMSOTP}
                        disabled={isLoading || otpCode.length !== 6}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify Code
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Status Messages */}
                  {attemptsRemaining < 3 && (
                    <div className="flex items-center text-sm text-orange-600">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {attemptsRemaining} attempts remaining
                    </div>
                  )}

                  {isCooldownActive && (
                    <div className="flex items-center text-sm text-red-600">
                      <XCircle className="h-4 w-4 mr-2" />
                      Please wait before requesting another code
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* TOTP Verification */}
            <TabsContent value="totp" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    Authenticator App
                  </CardTitle>
                  <CardDescription>
                    Use an authenticator app like Google Authenticator or Authy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isTotpEnabled ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Generate a QR code to set up your authenticator app
                        </p>
                      </div>

                      <Button
                        onClick={generateTOTP}
                        disabled={isLoading}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Code
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center text-green-600 mb-4">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">TOTP is enabled</span>
                      </div>

                      <div>
                        <Label htmlFor="totp-token">Authenticator Code</Label>
                        <Input
                          id="totp-token"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={totpToken}
                          onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={verifyTOTP}
                          disabled={isLoading || totpToken.length !== 6}
                          className="flex-1"
                        >
                          {isLoading ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Verify
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={disableTOTP}
                          disabled={isLoading}
                          variant="outline"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Disable
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* QR Code Dialog */}
        <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Scan this QR code with your authenticator app to set up TOTP
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {qrCode && (
                <div className="text-center">
                  <img src={qrCode} alt="TOTP QR Code" className="mx-auto" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Scan with Google Authenticator, Authy, or similar app
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="setup-token">Enter Code from App</Label>
                <Input
                  id="setup-token"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={verifyTOTP}
                disabled={isLoading || totpToken.length !== 6}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
