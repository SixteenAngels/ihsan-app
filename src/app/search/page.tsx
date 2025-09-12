'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Grid3X3, 
  List,
  Star,
  Truck,
  Package,
  ArrowUpDown,
  X
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  category: string
  brand: string
  inStock: boolean
  isReadyNow: boolean
  isGroupBuy: boolean
  groupBuyDiscount?: number
  shippingMethod: 'air' | 'sea' | 'both'
}

interface FilterOptions {
  category: string
  brand: string
  priceRange: string
  rating: string
  shipping: string
  availability: string
  sortBy: string
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 899.99,
    originalPrice: 999.99,
    image: '/api/placeholder/200/200',
    rating: 4.8,
    reviewCount: 124,
    category: 'Electronics',
    brand: 'Samsung',
    inStock: true,
    isReadyNow: true,
    isGroupBuy: false,
    shippingMethod: 'both'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 1199.99,
    image: '/api/placeholder/200/200',
    rating: 4.9,
    reviewCount: 89,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    isReadyNow: false,
    isGroupBuy: true,
    groupBuyDiscount: 15,
    shippingMethod: 'air'
  },
  {
    id: '3',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    price: 1999.99,
    image: '/api/placeholder/200/200',
    rating: 4.7,
    reviewCount: 67,
    category: 'Electronics',
    brand: 'Apple',
    inStock: true,
    isReadyNow: false,
    isGroupBuy: false,
    shippingMethod: 'sea'
  },
  {
    id: '4',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    price: 149.99,
    originalPrice: 179.99,
    image: '/api/placeholder/200/200',
    rating: 4.5,
    reviewCount: 234,
    category: 'Fashion',
    brand: 'Nike',
    inStock: true,
    isReadyNow: true,
    isGroupBuy: false,
    shippingMethod: 'both'
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    price: 189.99,
    image: '/api/placeholder/200/200',
    rating: 4.6,
    reviewCount: 156,
    category: 'Fashion',
    brand: 'Adidas',
    inStock: true,
    isReadyNow: true,
    isGroupBuy: true,
    groupBuyDiscount: 20,
    shippingMethod: 'both'
  }
]

const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Beauty']
const brands = ['All', 'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'LG']
const priceRanges = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under GH₵100', value: '0-100' },
  { label: 'GH₵100 - GH₵500', value: '100-500' },
  { label: 'GH₵500 - GH₵1000', value: '500-1000' },
  { label: 'Over GH₵1000', value: '1000+' }
]

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    brand: 'All',
    priceRange: 'all',
    rating: 'all',
    shipping: 'all',
    availability: 'all',
    sortBy: 'relevance'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    applyFilters()
  }, [filters, searchQuery])

  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Brand filter
    if (filters.brand !== 'All') {
      filtered = filtered.filter(product => product.brand === filters.brand)
    }

    // Price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (filters.priceRange === '1000+') {
          return product.price >= 1000
        }
        return product.price >= min && product.price <= max
      })
    }

    // Rating filter
    if (filters.rating !== 'all') {
      const minRating = Number(filters.rating)
      filtered = filtered.filter(product => product.rating >= minRating)
    }

    // Shipping filter
    if (filters.shipping !== 'all') {
      filtered = filtered.filter(product => 
        product.shippingMethod === filters.shipping || product.shippingMethod === 'both'
      )
    }

    // Availability filter
    if (filters.availability === 'ready-now') {
      filtered = filtered.filter(product => product.isReadyNow)
    } else if (filters.availability === 'group-buy') {
      filtered = filtered.filter(product => product.isGroupBuy)
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id))
        break
      default:
        // Relevance (default)
        break
    }

    setFilteredProducts(filtered)
  }

  const clearFilters = () => {
    setFilters({
      category: 'All',
      brand: 'All',
      priceRange: 'all',
      rating: 'all',
      shipping: 'all',
      availability: 'all',
      sortBy: 'relevance'
    })
  }

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== 'All' && value !== 'all' && value !== 'relevance'
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Search Products</h1>
          <p className="text-gray-600 mt-2">Find exactly what you&apos;re looking for</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search for products, brands, or categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category */}
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Brand */}
                  <div>
                    <Label className="text-sm font-medium">Brand</Label>
                    <Select value={filters.brand} onValueChange={(value) => setFilters(prev => ({ ...prev, brand: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map(brand => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium">Price Range</Label>
                    <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceRanges.map(range => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rating */}
                  <div>
                    <Label className="text-sm font-medium">Minimum Rating</Label>
                    <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Shipping */}
                  <div>
                    <Label className="text-sm font-medium">Shipping Method</Label>
                    <Select value={filters.shipping} onValueChange={(value) => setFilters(prev => ({ ...prev, shipping: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="air">Air Shipping</SelectItem>
                        <SelectItem value="sea">Sea Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Availability */}
                  <div>
                    <Label className="text-sm font-medium">Availability</Label>
                    <Select value={filters.availability} onValueChange={(value) => setFilters(prev => ({ ...prev, availability: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Products</SelectItem>
                        <SelectItem value="ready-now">Ready Now</SelectItem>
                        <SelectItem value="group-buy">Group Buy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredProducts.length} products found
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Results for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.slug}`}>
                      <CardContent className="p-4">
                        <div className={`flex gap-4 ${viewMode === 'list' ? 'items-center' : 'flex-col'}`}>
                          <div className={`relative ${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'}`}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md"
                            />
                            {product.isReadyNow && (
                              <Badge className="absolute top-2 left-2 bg-green-500">
                                <Truck className="w-3 h-3 mr-1" />
                                Ready Now
                              </Badge>
                            )}
                            {product.isGroupBuy && (
                              <Badge className="absolute top-2 right-2 bg-blue-500">
                                <Package className="w-3 h-3 mr-1" />
                                Group Buy
                              </Badge>
                            )}
                          </div>
                          <div className={`flex-1 ${viewMode === 'list' ? 'ml-4' : 'mt-4'}`}>
                            <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 ml-1">
                                  {product.rating} ({product.reviewCount})
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <span className="text-lg font-semibold text-gray-900">
                                GH₵{product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  GH₵{product.originalPrice.toFixed(2)}
                                </span>
                              )}
                              {product.groupBuyDiscount && (
                                <Badge variant="secondary">
                                  {product.groupBuyDiscount}% off
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
