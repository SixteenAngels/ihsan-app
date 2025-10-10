'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import { formatPrice, getOrderStatusColor, getOrderStatusText } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type OrderRow = {
  id: string
  order_number: string
  status: string
  shipping_method: 'air' | 'sea'
  total_amount: number
  created_at: string
}

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
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await (supabase as any).auth.getUser()
        if (!user) {
          setOrders([])
          return
        }
        const { data } = await (supabase as any)
          .from('orders')
          .select('id, order_number, status, shipping_method, total_amount, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        setOrders(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
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

        {(orders || []).length === 0 ? (
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
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order #{order.order_number}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
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
                    {/* Order Summary */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <div>Shipping: {order.shipping_method === 'air' ? 'Air (Fast)' : 'Sea (Economical)'}</div>
                          <div className="font-bold text-lg">{formatPrice(order.total_amount)}</div>
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
