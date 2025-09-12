'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Truck,
  Package,
  Share2,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface WishlistItem {
  id: string
  productId: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviewCount: number
  brand: string
  inStock: boolean
  isReadyNow: boolean
  isGroupBuy: boolean
  groupBuyDiscount?: number
  addedAt: string
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    productId: 'prod-1',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 899.99,
    originalPrice: 999.99,
    image: '/api/placeholder/200/200',
    rating: 4.8,
    reviewCount: 124,
    brand: 'Samsung',
    inStock: true,
    isReadyNow: true,
    isGroupBuy: false,
    addedAt: '2024-01-10T10:30:00Z'
  },
  {
    id: '2',
    productId: 'prod-2',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 1199.99,
    image: '/api/placeholder/200/200',
    rating: 4.9,
    reviewCount: 89,
    brand: 'Apple',
    inStock: true,
    isReadyNow: false,
    isGroupBuy: true,
    groupBuyDiscount: 15,
    addedAt: '2024-01-08T14:20:00Z'
  },
  {
    id: '3',
    productId: 'prod-3',
    name: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    price: 149.99,
    originalPrice: 179.99,
    image: '/api/placeholder/200/200',
    rating: 4.5,
    reviewCount: 234,
    brand: 'Nike',
    inStock: false,
    isReadyNow: true,
    isGroupBuy: false,
    addedAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '4',
    productId: 'prod-4',
    name: 'MacBook Pro M3',
    slug: 'macbook-pro-m3',
    price: 1999.99,
    image: '/api/placeholder/200/200',
    rating: 4.7,
    reviewCount: 67,
    brand: 'Apple',
    inStock: true,
    isReadyNow: false,
    isGroupBuy: false,
    addedAt: '2024-01-03T16:45:00Z'
  }
]

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(mockWishlistItems)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
    setSelectedItems(prev => prev.filter(id => id !== itemId))
  }

  const removeSelectedItems = () => {
    setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const selectAllItems = () => {
    setSelectedItems(wishlistItems.map(item => item.id))
  }

  const addToCart = (item: WishlistItem) => {
    // Simulate adding to cart
    console.log('Added to cart:', item.name)
    // In a real app, this would call an API to add the item to cart
  }

  const addSelectedToCart = () => {
    const selectedItemsData = wishlistItems.filter(item => selectedItems.includes(item.id))
    selectedItemsData.forEach(item => addToCart(item))
    // Remove selected items from wishlist after adding to cart
    setWishlistItems(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  const shareWishlist = () => {
    // Simulate sharing functionality
    console.log('Sharing wishlist...')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Actions Bar */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === wishlistItems.length && wishlistItems.length > 0}
                        onChange={selectAllItems}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-600">
                        Select All ({selectedItems.length} selected)
                      </span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedItems.length > 0 && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={addSelectedToCart}
                          disabled={selectedItems.some(id => 
                            !wishlistItems.find(item => item.id === id)?.inStock
                          )}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add Selected to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={removeSelectedItems}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Selected
                        </Button>
                      </>
                    )}
                    <Button variant="outline" size="sm" onClick={shareWishlist}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Wishlist
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex items-start pt-1">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-300"
                        />
                      </div>

                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Link href={`/products/${item.slug}`}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </Link>
                        {item.isReadyNow && (
                          <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                            <Truck className="w-3 h-3 mr-1" />
                            Ready Now
                          </Badge>
                        )}
                        {item.isGroupBuy && (
                          <Badge className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs">
                            <Package className="w-3 h-3 mr-1" />
                            Group Buy
                          </Badge>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`}>
                          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{item.brand}</p>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {item.rating} ({item.reviewCount})
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-3">
                          <span className="text-lg font-semibold text-gray-900">
                            GH₵{item.price.toFixed(2)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              GH₵{item.originalPrice.toFixed(2)}
                            </span>
                          )}
                          {item.groupBuyDiscount && (
                            <Badge variant="secondary">
                              {item.groupBuyDiscount}% off
                            </Badge>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="mt-3">
                          {item.inStock ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              Out of Stock
                            </Badge>
                          )}
                        </div>

                        {/* Added Date */}
                        <p className="text-xs text-gray-500 mt-2">
                          Added on {formatDate(item.addedAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => addToCart(item)}
                          disabled={!item.inStock}
                          className="whitespace-nowrap"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromWishlist(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/products/${item.slug}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">Wishlist Summary</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {wishlistItems.length} items • Total value: GH₵{wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={shareWishlist}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Wishlist
                    </Button>
                    <Button 
                      onClick={addSelectedToCart}
                      disabled={selectedItems.length === 0 || selectedItems.some(id => 
                        !wishlistItems.find(item => item.id === id)?.inStock
                      )}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add Selected to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Empty State */
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Save items you love to your wishlist and come back to them later
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/categories">
                    Browse Products
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/ready-now">
                    Ready Now Items
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
