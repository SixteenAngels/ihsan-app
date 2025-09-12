'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Truck, 
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    totalUsers: number
    totalProducts: number
    revenueGrowth: number
    ordersGrowth: number
    usersGrowth: number
  }
  sales: {
    daily: Array<{ date: string; revenue: number; orders: number }>
    monthly: Array<{ month: string; revenue: number; orders: number }>
  }
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
    growth: number
  }>
  groupBuyTrends: {
    activeCampaigns: number
    totalParticipants: number
    totalSavings: number
    completionRate: number
  }
  deliveryMetrics: {
    totalDeliveries: number
    onTimeRate: number
    averageDeliveryTime: number
    activeAgents: number
  }
  userEngagement: {
    newUsers: number
    returningUsers: number
    averageSessionTime: number
    conversionRate: number
  }
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: AnalyticsData = {
      overview: {
        totalRevenue: 125000,
        totalOrders: 1250,
        totalUsers: 850,
        totalProducts: 150,
        revenueGrowth: 12.5,
        ordersGrowth: 8.3,
        usersGrowth: 15.2
      },
      sales: {
        daily: [
          { date: '2024-01-01', revenue: 1200, orders: 12 },
          { date: '2024-01-02', revenue: 1500, orders: 15 },
          { date: '2024-01-03', revenue: 1800, orders: 18 },
          { date: '2024-01-04', revenue: 2100, orders: 21 },
          { date: '2024-01-05', revenue: 1900, orders: 19 },
          { date: '2024-01-06', revenue: 2200, orders: 22 },
          { date: '2024-01-07', revenue: 2500, orders: 25 }
        ],
        monthly: [
          { month: 'Jan', revenue: 45000, orders: 450 },
          { month: 'Feb', revenue: 52000, orders: 520 },
          { month: 'Mar', revenue: 48000, orders: 480 },
          { month: 'Apr', revenue: 61000, orders: 610 },
          { month: 'May', revenue: 58000, orders: 580 },
          { month: 'Jun', revenue: 67000, orders: 670 }
        ]
      },
      topProducts: [
        { id: '1', name: 'iPhone 15 Pro', sales: 45, revenue: 202500, growth: 15.2 },
        { id: '2', name: 'Nike Air Max 270', sales: 78, revenue: 27300, growth: 8.5 },
        { id: '3', name: 'Ghana Shea Butter', sales: 120, revenue: 3000, growth: 22.1 },
        { id: '4', name: 'Samsung Galaxy S24', sales: 32, revenue: 128000, growth: -5.2 },
        { id: '5', name: 'MacBook Pro M3', sales: 18, revenue: 180000, growth: 12.8 }
      ],
      groupBuyTrends: {
        activeCampaigns: 12,
        totalParticipants: 450,
        totalSavings: 25000,
        completionRate: 78.5
      },
      deliveryMetrics: {
        totalDeliveries: 1250,
        onTimeRate: 92.5,
        averageDeliveryTime: 2.3,
        activeAgents: 8
      },
      userEngagement: {
        newUsers: 125,
        returningUsers: 725,
        averageSessionTime: 8.5,
        conversionRate: 3.2
      }
    }

    setAnalyticsData(mockData)
    setLoading(false)
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-GH').format(num)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={slideInFromLeft} className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Comprehensive insights into your business performance
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Overview Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.overview.totalRevenue)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {analyticsData.overview.revenueGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={analyticsData.overview.revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(analyticsData.overview.revenueGrowth)}%
                </span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalOrders)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {analyticsData.overview.ordersGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={analyticsData.overview.ordersGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(analyticsData.overview.ordersGrowth)}%
                </span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalUsers)}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {analyticsData.overview.usersGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={analyticsData.overview.usersGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(analyticsData.overview.usersGrowth)}%
                </span>
                <span className="ml-1">from last period</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalProducts)}</div>
              <div className="text-xs text-muted-foreground">
                Active products in catalog
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Analytics Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="sales" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Top Products</TabsTrigger>
              <TabsTrigger value="groupbuy">Group Buy</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            {/* Sales Analytics */}
            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Daily revenue over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.sales.daily.map((day, index) => (
                        <div key={day.date} className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            {new Date(day.date).toLocaleDateString('en-GH', { weekday: 'short' })}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-muted-foreground">
                              {day.orders} orders
                            </div>
                            <div className="text-sm font-medium">
                              {formatCurrency(day.revenue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Performance</CardTitle>
                    <CardDescription>Revenue and orders by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analyticsData.sales.monthly.map((month) => (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{month.month}</span>
                            <span className="text-muted-foreground">{month.orders} orders</span>
                          </div>
                          <div className="text-lg font-bold">{formatCurrency(month.revenue)}</div>
                          <Progress 
                            value={(month.revenue / Math.max(...analyticsData.sales.monthly.map(m => m.revenue))) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Top Products */}
            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                  <CardDescription>Best selling products by revenue and growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topProducts.map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl font-bold text-muted-foreground">#{index + 1}</div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.sales} sales
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(product.revenue)}</div>
                          <div className="flex items-center text-sm">
                            {product.growth > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            <span className={product.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                              {Math.abs(product.growth)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Group Buy Trends */}
            <TabsContent value="groupbuy" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.groupBuyTrends.activeCampaigns}</div>
                    <div className="text-xs text-muted-foreground">
                      Currently running
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.groupBuyTrends.totalParticipants)}</div>
                    <div className="text-xs text-muted-foreground">
                      Across all campaigns
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(analyticsData.groupBuyTrends.totalSavings)}</div>
                    <div className="text-xs text-muted-foreground">
                      Customer savings
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.groupBuyTrends.completionRate}%</div>
                    <div className="text-xs text-muted-foreground">
                      Successful campaigns
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Delivery Metrics */}
            <TabsContent value="delivery" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.deliveryMetrics.totalDeliveries)}</div>
                    <div className="text-xs text-muted-foreground">
                      Completed deliveries
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.deliveryMetrics.onTimeRate}%</div>
                    <div className="text-xs text-muted-foreground">
                      Delivered on time
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.deliveryMetrics.averageDeliveryTime}h</div>
                    <div className="text-xs text-muted-foreground">
                      Average delivery time
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.deliveryMetrics.activeAgents}</div>
                    <div className="text-xs text-muted-foreground">
                      Currently active
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* User Engagement */}
            <TabsContent value="engagement" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">New Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.userEngagement.newUsers)}</div>
                    <div className="text-xs text-muted-foreground">
                      This period
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Returning Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.userEngagement.returningUsers)}</div>
                    <div className="text-xs text-muted-foreground">
                      Repeat customers
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.userEngagement.averageSessionTime}m</div>
                    <div className="text-xs text-muted-foreground">
                      Average session
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.userEngagement.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">
                      Visitors to customers
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  )
}
