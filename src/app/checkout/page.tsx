'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, CreditCard, Truck, Smartphone, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems, totalPrice, clearCart, isLoading: cartLoading } = useCart()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phoneNumber: user?.phone || '',
    email: user?.email || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('paystack_all')
  const [couponCode, setCouponCode] = useState('')
  const [saveInfo, setSaveInfo] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const subtotal = totalPrice
  const shipping = 0
  const total = subtotal + shipping

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      router.push('/cart')
    }
  }, [cartItems, cartLoading, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const generateReference = () => {
    return `IHSAN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handlePayment = async () => {
    if (!formData.email || !formData.phoneNumber) {
      toast.error('Please fill in your email and phone number')
      return
    }

    if (paymentMethod.startsWith('paystack')) {
      await processPaystackPayment()
    } else if (paymentMethod === 'cash') {
      await processCashOnDelivery()
    }
  }

  const processPaystackPayment = async () => {
    setIsProcessing(true)
    try {
      const reference = generateReference()
      
      // Determine payment method type
      const paystackMethod = paymentMethod === 'paystack_card' ? 'card' : 
                           paymentMethod === 'paystack_mobile' ? 'mobile_money' : 'all'
      
      const paymentData = {
        email: formData.email,
        phone: formData.phoneNumber,
        amount: total,
        currency: 'GHS',
        reference: reference,
        customerName: `${formData.firstName} ${formData.lastName}`,
        orderId: `ORDER_${Date.now()}`,
        paymentMethod: paystackMethod
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()

      if (result.success && result.data?.authorization_url) {
        // Create order in database
        await createOrder(reference, 'pending')
        
        // Redirect to Paystack
        window.location.href = result.data.authorization_url
      } else {
        throw new Error(result.error || 'Payment initialization failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Payment processing failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const createOrder = async (orderNumber: string, status: string) => {
    try {
      const orderData = {
        order_number: orderNumber,
        user_id: user?.id,
        status,
        shipping_method: 'air',
        shipping_cost: 0,
        subtotal,
        tax_amount: 0,
        total_amount: total,
        currency: 'GHS',
        payment_status: 'pending',
        payment_method: paymentMethod,
        shipping_address: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          street: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          phone: formData.phoneNumber
        },
        billing_address: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          street: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          phone: formData.phoneNumber
        },
        items: cartItems.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          unit_price: item.price
        }))
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Failed to create order')
      }

      return result
    } catch (error) {
      console.error('Order creation error:', error)
      throw error
    }
  }

  const processCashOnDelivery = async () => {
    setIsProcessing(true)
    try {
      const orderNumber = generateReference()
      
      // Create order for cash on delivery
      await createOrder(orderNumber, 'pending')
      
      // Clear cart
      await clearCart()
      
      toast.success('Order placed successfully! You will pay on delivery.')
      router.push(`/order-success?order=${orderNumber}`)
    } catch (error: any) {
      console.error('Cash on delivery error:', error)
      toast.error(error.message || 'Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {cartLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Button asChild>
              <Link href="/cart">Go to Cart</Link>
            </Button>
          </div>
        </div>
      ) : (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Account
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/my-account" className="text-slate-500 hover:text-slate-700">
            My Account
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/product" className="text-slate-500 hover:text-slate-700">
            Product
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/view-cart" className="text-slate-500 hover:text-slate-700">
            View Cart
            </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">CheckOut</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Billing Details Form */}
          <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle className="text-2xl text-primary">Billing Details</CardTitle>
            </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>
              </div>

                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                    </div>

                <div>
                  <Label htmlFor="streetAddress">Street Address</Label>
                  <Input
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  />
                    </div>

                <div>
                  <Label htmlFor="apartment">Apartment, floor, etc. (optional)</Label>
                  <Input
                    id="apartment"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                  />
                  </div>

                <div>
                  <Label htmlFor="city">Town/City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                    </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveInfo"
                    checked={saveInfo}
                    onCheckedChange={(checked) => setSaveInfo(checked as boolean)}
                  />
                  <Label htmlFor="saveInfo" className="text-sm">
                    Save this information for faster check-out next time
                  </Label>
                  </div>
                </CardContent>
              </Card>

            {/* Password Changes */}
            <Card className="mt-6">
                <CardHeader>
                <CardTitle className="text-xl text-primary">Password Changes</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                            <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  />
                            </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  />
                    </div>
                            <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  />
                  </div>
                </CardContent>
              </Card>
            </div>

          {/* Order Summary and Payment */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
                <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Payment Method</h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paystack_all" id="paystack_all" />
                      <Label htmlFor="paystack_all" className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Paystack (All Methods)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paystack_card" id="paystack_card" />
                      <Label htmlFor="paystack_card" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Card Payment</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paystack_mobile" id="paystack_mobile" />
                      <Label htmlFor="paystack_mobile" className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4" />
                        <span>Mobile Money</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center space-x-2">
                        <Truck className="h-4 w-4" />
                        <span>Cash on delivery</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Coupon Code</h3>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" className="btn-primary">
                      Apply Coupon
                    </Button>
                  </div>
                  </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Cart
                  </Button>
                  <Button 
                    className="w-full btn-primary" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'paystack_all' ? 'Pay with Paystack' : 
                         paymentMethod === 'paystack_card' ? 'Pay with Card' :
                         paymentMethod === 'paystack_mobile' ? 'Pay with Mobile Money' :
                         'Place Order'}
                      </>
                    )}
                  </Button>
                </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </div>
      )}
    </div>
  )
}