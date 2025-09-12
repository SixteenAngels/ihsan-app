import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We&apos;ve received your payment and will start processing your order shortly.
          </p>

          {/* Order Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Order Number</span>
                <span className="font-mono font-bold">IH-20241210-0001</span>
              </div>
              <div className="flex justify-between">
                <span>Order Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span>Paystack</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Method</span>
                <span>Air Shipping (Fast)</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-bold">GHS 5,175.00</span>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What&apos;s Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Order Processing</div>
                    <div className="text-sm text-muted-foreground">
                      We&apos;ll prepare your items for shipping within 1-2 business days.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Shipping</div>
                    <div className="text-sm text-muted-foreground">
                      Your order will be shipped via Air shipping and delivered in 3-7 days.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      You&apos;ll receive tracking information via email and SMS.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/orders">
                View Order Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/categories">
                Continue Shopping
              </Link>
            </Button>
          </div>

          {/* Support */}
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@ihsan.com" className="text-primary hover:underline">
                support@ihsan.com
              </a>{' '}
              or call{' '}
              <a href="tel:+233123456789" className="text-primary hover:underline">
                +233 123 456 789
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
