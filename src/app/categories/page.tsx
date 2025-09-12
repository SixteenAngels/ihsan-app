'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Zap, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock data - in real app this would come from API
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    price: 4500,
    comparePrice: 5000,
    images: ['/api/placeholder/300/300'],
    category: 'Electronics',
    isReadyNow: true,
    isGroupBuy: false,
    rating: 4.8,
    reviewCount: 124,
    stock: 10
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    price: 350,
    comparePrice: 400,
    images: ['/api/placeholder/300/300'],
    category: 'Fashion',
    isReadyNow: true,
    isGroupBuy: false,
    rating: 4.6,
    reviewCount: 89,
    stock: 25
  },
  {
    id: '3',
    name: 'Ghana Made Shea Butter',
    slug: 'ghana-shea-butter',
    price: 25,
    comparePrice: 30,
    images: ['/api/placeholder/300/300'],
    category: 'Beauty',
    isReadyNow: true,
    isGroupBuy: true,
    rating: 4.9,
    reviewCount: 156,
    stock: 100
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    price: 3800,
    comparePrice: 4200,
    images: ['/api/placeholder/300/300'],
    category: 'Electronics',
    isReadyNow: false,
    isGroupBuy: false,
    rating: 4.7,
    reviewCount: 67,
    stock: 5
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    price: 280,
    comparePrice: 320,
    images: ['/api/placeholder/300/300'],
    category: 'Fashion',
    isReadyNow: true,
    isGroupBuy: false,
    rating: 4.5,
    reviewCount: 43,
    stock: 15
  },
  {
    id: '6',
    name: 'Organic Coconut Oil',
    slug: 'organic-coconut-oil',
    price: 18,
    comparePrice: 22,
    images: ['/api/placeholder/300/300'],
    category: 'Beauty',
    isReadyNow: true,
    isGroupBuy: true,
    rating: 4.8,
    reviewCount: 92,
    stock: 200
  }
]

const categories = [
  { name: 'All', slug: 'all', count: mockProducts.length },
  { name: 'Fashion', slug: 'fashion', count: 2 },
  { name: 'Electronics', slug: 'electronics', count: 2 },
  { name: 'Beauty', slug: 'beauty', count: 2 },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop by Category</h1>
          <p className="text-muted-foreground">
            Discover products across all categories
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.slug}
                variant={category.slug === 'all' ? 'default' : 'outline'}
                size="sm"
                asChild
              >
                <Link href={`/categories/${category.slug}`}>
                  {category.name} ({category.count})
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.slug}`}>
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isReadyNow && (
                      <Badge className="bg-green-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Ready Now
                      </Badge>
                    )}
                    {product.isGroupBuy && (
                      <Badge className="bg-blue-500 text-white">
                        <Users className="h-3 w-3 mr-1" />
                        Group Buy
                      </Badge>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault()
                      // Handle wishlist
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>

                  {/* Stock Indicator */}
                  {product.stock < 10 && (
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="destructive" className="text-xs">
                        Only {product.stock} left
                      </Badge>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{product.category}</span>
                  </div>
                  
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/products/${product.slug}`}>
                      {product.name}
                    </Link>
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
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
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                    {product.comparePrice && (
                      <span className="text-sm text-green-600 font-medium">
                        {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% off
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button className="w-full" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  )
}
