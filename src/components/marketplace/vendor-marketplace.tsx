'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Store, 
  Star, 
  Users, 
  Package, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Filter,
  Search,
  Grid3X3,
  List,
  Heart,
  Share2
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'

interface Vendor {
  id: string
  name: string
  description: string
  logo: string
  banner: string
  rating: number
  reviews: number
  products: number
  followers: number
  location: string
  joinedDate: string
  verified: boolean
  categories: string[]
  featuredProducts: Product[]
}

interface Product {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  category: string
}

// Mock vendor data
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'African Naturals',
    description: 'Premium natural products from across Africa. Specializing in shea butter, coconut oil, and traditional skincare.',
    logo: '/api/placeholder/100/100',
    banner: '/api/placeholder/800/200',
    rating: 4.8,
    reviews: 2847,
    products: 156,
    followers: 12500,
    location: 'Accra, Ghana',
    joinedDate: '2020-03-15',
    verified: true,
    categories: ['Beauty & Health', 'Natural Products', 'Skincare'],
    featuredProducts: [
      {
        id: '1',
        name: 'Pure Ghana Shea Butter',
        price: 15.99,
        image: '/api/placeholder/200/200',
        rating: 4.9,
        reviews: 1247,
        category: 'Beauty & Health'
      },
      {
        id: '2',
        name: 'Coconut Oil - Cold Pressed',
        price: 12.50,
        image: '/api/placeholder/200/200',
        rating: 4.7,
        reviews: 892,
        category: 'Beauty & Health'
      }
    ]
  },
  {
    id: '2',
    name: 'Heritage Crafts',
    description: 'Authentic African crafts and textiles. Handwoven kente cloth, traditional masks, and cultural artifacts.',
    logo: '/api/placeholder/100/100',
    banner: '/api/placeholder/800/200',
    rating: 4.9,
    reviews: 1563,
    products: 89,
    followers: 8900,
    location: 'Kumasi, Ghana',
    joinedDate: '2019-08-22',
    verified: true,
    categories: ['Fashion & Textiles', 'Home & Decor', 'Art & Crafts'],
    featuredProducts: [
      {
        id: '3',
        name: 'Handwoven Kente Cloth',
        price: 45.00,
        image: '/api/placeholder/200/200',
        rating: 4.9,
        reviews: 156,
        category: 'Fashion & Textiles'
      },
      {
        id: '4',
        name: 'Wooden African Mask',
        price: 28.75,
        image: '/api/placeholder/200/200',
        rating: 4.7,
        reviews: 203,
        category: 'Home & Decor'
      }
    ]
  },
  {
    id: '3',
    name: 'Tropical Essentials',
    description: 'Fresh tropical fruits, spices, and organic products. Direct from local farmers and producers.',
    logo: '/api/placeholder/100/100',
    banner: '/api/placeholder/800/200',
    rating: 4.6,
    reviews: 3421,
    products: 203,
    followers: 15600,
    location: 'Lagos, Nigeria',
    joinedDate: '2021-01-10',
    verified: true,
    categories: ['Food & Beverages', 'Organic Products', 'Spices'],
    featuredProducts: [
      {
        id: '5',
        name: 'Organic Mango Powder',
        price: 8.99,
        image: '/api/placeholder/200/200',
        rating: 4.6,
        reviews: 445,
        category: 'Food & Beverages'
      },
      {
        id: '6',
        name: 'Premium Cocoa Powder',
        price: 18.50,
        image: '/api/placeholder/200/200',
        rating: 4.8,
        reviews: 678,
        category: 'Food & Beverages'
      }
    ]
  }
]

export default function VendorMarketplace() {
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'rating' | 'products' | 'followers' | 'newest'>('rating')

  const categories = ['all', 'Beauty & Health', 'Fashion & Textiles', 'Food & Beverages', 'Home & Decor', 'Art & Crafts']

  const filteredVendors = vendors
    .filter(vendor => 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(vendor => selectedCategory === 'all' || vendor.categories.includes(selectedCategory))
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'products':
          return b.products - a.products
        case 'followers':
          return b.followers - a.followers
        case 'newest':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
        default:
          return 0
      }
    })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Store className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Vendor Marketplace</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing vendors and their unique products from across Africa
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="initial"
          animate="in"
          variants={slideInFromBottom}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search vendors, products, or categories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </Button>
                  ))}
                </div>

                {/* Sort and View */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 border rounded-md text-sm"
                    aria-label="Sort vendors by"
                    title="Sort vendors by"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="products">Most Products</option>
                    <option value="followers">Most Followers</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vendors Grid */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }>
          {filteredVendors.map((vendor, index) => (
            <motion.div
              key={vendor.id}
              initial="initial"
              animate="in"
              variants={bounceIn}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-lg transition-all duration-200 ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                {viewMode === 'list' ? (
                  <>
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={vendor.banner}
                        alt={vendor.name}
                        className="w-full h-full object-cover rounded-l-lg"
                      />
                    </div>
                    <CardContent className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={vendor.logo} />
                            <AvatarFallback>{vendor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{vendor.name}</h3>
                              {vendor.verified && (
                                <Badge variant="default" className="text-xs">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{vendor.location}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {vendor.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{vendor.rating}</span>
                          <span className="text-muted-foreground">({vendor.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          <span>{vendor.products} products</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{formatNumber(vendor.followers)} followers</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1">Visit Store</Button>
                        <Button variant="outline">Follow</Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <img
                        src={vendor.banner}
                        alt={vendor.name}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                      <div className="absolute top-4 left-4">
                        <Avatar className="w-16 h-16 border-4 border-white">
                          <AvatarImage src={vendor.logo} />
                          <AvatarFallback>{vendor.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      {vendor.verified && (
                        <div className="absolute top-4 right-4">
                          <Badge variant="default" className="text-xs">
                            ✓ Verified
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-1">{vendor.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{vendor.location}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {vendor.description}
                        </p>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{vendor.rating}</span>
                            <span className="text-muted-foreground">({vendor.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{vendor.products}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{formatNumber(vendor.followers)} followers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Joined {new Date(vendor.joinedDate).getFullYear()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button className="flex-1">Visit Store</Button>
                        <Button variant="outline">Follow</Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVendors.length === 0 && (
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center py-16"
          >
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vendors found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all vendors
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
