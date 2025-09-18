'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react'

interface AnalyticsData {
  revenue: {
    total: number
    growth: number
    monthly: Array<{ month: string; amount: number }>
  }
  orders: {
    total: number
    growth: number
    monthly: Array<{ month: string; count: number }>
  }
  customers: {
    total: number
    growth: number
    monthly: Array<{ month: string; count: number }>
  }
  products: {
    total: number
    growth: number
    topSelling: Array<{ name: string; sales: number; revenue: number }>
  }
  categories: {
    name: string
    revenue: number
    percentage: number
  }[]
}

export default function ManagerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      setAnalytics({
        revenue: {
          total: 125430.50,
          growth: 12.5,
          monthly: [
            { month: 'Jan', amount: 45000 },
            { month: 'Feb', amount: 52000 },
            { month: 'Mar', amount: 48000 },
            { month: 'Apr', amount: 61000 },
            { month: 'May', amount: 58000 },
            { month: 'Jun', amount: 67000 }
          ]
        },
        orders: {
          total: 2847,
          growth: 8.3,
          monthly: [
            { month: 'Jan', count: 450 },
            { month: 'Feb', count: 520 },
            { month: 'Mar', count: 480 },
            { month: 'Apr', count: 610 },
            { month: 'May', count: 580 },
            { month: 'Jun', count: 670 }
          ]
        },
        customers: {
          total: 892,
          growth: 6.7,
          monthly: [
            { month: 'Jan', count: 120 },
            { month: 'Feb', count: 140 },
            { month: 'Mar', count: 130 },
            { month: 'Apr', count: 160 },
            { month: 'May', count: 150 },
            { month: 'Jun', count: 180 }
          ]
        },
        products: {
          total: 1247,
          growth: 15.2,
          topSelling: [
            { name: 'iPhone 15 Pro', sales: 245, revenue: 245000 },
            { name: 'Samsung Galaxy S24', sales: 189, revenue: 151200 },
            { name: 'MacBook Pro M3', sales: 156, revenue: 234000 },
            { name: 'AirPods Pro', sales: 298, revenue: 59600 },
            { name: 'iPad Air', sales: 134, revenue: 67000 }
          ]
        },
        categories: [
          { name: 'Electronics', revenue: 45000, percentage: 35.8 },
          { name: 'Fashion', revenue: 28000, percentage: 22.3 },
          { name: 'Home & Garden', revenue: 19000, percentage: 15.1 },
          { name: 'Automotive', revenue: 15000, percentage: 11.9 },
          { name: 'Health & Beauty', revenue: 12000, percentage: 9.6 },
          { name: 'Books & Media', revenue: 6000, percentage: 4.8 },
          { name: 'Baby & Kids', revenue: 1000, percentage: 0.8 }
        ]
      })
      setLoading(false)
    }, 1000)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:border-primary focus:ring-primary"
            aria-label="Select time range"
            title="Select time range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">{formatCurrency(analytics?.revenue.total || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.revenue.growth}%</span>
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
                <p className="text-2xl font-bold text-slate-900">{formatNumber(analytics?.orders.total || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.orders.growth}%</span>
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
                <p className="text-sm font-medium text-slate-600">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(analytics?.customers.total || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.customers.growth}%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Products</p>
                <p className="text-2xl font-bold text-slate-900">{formatNumber(analytics?.products.total || 0)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{analytics?.products.growth}%</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.revenue.monthly.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`bg-primary h-2 rounded-full ${
                          (month.amount / 70000) * 100 > 75 ? 'progress-bar-100' :
                          (month.amount / 70000) * 100 > 50 ? 'progress-bar-75' :
                          (month.amount / 70000) * 100 > 25 ? 'progress-bar-50' : 'progress-bar-25'
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{formatCurrency(month.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Orders Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.orders.monthly.map((month, index) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{month.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`bg-blue-500 h-2 rounded-full ${
                          (month.count / 700) * 100 > 75 ? 'progress-bar-100' :
                          (month.count / 700) * 100 > 50 ? 'progress-bar-75' :
                          (month.count / 700) * 100 > 25 ? 'progress-bar-50' : 'progress-bar-25'
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{formatNumber(month.count)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.products.topSelling.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600">{formatNumber(product.sales)} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-slate-600">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics?.categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-slate-600">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`bg-primary h-2 rounded-full ${
                          category.percentage > 75 ? 'progress-bar-100' :
                          category.percentage > 50 ? 'progress-bar-75' :
                          category.percentage > 25 ? 'progress-bar-50' : 'progress-bar-25'
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{category.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Download className="h-6 w-6 mb-2" />
              <span>Export Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Calendar className="h-6 w-6 mb-2" />
              <span>Schedule Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Eye className="h-6 w-6 mb-2" />
              <span>View Details</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
