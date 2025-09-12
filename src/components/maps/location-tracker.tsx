'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'react-hot-toast'
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Route, 
  Target,
  Play,
  Pause,
  Square,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { mapsService, Location, DeliveryRoute } from '@/lib/maps-service'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface LocationTrackerProps {
  deliveryId: string
  destination: Location
  onLocationUpdate?: (location: Location) => void
  onRouteUpdate?: (route: DeliveryRoute) => void
  onETAUpdate?: (eta: number) => void
  className?: string
}

export default function LocationTracker({
  deliveryId,
  destination,
  onLocationUpdate,
  onRouteUpdate,
  onETAUpdate,
  className = ''
}: LocationTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [route, setRoute] = useState<DeliveryRoute | null>(null)
  const [eta, setEta] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const watchIdRef = useRef<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  // Initialize map and get current location
  useEffect(() => {
    initializeLocation()
    return () => {
      if (watchIdRef.current) {
        mapsService.stopWatchingLocation(watchIdRef.current)
      }
    }
  }, [])

  // Calculate route when location or destination changes
  useEffect(() => {
    if (currentLocation && destination) {
      calculateRoute()
    }
  }, [currentLocation, destination])

  // Update ETA when route changes
  useEffect(() => {
    if (route && currentLocation) {
      const newEta = mapsService.calculateETA(currentLocation, destination)
      setEta(newEta)
      onETAUpdate?.(newEta)
    }
  }, [route, currentLocation, destination, onETAUpdate])

  const initializeLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Initialize map
      if (mapRef.current) {
        await mapsService.initializeMap(mapRef.current.id, {
          center: destination,
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        })
      }

      // Get current location
      const location = await mapsService.getCurrentLocation()
      if (location) {
        setCurrentLocation(location)
        onLocationUpdate?.(location)
      } else {
        throw new Error('Unable to get current location')
      }
    } catch (error) {
      console.error('Error initializing location:', error)
      setError(error instanceof Error ? error.message : 'Failed to initialize location')
      toast.error('Failed to get your location')
    } finally {
      setIsLoading(false)
    }
  }

  const calculateRoute = async () => {
    if (!currentLocation || !destination) return

    try {
      const routeData: DeliveryRoute = {
        origin: currentLocation,
        destination: destination
      }

      const calculatedRoute = await mapsService.calculateRoute(routeData)
      if (calculatedRoute) {
        setRoute(calculatedRoute)
        setDistance(calculatedRoute.distance || null)
        onRouteUpdate?.(calculatedRoute)
      }
    } catch (error) {
      console.error('Error calculating route:', error)
      toast.error('Failed to calculate route')
    }
  }

  const startTracking = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported')
      return
    }

    setIsTracking(true)
    setError(null)

    try {
      const watchId = await mapsService.watchLocation((location) => {
        setCurrentLocation(location)
        setAccuracy(location.accuracy || null)
        onLocationUpdate?.(location)
        
        // Calculate new route
        if (destination) {
          calculateRoute()
        }
      })

      watchIdRef.current = watchId
      toast.success('Location tracking started')
    } catch (error) {
      console.error('Error starting tracking:', error)
      setError(error instanceof Error ? error.message : 'Failed to start tracking')
      setIsTracking(false)
      toast.error('Failed to start location tracking')
    }
  }

  const stopTracking = () => {
    if (watchIdRef.current) {
      mapsService.stopWatchingLocation(watchIdRef.current)
      watchIdRef.current = null
    }
    setIsTracking(false)
    toast.success('Location tracking stopped')
  }

  const refreshLocation = async () => {
    setIsLoading(true)
    try {
      const location = await mapsService.getCurrentLocation()
      if (location) {
        setCurrentLocation(location)
        onLocationUpdate?.(location)
        toast.success('Location updated')
      }
    } catch (error) {
      console.error('Error refreshing location:', error)
      toast.error('Failed to refresh location')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`
    }
    return `${(meters / 1000).toFixed(1)}km`
  }

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${Math.round(minutes)}min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy < 10) return 'text-green-500'
    if (accuracy < 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Map Container */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Delivery Tracking
            </CardTitle>
            <CardDescription>
              Real-time location tracking and route optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Map */}
              <div 
                ref={mapRef}
                id="delivery-map"
                className="w-full h-64 min-h-[256px] bg-muted rounded-lg border"
              />
              
              {/* Controls */}
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={isTracking ? stopTracking : startTracking}
                  variant={isTracking ? 'destructive' : 'default'}
                  size="sm"
                >
                  {isTracking ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Tracking
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Tracking
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={refreshLocation}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button
                  onClick={calculateRoute}
                  variant="outline"
                  size="sm"
                >
                  <Route className="h-4 w-4 mr-2" />
                  Recalculate Route
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Location Status */}
      <motion.div variants={staggerItem}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Location Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Location */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Current Location</div>
                {currentLocation ? (
                  <div className="space-y-1">
                    <div className="font-medium">
                      {currentLocation.address || 'Location acquired'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                    </div>
                    {accuracy && (
                      <div className={`text-xs ${getAccuracyColor(accuracy)}`}>
                        Accuracy: ±{Math.round(accuracy)}m
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No location data</div>
                )}
              </div>

              {/* Destination */}
              <div>
                <div className="text-sm text-muted-foreground mb-2">Destination</div>
                <div className="space-y-1">
                  <div className="font-medium">
                    {destination.address || 'Delivery address'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {destination.lat.toFixed(6)}, {destination.lng.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Route Information */}
      {route && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2" />
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Distance */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {distance ? formatDistance(distance) : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Distance</div>
                </div>

                {/* ETA */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {eta ? formatTime(eta) : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Estimated Time</div>
                </div>

                {/* Status */}
                <div className="text-center">
                  <Badge 
                    variant={isTracking ? 'default' : 'secondary'}
                    className="text-lg px-4 py-2"
                  >
                    {isTracking ? 'Tracking' : 'Stopped'}
                  </Badge>
                  <div className="text-sm text-muted-foreground mt-1">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <motion.div variants={staggerItem}>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                <div>
                  <div className="font-medium">Location Error</div>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <motion.div variants={staggerItem}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                <span>Getting location...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
