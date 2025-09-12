'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  Lock, 
  Unlock,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShoppingBag,
  MessageSquare,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface PrivacySettings {
  dataCollection: {
    analytics: boolean
    marketing: boolean
    personalization: boolean
    location: boolean
  }
  dataSharing: {
    thirdParty: boolean
    partners: boolean
    advertisers: boolean
    research: boolean
  }
  communication: {
    email: boolean
    sms: boolean
    push: boolean
    phone: boolean
  }
  dataRetention: {
    accountData: number // days
    orderHistory: number // days
    analyticsData: number // days
    supportData: number // days
  }
}

interface DataRequest {
  id: string
  type: 'export' | 'deletion' | 'correction'
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  requestedAt: string
  completedAt?: string
  reason?: string
}

export default function PrivacySettings() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataCollection: {
      analytics: true,
      marketing: false,
      personalization: true,
      location: true
    },
    dataSharing: {
      thirdParty: false,
      partners: true,
      advertisers: false,
      research: false
    },
    communication: {
      email: true,
      sms: false,
      push: true,
      phone: false
    },
    dataRetention: {
      accountData: 2555, // 7 years
      orderHistory: 1095, // 3 years
      analyticsData: 365, // 1 year
      supportData: 730 // 2 years
    }
  })
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showDataRequestDialog, setShowDataRequestDialog] = useState(false)
  const [requestType, setRequestType] = useState<'export' | 'deletion' | 'correction'>('export')
  const [requestReason, setRequestReason] = useState('')

  useEffect(() => {
    loadPrivacySettings()
    loadDataRequests()
  }, [])

  const loadPrivacySettings = async () => {
    try {
      const response = await fetch('/api/privacy/settings')
      if (response.ok) {
        const data = await response.json()
        setPrivacySettings(data.settings)
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error)
    }
  }

  const loadDataRequests = async () => {
    try {
      const response = await fetch('/api/privacy/requests')
      if (response.ok) {
        const data = await response.json()
        setDataRequests(data.requests)
      }
    } catch (error) {
      console.error('Error loading data requests:', error)
    }
  }

  const updatePrivacySettings = async (newSettings: PrivacySettings) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/privacy/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: newSettings }),
      })

      if (response.ok) {
        setPrivacySettings(newSettings)
        toast.success('Privacy settings updated successfully')
      } else {
        throw new Error('Failed to update privacy settings')
      }
    } catch (error) {
      toast.error('Failed to update privacy settings')
      console.error('Error updating privacy settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const submitDataRequest = async () => {
    if (!requestReason.trim()) {
      toast.error('Please provide a reason for your request')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/privacy/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: requestType,
          reason: requestReason
        }),
      })

      if (response.ok) {
        toast.success('Data request submitted successfully')
        setShowDataRequestDialog(false)
        setRequestReason('')
        loadDataRequests()
      } else {
        throw new Error('Failed to submit data request')
      }
    } catch (error) {
      toast.error('Failed to submit data request')
      console.error('Error submitting data request:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadDataExport = async (requestId: string) => {
    try {
      const response = await fetch(`/api/privacy/export/${requestId}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `ihsan-data-export-${requestId}.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success('Data export downloaded')
      } else {
        throw new Error('Failed to download data export')
      }
    } catch (error) {
      toast.error('Failed to download data export')
      console.error('Error downloading data export:', error)
    }
  }

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'export':
        return <Download className="h-4 w-4" />
      case 'deletion':
        return <Trash2 className="h-4 w-4" />
      case 'correction':
        return <Settings className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getRequestStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatRetentionPeriod = (days: number): string => {
    if (days >= 365) {
      const years = Math.floor(days / 365)
      return `${years} year${years > 1 ? 's' : ''}`
    } else if (days >= 30) {
      const months = Math.floor(days / 30)
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      return `${days} day${days > 1 ? 's' : ''}`
    }
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
          <h1 className="text-4xl font-bold mb-4">Privacy & Data Protection</h1>
          <p className="text-xl text-muted-foreground">
            Manage your privacy settings and data protection preferences
          </p>
        </motion.div>

        {/* Privacy Settings Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="collection" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="collection">Data Collection</TabsTrigger>
              <TabsTrigger value="sharing">Data Sharing</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="retention">Data Retention</TabsTrigger>
            </TabsList>

            {/* Data Collection */}
            <TabsContent value="collection" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Data Collection Preferences
                  </CardTitle>
                  <CardDescription>
                    Control what data we collect about you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="analytics" className="text-base font-medium">
                          Analytics Data
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Help us improve our service by sharing usage analytics
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="analytics"
                      checked={privacySettings.dataCollection.analytics}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataCollection: {
                            ...privacySettings.dataCollection,
                            analytics: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="marketing" className="text-base font-medium">
                          Marketing Data
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Allow collection of data for personalized marketing
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="marketing"
                      checked={privacySettings.dataCollection.marketing}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataCollection: {
                            ...privacySettings.dataCollection,
                            marketing: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="personalization" className="text-base font-medium">
                          Personalization Data
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Collect data to personalize your experience
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="personalization"
                      checked={privacySettings.dataCollection.personalization}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataCollection: {
                            ...privacySettings.dataCollection,
                            personalization: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="location" className="text-base font-medium">
                          Location Data
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Allow collection of location data for delivery services
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="location"
                      checked={privacySettings.dataCollection.location}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataCollection: {
                            ...privacySettings.dataCollection,
                            location: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Sharing */}
            <TabsContent value="sharing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Data Sharing Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how your data is shared with third parties
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="third-party" className="text-base font-medium">
                          Third-Party Services
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Share data with third-party service providers
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="third-party"
                      checked={privacySettings.dataSharing.thirdParty}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataSharing: {
                            ...privacySettings.dataSharing,
                            thirdParty: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="partners" className="text-base font-medium">
                          Business Partners
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Share data with trusted business partners
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="partners"
                      checked={privacySettings.dataSharing.partners}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataSharing: {
                            ...privacySettings.dataSharing,
                            partners: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="advertisers" className="text-base font-medium">
                          Advertisers
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Allow data sharing with advertisers for targeted ads
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="advertisers"
                      checked={privacySettings.dataSharing.advertisers}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataSharing: {
                            ...privacySettings.dataSharing,
                            advertisers: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="research" className="text-base font-medium">
                          Research & Development
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Allow anonymized data for research purposes
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="research"
                      checked={privacySettings.dataSharing.research}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          dataSharing: {
                            ...privacySettings.dataSharing,
                            research: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Communication */}
            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Communication Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how we communicate with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="email-comm" className="text-base font-medium">
                          Email Communications
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Receive emails about orders, updates, and promotions
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="email-comm"
                      checked={privacySettings.communication.email}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          communication: {
                            ...privacySettings.communication,
                            email: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="sms-comm" className="text-base font-medium">
                          SMS Communications
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Receive SMS notifications about orders and updates
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="sms-comm"
                      checked={privacySettings.communication.sms}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          communication: {
                            ...privacySettings.communication,
                            sms: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="push-comm" className="text-base font-medium">
                          Push Notifications
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Receive push notifications on your device
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="push-comm"
                      checked={privacySettings.communication.push}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          communication: {
                            ...privacySettings.communication,
                            push: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label htmlFor="phone-comm" className="text-base font-medium">
                          Phone Calls
                        </Label>
                        <div className="text-sm text-muted-foreground">
                          Allow phone calls for important updates and support
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="phone-comm"
                      checked={privacySettings.communication.phone}
                      onCheckedChange={(checked) => {
                        const newSettings = {
                          ...privacySettings,
                          communication: {
                            ...privacySettings.communication,
                            phone: checked
                          }
                        }
                        updatePrivacySettings(newSettings)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Retention */}
            <TabsContent value="retention" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Data Retention Settings
                  </CardTitle>
                  <CardDescription>
                    Control how long we keep your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Account Data</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        How long to keep your account information
                      </div>
                      <div className="text-lg font-bold">
                        {formatRetentionPeriod(privacySettings.dataRetention.accountData)}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Order History</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        How long to keep your order records
                      </div>
                      <div className="text-lg font-bold">
                        {formatRetentionPeriod(privacySettings.dataRetention.orderHistory)}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Analytics Data</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        How long to keep usage analytics
                      </div>
                      <div className="text-lg font-bold">
                        {formatRetentionPeriod(privacySettings.dataRetention.analyticsData)}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium">Support Data</Label>
                      <div className="text-sm text-muted-foreground mb-2">
                        How long to keep support tickets and communications
                      </div>
                      <div className="text-lg font-bold">
                        {formatRetentionPeriod(privacySettings.dataRetention.supportData)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Data Requests */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Data Requests
                </div>
                <Button onClick={() => setShowDataRequestDialog(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </CardTitle>
              <CardDescription>
                Request data export, deletion, or correction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No data requests</h3>
                    <p className="text-muted-foreground">You haven't made any data requests yet.</p>
                  </div>
                ) : (
                  dataRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        {getRequestTypeIcon(request.type)}
                        <div>
                          <div className="font-medium capitalize">{request.type} Request</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(request.requestedAt).toLocaleDateString('en-GH')}
                          </div>
                          {request.reason && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {request.reason}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded ${getRequestStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        {request.type === 'export' && request.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadDataExport(request.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data Request Dialog */}
        <Dialog open={showDataRequestDialog} onOpenChange={setShowDataRequestDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Data Request</DialogTitle>
              <DialogDescription>
                Choose the type of data request you want to make
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="request-type">Request Type</Label>
                <select
                  id="request-type"
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as 'export' | 'deletion' | 'correction')}
                  className="w-full p-2 border rounded-md"
                  aria-label="Select request type"
                >
                  <option value="export">Data Export</option>
                  <option value="deletion">Data Deletion</option>
                  <option value="correction">Data Correction</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="request-reason">Reason for Request</Label>
                <Textarea
                  id="request-reason"
                  placeholder="Please explain why you need this data request..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDataRequestDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitDataRequest}
                disabled={isLoading || !requestReason.trim()}
              >
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
