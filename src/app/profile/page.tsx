'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Bell, 
  Shield, 
  Settings,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  fullName: string
  email: string
  phone: string
  avatar: string
  role: 'customer' | 'admin' | 'manager' | 'support' | 'delivery'
  memberSince: string
  totalOrders: number
  totalSpent: number
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  notifications: NotificationSettings
}

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  address: string
  city: string
  region: string
  phone: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: 'card' | 'mobile_money'
  name: string
  lastFour: string
  isDefault: boolean
}

interface NotificationSettings {
  email: {
    orders: boolean
    promotions: boolean
    security: boolean
  }
  sms: {
    orders: boolean
    promotions: boolean
  }
  push: {
    orders: boolean
    promotions: boolean
    groupBuys: boolean
  }
}

const emptyProfile: UserProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  avatar: '',
  role: 'customer',
  memberSince: new Date().toISOString(),
  totalOrders: 0,
  totalSpent: 0,
  addresses: [],
  paymentMethods: [],
  notifications: {
    email: { orders: true, promotions: false, security: true },
    sms: { orders: true, promotions: false },
    push: { orders: true, promotions: false, groupBuys: true }
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(emptyProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await (supabase as any).auth.getUser()
        if (!user) return
        const { data } = await (supabase as any)
          .from('profiles')
          .select('id, full_name, email, phone, role, created_at')
          .eq('id', user.id)
          .maybeSingle()
        if (data) {
          setProfile(prev => ({
            ...prev,
            id: data.id,
            fullName: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            role: (data.role as any) || 'customer',
            memberSince: data.created_at || prev.memberSince,
          }))
        }
      } catch {}
      finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleEdit = (field: string, currentValue: string) => {
    setEditingField(field)
    setEditValue(currentValue)
  }

  const handleSave = () => {
    if (editingField) {
      setProfile(prev => ({
        ...prev,
        [editingField]: editValue
      }))
    }
    setEditingField(null)
    setEditValue('')
  }

  const handleCancel = () => {
    setEditingField(null)
    setEditValue('')
  }

  const handleNotificationChange = (category: keyof NotificationSettings, setting: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category],
          [setting]: value
        }
      }
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <CardTitle className="text-xl">{profile.fullName}</CardTitle>
                <Badge className="w-fit mx-auto capitalize">{profile.role}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Member since</p>
                  <p className="font-medium">{formatDate(profile.memberSince)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">{profile.totalOrders}</p>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">GH₵{profile.totalSpent.toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full">
                      View Order History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {editingField === 'fullName' ? (
                            <>
                              <Input
                                id="fullName"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1"
                              />
                              <Button size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Input
                                id="fullName"
                                value={profile.fullName}
                                readOnly
                                className="flex-1"
                              />
                              <Button size="sm" variant="outline" onClick={() => handleEdit('fullName', profile.fullName)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {editingField === 'email' ? (
                            <>
                              <Input
                                id="email"
                                type="email"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1"
                              />
                              <Button size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Input
                                id="email"
                                value={profile.email}
                                readOnly
                                className="flex-1"
                              />
                              <Button size="sm" variant="outline" onClick={() => handleEdit('email', profile.email)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="flex items-center gap-2 mt-1">
                          {editingField === 'phone' ? (
                            <>
                              <Input
                                id="phone"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1"
                              />
                              <Button size="sm" onClick={handleSave}>
                                <Save className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Input
                                id="phone"
                                value={profile.phone}
                                readOnly
                                className="flex-1"
                              />
                              <Button size="sm" variant="outline" onClick={() => handleEdit('phone', profile.phone)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <h4 className="font-medium text-gray-900 mb-4">Account Security</h4>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="w-4 h-4 mr-2" />
                          Two-Factor Authentication
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Addresses
                      </CardTitle>
                      <Button onClick={() => setShowAddAddress(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.addresses.map((address) => (
                        <div key={address.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{address.name}</h4>
                              <Badge variant="outline" className="capitalize">{address.type}</Badge>
                              {address.isDefault && (
                                <Badge className="ml-2">Default</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.address}<br />
                            {address.city}, {address.region}<br />
                            {address.phone}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Methods */}
              <TabsContent value="payments">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Methods
                      </CardTitle>
                      <Button onClick={() => setShowAddPayment(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profile.paymentMethods.map((method) => (
                        <div key={method.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                                <CreditCard className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{method.name}</h4>
                                <p className="text-sm text-gray-600">**** **** **** {method.lastFour}</p>
                              </div>
                              {method.isDefault && (
                                <Badge>Default</Badge>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Email Notifications</h4>
                      <div className="space-y-3">
                        {Object.entries(profile.notifications.email).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <Button
                              size="sm"
                              variant={value ? "default" : "outline"}
                              onClick={() => handleNotificationChange('email', key, !value)}
                            >
                              {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">SMS Notifications</h4>
                      <div className="space-y-3">
                        {Object.entries(profile.notifications.sms).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <Button
                              size="sm"
                              variant={value ? "default" : "outline"}
                              onClick={() => handleNotificationChange('sms', key, !value)}
                            >
                              {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Push Notifications</h4>
                      <div className="space-y-3">
                        {Object.entries(profile.notifications.push).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {key.replace('_', ' ')}
                            </span>
                            <Button
                              size="sm"
                              variant={value ? "default" : "outline"}
                              onClick={() => handleNotificationChange('push', key, !value)}
                            >
                              {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
