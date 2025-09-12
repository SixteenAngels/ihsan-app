'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, ShoppingCart, Heart, Share, Truck, Users, Zap, ArrowLeft } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'

// Mock product data - in real app this would come from API
const mockProduct = {
  id: '1',
  name: 'iPhone 15 Pro',
  slug: 'iphone-15-pro',
  description: 'The iPhone 15 Pro features a titanium design, advanced camera system, and the powerful A17 Pro chip. Experience the future of mobile technology with enhanced performance and stunning visuals.',
  shortDescription: 'Latest iPhone with titanium design and advanced camera system',
  price: 4500,
  comparePrice: 5000,
  images: [
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600',
    '/api/placeholder/600/600'
  ],
  category: {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics'
  },
  brand: 'Apple',
  tags: ['smartphone', 'premium', 'camera', 'titanium'],
  rating: 4.8,
  reviewCount: 124,
  stock: 10,
  isReadyNow: true,
  isGroupBuy: false,
  variants: [
    { id: '1', name: 'Natural Titanium', sku: 'IPH15PRO-NT', price: 4500, stock: 5 },
    { id: '2', name: 'Blue Titanium', sku: 'IPH15PRO-BT', price: 4500, stock: 3 },
    { id: '3', name: 'White Titanium', sku: 'IPH15PRO-WT', price: 4500, stock: 2 }
  ],
  specifications: {
    'Display': '6.1-inch Super Retina XDR',
    'Processor': 'A17 Pro chip',
    'Storage': '128GB, 256GB, 512GB, 1TB',
    'Camera': '48MP Main, 12MP Ultra Wide, 12MP Telephoto',
    'Battery': 'Up to 23 hours video playback',
    'Material': 'Titanium with Ceramic Shield'
  }
}

const relatedProducts = [
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 5200,
    comparePrice: 5800,
    images: ['/api/placeholder/300/300'],
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    price: 3800,
    comparePrice: 4200,
    images: ['/api/placeholder/300/300'],
    rating: 4.7,
    reviewCount: 67
  },
  {
    id: '5',
    name: 'Google Pixel 8 Pro',
    slug: 'google-pixel-8-pro',
    price: 4200,
    comparePrice: 4600,
    images: ['/api/placeholder/300/300'],
    rating: 4.6,
    reviewCount: 45
  }
]

interface ProductPageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  // In real app, fetch product by slug
  if (params.slug !== mockProduct.slug) {
    notFound()
  }

  const product = mockProduct
  const discount = calculateDiscount(product.comparePrice, product.price)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-primary">Categories</Link>
          <span>/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/categories">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer">
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{product.category.name}</Badge>
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
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.shortDescription}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.comparePrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
                {product.comparePrice && (
                  <Badge variant="destructive" className="text-sm">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Stock: {product.stock} available
              </p>
            </div>

            {/* Variants */}
            <div className="space-y-3">
              <h3 className="font-medium">Color</h3>
              <div className="flex gap-2">
                {product.variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant="outline"
                    className="flex-1 justify-start"
                  >
                    {variant.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      ({variant.stock})
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
              <Button size="lg" className="w-full" variant="secondary">
                Buy Now
              </Button>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Shipping Options</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Air Shipping (Fast)</span>
                      <span className="font-medium">3-7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sea Shipping (Economical)</span>
                      <span className="font-medium">14-21 days</span>
                    </div>
                    {product.isReadyNow && (
                      <div className="flex justify-between text-green-600">
                        <span>Ready Now Delivery</span>
                        <span className="font-medium">24-48 hours</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${relatedProduct.slug}`}>
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/products/${relatedProduct.slug}`}>
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(relatedProduct.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {relatedProduct.rating} ({relatedProduct.reviewCount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(relatedProduct.comparePrice)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
