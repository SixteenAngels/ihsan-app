'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, User, Package, Heart, CreditCard, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [saveInfo, setSaveInfo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await (supabase as any).auth.getUser()
        if (!user) return
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .maybeSingle()
        if (profile) {
          const fullName = profile.full_name || ''
          const [firstName, ...rest] = fullName.split(' ')
          const lastName = rest.join(' ')
          setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            email: profile.email || ''
          }))
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const sidebarItems = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'address', label: 'Address Book', icon: Package },
    { id: 'payment', label: 'My Payment Options', icon: CreditCard },
    { id: 'returns', label: 'My Returns', icon: Package },
    { id: 'cancellations', label: 'My Cancellations', icon: Package },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">My Account</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-accent transition-colors ${
                        activeTab === item.id 
                          ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                          : 'text-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Edit Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password Changes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Password Changes</h3>
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6">
                    <Button variant="outline">
                      Cancel
                    </Button>
                    <Button className="btn-primary">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'wishlist' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">My Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Save items you love for later</p>
                    <Button asChild>
                      <Link href="/categories">Start Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'address' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Address Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No saved addresses</h3>
                    <p className="text-muted-foreground mb-6">Add addresses for faster checkout</p>
                    <Button>Add New Address</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Payment Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No payment methods</h3>
                    <p className="text-muted-foreground mb-6">Add payment methods for faster checkout</p>
                    <Button>Add Payment Method</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'returns' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">My Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No returns yet</h3>
                    <p className="text-muted-foreground mb-6">Your return requests will appear here</p>
                    <Button asChild>
                      <Link href="/categories">Start Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'cancellations' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">My Cancellations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No cancellations</h3>
                    <p className="text-muted-foreground mb-6">Your cancelled orders will appear here</p>
                    <Button asChild>
                      <Link href="/categories">Start Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
