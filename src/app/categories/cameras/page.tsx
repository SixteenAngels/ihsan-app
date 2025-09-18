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
  Camera
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
  megapixels: string
  lens: string
}

const cameraProducts: Product[] = [
  {
    id: '1',
    name: 'Sony A7R V',
    price: 3899,
    originalPrice: 3999,
    discount: 3,
    rating: 4.8,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Sony',
    type: 'Mirrorless',
    megapixels: '61MP',
    lens: '24-70mm f/2.8'
  },
  {
    id: '2',
    name: 'Canon EOS R5',
    price: 3299,
    originalPrice: 3499,
    discount: 6,
    rating: 4.7,
    reviews: 189,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Canon',
    type: 'Mirrorless',
    megapixels: '45MP',
    lens: '24-105mm f/4'
  },
  {
    id: '3',
    name: 'Nikon Z9',
    price: 5499,
    originalPrice: 5999,
    discount: 8,
    rating: 4.9,
    reviews: 156,
    image: '/api/placeholder/300/300',
    badge: 'Professional',
    brand: 'Nikon',
    type: 'Mirrorless',
    megapixels: '45MP',
    lens: '24-70mm f/2.8'
  },
  {
    id: '4',
    name: 'Fujifilm X-T5',
    price: 1699,
    originalPrice: 1899,
    discount: 11,
    rating: 4.6,
    reviews: 345,
    image: '/api/placeholder/300/300',
    brand: 'Fujifilm',
    type: 'Mirrorless',
    megapixels: '40MP',
    lens: '18-55mm f/2.8-4'
  },
  {
    id: '5',
    name: 'Panasonic Lumix GH6',
    price: 1999,
    originalPrice: 2199,
    discount: 9,
    rating: 4.5,
    reviews: 278,
    image: '/api/placeholder/300/300',
    badge: 'Video',
    brand: 'Panasonic',
    type: 'Mirrorless',
    megapixels: '25MP',
    lens: '12-35mm f/2.8'
  },
  {
    id: '6',
    name: 'Olympus OM-1',
    price: 2199,
    originalPrice: 2399,
    discount: 8,
    rating: 4.7,
    reviews: 198,
    image: '/api/placeholder/300/300',
    brand: 'Olympus',
    type: 'Mirrorless',
    megapixels: '20MP',
    lens: '12-40mm f/2.8'
  },
  {
    id: '7',
    name: 'Canon EOS 5D Mark IV',
    price: 2499,
    originalPrice: 2799,
    discount: 11,
    rating: 4.8,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'DSLR',
    brand: 'Canon',
    type: 'DSLR',
    megapixels: '30MP',
    lens: '24-70mm f/2.8'
  },
  {
    id: '8',
    name: 'Nikon D850',
    price: 2999,
    originalPrice: 3299,
    discount: 9,
    rating: 4.9,
    reviews: 423,
    image: '/api/placeholder/300/300',
    brand: 'Nikon',
    type: 'DSLR',
    megapixels: '45MP',
    lens: '24-70mm f/2.8'
  },
  {
    id: '9',
    name: 'Sony A7 IV',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    rating: 4.7,
    reviews: 789,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    brand: 'Sony',
    type: 'Mirrorless',
    megapixels: '33MP',
    lens: '28-70mm f/3.5-5.6'
  },
  {
    id: '10',
    name: 'Leica Q2',
    price: 4995,
    originalPrice: 5295,
    discount: 6,
    rating: 4.8,
    reviews: 123,
    image: '/api/placeholder/300/300',
    badge: 'Luxury',
    brand: 'Leica',
    type: 'Fixed Lens',
    megapixels: '47MP',
    lens: '28mm f/1.7'
  },
  {
    id: '11',
    name: 'Ricoh GR IIIx',
    price: 999,
    originalPrice: 1099,
    discount: 9,
    rating: 4.6,
    reviews: 456,
    image: '/api/placeholder/300/300',
    brand: 'Ricoh',
    type: 'Compact',
    megapixels: '24MP',
    lens: '40mm f/2.8'
  },
  {
    id: '12',
    name: 'Hasselblad X2D 100C',
    price: 8195,
    originalPrice: 8995,
    discount: 9,
    rating: 4.9,
    reviews: 67,
    image: '/api/placeholder/300/300',
    badge: 'Medium Format',
    brand: 'Hasselblad',
    type: 'Medium Format',
    megapixels: '100MP',
    lens: '45mm f/3.5'
  }
]

const brands = ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Olympus', 'Leica', 'Ricoh', 'Hasselblad']
const types = ['Mirrorless', 'DSLR', 'Fixed Lens', 'Compact', 'Medium Format']
const megapixels = ['20MP', '24MP', '25MP', '30MP', '33MP', '40MP', '45MP', '47MP', '61MP', '100MP']

export default function CamerasPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedMegapixels, setSelectedMegapixels] = useState('')

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
          <span className="text-slate-900">Cameras</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Cameras</h1>
              <p className="text-slate-600">Professional and enthusiast cameras for every photographer</p>
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
                  placeholder="Search cameras..."
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
          {cameraProducts.map((product) => (
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
                    product.badge === 'Professional' ? 'badge-featured' :
                    product.badge === 'Video' ? 'badge-featured' :
                    product.badge === 'DSLR' ? 'badge-featured' :
                    product.badge === 'Popular' ? 'badge-new' :
                    product.badge === 'Luxury' ? 'badge-featured' :
                    product.badge === 'Medium Format' ? 'badge-featured' :
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
                  <div><span className="font-medium">Sensor:</span> {product.megapixels}</div>
                  <div><span className="font-medium">Lens:</span> {product.lens}</div>
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
            Load More Cameras
          </Button>
        </div>
      </div>
    </div>
  )
}
