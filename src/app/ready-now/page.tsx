'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, ShoppingCart, Heart, Zap, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Mock data for Ready Now products
const readyNowProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    price: 4500,
    comparePrice: 5000,
    images: ['/api/placeholder/300/300'],
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 124,
    stock: 10,
    deliveryTime: '24-48 hours'
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    price: 350,
    comparePrice: 400,
    images: ['/api/placeholder/300/300'],
    category: 'Fashion',
    rating: 4.6,
    reviewCount: 89,
    stock: 25,
    deliveryTime: '24 hours'
  },
  {
    id: '3',
    name: 'Ghana Made Shea Butter',
    slug: 'ghana-shea-butter',
    price: 25,
    comparePrice: 30,
    images: ['/api/placeholder/300/300'],
    category: 'Beauty',
    rating: 4.9,
    reviewCount: 156,
    stock: 100,
    deliveryTime: '24 hours'
  },
  {
    id: '5',
    name: 'Adidas Ultraboost 22',
    slug: 'adidas-ultraboost-22',
    price: 280,
    comparePrice: 320,
    images: ['/api/placeholder/300/300'],
    category: 'Fashion',
    rating: 4.5,
    reviewCount: 43,
    stock: 15,
    deliveryTime: '48 hours'
  },
  {
    id: '6',
    name: 'Organic Coconut Oil',
    slug: 'organic-coconut-oil',
    price: 18,
    comparePrice: 22,
    images: ['/api/placeholder/300/300'],
    category: 'Beauty',
    rating: 4.8,
    reviewCount: 92,
    stock: 200,
    deliveryTime: '24 hours'
  },
  {
    id: '7',
    name: 'MacBook Air M2',
    slug: 'macbook-air-m2',
    price: 3200,
    comparePrice: 3500,
    images: ['/api/placeholder/300/300'],
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 78,
    stock: 3,
    deliveryTime: '48 hours'
  }
]

export default function ReadyNowPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ready Now</h1>
              <p className="text-muted-foreground">
                Ghana-stocked products delivered within 24-48 hours
              </p>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Fast Delivery Guarantee</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              All Ready Now products are stocked in Ghana and delivered within 24-48 hours to major cities.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{readyNowProducts.length}</div>
              <div className="text-sm text-muted-foreground">Ready Now Products</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">24-48h</div>
              <div className="text-sm text-muted-foreground">Delivery Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">Ghana</div>
              <div className="text-sm text-muted-foreground">Stocked Locally</div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {readyNowProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <Link href={`/products/${product.slug}`}>
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Ready Now Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-500 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Ready Now
                    </Badge>
                  </div>

                  {/* Delivery Time Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-white/90 text-black">
                      {product.deliveryTime}
                    </Badge>
                  </div>

                  {/* Wishlist Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Need Something Else?</h2>
            <p className="text-muted-foreground mb-6">
              Browse our full catalog with Air and Sea shipping options
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/categories">
                  View All Products
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/group-buy">
                  Join Group Buys
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
