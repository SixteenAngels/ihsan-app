'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'

interface CartItem {
  id: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
}

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeFromCart, totalPrice, isLoading } = useCart()
  const [couponCode, setCouponCode] = useState('')

  const subtotal = totalPrice
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">Cart</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Shopping Cart</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Add some items to get started</p>
                    <Button asChild>
                      <Link href="/categories">Continue Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 py-2 border-b font-medium text-gray-600">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2">Price</div>
                      <div className="col-span-2">Quantity</div>
                      <div className="col-span-2">Subtotal</div>
                    </div>

                    {/* Cart Items */}
                    {cartItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 py-6 border-b border-gray-100">
                        <div className="col-span-6 flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-inner"></div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <Badge className="badge-discount text-xs font-bold mt-1">
                                -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg text-primary">${item.price}</span>
                            <span className="text-sm text-slate-400 line-through">
                              ${item.originalPrice}
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center space-x-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity - 1)}
                              className="w-8 h-8 p-0 hover:bg-red-50 hover:border-red-300"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product_id, item.variant_id, item.quantity + 1)}
                              className="w-8 h-8 p-0 hover:bg-red-50 hover:border-red-300"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          <span className="font-bold text-lg text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.product_id, item.variant_id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Action Buttons */}
                    <div className="flex justify-between pt-6">
                      <Button variant="outline" asChild className="btn-outline">
                        <Link href="/categories">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Return To Shop
                        </Link>
                      </Button>
                      <Button variant="outline" className="btn-outline">
                        Update Cart
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coupon Code */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Coupon Code</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="btn-primary">
                    Apply Coupon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Cart Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full btn-primary" size="lg">
                  Process to checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}