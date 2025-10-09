'use client'

import { notFound, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star, ShoppingCart, Heart, Share, Truck, Users, Zap, ArrowLeft } from 'lucide-react'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

// No mock data in production; fetch real product by slug

export default function ProductPage() {
  const params = useParams() as { slug?: string }
  const slug = params?.slug || ''
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!isSupabaseConfigured || !slug) {
          setLoading(false)
          setProduct(null)
          return
        }
        const { data, error } = await (supabase as any)
          .from('products')
          .select('id,name,slug,description,short_description,price,compare_price,images,brand,stock_quantity,is_ready_now,is_group_buy,categories(name,slug)')
          .eq('slug', slug)
          .maybeSingle()
        if (error) {
          setProduct(null)
        } else {
          setProduct(data)
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (!loading && !product) {
    notFound()
  }

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading product…</p>
        </div>
      </div>
    )
  }

  const discount = product.compare_price ? calculateDiscount(product.compare_price, product.price) : 0

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
                src={product.images?.[0] || '/api/placeholder/600/600'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {((Array.isArray(product.images) ? product.images : []) as string[]).slice(0, 4).map((image: string, index: number) => (
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
              <p className="text-muted-foreground">{product.short_description || ''}</p>
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
                    {product.compare_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
                {product.compare_price && (
                  <Badge variant="destructive" className="text-sm">
                    {discount}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Stock: {product.stock_quantity ?? 0} available
              </p>
            </div>

            {/* Variants */}
            <div className="space-y-3">
              <h3 className="font-medium">Color</h3>
              <div className="flex gap-2">
                {(product.variants || []).map((variant: any) => (
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

        {/* Related products removed (no dummy data) */}
      </div>
    </div>
  )
}
