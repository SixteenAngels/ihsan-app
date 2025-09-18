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
  Wrench
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
  compatibility: string
  material: string
}

const carPartsProducts: Product[] = [
  {
    id: '1',
    name: 'Brake Pad Set',
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.6,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'Essential',
    brand: 'Brembo',
    category: 'Brakes',
    compatibility: 'Honda Civic 2016-2021',
    material: 'Ceramic'
  },
  {
    id: '2',
    name: 'Oil Filter',
    price: 12,
    originalPrice: 18,
    discount: 33,
    rating: 4.5,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'Mann-Filter',
    category: 'Engine',
    compatibility: 'Toyota Camry 2015-2020',
    material: 'Synthetic Fiber'
  },
  {
    id: '3',
    name: 'Air Filter',
    price: 25,
    originalPrice: 35,
    discount: 29,
    rating: 4.7,
    reviews: 345,
    image: '/api/placeholder/300/300',
    badge: 'Performance',
    brand: 'K&N',
    category: 'Engine',
    compatibility: 'Ford F-150 2017-2022',
    material: 'Cotton Gauze'
  },
  {
    id: '4',
    name: 'Spark Plugs Set',
    price: 45,
    originalPrice: 65,
    discount: 31,
    rating: 4.6,
    reviews: 189,
    image: '/api/placeholder/300/300',
    brand: 'NGK',
    category: 'Engine',
    compatibility: 'BMW 3 Series 2018-2023',
    material: 'Iridium'
  },
  {
    id: '5',
    name: 'Headlight Bulb',
    price: 35,
    originalPrice: 49,
    discount: 29,
    rating: 4.4,
    reviews: 267,
    image: '/api/placeholder/300/300',
    badge: 'LED',
    brand: 'Philips',
    category: 'Lighting',
    compatibility: 'Audi A4 2016-2021',
    material: 'LED'
  },
  {
    id: '6',
    name: 'Windshield Wiper Blades',
    price: 22,
    originalPrice: 32,
    discount: 31,
    rating: 4.5,
    reviews: 123,
    image: '/api/placeholder/300/300',
    brand: 'Bosch',
    category: 'Exterior',
    compatibility: 'Mercedes C-Class 2014-2021',
    material: 'Rubber'
  },
  {
    id: '7',
    name: 'Timing Belt Kit',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.8,
    reviews: 98,
    image: '/api/placeholder/300/300',
    badge: 'Critical',
    brand: 'Gates',
    category: 'Engine',
    compatibility: 'Volkswagen Jetta 2015-2019',
    material: 'Rubber/Steel'
  },
  {
    id: '8',
    name: 'Shock Absorber',
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.6,
    reviews: 178,
    image: '/api/placeholder/300/300',
    brand: 'Monroe',
    category: 'Suspension',
    compatibility: 'Nissan Altima 2013-2018',
    material: 'Steel/Hydraulic'
  },
  {
    id: '9',
    name: 'Alternator',
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.7,
    reviews: 67,
    image: '/api/placeholder/300/300',
    badge: 'Electrical',
    brand: 'Denso',
    category: 'Electrical',
    compatibility: 'Lexus ES 2016-2022',
    material: 'Steel/Copper'
  },
  {
    id: '10',
    name: 'Catalytic Converter',
    price: 399,
    originalPrice: 549,
    discount: 27,
    rating: 4.5,
    reviews: 145,
    image: '/api/placeholder/300/300',
    brand: 'MagnaFlow',
    category: 'Exhaust',
    compatibility: 'Chevrolet Silverado 2014-2018',
    material: 'Stainless Steel'
  },
  {
    id: '11',
    name: 'Radiator',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.6,
    reviews: 89,
    image: '/api/placeholder/300/300',
    badge: 'Cooling',
    brand: 'Spectra',
    category: 'Cooling',
    compatibility: 'Hyundai Sonata 2015-2019',
    material: 'Aluminum'
  },
  {
    id: '12',
    name: 'Fuel Pump',
    price: 179,
    originalPrice: 249,
    discount: 28,
    rating: 4.7,
    reviews: 234,
    image: '/api/placeholder/300/300',
    brand: 'Delphi',
    category: 'Fuel System',
    compatibility: 'Mazda CX-5 2017-2021',
    material: 'Plastic/Metal'
  }
]

const brands = ['Brembo', 'Mann-Filter', 'K&N', 'NGK', 'Philips', 'Bosch', 'Gates', 'Monroe', 'Denso', 'MagnaFlow', 'Spectra', 'Delphi']
const categories = ['Brakes', 'Engine', 'Lighting', 'Exterior', 'Suspension', 'Electrical', 'Exhaust', 'Cooling', 'Fuel System']
const materials = ['Ceramic', 'Synthetic Fiber', 'Cotton Gauze', 'Iridium', 'LED', 'Rubber', 'Rubber/Steel', 'Steel/Hydraulic', 'Steel/Copper', 'Stainless Steel', 'Aluminum', 'Plastic/Metal']

export default function CarPartsPage() {
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
          <Link href="/categories/automotive" className="text-slate-500 hover:text-slate-700">
            Automotive
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Car Parts</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Car Parts</h1>
              <p className="text-slate-600">Quality automotive parts and components for your vehicle</p>
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
                  placeholder="Search car parts..."
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
          {carPartsProducts.map((product) => (
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
                    product.badge === 'Essential' ? 'badge-featured' :
                    product.badge === 'Performance' ? 'badge-featured' :
                    product.badge === 'LED' ? 'badge-new' :
                    product.badge === 'Critical' ? 'badge-featured' :
                    product.badge === 'Electrical' ? 'badge-featured' :
                    product.badge === 'Cooling' ? 'badge-featured' :
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
                  <div><span className="font-medium">Compatibility:</span> {product.compatibility}</div>
                  <div><span className="font-medium">Material:</span> {product.material}</div>
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
            Load More Car Parts
          </Button>
        </div>
      </div>
    </div>
  )
}
