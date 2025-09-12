// Google Maps API configuration and utilities
import { Loader } from '@googlemaps/js-api-loader'

export interface Location {
  lat: number
  lng: number
  address?: string
  timestamp?: string
}

export interface DeliveryRoute {
  origin: Location
  destination: Location
  waypoints?: Location[]
  distance?: number
  duration?: number
  polyline?: string
}

export interface DeliveryZone {
  id: string
  name: string
  center: Location
  radius: number // in meters
  isActive: boolean
}

class MapsService {
  private loader: Loader
  private map: google.maps.Map | null = null
  private directionsService: google.maps.DirectionsService | null = null
  private directionsRenderer: google.maps.DirectionsRenderer | null = null
  private geocoder: google.maps.Geocoder | null = null

  constructor() {
    this.loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places', 'geometry']
    })
  }

  async initializeMap(containerId: string, options: google.maps.MapOptions = {}): Promise<google.maps.Map> {
    try {
      await this.loader.load()
      
      const defaultOptions: google.maps.MapOptions = {
        center: { lat: 5.6037, lng: -0.1870 }, // Accra, Ghana
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        ...options
      }

      this.map = new google.maps.Map(document.getElementById(containerId)!, defaultOptions)
      this.directionsService = new google.maps.DirectionsService()
      this.directionsRenderer = new google.maps.DirectionsRenderer()
      this.geocoder = new google.maps.Geocoder()

      return this.map
    } catch (error) {
      console.error('Error initializing map:', error)
      throw error
    }
  }

  async geocodeAddress(address: string): Promise<Location | null> {
    if (!this.geocoder) {
      await this.loader.load()
      this.geocoder = new google.maps.Geocoder()
    }

    try {
      const results = await this.geocoder.geocode({ address })
      if (results.results.length > 0) {
        const location = results.results[0].geometry.location
        return {
          lat: location.lat(),
          lng: location.lng(),
          address: results.results[0].formatted_address
        }
      }
      return null
    } catch (error) {
      console.error('Error geocoding address:', error)
      return null
    }
  }

  async reverseGeocode(location: Location): Promise<string | null> {
    if (!this.geocoder) {
      await this.loader.load()
      this.geocoder = new google.maps.Geocoder()
    }

    try {
      const results = await this.geocoder.geocode({
        location: { lat: location.lat, lng: location.lng }
      })
      
      if (results.results.length > 0) {
        return results.results[0].formatted_address
      }
      return null
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      return null
    }
  }

  async calculateRoute(route: DeliveryRoute): Promise<DeliveryRoute | null> {
    if (!this.directionsService) {
      await this.loader.load()
      this.directionsService = new google.maps.DirectionsService()
    }

    try {
      const request: google.maps.DirectionsRequest = {
        origin: { lat: route.origin.lat, lng: route.origin.lng },
        destination: { lat: route.destination.lat, lng: route.destination.lng },
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        ...(route.waypoints && {
          waypoints: route.waypoints.map(wp => ({
            location: { lat: wp.lat, lng: wp.lng },
            stopover: true
          }))
        })
      }

      const result = await this.directionsService.route(request)
      
      if (result.routes.length > 0) {
        const routeData = result.routes[0]
        const leg = routeData.legs[0]
        
        return {
          ...route,
          distance: leg.distance?.value || 0,
          duration: leg.duration?.value || 0,
          polyline: routeData.overview_polyline?.encoded_polyline || ''
        }
      }
      
      return null
    } catch (error) {
      console.error('Error calculating route:', error)
      return null
    }
  }

  async optimizeDeliveryRoute(deliveries: Location[]): Promise<Location[]> {
    if (deliveries.length <= 2) return deliveries

    try {
      // Use Google Maps Directions API with optimizeWaypoints
      const request: google.maps.DirectionsRequest = {
        origin: deliveries[0],
        destination: deliveries[deliveries.length - 1],
        waypoints: deliveries.slice(1, -1).map(location => ({
          location: { lat: location.lat, lng: location.lng },
          stopover: true
        })),
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      }

      const result = await this.directionsService!.route(request)
      
      if (result.routes.length > 0) {
        const optimizedWaypoints = result.routes[0].waypoint_order || []
        const optimizedDeliveries: Location[] = [deliveries[0]]
        
        optimizedWaypoints.forEach((index: number) => {
          optimizedDeliveries.push(deliveries[index + 1])
        })
        
        optimizedDeliveries.push(deliveries[deliveries.length - 1])
        return optimizedDeliveries
      }
      
      return deliveries
    } catch (error) {
      console.error('Error optimizing route:', error)
      return deliveries
    }
  }

  async getCurrentLocation(): Promise<Location | null> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          }
          
          // Get address for the location
          const address = await this.reverseGeocode(location)
          if (address) {
            location.address = address
          }
          
          resolve(location)
        },
        (error) => {
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }

  async watchLocation(callback: (location: Location) => void): Promise<number> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported')
    }

    return navigator.geolocation.watchPosition(
      async (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date().toISOString()
        }
        
        // Get address for the location
        const address = await this.reverseGeocode(location)
        if (address) {
          location.address = address
        }
        
        callback(location)
      },
      (error) => {
        console.error('Error watching location:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000 // 30 seconds
      }
    )
  }

  stopWatchingLocation(watchId: number): void {
    navigator.geolocation.clearWatch(watchId)
  }

  calculateDistance(point1: Location, point2: Location): number {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = point1.lat * Math.PI / 180
    const φ2 = point2.lat * Math.PI / 180
    const Δφ = (point2.lat - point1.lat) * Math.PI / 180
    const Δλ = (point2.lng - point1.lng) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }

  calculateETA(currentLocation: Location, destination: Location, averageSpeed: number = 30): number {
    const distance = this.calculateDistance(currentLocation, destination)
    const timeInHours = distance / (averageSpeed * 1000) // Convert km/h to m/h
    return Math.ceil(timeInHours * 60) // Return ETA in minutes
  }

  isLocationInZone(location: Location, zone: DeliveryZone): boolean {
    const distance = this.calculateDistance(location, zone.center)
    return distance <= zone.radius
  }

  renderRoute(route: DeliveryRoute, map: google.maps.Map): void {
    if (!this.directionsRenderer) {
      this.directionsRenderer = new google.maps.DirectionsRenderer()
    }

    this.directionsRenderer.setMap(map)
    this.directionsRenderer.setDirections({
      routes: [{
        legs: [{
          distance: { text: `${Math.round(route.distance! / 1000)} km`, value: route.distance! },
          duration: { text: `${Math.round(route.duration! / 60)} min`, value: route.duration! },
          start_address: route.origin.address || '',
          end_address: route.destination.address || '',
          start_location: { lat: () => route.origin.lat, lng: () => route.origin.lng },
          end_location: { lat: () => route.destination.lat, lng: () => route.destination.lng },
          steps: []
        }],
        overview_path: route.polyline ? this.decodePolyline(route.polyline) : [],
        overview_polyline: { encoded_polyline: route.polyline || '' },
        bounds: new google.maps.LatLngBounds(
          { lat: route.origin.lat, lng: route.origin.lng },
          { lat: route.destination.lat, lng: route.destination.lng }
        ),
        summary: '',
        warnings: [],
        waypoint_order: [],
        copyrights: '',
        fare: undefined
      }]
    })
  }

  private decodePolyline(encoded: string): google.maps.LatLng[] {
    const points: google.maps.LatLng[] = []
    let index = 0
    const len = encoded.length
    let lat = 0
    let lng = 0

    while (index < len) {
      let b: number
      let shift = 0
      let result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1))
      lat += dlat

      shift = 0
      result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1))
      lng += dlng

      points.push(new google.maps.LatLng(lat / 1e5, lng / 1e5))
    }

    return points
  }
}

// Export singleton instance
export const mapsService = new MapsService()

// Export types and utilities
export { MapsService }
