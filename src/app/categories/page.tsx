'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Grid3X3, 
  List, 
  ArrowRight,
  Loader2,
  Star
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  icon: string
  type: string
  is_active: boolean
  sort_order: number
  children: Category[]
}

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
  category: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          fetch('/api/categories/all'),
          fetch('/api/products?limit=6&featured=true')
        ])
        
        const categoriesData = await categoriesRes.json()
        const productsData = await productsRes.json()
        
        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
        
        if (productsData.products) {
          setFeaturedProducts(productsData.products)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading categories...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slideInFromLeft}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">Shop by Category</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover products across all categories. Find exactly what you're looking for.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-8"
          >
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
          </motion.div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {filteredCategories.map((category) => (
            <motion.div key={category.id} variants={staggerItem}>
              <Link href={`/categories/${category.slug}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    {category.children && category.children.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-2">
                          {category.children.length} subcategories
                        </p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {category.children.slice(0, 3).map((child) => (
                            <Badge key={child.id} variant="secondary" className="text-xs">
                              {child.name}
                            </Badge>
                          ))}
                          {category.children.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.children.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    <Button variant="outline" className="w-full">
                      Explore Category
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No categories found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search term
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">
              Check out our most popular items across all categories
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-muted relative">
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {product.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      {product.isReadyNow && (
                        <Badge className="bg-green-500 text-xs">Ready Now</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
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
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">GHS {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          GHS {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}