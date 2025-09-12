'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { formatPrice, getOrderStatusColor, getOrderStatusText } from '@/lib/utils'

// Mock orders data
const mockOrders = [
  {
    id: '1',
    orderNumber: 'IH-20241210-0001',
    status: 'processing',
    shippingMethod: 'air',
    totalAmount: 5175,
    createdAt: '2024-12-10T10:30:00Z',
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, price: 4500 },
      { name: 'Nike Air Max 270', quantity: 2, price: 350 }
    ]
  },
  {
    id: '2',
    orderNumber: 'IH-20241209-0002',
    status: 'shipped',
    shippingMethod: 'sea',
    totalAmount: 1250,
    createdAt: '2024-12-09T14:20:00Z',
    items: [
      { name: 'Ghana Made Shea Butter', quantity: 3, price: 25 }
    ]
  },
  {
    id: '3',
    orderNumber: 'IH-20241208-0003',
    status: 'delivered',
    shippingMethod: 'air',
    totalAmount: 2800,
    createdAt: '2024-12-08T09:15:00Z',
    items: [
      { name: 'Adidas Ultraboost 22', quantity: 1, price: 280 }
    ]
  }
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processing':
      return <Package className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'delivered':
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              Start shopping to see your orders here
            </p>
            <Button asChild>
              <Link href="/categories">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getOrderStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getOrderStatusText(order.status)}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Items</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <div>Shipping: {order.shippingMethod === 'air' ? 'Air (Fast)' : 'Sea (Economical)'}</div>
                          <div className="font-bold text-lg">{formatPrice(order.totalAmount)}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/orders/${order.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              Buy Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
