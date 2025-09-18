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
  Baby,
  Shirt,
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
  category: string
  ageRange: string
  size?: string
}

const babyKidsProducts: Product[] = [
  {
    id: '1',
    name: 'Organic Baby Onesie Set',
    price: 25,
    originalPrice: 35,
    discount: 29,
    rating: 4.7,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Organic',
    brand: 'Burt\'s Bees Baby',
    category: 'Baby Clothing',
    ageRange: '0-6 months',
    size: '3-6M'
  },
  {
    id: '2',
    name: 'Educational Building Blocks',
    price: 45,
    originalPrice: 65,
    discount: 31,
    rating: 4.8,
    reviews: 892,
    image: '/api/placeholder/300/300',
    badge: 'Educational',
    brand: 'Melissa & Doug',
    category: 'Toys',
    ageRange: '2-5 years'
  },
  {
    id: '3',
    name: 'Baby Stroller',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.6,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'Graco',
    category: 'Baby Gear',
    ageRange: '0-3 years'
  },
  {
    id: '4',
    name: 'Kids T-Shirt Pack',
    price: 18,
    originalPrice: 28,
    discount: 36,
    rating: 4.5,
    reviews: 423,
    image: '/api/placeholder/300/300',
    badge: 'Pack of 3',
    brand: 'Carter\'s',
    category: 'Baby Clothing',
    ageRange: '2-4 years',
    size: '2T'
  },
  {
    id: '5',
    name: 'Interactive Learning Tablet',
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.7,
    reviews: 2156,
    image: '/api/placeholder/300/300',
    badge: 'Learning',
    brand: 'LeapFrog',
    category: 'Toys',
    ageRange: '3-8 years'
  },
  {
    id: '6',
    name: 'Baby Car Seat',
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.8,
    reviews: 1876,
    image: '/api/placeholder/300/300',
    brand: 'Chicco',
    category: 'Baby Gear',
    ageRange: '0-2 years'
  },
  {
    id: '7',
    name: 'Art Supplies Set',
    price: 35,
    originalPrice: 55,
    discount: 36,
    rating: 4.6,
    reviews: 345,
    image: '/api/placeholder/300/300',
    badge: 'Creative',
    brand: 'Crayola',
    category: 'Toys',
    ageRange: '4-12 years'
  },
  {
    id: '8',
    name: 'Baby Bottle Set',
    price: 28,
    originalPrice: 38,
    discount: 26,
    rating: 4.7,
    reviews: 789,
    image: '/api/placeholder/300/300',
    brand: 'Dr. Brown\'s',
    category: 'Baby Gear',
    ageRange: '0-12 months'
  },
  {
    id: '9',
    name: 'Kids Sneakers',
    price: 45,
    originalPrice: 65,
    discount: 31,
    rating: 4.5,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Comfort',
    brand: 'Stride Rite',
    category: 'Baby Clothing',
    ageRange: '2-6 years',
    size: '10'
  },
  {
    id: '10',
    name: 'Puzzle Set',
    price: 22,
    originalPrice: 32,
    discount: 31,
    rating: 4.8,
    reviews: 1456,
    image: '/api/placeholder/300/300',
    brand: 'Ravensburger',
    category: 'Toys',
    ageRange: '3-8 years'
  },
  {
    id: '11',
    name: 'Baby Monitor',
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.6,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Safety',
    brand: 'Motorola',
    category: 'Baby Gear',
    ageRange: '0-3 years'
  },
  {
    id: '12',
    name: 'Kids Backpack',
    price: 32,
    originalPrice: 45,
    discount: 29,
    rating: 4.7,
    reviews: 234,
    image: '/api/placeholder/300/300',
    brand: 'Skip Hop',
    category: 'Baby Gear',
    ageRange: '3-8 years'
  }
]

const subcategories = [
  { name: 'Baby Clothing', icon: Shirt, href: '/categories/baby-clothing', count: 234 },
  { name: 'Toys', icon: Gamepad2, href: '/categories/toys', count: 456 },
  { name: 'Baby Gear', icon: Baby, href: '/categories/baby-gear', count: 189 }
]

const brands = ['Burt\'s Bees Baby', 'Melissa & Doug', 'Graco', 'Carter\'s', 'LeapFrog', 'Chicco', 'Crayola', 'Dr. Brown\'s', 'Stride Rite', 'Ravensburger', 'Motorola', 'Skip Hop']
const categories = ['Baby Clothing', 'Toys', 'Baby Gear']
const ageRanges = ['0-6 months', '0-12 months', '0-2 years', '0-3 years', '2-4 years', '2-5 years', '2-6 years', '3-8 years', '4-12 years']

export default function BabyKidsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedAgeRange, setSelectedAgeRange] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Baby & Kids</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Baby & Kids</h1>
              <p className="text-slate-600">Safe, fun, and educational products for children of all ages</p>
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

          {/* Subcategories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {subcategories.map((subcategory) => (
              <Link key={subcategory.name} href={subcategory.href}>
                <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm hover:shadow-lg">
                  <CardContent className="p-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                      <subcategory.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 mb-1">{subcategory.name}</h3>
                    <p className="text-xs text-slate-500">{subcategory.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search baby & kids..."
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
                value={selectedAgeRange}
                onChange={(e) => setSelectedAgeRange(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by age range"
                title="Filter by age range"
              >
                <option value="">All Ages</option>
                {ageRanges.map((ageRange) => (
                  <option key={ageRange} value={ageRange}>{ageRange}</option>
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
          {babyKidsProducts.map((product) => (
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
                    product.badge === 'Organic' ? 'badge-new' :
                    product.badge === 'Educational' ? 'badge-featured' :
                    product.badge === 'Pack of 3' ? 'badge-new' :
                    product.badge === 'Learning' ? 'badge-featured' :
                    product.badge === 'Creative' ? 'badge-featured' :
                    product.badge === 'Comfort' ? 'badge-new' :
                    product.badge === 'Safety' ? 'badge-featured' :
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
                  <div><span className="font-medium">Age Range:</span> {product.ageRange}</div>
                  {product.size && <div><span className="font-medium">Size:</span> {product.size}</div>}
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
            Load More Baby & Kids Items
          </Button>
        </div>
      </div>
    </div>
  )
}
