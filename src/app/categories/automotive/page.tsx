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
  Car,
  Wrench,
  Settings
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

const automotiveProducts: Product[] = [
  {
    id: '1',
    name: 'Brake Pad Set',
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.6,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'Brembo',
    category: 'Car Parts',
    compatibility: 'Honda Civic',
    material: 'Ceramic'
  },
  {
    id: '2',
    name: 'Oil Filter',
    price: 15,
    originalPrice: 25,
    discount: 40,
    rating: 4.5,
    reviews: 189,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Mann-Filter',
    category: 'Car Parts',
    compatibility: 'Toyota Camry',
    material: 'Synthetic'
  },
  {
    id: '3',
    name: 'Socket Wrench Set',
    price: 79,
    originalPrice: 119,
    discount: 34,
    rating: 4.7,
    reviews: 456,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Craftsman',
    category: 'Tools',
    compatibility: 'Universal',
    material: 'Chrome Vanadium'
  },
  {
    id: '4',
    name: 'Car Phone Mount',
    price: 29,
    originalPrice: 49,
    discount: 41,
    rating: 4.4,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'iOttie',
    category: 'Car Accessories',
    compatibility: 'Universal',
    material: 'Plastic'
  },
  {
    id: '5',
    name: 'Air Filter',
    price: 35,
    originalPrice: 55,
    discount: 36,
    rating: 4.6,
    reviews: 345,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    brand: 'K&N',
    category: 'Car Parts',
    compatibility: 'Ford F-150',
    material: 'Cotton Gauze'
  },
  {
    id: '6',
    name: 'Torque Wrench',
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.8,
    reviews: 278,
    image: '/api/placeholder/300/300',
    brand: 'Tekton',
    category: 'Tools',
    compatibility: 'Universal',
    material: 'Steel'
  },
  {
    id: '7',
    name: 'Dash Cam',
    price: 199,
    originalPrice: 299,
    discount: 33,
    rating: 4.7,
    reviews: 123,
    image: '/api/placeholder/300/300',
    badge: 'Featured',
    brand: 'Garmin',
    category: 'Car Accessories',
    compatibility: 'Universal',
    material: 'Plastic'
  },
  {
    id: '8',
    name: 'Spark Plugs Set',
    price: 45,
    originalPrice: 65,
    discount: 31,
    rating: 4.5,
    reviews: 789,
    image: '/api/placeholder/300/300',
    brand: 'NGK',
    category: 'Car Parts',
    compatibility: 'BMW 3 Series',
    material: 'Iridium'
  },
  {
    id: '9',
    name: 'Floor Jack',
    price: 129,
    originalPrice: 179,
    discount: 28,
    rating: 4.6,
    reviews: 456,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Torin',
    category: 'Tools',
    compatibility: 'Universal',
    material: 'Steel'
  },
  {
    id: '10',
    name: 'Car Seat Covers',
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.4,
    reviews: 234,
    image: '/api/placeholder/300/300',
    brand: 'Covercraft',
    category: 'Car Accessories',
    compatibility: 'Honda Accord',
    material: 'Neoprene'
  },
  {
    id: '11',
    name: 'Timing Belt Kit',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.7,
    reviews: 189,
    image: '/api/placeholder/300/300',
    brand: 'Gates',
    category: 'Car Parts',
    compatibility: 'Nissan Altima',
    material: 'Rubber'
  },
  {
    id: '12',
    name: 'Multimeter',
    price: 79,
    originalPrice: 119,
    discount: 34,
    rating: 4.5,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Tool',
    brand: 'Fluke',
    category: 'Tools',
    compatibility: 'Universal',
    material: 'Plastic'
  }
]

const subcategories = [
  { name: 'Car Parts', icon: Car, href: '/categories/car-parts', count: 156 },
  { name: 'Tools', icon: Wrench, href: '/categories/tools', count: 89 },
  { name: 'Car Accessories', icon: Settings, href: '/categories/car-accessories', count: 134 }
]

const brands = ['Brembo', 'Mann-Filter', 'Craftsman', 'iOttie', 'K&N', 'Tekton', 'Garmin', 'NGK', 'Torin', 'Covercraft', 'Gates', 'Fluke']
const categories = ['Car Parts', 'Tools', 'Car Accessories']
const materials = ['Ceramic', 'Synthetic', 'Chrome Vanadium', 'Plastic', 'Cotton Gauze', 'Steel', 'Iridium', 'Neoprene', 'Rubber']

export default function AutomotivePage() {
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
          <span className="text-slate-900">Automotive</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Automotive</h1>
              <p className="text-slate-600">Quality car parts, tools, and accessories for your vehicle</p>
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
                  placeholder="Search automotive..."
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
          {automotiveProducts.map((product) => (
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
                    product.badge === 'Popular' ? 'badge-new' :
                    product.badge === 'Featured' ? 'badge-featured' :
                    product.badge === 'Tool' ? 'badge-featured' :
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
            Load More Automotive Items
          </Button>
        </div>
      </div>
    </div>
  )
}
