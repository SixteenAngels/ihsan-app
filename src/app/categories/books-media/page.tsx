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
  BookOpen,
  Music,
  Film
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
  format: string
  author?: string
  artist?: string
}

const booksMediaProducts: Product[] = [
  {
    id: '1',
    name: 'The Psychology of Money',
    price: 15,
    originalPrice: 20,
    discount: 25,
    rating: 4.7,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    badge: 'Best Seller',
    brand: 'Harriman House',
    category: 'Books',
    format: 'Paperback',
    author: 'Morgan Housel'
  },
  {
    id: '2',
    name: 'Atomic Habits',
    price: 18,
    originalPrice: 25,
    discount: 28,
    rating: 4.8,
    reviews: 2156,
    image: '/api/placeholder/300/300',
    badge: 'Hot',
    brand: 'Avery',
    category: 'Books',
    format: 'Hardcover',
    author: 'James Clear'
  },
  {
    id: '3',
    name: '1984',
    price: 12,
    originalPrice: 16,
    discount: 25,
    rating: 4.6,
    reviews: 3456,
    image: '/api/placeholder/300/300',
    brand: 'Signet Classics',
    category: 'Books',
    format: 'Paperback',
    author: 'George Orwell'
  },
  {
    id: '4',
    name: 'The Great Gatsby',
    price: 10,
    originalPrice: 14,
    discount: 29,
    rating: 4.5,
    reviews: 2789,
    image: '/api/placeholder/300/300',
    brand: 'Scribner',
    category: 'Books',
    format: 'Paperback',
    author: 'F. Scott Fitzgerald'
  },
  {
    id: '5',
    name: 'Abbey Road Vinyl',
    price: 35,
    originalPrice: 45,
    discount: 22,
    rating: 4.9,
    reviews: 567,
    image: '/api/placeholder/300/300',
    badge: 'Classic',
    brand: 'Apple Records',
    category: 'Music',
    format: 'Vinyl',
    artist: 'The Beatles'
  },
  {
    id: '6',
    name: 'Thriller CD',
    price: 12,
    originalPrice: 18,
    discount: 33,
    rating: 4.8,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Epic Records',
    category: 'Music',
    format: 'CD',
    artist: 'Michael Jackson'
  },
  {
    id: '7',
    name: 'The Dark Knight Blu-ray',
    price: 15,
    originalPrice: 25,
    discount: 40,
    rating: 4.9,
    reviews: 3456,
    image: '/api/placeholder/300/300',
    badge: 'Featured',
    brand: 'Warner Bros',
    category: 'Movies',
    format: 'Blu-ray'
  },
  {
    id: '8',
    name: 'Inception DVD',
    price: 8,
    originalPrice: 15,
    discount: 47,
    rating: 4.7,
    reviews: 2789,
    image: '/api/placeholder/300/300',
    brand: 'Warner Bros',
    category: 'Movies',
    format: 'DVD'
  },
  {
    id: '9',
    name: 'Harry Potter Complete Set',
    price: 89,
    originalPrice: 120,
    discount: 26,
    rating: 4.9,
    reviews: 4567,
    image: '/api/placeholder/300/300',
    badge: 'Collection',
    brand: 'Bloomsbury',
    category: 'Books',
    format: 'Box Set',
    author: 'J.K. Rowling'
  },
  {
    id: '10',
    name: 'Bohemian Rhapsody Vinyl',
    price: 28,
    originalPrice: 35,
    discount: 20,
    rating: 4.8,
    reviews: 1234,
    image: '/api/placeholder/300/300',
    brand: 'Hollywood Records',
    category: 'Music',
    format: 'Vinyl',
    artist: 'Queen'
  },
  {
    id: '11',
    name: 'The Matrix Trilogy',
    price: 25,
    originalPrice: 40,
    discount: 38,
    rating: 4.6,
    reviews: 1890,
    image: '/api/placeholder/300/300',
    badge: 'Trilogy',
    brand: 'Warner Bros',
    category: 'Movies',
    format: 'Blu-ray Collection'
  },
  {
    id: '12',
    name: 'Sapiens Digital',
    price: 12,
    originalPrice: 18,
    discount: 33,
    rating: 4.7,
    reviews: 2345,
    image: '/api/placeholder/300/300',
    brand: 'Harper',
    category: 'Books',
    format: 'eBook',
    author: 'Yuval Noah Harari'
  }
]

const subcategories = [
  { name: 'Books', icon: BookOpen, href: '/categories/books', count: 1234 },
  { name: 'Music', icon: Music, href: '/categories/music', count: 567 },
  { name: 'Movies & TV', icon: Film, href: '/categories/movies', count: 890 }
]

const brands = ['Harriman House', 'Avery', 'Signet Classics', 'Scribner', 'Apple Records', 'Epic Records', 'Warner Bros', 'Hollywood Records', 'Bloomsbury', 'Harper']
const categories = ['Books', 'Music', 'Movies']
const formats = ['Paperback', 'Hardcover', 'eBook', 'Vinyl', 'CD', 'DVD', 'Blu-ray', 'Box Set', 'Collection']

export default function BooksMediaPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Books & Media</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Books & Media</h1>
              <p className="text-slate-600">Discover books, music, movies, and digital media</p>
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
                  placeholder="Search books & media..."
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
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
                aria-label="Filter by format"
                title="Filter by format"
              >
                <option value="">All Formats</option>
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
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
          {booksMediaProducts.map((product) => (
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
                    product.badge === 'Featured' ? 'badge-featured' :
                    product.badge === 'Collection' ? 'badge-featured' :
                    product.badge === 'Trilogy' ? 'badge-featured' :
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
                  <div><span className="font-medium">Format:</span> {product.format}</div>
                  {product.author && <div><span className="font-medium">Author:</span> {product.author}</div>}
                  {product.artist && <div><span className="font-medium">Artist:</span> {product.artist}</div>}
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
            Load More Books & Media
          </Button>
        </div>
      </div>
    </div>
  )
}
