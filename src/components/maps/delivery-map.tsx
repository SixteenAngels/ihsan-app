'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route, 
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Filter
} from 'lucide-react'
import { mapsService, Location, DeliveryRoute, DeliveryZone } from '@/lib/maps-service'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface DeliveryOrder {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: Location
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedDelivery: string
  items: Array<{
    id: string
    name: string
    quantity: number
  }>
}

interface DeliveryMapProps {
  orders: DeliveryOrder[]
  currentLocation?: Location
  onOrderSelect?: (order: DeliveryOrder) => void
  onRouteOptimize?: (optimizedOrders: DeliveryOrder[]) => void
  className?: string
}

export default function DeliveryMap({
  orders,
  currentLocation,
  onOrderSelect,
  onRouteOptimize,
  className = ''
}: DeliveryMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [markers, setMarkers] = useState<google.maps.Marker[]>([])
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null)
  const [optimizedRoute, setOptimizedRoute] = useState<DeliveryRoute | null>(null)
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Initialize map
  useEffect(() => {
    initializeMap()
  }, [])

  // Update markers when orders or filters change
  useEffect(() => {
    if (map) {
      updateMarkers()
    }
  }, [map, orders, statusFilter, priorityFilter])

  // Update current location marker
  useEffect(() => {
    if (map && currentLocation) {
      updateCurrentLocationMarker()
    }
  }, [map, currentLocation])

  const initializeMap = async () => {
    if (!mapRef.current) return

    try {
      const mapInstance = await mapsService.initializeMap(mapRef.current.id, {
        center: { lat: 5.6037, lng: -0.1870 }, // Accra, Ghana
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      setMap(mapInstance)
      
      // Initialize directions renderer
      const renderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeWeight: 4,
          strokeOpacity: 0.8
        }
      })
      renderer.setMap(mapInstance)
      setDirectionsRenderer(renderer)

      // Load delivery zones
      loadDeliveryZones()
    } catch (error) {
      console.error('Error initializing map:', error)
      toast.error('Failed to initialize map')
    }
  }

  const loadDeliveryZones = async () => {
    // Mock delivery zones - replace with actual API call
    const zones: DeliveryZone[] = [
      {
        id: '1',
        name: 'Accra Central',
        center: { lat: 5.6037, lng: -0.1870 },
        radius: 5000, // 5km
        isActive: true
      },
      {
        id: '2',
        name: 'East Legon',
        center: { lat: 5.6500, lng: -0.1500 },
        radius: 3000, // 3km
        isActive: true
      },
      {
        id: '3',
        name: 'West Legon',
        center: { lat: 5.6500, lng: -0.2200 },
        radius: 3000, // 3km
        isActive: true
      }
    ]
    setDeliveryZones(zones)
  }

  const updateMarkers = () => {
    if (!map) return

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null))

    const filteredOrders = orders.filter(order => {
      const statusMatch = statusFilter === 'all' || order.status === statusFilter
      const priorityMatch = priorityFilter === 'all' || order.priority === priorityFilter
      return statusMatch && priorityMatch
    })

    const newMarkers: google.maps.Marker[] = []

    filteredOrders.forEach(order => {
      const marker = new google.maps.Marker({
        position: { lat: order.deliveryAddress.lat, lng: order.deliveryAddress.lng },
        map: map,
        title: `${order.orderNumber} - ${order.customerName}`,
        icon: getMarkerIcon(order.status, order.priority),
        animation: google.maps.Animation.DROP
      })

      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(order)
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
        setSelectedOrder(order)
        onOrderSelect?.(order)
      })

      newMarkers.push(marker)
    })

    setMarkers(newMarkers)

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition()!)
      })
      map.fitBounds(bounds)
    }
  }

  const updateCurrentLocationMarker = () => {
    if (!map || !currentLocation) return

    // Remove existing current location marker
    const existingMarker = markers.find(marker => marker.getTitle() === 'Current Location')
    if (existingMarker) {
      existingMarker.setMap(null)
    }

    // Add current location marker
    const currentLocationMarker = new google.maps.Marker({
      position: { lat: currentLocation.lat, lng: currentLocation.lng },
      map: map,
      title: 'Current Location',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#3b82f6" stroke="white" stroke-width="2"/>
            <circle cx="12" cy="12" r="3" fill="white"/>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 12)
      },
      animation: google.maps.Animation.BOUNCE
    })

    setMarkers(prev => [...prev.filter(m => m.getTitle() !== 'Current Location'), currentLocationMarker])
  }

  const getMarkerIcon = (status: string, priority: string) => {
    const colors = {
      assigned: '#3b82f6',    // Blue
      picked_up: '#f59e0b',   // Amber
      in_transit: '#8b5cf6',  // Purple
      delivered: '#10b981',   // Green
      failed: '#ef4444'       // Red
    }

    const prioritySizes = {
      low: 20,
      medium: 24,
      high: 28,
      urgent: 32
    }

    const color = colors[status as keyof typeof colors] || '#6b7280'
    const size = prioritySizes[priority as keyof typeof prioritySizes] || 24

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="white"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size)
    }
  }

  const createInfoWindowContent = (order: DeliveryOrder) => {
    return `
      <div class="p-4 min-w-[250px]">
        <div class="font-bold text-lg mb-2">${order.orderNumber}</div>
        <div class="text-sm text-gray-600 mb-2">${order.customerName}</div>
        <div class="text-sm mb-2">${order.deliveryAddress.address || 'Delivery Address'}</div>
        <div class="flex items-center gap-2 mb-2">
          <span class="px-2 py-1 text-xs rounded ${getStatusBadgeClass(order.status)}">${order.status.replace('_', ' ')}</span>
          <span class="px-2 py-1 text-xs rounded ${getPriorityBadgeClass(order.priority)}">${order.priority}</span>
        </div>
        <div class="text-sm text-gray-500">
          ETA: ${new Date(order.estimatedDelivery).toLocaleString('en-GH')}
        </div>
        <div class="mt-2">
          <button onclick="window.selectOrder('${order.id}')" class="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
            Select Order
          </button>
        </div>
      </div>
    `
  }

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      assigned: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    }
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityBadgeClass = (priority: string) => {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return classes[priority as keyof typeof classes] || 'bg-gray-100 text-gray-800'
  }

  const optimizeRoute = async () => {
    if (!currentLocation || orders.length === 0) {
      toast.error('No current location or orders to optimize')
      return
    }

    setIsLoading(true)
    try {
      const deliveryLocations = orders
        .filter(order => ['assigned', 'picked_up'].includes(order.status))
        .map(order => order.deliveryAddress)

      if (deliveryLocations.length === 0) {
        toast.error('No active deliveries to optimize')
        return
      }

      const optimizedLocations = await mapsService.optimizeDeliveryRoute(deliveryLocations)
      
      // Reorder orders based on optimized route
      const optimizedOrders = optimizedLocations.map(location => 
        orders.find(order => 
          order.deliveryAddress.lat === location.lat && 
          order.deliveryAddress.lng === location.lng
        )
      ).filter(Boolean) as DeliveryOrder[]

      setOptimizedRoute({
        origin: currentLocation,
        destination: optimizedLocations[optimizedLocations.length - 1],
        waypoints: optimizedLocations.slice(1, -1)
      })

      onRouteOptimize?.(optimizedOrders)
      toast.success('Route optimized successfully')
    } catch (error) {
      console.error('Error optimizing route:', error)
      toast.error('Failed to optimize route')
    } finally {
      setIsLoading(false)
    }
  }

  const showRoute = () => {
    if (!optimizedRoute || !directionsRenderer) return

    const request: google.maps.DirectionsRequest = {
      origin: { lat: optimizedRoute.origin.lat, lng: optimizedRoute.origin.lng },
      destination: { lat: optimizedRoute.destination.lat, lng: optimizedRoute.destination.lng },
      waypoints: optimizedRoute.waypoints?.map(wp => ({
        location: { lat: wp.lat, lng: wp.lng },
        stopover: true
      })),
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    }

    const directionsService = new google.maps.DirectionsService()
    directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK && result) {
        directionsRenderer.setDirections(result)
      }
    })
  }

  const clearRoute = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] })
    }
    setOptimizedRoute(null)
  }

  // Add global function for info window buttons
  useEffect(() => {
    (window as any).selectOrder = (orderId: string) => {
      const order = orders.find(o => o.id === orderId)
      if (order) {
        setSelectedOrder(order)
        onOrderSelect?.(order)
      }
    }
  }, [orders, onOrderSelect])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Container */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Delivery Map
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">
                  {orders.length} Orders
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Interactive map showing delivery locations and optimized routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="picked_up">Picked Up</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Map */}
              <div 
                ref={mapRef}
                id="delivery-map"
                className="w-full h-96 bg-muted rounded-lg border"
                style={{ minHeight: '384px' }}
              />

              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={optimizeRoute}
                  disabled={isLoading || !currentLocation}
                  size="sm"
                >
                  <Route className="h-4 w-4 mr-2" />
                  {isLoading ? 'Optimizing...' : 'Optimize Route'}
                </Button>

                <Button
                  onClick={showRoute}
                  disabled={!optimizedRoute}
                  variant="outline"
                  size="sm"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Show Route
                </Button>

                <Button
                  onClick={clearRoute}
                  disabled={!optimizedRoute}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Route
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Order Details */}
      {selectedOrder && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  {selectedOrder.orderNumber}
                </div>
                <div className="flex space-x-2">
                  <Badge className={getStatusBadgeClass(selectedOrder.status)}>
                    {selectedOrder.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityBadgeClass(selectedOrder.priority)}>
                    {selectedOrder.priority}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Customer</div>
                  <div className="font-medium">{selectedOrder.customerName}</div>
                  <div className="text-sm text-muted-foreground">{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Delivery Address</div>
                  <div className="text-sm">{selectedOrder.deliveryAddress.address || 'Address not available'}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-2">Items</div>
                <div className="space-y-1">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-muted-foreground mb-1">Estimated Delivery</div>
                <div className="text-sm">
                  {new Date(selectedOrder.estimatedDelivery).toLocaleString('en-GH')}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Delivery Zones */}
      {deliveryZones.length > 0 && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Delivery Zones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {deliveryZones.map((zone) => (
                  <div key={zone.id} className="text-center">
                    <div className="font-medium">{zone.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Radius: {zone.radius / 1000}km
                    </div>
                    <Badge variant={zone.isActive ? 'default' : 'secondary'} className="mt-1">
                      {zone.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
