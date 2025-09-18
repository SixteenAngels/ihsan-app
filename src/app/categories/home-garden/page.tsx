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
  Home,
  Sofa,
  Utensils,
  TreePine
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
  color: string
}

const homeGardenProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sectional Sofa',
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.6,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'West Elm',
    category: 'Furniture',
    material: 'Fabric',
    color: 'Gray'
  },
  {
    id: '2',
    name: 'Wooden Dining Table',
    price: 599,
    originalPrice: 799,
    discount: 25,
    rating: 4.5,
    reviews: 189,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'IKEA',
    category: 'Furniture',
    material: 'Oak Wood',
    color: 'Natural'
  },
  {
    id: '3',
    name: 'Ceramic Dinnerware Set',
    price: 89,
    originalPrice: 129,
    discount: 31,
    rating: 4.7,
    reviews: 456,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Crate & Barrel',
    category: 'Kitchen',
    material: 'Ceramic',
    color: 'White'
  },
  {
    id: '4',
    name: 'Decorative Throw Pillows',
    price: 39,
    originalPrice: 59,
    discount: 34,
    rating: 4.4,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'Pottery Barn',
    category: 'Decor',
    material: 'Cotton',
    color: 'Navy Blue'
  },
  {
    id: '5',
    name: 'Garden Tool Set',
    price: 79,
    originalPrice: 99,
    discount: 20,
    rating: 4.6,
    reviews: 345,
    image: '/api/placeholder/300/300',
    badge: 'Popular',
    brand: 'Fiskars',
    category: 'Garden',
    material: 'Steel',
    color: 'Orange'
  },
  {
    id: '6',
    name: 'LED Floor Lamp',
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.5,
    reviews: 278,
    image: '/api/placeholder/300/300',
    brand: 'Target',
    category: 'Decor',
    material: 'Metal',
    color: 'Black'
  },
  {
    id: '7',
    name: 'Outdoor Patio Set',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    rating: 4.7,
    reviews: 123,
    image: '/api/placeholder/300/300',
    badge: 'Featured',
    brand: 'Wayfair',
    category: 'Garden',
    material: 'Wicker',
    color: 'Brown'
  },
  {
    id: '8',
    name: 'Kitchen Knife Set',
    price: 129,
    originalPrice: 179,
    discount: 28,
    rating: 4.8,
    reviews: 789,
    image: '/api/placeholder/300/300',
    brand: 'Zwilling',
    category: 'Kitchen',
    material: 'Stainless Steel',
    color: 'Silver'
  },
  {
    id: '9',
    name: 'Area Rug 8x10',
    price: 299,
    originalPrice: 399,
    discount: 25,
    rating: 4.4,
    reviews: 456,
    image: '/api/placeholder/300/300',
    brand: 'Ruggable',
    category: 'Decor',
    material: 'Wool',
    color: 'Beige'
  },
  {
    id: '10',
    name: 'Plant Pot Set',
    price: 49,
    originalPrice: 69,
    discount: 29,
    rating: 4.6,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'New',
    brand: 'Terrain',
    category: 'Garden',
    material: 'Ceramic',
    color: 'Terracotta'
  },
  {
    id: '11',
    name: 'Coffee Table',
    price: 399,
    originalPrice: 549,
    discount: 27,
    rating: 4.5,
    reviews: 189,
    image: '/api/placeholder/300/300',
    brand: 'CB2',
    category: 'Furniture',
    material: 'Glass & Wood',
    color: 'Walnut'
  },
  {
    id: '12',
    name: 'Cookware Set',
    price: 199,
    originalPrice: 279,
    discount: 29,
    rating: 4.7,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Kitchen',
    brand: 'All-Clad',
    category: 'Kitchen',
    material: 'Stainless Steel',
    color: 'Silver'
  }
]

const subcategories = [
  { name: 'Furniture', icon: Sofa, href: '/categories/furniture', count: 156 },
  { name: 'Home Decor', icon: Home, href: '/categories/decor', count: 234 },
  { name: 'Kitchen & Dining', icon: Utensils, href: '/categories/kitchen', count: 189 },
  { name: 'Garden & Outdoor', icon: TreePine, href: '/categories/garden', count: 123 }
]

const brands = ['West Elm', 'IKEA', 'Crate & Barrel', 'Pottery Barn', 'Fiskars', 'Target', 'Wayfair', 'Zwilling', 'Ruggable', 'Terrain', 'CB2', 'All-Clad']
const categories = ['Furniture', 'Decor', 'Kitchen', 'Garden']
const materials = ['Fabric', 'Wood', 'Ceramic', 'Cotton', 'Steel', 'Metal', 'Wicker', 'Stainless Steel', 'Wool', 'Glass']

export default function HomeGardenPage() {
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
          <span className="text-slate-900">Home & Garden</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Home & Garden</h1>
              <p className="text-slate-600">Transform your space with beautiful home and garden essentials</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                  placeholder="Search home & garden..."
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
          {homeGardenProducts.map((product) => (
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
                    product.badge === 'Kitchen' ? 'badge-featured' :
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
                  <span className="mr-2">{product.material}</span>
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
            Load More Home & Garden Items
          </Button>
        </div>
      </div>
    </div>
  )
}
