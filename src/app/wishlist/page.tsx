'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Trash2, ShoppingCart, Eye, ShoppingBag } from 'lucide-react'

interface WishlistItem {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  discount?: number
  badge?: string
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true)
      try {
        // In a real app, this would fetch from user's wishlist API
        // For now, we'll use empty array since we removed dummy data
        setWishlistItems([])
      } finally {
        setLoading(false)
      }
    }
    loadWishlist()
  }, [])

  const removeFromWishlist = (id: string) => {
    setWishlistItems(items => items.filter(item => item.id !== id))
  }

  const moveAllToCart = () => {
    // In a real app, this would add all items to cart
    console.log('Moving all items to cart')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Home
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-900">Wishlist</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Wishlist ({wishlistItems.length})</h1>
          <Button onClick={moveAllToCart} className="btn-primary">
            Move All To Bag
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-600">Loading...</div>
        ) : wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-slate-500 mb-6">Save items you love for later</p>
              <Button asChild>
                <Link href="/categories">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="relative">
                  <div className="aspect-square bg-slate-100 rounded-t-lg flex items-center justify-center">
                    <div className="w-32 h-32 bg-slate-300 rounded-lg"></div>
                  </div>
                  {item.discount && (
                    <Badge className="absolute top-2 left-2 badge-discount">
                      -{item.discount}%
                    </Badge>
                  )}
                  {item.badge && (
                    <Badge className="absolute top-2 left-2 badge-new">
                      {item.badge}
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white hover:bg-slate-100"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-slate-600">({item.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-primary">${item.price}</span>
                    <span className="text-sm text-slate-500 line-through">
                      ${item.originalPrice}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full btn-primary">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                        </Button>
                    <Button variant="outline" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      Quick View
                    </Button>
                </div>
              </CardContent>
            </Card>
            ))}
                      </div>
        )}

        {/* Recommendations - Load from API when wishlist is empty */}
        {!loading && wishlistItems.length === 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You might also like</h2>
            <div className="text-center py-12 text-slate-600">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>Start shopping to see recommendations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}