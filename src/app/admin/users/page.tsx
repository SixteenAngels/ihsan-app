'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-hot-toast'
import { Users, UserCheck, UserX, Search, Filter, MoreHorizontal, Shield, UserCog, Headphones, Truck } from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface User {
  id: string
  email: string
  full_name: string
  role: 'customer' | 'admin' | 'manager' | 'support' | 'delivery'
  avatar_url?: string
  is_active: boolean
  created_at: string
  last_login?: string
}

interface RoleStats {
  total: number
  customers: number
  admins: number
  managers: number
  support: number
  delivery: number
}

const roleConfig = {
  customer: { label: 'Customer', color: 'bg-blue-100 text-blue-800', icon: Users },
  admin: { label: 'Admin', color: 'bg-red-100 text-red-800', icon: Shield },
  manager: { label: 'Manager', color: 'bg-purple-100 text-purple-800', icon: UserCog },
  support: { label: 'Support', color: 'bg-green-100 text-green-800', icon: Headphones },
  delivery: { label: 'Delivery', color: 'bg-orange-100 text-orange-800', icon: Truck }
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [roleStats, setRoleStats] = useState<RoleStats>({
    total: 0,
    customers: 0,
    admins: 0,
    managers: 0,
    support: 0,
    delivery: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@ihsan.com',
        full_name: 'Admin User',
        role: 'admin',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        email: 'manager@ihsan.com',
        full_name: 'Manager User',
        role: 'manager',
        is_active: true,
        created_at: '2024-01-02T00:00:00Z',
        last_login: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        email: 'support@ihsan.com',
        full_name: 'Support Agent',
        role: 'support',
        is_active: true,
        created_at: '2024-01-03T00:00:00Z',
        last_login: '2024-01-15T08:45:00Z'
      },
      {
        id: '4',
        email: 'delivery@ihsan.com',
        full_name: 'Delivery Agent',
        role: 'delivery',
        is_active: true,
        created_at: '2024-01-04T00:00:00Z',
        last_login: '2024-01-15T07:30:00Z'
      },
      {
        id: '5',
        email: 'customer1@example.com',
        full_name: 'John Doe',
        role: 'customer',
        is_active: true,
        created_at: '2024-01-05T00:00:00Z',
        last_login: '2024-01-15T06:20:00Z'
      },
      {
        id: '6',
        email: 'customer2@example.com',
        full_name: 'Jane Smith',
        role: 'customer',
        is_active: false,
        created_at: '2024-01-06T00:00:00Z',
        last_login: '2024-01-10T14:15:00Z'
      }
    ]

    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
    
    // Calculate role stats
    const stats: RoleStats = {
      total: mockUsers.length,
      customers: mockUsers.filter(u => u.role === 'customer').length,
      admins: mockUsers.filter(u => u.role === 'admin').length,
      managers: mockUsers.filter(u => u.role === 'manager').length,
      support: mockUsers.filter(u => u.role === 'support').length,
      delivery: mockUsers.filter(u => u.role === 'delivery').length
    }
    setRoleStats(stats)
    setLoading(false)
  }, [])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.is_active : !user.is_active
      )
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleRoleChange = async (user: User, newRole: string) => {
    try {
      // API call to update user role
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        // Update local state
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, role: newRole as any } : u
        ))
        toast.success(`Role updated to ${roleConfig[newRole as keyof typeof roleConfig].label}`)
        setIsRoleDialogOpen(false)
        setSelectedUser(null)
      } else {
        throw new Error('Failed to update role')
      }
    } catch (error) {
      toast.error('Failed to update user role')
      console.error('Error updating role:', error)
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !user.is_active }),
      })

      if (response.ok) {
        setUsers(prev => prev.map(u => 
          u.id === user.id ? { ...u, is_active: !u.is_active } : u
        ))
        toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`)
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      toast.error('Failed to update user status')
      console.error('Error updating status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={slideInFromLeft} className="text-center">
          <h1 className="text-4xl font-bold mb-4">User Management</h1>
          <p className="text-xl text-muted-foreground">
            Manage user roles, permissions, and account status
          </p>
        </motion.div>

        {/* Role Statistics */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(roleStats).map(([key, value]) => {
            if (key === 'total') return null
            const role = key as keyof typeof roleConfig
            const config = roleConfig[role]
            const Icon = config.icon
            
            return (
              <Card key={key} className="text-center">
                <CardContent className="pt-6">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{value}</div>
                  <div className="text-sm text-muted-foreground">{config.label}s</div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search Users</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="role-filter">Role</Label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('')
                      setRoleFilter('all')
                      setStatusFilter('all')
                    }}
                    className="w-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Users ({filteredUsers.length})</CardTitle>
              <CardDescription>
                Manage user roles and account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const config = roleConfig[user.role]
                  const Icon = config.icon
                  
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={config.color}>
                              <Icon className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user)
                            setNewRole(user.role)
                            setIsRoleDialogOpen(true)
                          }}
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Change Role
                        </Button>
                        
                        <Button
                          variant={user.is_active ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.is_active ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Role Change Dialog */}
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Change the role for {selectedUser?.full_name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-role">New Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <config.icon className="h-4 w-4 mr-2" />
                          {config.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedUser && handleRoleChange(selectedUser, newRole)}
                disabled={newRole === selectedUser?.role}
              >
                Update Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}