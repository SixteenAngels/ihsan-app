'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Package, ShoppingCart, Settings, LogOut, DollarSign, TrendingUp } from 'lucide-react'

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [escrowBalance, setEscrowBalance] = useState<number>(0)
  const [ordersCount, setOrdersCount] = useState<number>(0)
  const [productsCount, setProductsCount] = useState<number>(0)
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = 'vendorAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'vendorUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [heldRes, ordsRes, prodsRes] = await Promise.all([
          fetch('/api/orders?vendorId=vendor-1&escrowStatus=held&limit=1000'),
          fetch('/api/orders?vendorId=vendor-1&limit=1'),
          fetch('/api/products?vendorId=vendor-1&limit=1'),
        ])
        const held = await heldRes.json()
        const ords = await ordsRes.json()
        const prods = await prodsRes.json()
        const sum = (held.orders || []).reduce((acc: number, o: any) => acc + (o.total_amount || o.total || 0), 0)
        setEscrowBalance(sum)
        setOrdersCount(ords.pagination?.total || (ords.orders?.length ?? 0))
        setProductsCount(prods.pagination?.total || (prods.products?.length ?? 0))
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vendor Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-300">Manage your products and orders</p>
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
          <aside className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingCart }
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

          <main className="flex-1 bg-white rounded-lg shadow-md p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">Revenue (30d)</p>
                          <p className="text-2xl font-bold text-slate-900">$12,540</p>
                          <div className="flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">+8.2%</span>
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
                          <p className="text-sm font-medium text-slate-600">Orders</p>
                          <p className="text-2xl font-bold text-slate-900">{ordersCount.toLocaleString()}</p>
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
                          <p className="text-sm font-medium text-slate-600">Active Products</p>
                          <p className="text-2xl font-bold text-slate-900">{productsCount.toLocaleString()}</p>
                          <div className="text-xs text-slate-500">Escrow balance: <span className="font-semibold text-slate-900">${escrowBalance.toLocaleString()}</span></div>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Products</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Manage Products</h3>
                      <p className="text-slate-600 mb-4">Create, edit, and manage your product listings.</p>
                      <Button asChild>
                        <a href="/vendor/products">Go to Products</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">Orders</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <ShoppingCart className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Manage Orders</h3>
                      <p className="text-slate-600 mb-4">Review, process, and track your customer orders.</p>
                      <Button asChild>
                        <a href="/vendor/orders">Go to Orders</a>
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


