'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { supabase, type HomepageBanner, isSupabaseConfigured } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Star, 
  Heart, 
  ShoppingCart,
  Smartphone,
  Monitor,
  Camera,
  Headphones,
  Watch,
  Gamepad2,
  TrendingUp,
  Clock,
  Truck,
  Shield,
  RotateCcw
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
}

interface Category {
  id: string
  name: string
  description: string
  image: string
  subcategories: Array<{
    id: string
    name: string
    count: number
    href: string
  }>
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<HomepageBanner | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?limit=8'),
          fetch('/api/categories')
        ])
        
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        
        setProducts(productsData.products || [])
        setCategories(categoriesData || [])

        // Load active homepage banner
        if (isSupabaseConfigured) {
          const nowIso = new Date().toISOString()
          const { data } = await (supabase as any)
            .from('homepage_banners')
            .select('*')
            .eq('is_active', true)
            .lte('starts_at', nowIso)
            .or('starts_at.is.null')
            .gte('ends_at', nowIso)
            .or('ends_at.is.null')
            .order('sort_order', { ascending: true })
            .limit(1)
          if (Array.isArray(data) && data[0]) setBanner(data[0])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section (dynamic) */}
      <section className={`py-20 relative overflow-hidden bg-gradient-to-br ${banner?.bg_gradient || 'from-slate-50 via-white to-red-50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-6xl lg:text-7xl font-black text-slate-900 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {banner?.title || 'Welcome to Ihsan'}
                {banner?.subtitle && (
                  <span className="block text-gradient-red">{banner.subtitle}</span>
                )}
            </motion.h1>
            <motion.p 
                className="text-xl lg:text-2xl text-slate-600 max-w-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {banner?.subtitle ? '' : 'Shop the latest deals and new arrivals'}
            </motion.p>
            <motion.div 
                className="flex flex-col sm:flex-row gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {banner?.cta_href && (
                  <Button asChild size="lg" className="btn-primary text-lg px-8 py-4">
                    <Link href={banner.cta_href}>
                      {banner.cta_label || 'Shop Now'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
                {banner?.secondary_href && (
                  <Button asChild variant="outline" size="lg" className="text-lg px-8 py-4">
                    <Link href={banner.secondary_href}>
                      {banner.secondary_label || 'Learn More'}
                    </Link>
                  </Button>
                )}
              </motion.div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-full h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flash Sales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Flash Sales</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-slate-600">Ends in:</span>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">03</div>
                  <div className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">23</div>
                  <div className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">19</div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="product-card group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
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
                        product.badge === 'Popular' ? 'badge-new' :
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover our wide range of products across different categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Phones', icon: Smartphone, color: 'bg-blue-50 hover:bg-blue-100', iconColor: 'text-blue-600' },
              { name: 'Computers', icon: Monitor, color: 'bg-red-50 hover:bg-red-100', iconColor: 'text-red-600' },
              { name: 'Cameras', icon: Camera, color: 'bg-emerald-50 hover:bg-emerald-100', iconColor: 'text-emerald-600' },
              { name: 'Headphones', icon: Headphones, color: 'bg-purple-50 hover:bg-purple-100', iconColor: 'text-purple-600' },
              { name: 'Watches', icon: Watch, color: 'bg-amber-50 hover:bg-amber-100', iconColor: 'text-amber-600' },
              { name: 'Gaming', icon: Gamepad2, color: 'bg-pink-50 hover:bg-pink-100', iconColor: 'text-pink-600' }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/categories/${category.name.toLowerCase()}`}>
                  <Card className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 shadow-sm hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <category.icon className={`h-8 w-8 ${category.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-sm text-slate-900">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Just For You */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Just For You</h2>
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(4, 8).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="product-card group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
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
                        product.badge === 'Popular' ? 'badge-new' :
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Delivery', description: 'Free shipping on orders over $100' },
              { icon: RotateCcw, title: 'Easy Returns', description: '30-day return policy' },
              { icon: Shield, title: 'Secure Payment', description: '100% secure payment processing' },
              { icon: Clock, title: '24/7 Support', description: 'Round-the-clock customer support' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}