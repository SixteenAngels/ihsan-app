'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { MapPin, Truck, Package, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'react-toastify'

interface TrackingEvent {
  id: string
  status: string
  location: string
  description: string
  timestamp: string
}

interface OrderTracking {
  order_id: string
  order_number: string
  status: string
  tracking_number?: string
  carrier?: string
  estimated_delivery?: string
  events: TrackingEvent[]
}

export function DeliveryTracking() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [orderTracking, setOrderTracking] = useState<OrderTracking | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tracking/${trackingNumber}`)
      const data = await response.json()
      
      if (data.success) {
        setOrderTracking(data.tracking)
      } else {
        toast.error(data.error || 'Tracking information not found')
        setOrderTracking(null)
      }
    } catch (error) {
      console.error('Error tracking order:', error)
      toast.error('Failed to track order')
      setOrderTracking(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in_transit':
        return <Truck className="h-5 w-5 text-blue-600" />
      case 'processing':
        return <Package className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-600">
          Enter your tracking number to see the current status of your order
        </p>
      </div>

      {/* Tracking Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Track Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <Label htmlFor="tracking-number">Tracking Number</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your tracking number"
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Tracking...
                    </>
                  ) : (
                    'Track'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {orderTracking && (
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Order Number</Label>
                  <p className="font-semibold">{orderTracking.order_number}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Current Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(orderTracking.status)}
                    <Badge className={getStatusColor(orderTracking.status)}>
                      {orderTracking.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Estimated Delivery</Label>
                  <p className="font-semibold">
                    {orderTracking.estimated_delivery 
                      ? new Date(orderTracking.estimated_delivery).toLocaleDateString()
                      : 'TBD'
                    }
                  </p>
                </div>
              </div>
              
              {orderTracking.carrier && (
                <div className="mt-4 pt-4 border-t">
                  <Label className="text-sm text-gray-600">Carrier</Label>
                  <p className="font-semibold">{orderTracking.carrier}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tracking Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderTracking.events.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{event.status}</h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-1">{event.description}</p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Can't find your tracking number? Check your order confirmation email.
            </p>
            <p className="text-sm text-gray-600">
              If you're having trouble tracking your order, please contact our support team.
            </p>
            <Button variant="outline" className="mt-4">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
