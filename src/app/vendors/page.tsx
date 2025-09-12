'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Store, 
  Star, 
  Users, 
  Package, 
  TrendingUp,
  MapPin,
  Clock,
  Shield,
  Heart,
  Share2,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'
import { useCurrency } from '@/lib/currency-context'

interface Vendor {
  id: string
  name: string
  description: string
  logo: string
  banner: string
  rating: number
  reviewCount: number
  followerCount: number
  productCount: number
  location: string
  category: string
  verified: boolean
  joinedDate: string
  responseTime: string
  fulfillmentRate: number
  returnRate: number
  status: 'active' | 'pending' | 'suspended' | 'inactive'
  featured: boolean
  tags: string[]
  socialLinks: {
    website?: string
    instagram?: string
    facebook?: string
    twitter?: string
  }
}

interface VendorStats {
  totalVendors: number
  activeVendors: number
  pendingVendors: number
  totalProducts: number
  averageRating: number
}

export default function MultiVendorSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'products' | 'analytics'>('overview')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const { formatCurrency } = useCurrency()

  // Mock vendor data
  const vendors: Vendor[] = [
    {
      id: '1',
      name: 'African Naturals',
      description: 'Premium organic skincare products from Ghana. Handcrafted with love using traditional methods.',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.8,
      reviewCount: 1247,
      followerCount: 8934,
      productCount: 45,
      location: 'Accra, Ghana',
      category: 'Beauty & Health',
      verified: true,
      joinedDate: '2023-01-15',
      responseTime: '< 2 hours',
      fulfillmentRate: 98.5,
      returnRate: 2.1,
      status: 'active',
      featured: true,
      tags: ['organic', 'skincare', 'handmade', 'premium'],
      socialLinks: {
        website: 'https://africannaturals.com',
        instagram: '@africannaturals',
        facebook: 'African Naturals'
      }
    },
    {
      id: '2',
      name: 'Heritage Crafts',
      description: 'Authentic African crafts and home decor. Supporting local artisans and preserving cultural heritage.',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.6,
      reviewCount: 892,
      followerCount: 5678,
      productCount: 78,
      location: 'Kumasi, Ghana',
      category: 'Home & Decor',
      verified: true,
      joinedDate: '2023-03-22',
      responseTime: '< 4 hours',
      fulfillmentRate: 96.2,
      returnRate: 3.8,
      status: 'active',
      featured: false,
      tags: ['handmade', 'cultural', 'artisan', 'decor'],
      socialLinks: {
        instagram: '@heritagecrafts',
        facebook: 'Heritage Crafts'
      }
    },
    {
      id: '3',
      name: 'Tropical Essentials',
      description: 'Fresh tropical fruits and organic produce delivered directly from local farms.',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.4,
      reviewCount: 634,
      followerCount: 3456,
      productCount: 32,
      location: 'Tamale, Ghana',
      category: 'Food & Beverage',
      verified: false,
      joinedDate: '2023-06-10',
      responseTime: '< 6 hours',
      fulfillmentRate: 94.1,
      returnRate: 5.9,
      status: 'active',
      featured: false,
      tags: ['organic', 'fresh', 'local', 'farm'],
      socialLinks: {
        website: 'https://tropicalessentials.com'
      }
    },
    {
      id: '4',
      name: 'Artisan Gallery',
      description: 'Curated collection of African art, jewelry, and fashion accessories.',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.7,
      reviewCount: 1156,
      followerCount: 7890,
      productCount: 67,
      location: 'Cape Coast, Ghana',
      category: 'Fashion & Accessories',
      verified: true,
      joinedDate: '2022-11-08',
      responseTime: '< 3 hours',
      fulfillmentRate: 97.3,
      returnRate: 2.7,
      status: 'active',
      featured: true,
      tags: ['art', 'jewelry', 'fashion', 'curated'],
      socialLinks: {
        website: 'https://artisangallery.com',
        instagram: '@artisangallery',
        twitter: '@artisangallery'
      }
    },
    {
      id: '5',
      name: 'Tech Hub Africa',
      description: 'Latest technology products and gadgets for the African market.',
      logo: '/api/placeholder/80/80',
      banner: '/api/placeholder/400/200',
      rating: 4.2,
      reviewCount: 423,
      followerCount: 2345,
      productCount: 89,
      location: 'Lagos, Nigeria',
      category: 'Electronics',
      verified: true,
      joinedDate: '2023-08-15',
      responseTime: '< 1 hour',
      fulfillmentRate: 95.8,
      returnRate: 4.2,
      status: 'pending',
      featured: false,
      tags: ['technology', 'gadgets', 'electronics', 'innovation'],
      socialLinks: {
        website: 'https://techhubafrica.com',
        twitter: '@techhubafrica'
      }
    }
  ]

  const stats: VendorStats = {
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'active').length,
    pendingVendors: vendors.filter(v => v.status === 'pending').length,
    totalProducts: vendors.reduce((sum, v) => sum + v.productCount, 0),
    averageRating: vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
  }

  const categories = ['all', 'Beauty & Health', 'Home & Decor', 'Food & Beverage', 'Fashion & Accessories', 'Electronics']

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'products':
        return b.productCount - a.productCount
      case 'followers':
        return b.followerCount - a.followerCount
      case 'newest':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'pending': return 'bg-yellow-500'
      case 'suspended': return 'bg-red-500'
      case 'inactive': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'pending': return Clock
      case 'suspended': return XCircle
      case 'inactive': return AlertCircle
      default: return AlertCircle
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
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
              <h1 className="text-4xl font-bold">Multi-Vendor Marketplace</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing vendors and their unique products from across Africa
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial="initial"
          animate="in"
          variants={slideInFromBottom}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Overview', icon: TrendingUp },
                  { id: 'vendors', label: 'Vendors', icon: Store },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'outline'}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Total Vendors', value: stats.totalVendors.toString(), icon: Store, color: 'text-purple-600' },
                  { label: 'Active Vendors', value: stats.activeVendors.toString(), icon: CheckCircle, color: 'text-green-600' },
                  { label: 'Pending Vendors', value: stats.pendingVendors.toString(), icon: Clock, color: 'text-yellow-600' },
                  { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-blue-600' },
                  { label: 'Avg Rating', value: stats.averageRating.toFixed(1), icon: Star, color: 'text-orange-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-gray-100`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Featured Vendors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Featured Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vendors.filter(v => v.featured).map((vendor, index) => (
                      <motion.div
                        key={vendor.id}
                        initial="initial"
                        animate="in"
                        variants={bounceIn}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="relative">
                            <img
                              src={vendor.banner}
                              alt={vendor.name}
                              className="w-full h-32 object-cover rounded-t-lg"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-yellow-500 text-white">
                                Featured
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <img
                                src={vendor.logo}
                                alt={vendor.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{vendor.name}</h3>
                                  {vendor.verified && (
                                    <Shield className="w-4 h-4 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {vendor.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{vendor.rating}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{vendor.followerCount}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    <span>{vendor.productCount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'vendors' && (
            <motion.div
              key="vendors"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search vendors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        aria-label="Filter vendors by category"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category === 'all' ? 'All Categories' : category}
                          </option>
                        ))}
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        aria-label="Sort vendors"
                      >
                        <option value="rating">Sort by Rating</option>
                        <option value="products">Sort by Products</option>
                        <option value="followers">Sort by Followers</option>
                        <option value="newest">Sort by Newest</option>
                      </select>
                      <div className="flex border rounded-md">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="w-4 h-4" />
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

              {/* Vendors Grid/List */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {sortedVendors.map((vendor, index) => {
                  const StatusIcon = getStatusIcon(vendor.status)
                  return (
                    <motion.div
                      key={vendor.id}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        {viewMode === 'grid' ? (
                          <div>
                            <div className="relative">
                              <img
                                src={vendor.banner}
                                alt={vendor.name}
                                className="w-full h-40 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                {vendor.featured && (
                                  <Badge className="bg-yellow-500 text-white">
                                    Featured
                                  </Badge>
                                )}
                                <Badge className={getStatusColor(vendor.status)}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {vendor.status}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <img
                                  src={vendor.logo}
                                  alt={vendor.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{vendor.name}</h3>
                                    {vendor.verified && (
                                      <Shield className="w-4 h-4 text-blue-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {vendor.description}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                      <span>{vendor.rating}</span>
                                      <span className="text-muted-foreground">({vendor.reviewCount})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>{vendor.followerCount}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Package className="w-3 h-3" />
                                      <span>{vendor.productCount}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-3">
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View Store
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Heart className="w-3 h-3 mr-1" />
                                      Follow
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        ) : (
                          <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={vendor.logo}
                                alt={vendor.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                                  {vendor.verified && (
                                    <Shield className="w-4 h-4 text-blue-500" />
                                  )}
                                  <Badge className={getStatusColor(vendor.status)}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {vendor.status}
                                  </Badge>
                                </div>
                                <p className="text-muted-foreground mt-1">{vendor.description}</p>
                                <div className="flex items-center gap-6 mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span>{vendor.rating}</span>
                                    <span className="text-muted-foreground">({vendor.reviewCount} reviews)</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{vendor.followerCount} followers</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    <span>{vendor.productCount} products</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{vendor.location}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3 mr-1" />
                                  View Store
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Heart className="w-3 h-3 mr-1" />
                                  Follow
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Share2 className="w-3 h-3 mr-1" />
                                  Share
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    All Products from Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Product Catalog</h3>
                    <p className="text-muted-foreground mb-4">
                      Browse products from all vendors in one place
                    </p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Vendor Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">
                      Track vendor performance, sales, and engagement metrics
                    </p>
                    <Button>
                      <Eye className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}