'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Package, Truck, ArrowLeft } from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  total_amount: number
  currency: string
  created_at: string
  items: Array<{
    product_name: string
    quantity: number
    unit_price: number
  }>
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams?.get('order')
  const error = searchParams?.get('error')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails()
    } else {
      setIsLoading(false)
    }
  }, [orderNumber])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderNumber}`)
      const data = await response.json()
      
      if (data.success) {
        setOrder(data.order)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Issue</h1>
          <p className="text-gray-600 mb-6">
            {error === 'payment_cancelled' && 'Payment was cancelled. You can try again.'}
            {error === 'payment_failed' && 'Payment failed. Please try again.'}
            {error === 'verification_failed' && 'Payment verification failed. Please contact support.'}
            {error === 'callback_error' && 'An error occurred processing your payment. Please contact support.'}
            {error === 'update_failed' && 'Order was created but payment status could not be updated. Please contact support.'}
            {!['payment_cancelled', 'payment_failed', 'verification_failed', 'callback_error', 'update_failed'].includes(error || '') && 'An error occurred with your order.'}
          </p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
          {order && (
            <p className="text-lg font-semibold text-primary">
              Order #{order.order_number}
            </p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            {order && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Order Number:</span>
                      <p className="font-semibold">{order.order_number}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Status:</span>
                      <p className="font-semibold capitalize">{order.status}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Total Amount:</span>
                      <p className="font-semibold">{order.currency} {order.total_amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Order Date:</span>
                      <p className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Order Items:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.product_name} x {item.quantity}</span>
                          <span>{order.currency} {(item.unit_price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  What's Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Order Processing</h4>
                      <p className="text-sm text-gray-600">
                        We're preparing your order for shipment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 rounded-full p-2">
                      <Truck className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Shipping</h4>
                      <p className="text-sm text-gray-600">
                        Your order will be shipped within 1-2 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Delivery</h4>
                      <p className="text-sm text-gray-600">
                        Track your order and receive delivery updates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/my-account/orders">
                      View All Orders
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/">
                      Continue Shopping
                    </Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/support">
                      Contact Support
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
