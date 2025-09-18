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
  Shirt
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
  size: string
  color: string
  material: string
}

const mensClothingProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    price: 29,
    originalPrice: 39,
    discount: 26,
    rating: 4.5,
    reviews: 1247,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'Nike',
    size: 'M',
    color: 'White',
    material: 'Cotton'
  },
  {
    id: '2',
    name: 'Denim Jeans',
    price: 79,
    originalPrice: 99,
    discount: 20,
    rating: 4.6,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Classic',
    brand: 'Levi\'s',
    size: '32',
    color: 'Blue',
    material: 'Denim'
  },
  {
    id: '3',
    name: 'Leather Jacket',
    price: 199,
    originalPrice: 299,
    discount: 33,
    rating: 4.6,
    reviews: 1876,
    image: '/api/placeholder/300/300',
    badge: 'Premium',
    brand: 'AllSaints',
    size: 'L',
    color: 'Brown',
    material: 'Leather'
  },
  {
    id: '4',
    name: 'Wool Sweater',
    price: 79,
    originalPrice: 109,
    discount: 28,
    rating: 4.7,
    reviews: 345,
    image: '/api/placeholder/300/300',
    brand: 'Uniqlo',
    size: 'L',
    color: 'Gray',
    material: 'Wool'
  },
  {
    id: '5',
    name: 'Athletic Shorts',
    price: 25,
    originalPrice: 35,
    discount: 29,
    rating: 4.2,
    reviews: 789,
    image: '/api/placeholder/300/300',
    brand: 'Under Armour',
    size: 'M',
    color: 'Black',
    material: 'Polyester'
  },
  {
    id: '6',
    name: 'Dress Shirt',
    price: 59,
    originalPrice: 79,
    discount: 25,
    rating: 4.4,
    reviews: 423,
    image: '/api/placeholder/300/300',
    badge: 'Formal',
    brand: 'Brooks Brothers',
    size: '16',
    color: 'White',
    material: 'Cotton'
  },
  {
    id: '7',
    name: 'Hoodie',
    price: 69,
    originalPrice: 89,
    discount: 22,
    rating: 4.5,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Champion',
    size: 'L',
    color: 'Navy',
    material: 'Cotton Blend'
  },
  {
    id: '8',
    name: 'Chino Pants',
    price: 49,
    originalPrice: 69,
    discount: 29,
    rating: 4.3,
    reviews: 567,
    image: '/api/placeholder/300/300',
    brand: 'Banana Republic',
    size: '32',
    color: 'Khaki',
    material: 'Cotton'
  },
  {
    id: '9',
    name: 'Polo Shirt',
    price: 39,
    originalPrice: 55,
    discount: 29,
    rating: 4.6,
    reviews: 987,
    image: '/api/placeholder/300/300',
    badge: 'Casual',
    brand: 'Ralph Lauren',
    size: 'M',
    color: 'Blue',
    material: 'Cotton'
  },
  {
    id: '10',
    name: 'Blazer',
    price: 149,
    originalPrice: 199,
    discount: 25,
    rating: 4.7,
    reviews: 234,
    image: '/api/placeholder/300/300',
    badge: 'Business',
    brand: 'Hugo Boss',
    size: '40R',
    color: 'Navy',
    material: 'Wool Blend'
  },
  {
    id: '11',
    name: 'Cargo Pants',
    price: 45,
    originalPrice: 65,
    discount: 31,
    rating: 4.4,
    reviews: 456,
    image: '/api/placeholder/300/300',
    brand: 'Carhartt',
    size: '32',
    color: 'Olive',
    material: 'Cotton Canvas'
  },
  {
    id: '12',
    name: 'Henley Shirt',
    price: 35,
    originalPrice: 49,
    discount: 29,
    rating: 4.5,
    reviews: 678,
    image: '/api/placeholder/300/300',
    brand: 'J.Crew',
    size: 'M',
    color: 'Heather Gray',
    material: 'Cotton'
  }
]

const brands = ['Nike', 'Levi\'s', 'AllSaints', 'Uniqlo', 'Under Armour', 'Brooks Brothers', 'Champion', 'Banana Republic', 'Ralph Lauren', 'Hugo Boss', 'Carhartt', 'J.Crew']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40', '42', '14', '15', '16', '17', '40R', '42R', '44R']
const colors = ['Black', 'White', 'Blue', 'Gray', 'Brown', 'Navy', 'Khaki', 'Olive', 'Heather Gray']
const materials = ['Cotton', 'Denim', 'Leather', 'Wool', 'Polyester', 'Cotton Blend', 'Wool Blend', 'Cotton Canvas']

export default function MensClothingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
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
          <Link href="/categories/fashion" className="text-slate-500 hover:text-slate-700">
            Fashion
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Men's Clothing</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Men's Clothing</h1>
              <p className="text-slate-600">Stylish and comfortable clothing for the modern man</p>
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
                  placeholder="Search men's clothing..."
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
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by size"
                title="Filter by size"
              >
                <option value="">All Sizes</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
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
          {mensClothingProducts.map((product) => (
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
                    product.badge === 'Classic' ? 'badge-featured' :
                    product.badge === 'Premium' ? 'badge-featured' :
                    product.badge === 'Formal' ? 'badge-featured' :
                    product.badge === 'Casual' ? 'badge-new' :
                    product.badge === 'Business' ? 'badge-featured' :
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
                  <div><span className="font-medium">Size:</span> {product.size} | <span className="font-medium">Color:</span> {product.color}</div>
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
            Load More Men's Clothing
          </Button>
        </div>
      </div>
    </div>
  )
}
