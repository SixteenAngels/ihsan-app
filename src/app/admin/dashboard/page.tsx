'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Truck,
  MessageCircle,
  Settings,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { PermissionGate } from '@/lib/auth-context'
import { getUserPermissions, getRoleDisplayName } from '@/lib/roles'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  completedOrders: number
  activeGroupBuys: number
  supportTickets: number
}

const mockStats: DashboardStats = {
  totalOrders: 1247,
  totalRevenue: 45680.50,
  totalUsers: 892,
  totalProducts: 156,
  pendingOrders: 23,
  completedOrders: 1189,
  activeGroupBuys: 8,
  supportTickets: 12
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats] = useState<DashboardStats>(mockStats)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  const permissions = getUserPermissions(user.role)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {user.fullName}</p>
            </div>
            <div className="text-right">
              <Badge className="bg-blue-100 text-blue-800">
                {getRoleDisplayName(user.role)}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">Last login: Today</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PermissionGate permission="canViewAnalytics">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </PermissionGate>

          <PermissionGate permission="canViewFullAnalytics">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">GH₵{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </PermissionGate>

          <PermissionGate permission="canManageUsers">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </PermissionGate>

          <PermissionGate permission="canManageProducts">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </PermissionGate>
        </div>

        {/* Role-specific Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <PermissionGate permission="canManageProducts">
              <TabsTrigger value="products">Products</TabsTrigger>
            </PermissionGate>
            <PermissionGate permission="canManageOrders">
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </PermissionGate>
            <PermissionGate permission="canManageUsers">
              <TabsTrigger value="users">Users</TabsTrigger>
            </PermissionGate>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <PermissionGate permission="canManageOrders">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #ORD-2024-001</p>
                          <p className="text-sm text-gray-600">Kwame Asante</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">GH₵245.50</p>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #ORD-2024-002</p>
                          <p className="text-sm text-gray-600">Sarah Mensah</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">GH₵189.99</p>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #ORD-2024-003</p>
                          <p className="text-sm text-gray-600">John Doe</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">GH₵89.50</p>
                          <Badge className="bg-blue-100 text-blue-800">Shipped</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/admin/orders">View All Orders</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </PermissionGate>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <PermissionGate permission="canManageProducts">
                      <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/admin/products">
                          <Package className="w-6 h-6 mb-2" />
                          Manage Products
                        </Link>
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission="canManageOrders">
                      <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/admin/orders">
                          <ShoppingCart className="w-6 h-6 mb-2" />
                          Manage Orders
                        </Link>
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission="canManageUsers">
                      <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/admin/users">
                          <Users className="w-6 h-6 mb-2" />
                          Manage Users
                        </Link>
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission="canManageGroupBuys">
                      <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/admin/group-buys">
                          <TrendingUp className="w-6 h-6 mb-2" />
                          Group Buys
                        </Link>
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission="canManageSupportTickets">
                      <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/admin/support">
                          <MessageCircle className="w-6 h-6 mb-2" />
                          Support Tickets
                        </Link>
                      </Button>
                    </PermissionGate>

                    <PermissionGate permission="canManageDeliveries">
                      <Button variant="outline" className="h-20 flex-col" asChild>
                        <Link href="/admin/deliveries">
                          <Truck className="w-6 h-6 mb-2" />
                          Deliveries
                        </Link>
                      </Button>
                    </PermissionGate>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <PermissionGate permission="canManageProducts">
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Product Management</CardTitle>
                    <Button asChild>
                      <Link href="/admin/products">Manage Products</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                      <p className="text-sm text-gray-600">Total Products</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">142</p>
                      <p className="text-sm text-gray-600">Active Products</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">14</p>
                      <p className="text-sm text-gray-600">Low Stock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </PermissionGate>

          {/* Orders Tab */}
          <PermissionGate permission="canManageOrders">
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Order Management</CardTitle>
                    <Button asChild>
                      <Link href="/admin/orders">Manage Orders</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                      <p className="text-sm text-gray-600">Pending</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">35</p>
                      <p className="text-sm text-gray-600">In Transit</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.completedOrders}</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-gray-600">Issues</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </PermissionGate>

          {/* Users Tab */}
          <PermissionGate permission="canManageUsers">
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>User Management</CardTitle>
                    <Button asChild>
                      <Link href="/admin/users">Manage Users</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">856</p>
                      <p className="text-sm text-gray-600">Active Users</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">23</p>
                      <p className="text-sm text-gray-600">New This Week</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-sm text-gray-600">Staff Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </PermissionGate>
        </Tabs>
      </div>
    </div>
  )
}
