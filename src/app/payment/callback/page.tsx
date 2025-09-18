'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function PaymentCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams?.get('reference')
      const trxref = searchParams?.get('trxref')

      if (!reference && !trxref) {
        setError('No payment reference found')
        setPaymentStatus('failed')
        return
      }

      const paymentRef = reference || trxref

      try {
        const response = await fetch(`/api/payment?reference=${paymentRef}`)
        const result = await response.json()

        if (result.success) {
          setPaymentData(result.data)
          
          if (result.data.status === 'success') {
            setPaymentStatus('success')
          } else if (result.data.status === 'pending') {
            setPaymentStatus('pending')
          } else {
            setPaymentStatus('failed')
          }
        } else {
          setError(result.error || 'Payment verification failed')
          setPaymentStatus('failed')
        }
      } catch (err) {
        setError('Failed to verify payment')
        setPaymentStatus('failed')
      }
    }

    verifyPayment()
  }, [searchParams])

  const handleContinue = () => {
    if (paymentStatus === 'success') {
      // Redirect to order confirmation or dashboard
      router.push('/my-account/orders')
    } else {
      // Redirect back to checkout
      router.push('/checkout')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {paymentStatus === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
              <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
              <p className="text-slate-600">Please wait while we verify your payment...</p>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-green-700">Payment Successful!</h2>
              <p className="text-slate-600 mb-4">
                Your payment of {paymentData?.currency} {paymentData?.amount} has been processed successfully.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Reference: {paymentData?.reference}
              </p>
              <Button onClick={handleContinue} className="w-full">
                Continue to Orders
              </Button>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-red-700">Payment Failed</h2>
              <p className="text-slate-600 mb-4">
                {error || 'Your payment could not be processed. Please try again.'}
              </p>
              <Button onClick={handleContinue} className="w-full">
                Try Again
              </Button>
            </>
          )}

          {paymentStatus === 'pending' && (
            <>
              <Loader2 className="h-16 w-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
              <h2 className="text-xl font-semibold mb-2 text-yellow-700">Payment Pending</h2>
              <p className="text-slate-600 mb-4">
                Your payment is being processed. You will be notified once it's completed.
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Reference: {paymentData?.reference}
              </p>
              <Button onClick={handleContinue} className="w-full">
                Check Status Later
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
