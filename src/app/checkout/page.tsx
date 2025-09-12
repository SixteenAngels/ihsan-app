'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, CreditCard, Truck, MapPin, User, UserPlus } from 'lucide-react'
import { formatPrice, calculateShippingCost } from '@/lib/utils'
import { useGuestCart } from '@/lib/guest-cart'
import { useAuth } from '@/lib/auth-context'

// Mock checkout data
const mockOrderItems = [
  {
    id: '1',
    productName: 'iPhone 15 Pro',
    variantName: 'Natural Titanium',
    price: 4500,
    quantity: 1,
    image: '/api/placeholder/60/60'
  },
  {
    id: '2',
    productName: 'Nike Air Max 270',
    variantName: null,
    price: 350,
    quantity: 2,
    image: '/api/placeholder/60/60'
  }
]

export default function CheckoutPage() {
  const { user, isLoading } = useAuth()
  const { cart, guestId, isHydrated } = useGuestCart()
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air')
  const [isProcessing, setIsProcessing] = useState(false)

  // Use guest cart items or mock data
  const orderItems = isHydrated && cart.items.length > 0 ? cart.items : mockOrderItems

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shippingCost = calculateShippingCost(subtotal, shippingMethod)
  const tax = subtotal * 0.15
  const total = subtotal + shippingCost + tax

  // Show loading state while checking authentication
  if (isLoading || !isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // Determine checkout mode - only authenticated users can checkout
  const checkoutMode = user ? 'authenticated' : 'choice'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    
    try {
      // Only authenticated users can checkout
      if (!user) {
        throw new Error('Authentication required for checkout')
      }
      
      // Authenticated user checkout
      await handleAuthenticatedCheckout()
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAuthenticatedCheckout = async () => {
    // Simulate authenticated checkout
    await new Promise(resolve => setTimeout(resolve, 2000))
    window.location.href = '/orders/success'
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order
            </p>
          </div>
        </div>

        {/* Login Required Notice */}
        {checkoutMode === 'choice' && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <User className="h-5 w-5" />
                Account Required for Checkout
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-orange-800">
                <p className="mb-4">
                  To complete your purchase and ensure secure payment processing, 
                  you need to create an account or sign in.
                </p>
                <div className="space-y-2 text-sm">
                  <p>✅ Secure payment processing</p>
                  <p>✅ Order tracking and history</p>
                  <p>✅ Saved addresses for future orders</p>
                  <p>✅ Exclusive deals and discounts</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  className="h-auto p-6 flex flex-col items-center gap-3"
                  onClick={() => window.location.href = '/login?redirect=/checkout'}
                >
                  <User className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Sign In</div>
                    <div className="text-sm opacity-90">
                      Already have an account?
                    </div>
                  </div>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 border-orange-300 text-orange-700 hover:bg-orange-100"
                  onClick={() => window.location.href = '/signup?redirect=/checkout'}
                >
                  <UserPlus className="h-8 w-8" />
                  <div className="text-center">
                    <div className="font-semibold">Create Account</div>
                    <div className="text-sm text-orange-600">
                      Quick and easy signup
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Only show form if user is authenticated */}
        {checkoutMode === 'authenticated' && (
          <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="+233 123 456 789" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main Street" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Region</Label>
                      <Input id="state" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" required />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={shippingMethod} onValueChange={(value: 'air' | 'sea') => setShippingMethod(value)}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="air" id="air" />
                      <div className="flex-1">
                        <Label htmlFor="air" className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Air Shipping (Fast)</div>
                              <div className="text-sm text-muted-foreground">3-7 days delivery</div>
                            </div>
                            <div className="font-bold">{formatPrice(shippingCost)}</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="sea" id="sea" />
                      <div className="flex-1">
                        <Label htmlFor="sea" className="cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Sea Shipping (Economical)</div>
                              <div className="text-sm text-muted-foreground">14-21 days delivery</div>
                            </div>
                            <div className="font-bold">{formatPrice(shippingCost)}</div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">Paystack Payment Gateway</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Secure payment processing. You&apos;ll be redirected to complete payment.
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>• Credit/Debit Cards</p>
                      <p>• Mobile Money</p>
                      <p>• Bank Transfer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                        <img
                          src={item.image || '/api/placeholder/60/60'}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        {item.variantName && (
                          <div className="text-sm text-muted-foreground">{item.variantName}</div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Order Total */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping ({shippingMethod === 'air' ? 'Air' : 'Sea'})</span>
                      <span>{formatPrice(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (VAT)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
