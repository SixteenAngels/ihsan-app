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
  Laptop
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
  processor: string
  ram: string
  storage: string
  screenSize: string
}

const laptopProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 16" M3',
    price: 2499,
    originalPrice: 2699,
    discount: 7,
    rating: 4.9,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'Apple',
    processor: 'Apple M3',
    ram: '18GB',
    storage: '512GB SSD',
    screenSize: '16.2"'
  },
  {
    id: '2',
    name: 'Dell XPS 15',
    price: 1899,
    originalPrice: 2099,
    discount: 10,
    rating: 4.6,
    reviews: 423,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Dell',
    processor: 'Intel i7-13700H',
    ram: '16GB',
    storage: '1TB SSD',
    screenSize: '15.6"'
  },
  {
    id: '3',
    name: 'HP Spectre x360 14',
    price: 1299,
    originalPrice: 1499,
    discount: 13,
    rating: 4.5,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'HP',
    processor: 'Intel i7-1360P',
    ram: '16GB',
    storage: '512GB SSD',
    screenSize: '14"'
  },
  {
    id: '4',
    name: 'Lenovo ThinkPad X1 Carbon',
    price: 1599,
    originalPrice: 1799,
    discount: 11,
    rating: 4.7,
    reviews: 189,
    image: '/api/placeholder/300/300',
    brand: 'Lenovo',
    processor: 'Intel i7-1365U',
    ram: '16GB',
    storage: '512GB SSD',
    screenSize: '14"'
  },
  {
    id: '5',
    name: 'ASUS ROG Zephyrus G14',
    price: 1399,
    originalPrice: 1599,
    discount: 13,
    rating: 4.6,
    reviews: 456,
    image: '/api/placeholder/300/300',
    badge: 'Gaming',
    brand: 'ASUS',
    processor: 'AMD Ryzen 9 7940HS',
    ram: '16GB',
    storage: '1TB SSD',
    screenSize: '14"'
  },
  {
    id: '6',
    name: 'Microsoft Surface Laptop 5',
    price: 999,
    originalPrice: 1199,
    discount: 17,
    rating: 4.4,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'Microsoft',
    processor: 'Intel i5-1235U',
    ram: '8GB',
    storage: '256GB SSD',
    screenSize: '13.5"'
  },
  {
    id: '7',
    name: 'MacBook Air 15" M2',
    price: 1299,
    originalPrice: 1399,
    discount: 7,
    rating: 4.8,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    brand: 'Apple',
    processor: 'Apple M2',
    ram: '8GB',
    storage: '256GB SSD',
    screenSize: '15.3"'
  },
  {
    id: '8',
    name: 'Razer Blade 15',
    price: 1999,
    originalPrice: 2199,
    discount: 9,
    rating: 4.5,
    reviews: 345,
    image: '/api/placeholder/300/300',
    badge: 'Gaming',
    brand: 'Razer',
    processor: 'Intel i7-13700H',
    ram: '16GB',
    storage: '1TB SSD',
    screenSize: '15.6"'
  },
  {
    id: '9',
    name: 'Acer Swift 3',
    price: 699,
    originalPrice: 899,
    discount: 22,
    rating: 4.3,
    reviews: 789,
    image: '/api/placeholder/300/300',
    badge: 'Budget',
    brand: 'Acer',
    processor: 'AMD Ryzen 7 7730U',
    ram: '8GB',
    storage: '512GB SSD',
    screenSize: '14"'
  },
  {
    id: '10',
    name: 'LG Gram 17',
    price: 1199,
    originalPrice: 1399,
    discount: 14,
    rating: 4.4,
    reviews: 234,
    image: '/api/placeholder/300/300',
    brand: 'LG',
    processor: 'Intel i7-1260P',
    ram: '16GB',
    storage: '512GB SSD',
    screenSize: '17"'
  },
  {
    id: '11',
    name: 'MSI Creator Z16',
    price: 1799,
    originalPrice: 1999,
    discount: 10,
    rating: 4.6,
    reviews: 123,
    image: '/api/placeholder/300/300',
    badge: 'Creator',
    brand: 'MSI',
    processor: 'Intel i7-12700H',
    ram: '16GB',
    storage: '1TB SSD',
    screenSize: '16"'
  },
  {
    id: '12',
    name: 'Framework Laptop 13',
    price: 1099,
    originalPrice: 1299,
    discount: 15,
    rating: 4.7,
    reviews: 456,
    image: '/api/placeholder/300/300',
    badge: 'Modular',
    brand: 'Framework',
    processor: 'Intel i5-1240P',
    ram: '8GB',
    storage: '256GB SSD',
    screenSize: '13.5"'
  }
]

const brands = ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft', 'Razer', 'Acer', 'LG', 'MSI', 'Framework']
const processors = ['Apple M3', 'Apple M2', 'Intel i7', 'Intel i5', 'AMD Ryzen 9', 'AMD Ryzen 7']
const ramOptions = ['8GB', '16GB', '18GB', '32GB']
const storageOptions = ['256GB SSD', '512GB SSD', '1TB SSD', '2TB SSD']

export default function LaptopsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedProcessor, setSelectedProcessor] = useState('')
  const [selectedRam, setSelectedRam] = useState('')
  const [selectedStorage, setSelectedStorage] = useState('')

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
          <span className="text-slate-900">Laptops</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Laptops</h1>
              <p className="text-slate-600">Powerful laptops for work, gaming, and creativity</p>
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
                  placeholder="Search laptops..."
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
                value={selectedProcessor}
                onChange={(e) => setSelectedProcessor(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by processor"
                title="Filter by processor"
              >
                <option value="">All Processors</option>
                {processors.map((processor) => (
                  <option key={processor} value={processor}>{processor}</option>
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
          {laptopProducts.map((product) => (
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
                    product.badge === 'Gaming' ? 'badge-featured' :
                    product.badge === 'Creator' ? 'badge-featured' :
                    product.badge === 'Modular' ? 'badge-new' :
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
                  <div><span className="font-medium">Processor:</span> {product.processor}</div>
                  <div><span className="font-medium">RAM:</span> {product.ram} | <span className="font-medium">Storage:</span> {product.storage}</div>
                  <div><span className="font-medium">Screen:</span> {product.screenSize}</div>
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
            Load More Laptops
          </Button>
        </div>
      </div>
    </div>
  )
}
