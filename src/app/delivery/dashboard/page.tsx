'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-toastify'
import { 
  Truck, 
  MapPin, 
  Clock, 
  Phone, 
  User, 
  Package, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Navigation,
  Camera,
  MessageSquare,
  Star
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'
import LocationTracker from '@/components/maps/location-tracker'
import DeliveryMap from '@/components/maps/delivery-map'
import { Location } from '@/lib/maps-service'

interface DeliveryOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  customerAddress: string
  deliveryAddress: Location
  items: Array<{
    id: string
    name: string
    quantity: number
    image?: string
  }>
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedDelivery: string
  actualDelivery?: string
  notes?: string
  deliveryProof?: string
  customerRating?: number
  customerFeedback?: string
}

interface DeliveryStats {
  totalDeliveries: number
  completedToday: number
  pendingDeliveries: number
  averageRating: number
  onTimeRate: number
}

export default function DeliveryAgentDashboard() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([])
  const [stats, setStats] = useState<DeliveryStats>({
    totalDeliveries: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    averageRating: 0,
    onTimeRate: 0
  })
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [deliveryProof, setDeliveryProof] = useState('')
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockOrders: DeliveryOrder[] = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        customerPhone: '+233 24 123 4567',
        customerAddress: '123 Main Street, Accra',
        deliveryAddress: {
          lat: 5.6037,
          lng: -0.1870,
          address: '123 Main Street, Accra, Greater Accra'
        },
        items: [
          { id: '1', name: 'iPhone 15 Pro', quantity: 1 },
          { id: '2', name: 'Nike Air Max 270', quantity: 2 }
        ],
        status: 'assigned',
        priority: 'high',
        estimatedDelivery: '2024-01-15T14:00:00Z',
        notes: 'Customer prefers afternoon delivery'
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerName: 'Jane Smith',
        customerPhone: '+233 24 987 6543',
        customerAddress: '456 Oak Avenue, Kumasi',
        deliveryAddress: {
          lat: 6.6885,
          lng: -1.6244,
          address: '456 Oak Avenue, Kumasi, Ashanti'
        },
        items: [
          { id: '3', name: 'Ghana Shea Butter', quantity: 3 }
        ],
        status: 'picked_up',
        priority: 'medium',
        estimatedDelivery: '2024-01-15T16:00:00Z'
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerName: 'Kwame Asante',
        customerPhone: '+233 24 555 1234',
        customerAddress: '789 Pine Road, Takoradi',
        deliveryAddress: {
          lat: 4.8845,
          lng: -1.7554,
          address: '789 Pine Road, Takoradi, Western'
        },
        items: [
          { id: '4', name: 'Samsung Galaxy S24', quantity: 1 }
        ],
        status: 'in_transit',
        priority: 'urgent',
        estimatedDelivery: '2024-01-15T12:00:00Z'
      }
    ]

    const mockStats: DeliveryStats = {
      totalDeliveries: 1250,
      completedToday: 8,
      pendingDeliveries: 3,
      averageRating: 4.7,
      onTimeRate: 92.5
    }

    setOrders(mockOrders)
    setStats(mockStats)
    setLoading(false)

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800'
      case 'picked_up': return 'bg-yellow-100 text-yellow-800'
      case 'in_transit': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          delivery_notes: deliveryNotes,
          delivery_proof: deliveryProof,
          actual_delivery_time: new Date().toISOString()
        }),
      })

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, status: status as any } : order
        ))
        toast.success(`Order ${status.replace('_', ' ')} successfully`)
        setIsDeliveryDialogOpen(false)
        setDeliveryNotes('')
        setDeliveryProof('')
      } else {
        throw new Error('Failed to update order status')
      }
    } catch (error) {
      toast.error('Failed to update order status')
      console.error('Error updating order:', error)
    }
  }

  const openMaps = (location: Location) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
    window.open(url, '_blank')
  }

  const callCustomer = (phone: string) => {
    window.open(`tel:${phone}`, '_self')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const assignedOrders = orders.filter(order => order.status === 'assigned')
  const activeOrders = orders.filter(order => ['picked_up', 'in_transit'].includes(order.status))
  const completedOrders = orders.filter(order => order.status === 'delivered')

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={slideInFromLeft} className="text-center">
          <h1 className="text-4xl font-bold mb-4">Delivery Dashboard</h1>
          <p className="text-xl text-muted-foreground">
            Manage your deliveries and track your performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.totalDeliveries}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.completedToday}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{stats.pendingDeliveries}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.averageRating}</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.onTimeRate}%</div>
              <div className="text-sm text-muted-foreground">On Time</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Tracker */}
        <motion.div variants={staggerItem}>
          <LocationTracker
            deliveryId="current-delivery"
            destination={orders[0]?.deliveryAddress || { lat: 5.6037, lng: -0.1870, address: 'Accra, Ghana' }}
            onLocationUpdate={(location) => {
              setCurrentLocation(location)
              console.log('Location updated:', location)
            }}
            onRouteUpdate={(route) => {
              console.log('Route updated:', route)
            }}
            onETAUpdate={(eta) => {
              console.log('ETA updated:', eta)
            }}
          />
        </motion.div>

        {/* Delivery Map */}
        <motion.div variants={staggerItem}>
          <DeliveryMap
            orders={orders}
            currentLocation={currentLocation || undefined}
            onOrderSelect={(order) => {
              // Find the original order with customerAddress
              const originalOrder = orders.find(o => o.id === order.id)
              if (originalOrder) {
                setSelectedOrder(originalOrder)
              }
              console.log('Order selected:', order)
            }}
            onRouteOptimize={(optimizedOrders) => {
              console.log('Route optimized:', optimizedOrders)
              toast.success('Route optimized successfully')
            }}
          />
        </motion.div>

        {/* Orders Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="assigned" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="assigned">
                Assigned ({assignedOrders.length})
              </TabsTrigger>
              <TabsTrigger value="active">
                Active ({activeOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedOrders.length})
              </TabsTrigger>
            </TabsList>

            {/* Assigned Orders */}
            <TabsContent value="assigned" className="space-y-4">
              {assignedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription>{order.customerName}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Delivery Address
                        </div>
                        <div className="text-sm">
                          {order.deliveryAddress.address}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4 mr-2" />
                          Estimated Delivery
                        </div>
                        <div className="text-sm">
                          {new Date(order.estimatedDelivery).toLocaleString('en-GH')}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Items:</div>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.name}</span>
                            <span className="text-muted-foreground">Qty: {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.notes && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Notes:</div>
                        <div className="text-sm bg-muted p-2 rounded">{order.notes}</div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => openMaps(order.deliveryAddress)}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => callCustomer(order.customerPhone)}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDeliveryDialogOpen(true)
                        }}
                        className="flex-1"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Pick Up
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Active Orders */}
            <TabsContent value="active" className="space-y-4">
              {activeOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription>{order.customerName}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Delivery Address
                        </div>
                        <div className="text-sm">
                          {order.deliveryAddress.address}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4 mr-2" />
                          Estimated Delivery
                        </div>
                        <div className="text-sm">
                          {new Date(order.estimatedDelivery).toLocaleString('en-GH')}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => openMaps(order.deliveryAddress)}
                        className="flex-1"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Navigate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => callCustomer(order.customerPhone)}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDeliveryDialogOpen(true)
                        }}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Deliver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Completed Orders */}
            <TabsContent value="completed" className="space-y-4">
              {completedOrders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                        <CardDescription>{order.customerName}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        {order.customerRating && (
                          <Badge variant="outline" className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {order.customerRating}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <Clock className="h-4 w-4 mr-2" />
                          Delivered At
                        </div>
                        <div className="text-sm">
                          {order.actualDelivery ? 
                            new Date(order.actualDelivery).toLocaleString('en-GH') : 
                            'N/A'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4 mr-2" />
                          Delivered To
                        </div>
                        <div className="text-sm">
                          {order.deliveryAddress.address}
                        </div>
                      </div>
                    </div>

                    {order.customerFeedback && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Customer Feedback:</div>
                        <div className="text-sm bg-muted p-2 rounded">{order.customerFeedback}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Delivery Dialog */}
        <Dialog open={isDeliveryDialogOpen} onOpenChange={setIsDeliveryDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update Delivery Status</DialogTitle>
              <DialogDescription>
                Update the status for order {selectedOrder?.orderNumber}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="delivery-notes">Delivery Notes</Label>
                <Textarea
                  id="delivery-notes"
                  placeholder="Add any delivery notes..."
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="delivery-proof">Delivery Proof (Photo URL)</Label>
                <Input
                  id="delivery-proof"
                  placeholder="Enter photo URL or upload..."
                  value={deliveryProof}
                  onChange={(e) => setDeliveryProof(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex-col space-y-2">
              <div className="flex space-x-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedOrder?.status === 'assigned') {
                      updateOrderStatus(selectedOrder.id, 'picked_up')
                    } else {
                      updateOrderStatus(selectedOrder!.id, 'delivered')
                    }
                  }}
                  className="flex-1"
                >
                  {selectedOrder?.status === 'assigned' ? 'Mark as Picked Up' : 'Mark as Delivered'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => updateOrderStatus(selectedOrder!.id, 'failed')}
                  className="flex-1"
                >
                  Mark as Failed
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsDeliveryDialogOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
