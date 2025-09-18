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
  Sofa
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
  category: string
  material: string
  dimensions: string
}

const furnitureProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sectional Sofa',
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.7,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'West Elm',
    category: 'Living Room',
    material: 'Fabric',
    dimensions: '120" x 84" x 34"'
  },
  {
    id: '2',
    name: 'Dining Table Set',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.6,
    reviews: 156,
    image: '/api/placeholder/300/300',
    badge: 'Set',
    brand: 'Crate & Barrel',
    category: 'Dining Room',
    material: 'Wood',
    dimensions: '72" x 36" x 30"'
  },
  {
    id: '3',
    name: 'Platform Bed Frame',
    price: 599,
    originalPrice: 799,
    discount: 25,
    rating: 4.8,
    reviews: 345,
    image: '/api/placeholder/300/300',
    brand: 'IKEA',
    category: 'Bedroom',
    material: 'Wood',
    dimensions: '80" x 60" x 8"'
  },
  {
    id: '4',
    name: 'Office Desk',
    price: 399,
    originalPrice: 549,
    discount: 27,
    rating: 4.5,
    reviews: 189,
    image: '/api/placeholder/300/300',
    badge: 'Ergonomic',
    brand: 'Herman Miller',
    category: 'Office',
    material: 'Wood/Metal',
    dimensions: '60" x 30" x 29"'
  },
  {
    id: '5',
    name: 'Bookshelf',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.4,
    reviews: 267,
    image: '/api/placeholder/300/300',
    brand: 'Pottery Barn',
    category: 'Living Room',
    material: 'Wood',
    dimensions: '36" x 12" x 72"'
  },
  {
    id: '6',
    name: 'Coffee Table',
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.6,
    reviews: 123,
    image: '/api/placeholder/300/300',
    badge: 'Modern',
    brand: 'CB2',
    category: 'Living Room',
    material: 'Glass/Wood',
    dimensions: '48" x 24" x 16"'
  },
  {
    id: '7',
    name: 'Dresser',
    price: 699,
    originalPrice: 899,
    discount: 22,
    rating: 4.7,
    reviews: 98,
    image: '/api/placeholder/300/300',
    brand: 'Restoration Hardware',
    category: 'Bedroom',
    material: 'Wood',
    dimensions: '60" x 20" x 32"'
  },
  {
    id: '8',
    name: 'Accent Chair',
    price: 399,
    originalPrice: 549,
    discount: 27,
    rating: 4.5,
    reviews: 178,
    image: '/api/placeholder/300/300',
    badge: 'Designer',
    brand: 'Design Within Reach',
    category: 'Living Room',
    material: 'Leather',
    dimensions: '32" x 32" x 32"'
  },
  {
    id: '9',
    name: 'Kitchen Island',
    price: 799,
    originalPrice: 1099,
    discount: 27,
    rating: 4.8,
    reviews: 67,
    image: '/api/placeholder/300/300',
    brand: 'Williams Sonoma Home',
    category: 'Kitchen',
    material: 'Wood/Marble',
    dimensions: '48" x 24" x 36"'
  },
  {
    id: '10',
    name: 'Nightstand',
    price: 249,
    originalPrice: 329,
    discount: 24,
    rating: 4.6,
    reviews: 145,
    image: '/api/placeholder/300/300',
    brand: 'Wayfair',
    category: 'Bedroom',
    material: 'Wood',
    dimensions: '24" x 16" x 26"'
  },
  {
    id: '11',
    name: 'Storage Cabinet',
    price: 449,
    originalPrice: 599,
    discount: 25,
    rating: 4.7,
    reviews: 89,
    image: '/api/placeholder/300/300',
    badge: 'Storage',
    brand: 'Room & Board',
    category: 'Living Room',
    material: 'Wood',
    dimensions: '48" x 18" x 72"'
  },
  {
    id: '12',
    name: 'Bar Stool Set',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.5,
    reviews: 234,
    image: '/api/placeholder/300/300',
    brand: 'Target',
    category: 'Kitchen',
    material: 'Wood/Metal',
    dimensions: '24" x 18" x 42"'
  }
]

const brands = ['West Elm', 'Crate & Barrel', 'IKEA', 'Herman Miller', 'Pottery Barn', 'CB2', 'Restoration Hardware', 'Design Within Reach', 'Williams Sonoma Home', 'Wayfair', 'Room & Board', 'Target']
const categories = ['Living Room', 'Dining Room', 'Bedroom', 'Office', 'Kitchen']
const materials = ['Fabric', 'Wood', 'Wood/Metal', 'Glass/Wood', 'Leather', 'Wood/Marble']

export default function FurniturePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <Link href="/categories/home-garden" className="text-slate-500 hover:text-slate-700">
            Home & Garden
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Furniture</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Furniture</h1>
              <p className="text-slate-600">Quality furniture to transform your living spaces</p>
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
                  placeholder="Search furniture..."
                  className="pl-10 pr-4 border-slate-300 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by category"
                title="Filter by category"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by material"
                title="Filter by material"
              >
                <option value="">All Materials</option>
                {materials.map((material) => (
                  <option key={material} value={material}>{material}</option>
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
          {furnitureProducts.map((product) => (
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
                    product.badge === 'Best Seller' ? 'badge-featured' :
                    product.badge === 'Set' ? 'badge-new' :
                    product.badge === 'Ergonomic' ? 'badge-featured' :
                    product.badge === 'Modern' ? 'badge-featured' :
                    product.badge === 'Designer' ? 'badge-featured' :
                    product.badge === 'Storage' ? 'badge-featured' :
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
                  <div><span className="font-medium">Category:</span> {product.category}</div>
                  <div><span className="font-medium">Material:</span> {product.material}</div>
                  <div><span className="font-medium">Dimensions:</span> {product.dimensions}</div>
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
            Load More Furniture
          </Button>
        </div>
      </div>
    </div>
  )
}
