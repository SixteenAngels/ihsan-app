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
  Smartphone
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
  storage: string
  color: string
}

const phoneProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    rating: 4.8,
    reviews: 1247,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Apple',
    storage: '256GB',
    color: 'Natural Titanium'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1099,
    originalPrice: 1199,
    discount: 8,
    rating: 4.7,
    reviews: 892,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Samsung',
    storage: '512GB',
    color: 'Titanium Black'
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    price: 899,
    originalPrice: 999,
    discount: 10,
    rating: 4.6,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'Google',
    storage: '128GB',
    color: 'Obsidian'
  },
  {
    id: '4',
    name: 'OnePlus 12',
    price: 799,
    originalPrice: 899,
    discount: 11,
    rating: 4.5,
    reviews: 423,
    image: '/api/placeholder/300/300',
    brand: 'OnePlus',
    storage: '256GB',
    color: 'Silky Black'
  },
  {
    id: '5',
    name: 'iPhone 15',
    price: 799,
    originalPrice: 829,
    discount: 4,
    rating: 4.7,
    reviews: 2156,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    brand: 'Apple',
    storage: '128GB',
    color: 'Blue'
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24',
    price: 799,
    originalPrice: 899,
    discount: 11,
    rating: 4.6,
    reviews: 1876,
    image: '/api/placeholder/300/300',
    brand: 'Samsung',
    storage: '256GB',
    color: 'Marble Gray'
  },
  {
    id: '7',
    name: 'Xiaomi 14 Pro',
    price: 699,
    originalPrice: 799,
    discount: 13,
    rating: 4.4,
    reviews: 1456,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Xiaomi',
    storage: '512GB',
    color: 'Black'
  },
  {
    id: '8',
    name: 'Huawei P60 Pro',
    price: 899,
    originalPrice: 999,
    discount: 10,
    rating: 4.5,
    reviews: 987,
    image: '/api/placeholder/300/300',
    brand: 'Huawei',
    storage: '256GB',
    color: 'Rococo Pearl'
  },
  {
    id: '9',
    name: 'Sony Xperia 1 V',
    price: 1199,
    originalPrice: 1299,
    discount: 8,
    rating: 4.3,
    reviews: 345,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Sony',
    storage: '256GB',
    color: 'Platinum Silver'
  },
  {
    id: '10',
    name: 'Nothing Phone (2)',
    price: 599,
    originalPrice: 699,
    discount: 14,
    rating: 4.4,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Nothing',
    storage: '256GB',
    color: 'White'
  },
  {
    id: '11',
    name: 'Motorola Edge 40 Pro',
    price: 649,
    originalPrice: 749,
    discount: 13,
    rating: 4.2,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'Motorola',
    storage: '256GB',
    color: 'Interstellar Black'
  },
  {
    id: '12',
    name: 'OPPO Find X6 Pro',
    price: 999,
    originalPrice: 1099,
    discount: 9,
    rating: 4.5,
    reviews: 789,
    image: '/api/placeholder/300/300',
    badge: 'Featured',
    brand: 'OPPO',
    storage: '512GB',
    color: 'Glacier Blue'
  }
]

const brands = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Sony', 'Nothing', 'Motorola', 'OPPO']
const storageOptions = ['64GB', '128GB', '256GB', '512GB', '1TB']
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Purple', 'Gold', 'Silver']

export default function PhonesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

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
          <span className="text-slate-900">Phones</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Smartphones</h1>
              <p className="text-slate-600">Latest smartphones from top brands</p>
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
                  placeholder="Search phones..."
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
                value={selectedStorage}
                onChange={(e) => setSelectedStorage(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by storage"
                title="Filter by storage"
              >
                <option value="">All Storage</option>
                {storageOptions.map((storage) => (
                  <option key={storage} value={storage}>{storage}</option>
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
          {phoneProducts.map((product) => (
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
                <div className="text-sm text-slate-600 mb-2">
                  <span className="mr-2">{product.storage}</span>
                  <span>{product.color}</span>
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
            Load More Phones
          </Button>
        </div>
      </div>
    </div>
  )
}
