'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Package, Users, ShoppingCart, Settings, LogOut, ShoppingBag } from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()
  const [counts, setCounts] = useState({ revenue: 0, orders: 0, products: 0, users: 0, pendingApprovals: 0 })

  const handleLogout = () => {
    // Clear auth cookies
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'adminUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    // Redirect to login
    router.push('/login')
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes, pendingRes] = await Promise.all([
          fetch('/api/products?limit=1'),
          fetch('/api/orders?limit=1'),
          fetch('/api/users?limit=1'),
          fetch('/api/products?approved=false&limit=1')
        ])
        const products = await productsRes.json()
        const orders = await ordersRes.json()
        const users = await usersRes.json()
        const pending = await pendingRes.json()

        // revenue: sum of total_amount from Supabase orders if present; fallback to 0
        const revenue = (orders.orders || []).reduce((sum: number, o: any) => sum + (o.total_amount || o.total || 0), 0)
        setCounts({
          revenue,
          orders: orders.pagination?.total || (orders.orders?.length ?? 0),
          products: products.pagination?.total || (products.products?.length ?? 0),
          users: users.pagination?.total || (users.users?.length ?? 0),
          pendingApprovals: pending.pagination?.total || 0,
        })
      } catch (e) {
        // keep defaults on failure
      }
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300">Manage your e-commerce store</p>
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

      <div className="flex">
        <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'products' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('products')}
              >
                <Package className="h-4 w-4 mr-2" />
                Products
              </Button>
              <Button
                variant={activeTab === 'orders' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Orders
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
              <Button
                variant={activeTab === 'approvals' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('approvals')}
              >
                <Package className="h-4 w-4 mr-2" />
                Approvals
              </Button>
              <Button
                variant={activeTab === 'vendors' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('vendors')}
              >
                <Users className="h-4 w-4 mr-2" />
                Vendors
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                variant={activeTab === 'chats' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('chats')}
              >
                <Users className="h-4 w-4 mr-2" />
                Support Chats
              </Button>
              <Button
                variant={activeTab === 'homepage' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('homepage')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Homepage Banners
              </Button>
              <Button
                variant={activeTab === 'store' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('store')}
              >
                <Package className="h-4 w-4 mr-2" />
                Admin Store
              </Button>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {/* Quick link card to flash deals manager */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Flash Deals</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-300">Create and manage flash and daily sales</p>
                <Button asChild>
                  <a href="/admin/flash-deals">Open</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Revenue</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">${counts.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Orders</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{counts.orders.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Products</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{counts.products.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Total Users</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{counts.users.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Pending Approvals</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{counts.pendingApprovals.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Products</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Product Management</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Manage your product catalog, inventory, and pricing.</p>
                    <Button asChild>
                      <a href="/admin/products">Go to Products</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Orders</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Order Management</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">View and manage customer orders, shipping, and fulfillment.</p>
                    <Button asChild>
                      <a href="/admin/orders">Go to Orders</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Users</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">User Management</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Manage customer accounts, roles, and permissions.</p>
                    <Button asChild>
                      <a href="/admin/users">Go to Users</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Approvals</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Product Approvals</h3>
                    <p className="text-slate-600 mb-4">Review and approve vendor-submitted products.</p>
                    <Button asChild>
                      <a href="/admin/approvals">Go to Approvals</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Vendors</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Vendor Management</h3>
                    <p className="text-slate-600 mb-4">Approve or suspend vendors and view their status.</p>
                    <Button asChild>
                      <a href="/admin/vendors">Go to Vendors</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Platform Settings</h3>
                    <p className="text-slate-600 mb-4">Configure approvals and commission rates.</p>
                    <Button asChild>
                      <a href="/admin/settings">Go to Settings</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Admin Store</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Manage Admin Store</h3>
                    <p className="text-slate-600 mb-4">List and manage products sold directly by Admin.</p>
                    <Button asChild>
                      <a href="/admin/store">Go to Admin Store</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'chats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Support Chats</h2>
              <div className="bg-white rounded-lg shadow">
                {/* Embed LiveChat for admin */}
                {/* @ts-expect-error Server/Client mismatch acceptable for dynamic import */}
                {require('@/components/chat/live-chat').default && (
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  require('@/lib/auth-context').useAuth && (
                    (() => {
                      const { useAuth } = require('@/lib/auth-context')
                      const LiveChat = require('@/components/chat/live-chat').default
                      const AuthWrapped = () => {
                        const { user } = useAuth()
                        if (!user) return null
                        return <LiveChat userId={user.id} userRole={user.role} />
                      }
                      return <AuthWrapped />
                    })()
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === 'homepage' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Homepage Banners</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Manage Banners</h3>
                    <p className="text-slate-600 mb-4">Create and manage the hero banner content.</p>
                    <Button asChild>
                      <a href="/admin/flash-deals">Open Banner Manager</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Categories</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <ShoppingBag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Category Management</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Organize products with categories and subcategories.</p>
                    <Button asChild>
                      <a href="/admin/categories">Go to Categories</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}