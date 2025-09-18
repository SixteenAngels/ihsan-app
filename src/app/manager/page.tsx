'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Eye,
  Edit,
  Filter,
  Search,
  Calendar,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  XCircle,
  Shield
} from 'lucide-react'

interface ManagerStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalCustomers: number
  revenueGrowth: number
  orderGrowth: number
  productGrowth: number
  customerGrowth: number
}

interface RecentActivity {
  id: string
  type: 'order' | 'product' | 'customer' | 'review'
  title: string
  description: string
  timestamp: string
  status: 'success' | 'warning' | 'error' | 'info'
}

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<ManagerStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          fetch('/api/orders?limit=1'),
          fetch('/api/products?limit=1'),
          fetch('/api/users?limit=1')
        ])
        const orders = await ordersRes.json()
        const products = await productsRes.json()
        const users = await usersRes.json()

        const revenue = (orders.orders || []).reduce((sum: number, o: any) => sum + (o.total_amount || o.total || 0), 0)
        const totalOrders = orders.pagination?.total || (orders.orders?.length ?? 0)
        const totalProducts = products.pagination?.total || (products.products?.length ?? 0)
        const totalCustomers = users.pagination?.total || (users.users?.length ?? 0)

        setStats({
          totalRevenue: revenue,
          totalOrders,
          totalProducts,
          totalCustomers,
          revenueGrowth: 0,
          orderGrowth: 0,
          productGrowth: 0,
          customerGrowth: 0
        })

        setRecentActivities([
          { id: '1', type: 'order', title: 'Orders synced', description: `${totalOrders} orders loaded`, timestamp: 'now', status: 'info' },
          { id: '2', type: 'product', title: 'Products synced', description: `${totalProducts} products loaded`, timestamp: 'now', status: 'info' },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleLogout = () => {
    // Clear auth cookies
    document.cookie = 'managerAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'managerUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    // Redirect to login
    router.push('/login')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />
      case 'product': return <Package className="h-4 w-4" />
      case 'customer': return <Users className="h-4 w-4" />
      case 'review': return <Star className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      case 'info': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading manager dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manager Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300">Store management and analytics</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingCart },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'reports', label: 'Reports', icon: Calendar },
                { id: 'escrow', label: 'Escrow', icon: Shield },
                { id: 'moderation', label: 'Moderation', icon: Package },
                { id: 'homepage', label: 'Homepage', icon: Settings },
                { id: 'notifications', label: 'Notifications', icon: Settings },
                { id: 'ready-now', label: 'Ready Now', icon: Package }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="capitalize">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white rounded-lg shadow-md p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-slate-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats?.revenueGrowth}%</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Orders</p>
                          <p className="text-2xl font-bold text-slate-900">{stats?.totalOrders.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats?.orderGrowth}%</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Products</p>
                          <p className="text-2xl font-bold text-slate-900">{stats?.totalProducts.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats?.productGrowth}%</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total Customers</p>
                          <p className="text-2xl font-bold text-slate-900">{stats?.totalCustomers.toLocaleString()}</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+{stats?.customerGrowth}%</span>
                          </div>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50">
                          <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{activity.title}</h4>
                            <p className="text-sm text-slate-600">{activity.description}</p>
                            <div className="flex items-center mt-1 text-xs text-slate-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Product Management</h2>
                  <Button>
                    <Package className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10 pr-4"
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Product Management</h3>
                      <p className="text-slate-600 mb-4">View and manage your product catalog with inventory tracking.</p>
                      <Button asChild>
                        <a href="/manager/products">Go to Products</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Order Management</h2>
                  <Button>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Order Management</h3>
                      <p className="text-slate-600 mb-4">Track and manage customer orders, shipping, and fulfillment.</p>
                      <Button asChild>
                        <a href="/manager/orders">Go to Orders</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">Customer Management</h2>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    View All Customers
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Customer Management</h3>
                      <p className="text-slate-600 mb-4">Manage customer accounts, orders, and support requests.</p>
                      <Button asChild>
                        <a href="/manager/customers">Go to Customers</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Sales Analytics</h3>
                      <p className="text-slate-600 mb-4">View detailed analytics and performance metrics.</p>
                      <Button asChild>
                        <a href="/manager/analytics">View Analytics</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Generate Reports</h3>
                      <p className="text-slate-600 mb-4">Create and download various business reports.</p>
                      <Button asChild>
                        <a href="/manager/reports">Generate Reports</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'escrow' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Escrow</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Escrow Management</h3>
                      <p className="text-slate-600 mb-4">Release payments to vendors upon delivery confirmation.</p>
                      <Button asChild>
                        <a href="/manager/escrow">Go to Escrow</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'moderation' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Moderation</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Product Moderation</h3>
                      <p className="text-slate-600 mb-4">Temporarily hide or unhide vendor products.</p>
                      <Button asChild>
                        <a href="/manager/moderation">Go to Moderation</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'homepage' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Homepage</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Homepage Settings</h3>
                      <p className="text-slate-600 mb-4">Manage banners and featured products.</p>
                      <Button asChild>
                        <a href="/manager/homepage">Go to Homepage Settings</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Platform Notifications</h3>
                      <p className="text-slate-600 mb-4">Send promos and group buy reminders.</p>
                      <Button asChild>
                        <a href="/manager/notifications">Go to Notifications</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'ready-now' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Ready Now</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Ready Now Verification</h3>
                      <p className="text-slate-600 mb-4">Verify Ghana-stocked items for fast delivery.</p>
                      <Button asChild>
                        <a href="/manager/ready-now">Go to Ready Now</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
