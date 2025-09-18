'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  ArrowLeft,
  Phone,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

interface OrderStatus {
  id: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'
  timestamp: string
  location?: string
  description: string
}

interface Order {
  id: string
  orderNumber: string
  status: string
  createdAt: string
  estimatedDelivery: string
  total: number
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }>
  shipping: {
    method: 'air' | 'sea'
    address: string
    city: string
    region: string
    phone: string
  }
  tracking: {
    carrier: string
    trackingNumber: string
    estimatedDelivery: string
  }
  statusHistory: OrderStatus[]
}

const mockOrder: Order = {
  id: 'ORD-2024-001',
  orderNumber: 'ORD-2024-001',
  status: 'shipped',
  createdAt: '2024-01-15T10:30:00Z',
  estimatedDelivery: '2024-01-20T18:00:00Z',
  total: 245.50,
  items: [
    {
      id: '1',
      name: 'Samsung Galaxy S24 Ultra',
      quantity: 1,
      price: 899.99,
      image: '/api/placeholder/80/80'
    },
    {
      id: '2',
      name: 'iPhone 15 Pro Max',
      quantity: 1,
      price: 1199.99,
      image: '/api/placeholder/80/80'
    }
  ],
  shipping: {
    method: 'air',
    address: '123 Independence Avenue',
    city: 'Accra',
    region: 'Greater Accra',
    phone: '+233 24 123 4567'
  },
  tracking: {
    carrier: 'DHL Express',
    trackingNumber: 'DHL1234567890',
    estimatedDelivery: '2024-01-20T18:00:00Z'
  },
  statusHistory: [
    {
      id: '1',
      status: 'pending',
      timestamp: '2024-01-15T10:30:00Z',
      description: 'Order placed successfully'
    },
    {
      id: '2',
      status: 'confirmed',
      timestamp: '2024-01-15T11:15:00Z',
      location: 'Warehouse, Tema',
      description: 'Order confirmed and payment verified'
    },
    {
      id: '3',
      status: 'processing',
      timestamp: '2024-01-16T09:00:00Z',
      location: 'Warehouse, Tema',
      description: 'Items being prepared for shipment'
    },
    {
      id: '4',
      status: 'shipped',
      timestamp: '2024-01-17T14:30:00Z',
      location: 'Kotoka International Airport',
      description: 'Package shipped via DHL Express'
    }
  ]
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

function OrderTrackingPageContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams?.get('order') || '')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order number')
      return
    }

    setIsLoading(true)
    setError('')
    
    // Simulate API call
    setTimeout(() => {
      if (orderNumber.toUpperCase() === 'ORD-2024-001') {
        setOrder(mockOrder)
      } else {
        setError('Order not found. Please check your order number.')
      }
      setIsLoading(false)
    }, 1000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config?.icon || Clock
    return <Icon className="w-5 h-5" />
  }

  const getProgressPercentage = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']
    const currentIndex = statusOrder.indexOf(status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  const getProgressClass = (status: string) => {
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered']
    const index = statusOrder.indexOf(status)
    const widthClasses = ['w-1/6', 'w-2/6', 'w-3/6', 'w-4/6', 'w-5/6', 'w-full']
    if (index < 0) return 'w-0'
    return widthClasses[Math.min(index, widthClasses.length - 1)]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/orders" className="inline-flex items-center text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600 mt-2">Enter your order number to track your package</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Order Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="orderNumber">Order Number</Label>
                <Input
                  id="orderNumber"
                  placeholder="Enter your order number (e.g., ORD-2024-001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Track Order'}
                </Button>
              </div>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.orderNumber}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.color}>
                    {statusConfig[order.status as keyof typeof statusConfig]?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">
                      {order.shipping.address}<br />
                      {order.shipping.city}, {order.shipping.region}<br />
                      {order.shipping.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Method</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {order.shipping.method} Shipping
                    </p>
                    <p className="text-sm text-gray-600">
                      Estimated Delivery: {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tracking Info</h4>
                    <p className="text-sm text-gray-600">
                      Carrier: {order.tracking.carrier}<br />
                      Tracking: {order.tracking.trackingNumber}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>Order Placed</span>
                      <span>Delivered</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-primary h-2 rounded-full transition-all duration-500 ${getProgressClass(order.status)}`}
                      />
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="space-y-4">
                    {order.statusHistory.map((status, index) => (
                      <div key={status.id} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === order.statusHistory.length - 1 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {getStatusIcon(status.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {statusConfig[status.status as keyof typeof statusConfig]?.label}
                            </h4>
                            {status.location && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {status.location}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{status.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(status.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">GH₵{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total</span>
                      <span>GH₵{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Live Chat
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Having issues with your order? Our support team is available 24/7 to help you.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderTrackingPageContent />
    </Suspense>
  )
}
