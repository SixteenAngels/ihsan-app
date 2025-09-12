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
  TrendingDown,
  DollarSign,
  Eye,
  ShoppingCart,
  Heart,
  Share2,
  Edit,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  Upload,
  Image,
  Tag,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'
import { useCurrency } from '@/lib/currency-context'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  stock: number
  sales: number
  rating: number
  status: 'active' | 'inactive' | 'out_of_stock'
}

interface Order {
  id: string
  customerName: string
  productName: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
}

interface VendorStats {
  totalSales: number
  totalOrders: number
  totalProducts: number
  averageRating: number
  totalRevenue: number
  monthlyGrowth: number
}

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics' | 'settings'>('overview')
  const { formatCurrency } = useCurrency()

  // Mock vendor data
  const vendor = {
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
    socialLinks: {
      website: 'https://africannaturals.com',
      instagram: '@africannaturals',
      facebook: 'African Naturals'
    }
  }

  const stats: VendorStats = {
    totalSales: 1247,
    totalOrders: 892,
    totalProducts: 45,
    averageRating: 4.8,
    totalRevenue: 125000,
    monthlyGrowth: 12.5
  }

  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Ghana Shea Butter',
      price: 25.99,
      image: '/api/placeholder/100/100',
      category: 'Skincare',
      stock: 150,
      sales: 234,
      rating: 4.9,
      status: 'active'
    },
    {
      id: '2',
      name: 'Organic Coconut Oil',
      price: 18.50,
      image: '/api/placeholder/100/100',
      category: 'Skincare',
      stock: 89,
      sales: 156,
      rating: 4.7,
      status: 'active'
    },
    {
      id: '3',
      name: 'African Black Soap',
      price: 12.99,
      image: '/api/placeholder/100/100',
      category: 'Skincare',
      stock: 0,
      sales: 89,
      rating: 4.6,
      status: 'out_of_stock'
    },
    {
      id: '4',
      name: 'Moringa Face Cream',
      price: 32.99,
      image: '/api/placeholder/100/100',
      category: 'Skincare',
      stock: 67,
      sales: 123,
      rating: 4.8,
      status: 'active'
    }
  ]

  const recentOrders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      productName: 'Premium Ghana Shea Butter',
      amount: 25.99,
      status: 'delivered',
      date: '2024-01-15'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      productName: 'Organic Coconut Oil',
      amount: 18.50,
      status: 'shipped',
      date: '2024-01-14'
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Johnson',
      productName: 'Moringa Face Cream',
      amount: 32.99,
      status: 'processing',
      date: '2024-01-13'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'out_of_stock': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      case 'processing': return 'bg-blue-500'
      case 'shipped': return 'bg-purple-500'
      case 'delivered': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return AlertCircle
      case 'out_of_stock': return XCircle
      case 'pending': return Clock
      case 'processing': return Clock
      case 'shipped': return CheckCircle
      case 'delivered': return CheckCircle
      case 'cancelled': return XCircle
      default: return AlertCircle
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Vendor Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="flex items-center gap-6"
          >
            <img
              src={vendor.logo}
              alt={vendor.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{vendor.name}</h1>
                {vendor.verified && (
                  <Badge className="bg-blue-500 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-white/90 text-lg mb-3">{vendor.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{vendor.rating}</span>
                  <span className="text-white/70">({vendor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{vendor.followerCount} followers</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  <span>{vendor.productCount} products</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{vendor.location}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Heart className="w-4 h-4 mr-2" />
                Follow
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
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
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'products', label: 'Products', icon: Package },
                  { id: 'orders', label: 'Orders', icon: ShoppingCart },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                  { id: 'settings', label: 'Settings', icon: Settings }
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Sales', value: stats.totalSales.toString(), icon: ShoppingCart, color: 'text-green-600' },
                  { label: 'Total Orders', value: stats.totalOrders.toString(), icon: Package, color: 'text-blue-600' },
                  { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-purple-600' },
                  { label: 'Monthly Growth', value: `+${stats.monthlyGrowth}%`, icon: TrendingUp, color: 'text-orange-600' }
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

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status)
                      return (
                        <motion.div
                          key={order.id}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                                    <StatusIcon className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{order.id}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {order.customerName} • {order.productName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{order.date}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {formatCurrency(order.amount)}
                                  </p>
                                  <Badge variant="secondary" className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Products
                    </CardTitle>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => {
                      const StatusIcon = getStatusIcon(product.status)
                      return (
                        <motion.div
                          key={product.id}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-shadow">
                            <div className="relative">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-t-lg"
                              />
                              <div className="absolute top-2 right-2">
                                <Badge className={getStatusColor(product.status)}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {product.status}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2">{product.name}</h3>
                              <p className="text-2xl font-bold text-primary mb-2">
                                {formatCurrency(product.price)}
                              </p>
                              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{product.rating}</span>
                                </div>
                                <span>{product.sales} sales</span>
                                <span>{product.stock} in stock</span>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => {
                      const StatusIcon = getStatusIcon(order.status)
                      return (
                        <motion.div
                          key={order.id}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-full ${getStatusColor(order.status)}`}>
                                    <StatusIcon className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-lg">{order.id}</h3>
                                    <p className="text-muted-foreground">
                                      {order.customerName} • {order.productName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{order.date}</p>
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <p className="text-xl font-bold">
                                    {formatCurrency(order.amount)}
                                  </p>
                                  <Badge variant="secondary" className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </Button>
                                    <Button size="sm" variant="outline">
                                      <Edit className="w-3 h-3 mr-1" />
                                      Update
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
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
                    Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground mb-4">
                      Track your sales performance, customer insights, and growth metrics
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

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Store Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Store Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Store Name</label>
                          <Input defaultValue={vendor.name} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category</label>
                          <Input defaultValue={vendor.category} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Location</label>
                          <Input defaultValue={vendor.location} />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Response Time</label>
                          <Input defaultValue={vendor.responseTime} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Website</label>
                          <Input defaultValue={vendor.socialLinks.website} placeholder="https://yourwebsite.com" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Instagram</label>
                          <Input defaultValue={vendor.socialLinks.instagram} placeholder="@yourusername" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Facebook</label>
                          <Input defaultValue={vendor.socialLinks.facebook} placeholder="Your Page Name" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Twitter</label>
                          <Input placeholder="@yourusername" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Store Images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Store Logo</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Upload store logo</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Store Banner</label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Upload store banner</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Save Settings
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
