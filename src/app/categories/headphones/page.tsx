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
  Headphones
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
  type: string
  connectivity: string
  batteryLife?: string
}

const headphonesProducts: Product[] = [
  {
    id: '1',
    name: 'AirPods Pro 2nd Gen',
    price: 249,
    originalPrice: 279,
    discount: 11,
    rating: 4.6,
    reviews: 2156,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    brand: 'Apple',
    type: 'True Wireless',
    connectivity: 'Bluetooth 5.3',
    batteryLife: '6 hours'
  },
  {
    id: '2',
    name: 'Sony WH-1000XM5',
    price: 399,
    originalPrice: 449,
    discount: 11,
    rating: 4.8,
    reviews: 1876,
    image: '/api/placeholder/300/300',
    badge: 'Noise Cancelling',
    brand: 'Sony',
    type: 'Over-Ear',
    connectivity: 'Bluetooth 5.2',
    batteryLife: '30 hours'
  },
  {
    id: '3',
    name: 'Bose QuietComfort 45',
    price: 329,
    originalPrice: 379,
    discount: 13,
    rating: 4.7,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Bose',
    type: 'Over-Ear',
    connectivity: 'Bluetooth 5.1',
    batteryLife: '24 hours'
  },
  {
    id: '4',
    name: 'Sennheiser HD 660S',
    price: 499,
    originalPrice: 599,
    discount: 17,
    rating: 4.9,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Audiophile',
    brand: 'Sennheiser',
    type: 'Over-Ear',
    connectivity: 'Wired'
  },
  {
    id: '5',
    name: 'Jabra Elite 85t',
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.5,
    reviews: 1456,
    image: '/api/placeholder/300/300',
    brand: 'Jabra',
    type: 'True Wireless',
    connectivity: 'Bluetooth 5.1',
    batteryLife: '5.5 hours'
  },
  {
    id: '6',
    name: 'Audio-Technica ATH-M50x',
    price: 149,
    originalPrice: 179,
    discount: 17,
    rating: 4.8,
    reviews: 2789,
    image: '/api/placeholder/300/300',
    badge: 'Studio',
    brand: 'Audio-Technica',
    type: 'Over-Ear',
    connectivity: 'Wired'
  },
  {
    id: '7',
    name: 'Beats Studio3 Wireless',
    price: 199,
    originalPrice: 249,
    discount: 20,
    rating: 4.4,
    reviews: 987,
    image: '/api/placeholder/300/300',
    brand: 'Beats',
    type: 'Over-Ear',
    connectivity: 'Bluetooth 4.2',
    batteryLife: '22 hours'
  },
  {
    id: '8',
    name: 'Sony WF-1000XM4',
    price: 279,
    originalPrice: 329,
    discount: 15,
    rating: 4.7,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Premium',
    brand: 'Sony',
    type: 'True Wireless',
    connectivity: 'Bluetooth 5.2',
    batteryLife: '8 hours'
  },
  {
    id: '9',
    name: 'Beyerdynamic DT 770 Pro',
    price: 179,
    originalPrice: 219,
    discount: 18,
    rating: 4.8,
    reviews: 456,
    image: '/api/placeholder/300/300',
    brand: 'Beyerdynamic',
    type: 'Over-Ear',
    connectivity: 'Wired'
  },
  {
    id: '10',
    name: 'Samsung Galaxy Buds2 Pro',
    price: 229,
    originalPrice: 279,
    discount: 18,
    rating: 4.6,
    reviews: 789,
    image: '/api/placeholder/300/300',
    brand: 'Samsung',
    type: 'True Wireless',
    connectivity: 'Bluetooth 5.3',
    batteryLife: '5 hours'
  },
  {
    id: '11',
    name: 'HyperX Cloud II',
    price: 99,
    originalPrice: 129,
    discount: 23,
    rating: 4.7,
    reviews: 2345,
    image: '/api/placeholder/300/300',
    badge: 'Gaming',
    brand: 'HyperX',
    type: 'Over-Ear',
    connectivity: 'USB/Wired'
  },
  {
    id: '12',
    name: 'Shure SE215',
    price: 99,
    originalPrice: 129,
    discount: 23,
    rating: 4.8,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Shure',
    type: 'In-Ear',
    connectivity: 'Wired'
  }
]

const brands = ['Apple', 'Sony', 'Bose', 'Sennheiser', 'Jabra', 'Audio-Technica', 'Beats', 'Beyerdynamic', 'Samsung', 'HyperX', 'Shure']
const types = ['True Wireless', 'Over-Ear', 'In-Ear', 'On-Ear']
const connectivity = ['Bluetooth 5.3', 'Bluetooth 5.2', 'Bluetooth 5.1', 'Bluetooth 4.2', 'Wired', 'USB/Wired']

export default function HeadphonesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedConnectivity, setSelectedConnectivity] = useState('')

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
          <span className="text-slate-900">Headphones</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Headphones</h1>
              <p className="text-slate-600">Premium audio experience with top-quality headphones</p>
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
                  placeholder="Search headphones..."
                  className="pl-10 pr-4 border-slate-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by brand"
                title="Filter by brand"
              >
                <option value="">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
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
          {headphonesProducts.map((product) => (
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
                    product.badge === 'Popular' ? 'badge-new' :
                    product.badge === 'Noise Cancelling' ? 'badge-featured' :
                    product.badge === 'Audiophile' ? 'badge-featured' :
                    product.badge === 'Studio' ? 'badge-featured' :
                    product.badge === 'Premium' ? 'badge-featured' :
                    product.badge === 'Gaming' ? 'badge-featured' :
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
                  <div><span className="font-medium">Type:</span> {product.type}</div>
                  <div><span className="font-medium">Connectivity:</span> {product.connectivity}</div>
                  {product.batteryLife && <div><span className="font-medium">Battery:</span> {product.batteryLife}</div>}
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
            Load More Headphones
          </Button>
        </div>
      </div>
    </div>
  )
}
