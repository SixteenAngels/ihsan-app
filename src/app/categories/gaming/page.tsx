'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  Gamepad2
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  badge?: string
  brand: string
  platform: string
  type: string
  features: string[]
}

const gamingProducts: Product[] = [
  {
    id: '1',
    name: 'PlayStation 5',
    price: 499,
    originalPrice: 549,
    discount: 9,
    rating: 4.9,
    reviews: 3456,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Sony',
    platform: 'PlayStation',
    type: 'Console',
    features: ['4K Gaming', 'Ray Tracing', 'SSD Storage']
  },
  {
    id: '2',
    name: 'Xbox Series X',
    price: 499,
    originalPrice: 529,
    discount: 6,
    rating: 4.8,
    reviews: 2789,
    image: '/api/placeholder/300/300',
    brand: 'Microsoft',
    platform: 'Xbox',
    type: 'Console',
    features: ['4K Gaming', 'Ray Tracing', 'Quick Resume']
  },
  {
    id: '3',
    name: 'Nintendo Switch OLED',
    price: 349,
    originalPrice: 399,
    discount: 13,
    rating: 4.7,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Portable',
    brand: 'Nintendo',
    platform: 'Nintendo',
    type: 'Handheld Console',
    features: ['OLED Display', 'Portable Gaming', 'Dockable']
  },
  {
    id: '4',
    name: 'Steam Deck',
    price: 399,
    originalPrice: 499,
    discount: 20,
    rating: 4.6,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'PC Gaming',
    brand: 'Valve',
    platform: 'PC',
    type: 'Handheld PC',
    features: ['PC Games', 'Steam Library', 'Portable']
  },
  {
    id: '5',
    name: 'DualSense Controller',
    price: 69,
    originalPrice: 79,
    discount: 13,
    rating: 4.8,
    reviews: 2156,
    image: '/api/placeholder/300/300',
    badge: 'Controller',
    brand: 'Sony',
    platform: 'PlayStation',
    type: 'Controller',
    features: ['Haptic Feedback', 'Adaptive Triggers', 'Built-in Mic']
  },
  {
    id: '6',
    name: 'Xbox Wireless Controller',
    price: 59,
    originalPrice: 69,
    discount: 14,
    rating: 4.7,
    reviews: 1876,
    image: '/api/placeholder/300/300',
    brand: 'Microsoft',
    platform: 'Xbox',
    type: 'Controller',
    features: ['Wireless', 'Textured Grip', 'Share Button']
  },
  {
    id: '7',
    name: 'Gaming Keyboard',
    price: 129,
    originalPrice: 179,
    discount: 28,
    rating: 4.6,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Mechanical',
    brand: 'Corsair',
    platform: 'PC',
    type: 'Keyboard',
    features: ['Mechanical Switches', 'RGB Lighting', 'Programmable Keys']
  },
  {
    id: '8',
    name: 'Gaming Mouse',
    price: 79,
    originalPrice: 99,
    discount: 20,
    rating: 4.7,
    reviews: 987,
    image: '/api/placeholder/300/300',
    brand: 'Logitech',
    platform: 'PC',
    type: 'Mouse',
    features: ['High DPI', 'RGB Lighting', 'Programmable Buttons']
  },
  {
    id: '9',
    name: 'Gaming Headset',
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.8,
    reviews: 1456,
    image: '/api/placeholder/300/300',
    badge: '7.1 Surround',
    brand: 'SteelSeries',
    platform: 'Multi-Platform',
    type: 'Headset',
    features: ['7.1 Surround', 'Noise Cancelling', 'Retractable Mic']
  },
  {
    id: '10',
    name: 'Gaming Monitor',
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.7,
    reviews: 789,
    image: '/api/placeholder/300/300',
    badge: '144Hz',
    brand: 'ASUS',
    platform: 'PC',
    type: 'Monitor',
    features: ['144Hz Refresh', '1ms Response', 'G-Sync Compatible']
  },
  {
    id: '11',
    name: 'Gaming Chair',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.5,
    reviews: 2345,
    image: '/api/placeholder/300/300',
    brand: 'DXRacer',
    platform: 'Multi-Platform',
    type: 'Accessory',
    features: ['Ergonomic Design', 'Lumbar Support', 'Adjustable Height']
  },
  {
    id: '12',
    name: 'Gaming Mouse Pad',
    price: 25,
    originalPrice: 35,
    discount: 29,
    rating: 4.6,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Razer',
    platform: 'PC',
    type: 'Accessory',
    features: ['Large Surface', 'Non-Slip Base', 'RGB Lighting']
  }
]

const brands = ['Sony', 'Microsoft', 'Nintendo', 'Valve', 'Corsair', 'Logitech', 'SteelSeries', 'ASUS', 'DXRacer', 'Razer']
const platforms = ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Multi-Platform']
const types = ['Console', 'Handheld Console', 'Handheld PC', 'Controller', 'Keyboard', 'Mouse', 'Headset', 'Monitor', 'Accessory']

export default function GamingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [selectedType, setSelectedType] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/categories/electronics" className="text-slate-500 hover:text-slate-700">
            Electronics
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Gaming</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Gaming</h1>
              <p className="text-slate-600">Next-generation gaming consoles, accessories, and PC gaming gear</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search gaming products..."
                  className="pl-10 pr-4 border-slate-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by platform"
                title="Filter by platform"
              >
                <option value="">All Platforms</option>
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>{platform}</option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by type"
                title="Filter by type"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Sort products"
                title="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {gamingProducts.map((product) => (
            <Card key={product.id} className="product-card group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 rounded-t-lg flex items-center justify-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg shadow-inner"></div>
                </div>
                {product.discount > 0 && (
                  <Badge className="absolute top-3 left-3 badge-discount text-xs">
                    -{product.discount}% OFF
                  </Badge>
                )}
                {product.badge && (
                  <Badge className={`absolute top-3 right-3 text-xs ${
                    product.badge === 'New' ? 'badge-new' :
                    product.badge === 'Hot' ? 'badge-sale' :
                    product.badge === 'Portable' ? 'badge-new' :
                    product.badge === 'PC Gaming' ? 'badge-featured' :
                    product.badge === 'Controller' ? 'badge-new' :
                    product.badge === 'Mechanical' ? 'badge-featured' :
                    product.badge === '7.1 Surround' ? 'badge-featured' :
                    product.badge === '144Hz' ? 'badge-featured' :
                    'badge-new'
                  }`}>
                    {product.badge}
                  </Badge>
                )}
                <Button 
                  size="icon" 
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white hover:bg-slate-50 shadow-lg"
                >
                  <Heart className="h-4 w-4 text-slate-600" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900 line-clamp-2">{product.name}</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{product.brand}</span>
                </div>
                <div className="text-sm text-slate-600 mb-2 space-y-1">
                  <div><span className="font-medium">Platform:</span> {product.platform}</div>
                  <div><span className="font-medium">Type:</span> {product.type}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="text-xs bg-slate-100 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-600 ml-2">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">${product.price}</span>
                  <span className="text-sm text-slate-400 line-through">
                    ${product.originalPrice}
                  </span>
                </div>
                <Button className="w-full btn-primary hover:shadow-lg">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            Load More Gaming Products
          </Button>
        </div>
      </div>
    </div>
  )
}
