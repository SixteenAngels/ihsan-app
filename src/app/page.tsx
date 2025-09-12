'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingBag, Truck, Users, Zap, Star, ArrowRight } from 'lucide-react'
import { 
  fadeIn, 
  slideInFromLeft, 
  slideInFromRight, 
  staggerContainer, 
  staggerItem, 
  cardVariants,
  buttonVariants 
} from '@/lib/animations'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideInFromLeft}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Welcome to <span className="text-primary">Ihsan</span>
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideInFromRight}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Modern e-commerce platform for Ghana and Africa. Shop with Air/Sea shipping options, 
              Ready Now local stock, and Group Buy discounts.
            </motion.p>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button size="lg" asChild>
                  <Link href="/categories">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/ready-now">
                    Ready Now Items
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Ihsan?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience shopping like never before with our innovative features designed for Africa
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={staggerItem}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Flexible Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Choose between Air shipping (fast) or Sea shipping (economical) based on your needs
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Ready Now</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Get Ghana-stocked products delivered within 24-48 hours for immediate needs
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Group Buy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Join group purchases to unlock tiered discounts and save more on bulk orders
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <ShoppingBag className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Mobile First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      PWA technology ensures seamless shopping experience on web and mobile
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">
              Discover products across all categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { name: 'Fashion', icon: '👗', href: '/categories/fashion' },
              { name: 'Electronics', icon: '📱', href: '/categories/electronics' },
              { name: 'Beauty', icon: '💄', href: '/categories/beauty' },
              { name: 'Bulk Deals', icon: '📦', href: '/categories/bulk-deals' },
              { name: 'Ready Now', icon: '⚡', href: '/ready-now' },
            ].map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">
              Discover our most popular items
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'iPhone 15 Pro',
                price: 4500,
                originalPrice: 5000,
                image: '/api/placeholder/300/300',
                badge: 'Ready Now',
                rating: 4.8
              },
              {
                name: 'Nike Air Max 270',
                price: 350,
                originalPrice: 400,
                image: '/api/placeholder/300/300',
                badge: 'Ready Now',
                rating: 4.6
              },
              {
                name: 'Ghana Made Shea Butter',
                price: 25,
                originalPrice: 30,
                image: '/api/placeholder/300/300',
                badge: 'Group Buy',
                rating: 4.9
              }
            ].map((product) => (
              <Card key={product.name} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      {product.badge}
                    </span>
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
                    <span className="text-sm text-muted-foreground line-through">
                      GHS {product.originalPrice}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/categories">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers across Ghana and Africa
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/categories">
              Explore Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
