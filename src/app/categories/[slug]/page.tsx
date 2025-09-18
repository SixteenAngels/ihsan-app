'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  ShoppingCart, 
  Heart,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  isReadyNow: boolean
  isGroupBuy: boolean
  discount?: number
  vendor: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  icon: string
  children: Category[]
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string
  
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState('all')

  useEffect(() => {
    const fetchCategoryData = async () => {
      setIsLoading(true)
      try {
        const [categoryRes, productsRes] = await Promise.all([
          fetch('/api/categories/all'),
          fetch(`/api/products?category=${slug}&limit=20`)
        ])
        
        const categoryData = await categoryRes.json()
        const productsData = await productsRes.json()
        
        if (categoryData.success) {
          const foundCategory = categoryData.data.find((cat: Category) => cat.slug === slug)
          setCategory(foundCategory || null)
        }

        if (productsData.products) {
          setProducts(productsData.products)
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategoryData()
  }, [slug])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = priceRange === 'all' || 
      (priceRange === 'under-100' && product.price < 100) ||
      (priceRange === '100-500' && product.price >= 100 && product.price <= 500) ||
      (priceRange === '500-1000' && product.price >= 500 && product.price <= 1000) ||
      (priceRange === 'over-1000' && product.price > 1000)
    
    return matchesSearch && matchesPrice
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'newest':
        return b.id.localeCompare(a.id)
      default:
        return b.rating - a.rating // popular
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading category...</span>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slideInFromLeft}
            className="flex items-center space-x-4 mb-6"
          >
            <Button variant="ghost" size="icon" asChild>
              <Link href="/categories">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="text-4xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-100">Under GHS 100</SelectItem>
                  <SelectItem value="100-500">GHS 100 - 500</SelectItem>
                  <SelectItem value="500-1000">GHS 500 - 1000</SelectItem>
                  <SelectItem value="over-1000">Over GHS 1000</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}
        >
          {sortedProducts.map((product) => (
            <motion.div key={product.id} variants={staggerItem}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.isReadyNow && (
                      <Badge className="bg-green-500">Ready Now</Badge>
                    )}
                    {product.isGroupBuy && (
                      <Badge variant="secondary">Group Buy</Badge>
                    )}
                    {product.discount && (
                      <Badge variant="destructive">-{product.discount}%</Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold">GHS {product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        GHS {product.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{product.vendor}</p>

                  <Button className="w-full" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setPriceRange('all')
              setSortBy('popular')
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

