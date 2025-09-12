'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  FileText,
  Camera,
  Paperclip,
  Send,
  User,
  Store,
  Package,
  DollarSign,
  Calendar,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Flag,
  Shield,
  Gavel,
  Scale,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'
import { useCurrency } from '@/lib/currency-context'

interface Dispute {
  id: string
  orderId: string
  customerName: string
  vendorName: string
  productName: string
  amount: number
  reason: string
  description: string
  status: 'open' | 'in_review' | 'resolved' | 'closed' | 'escalated'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  resolution?: string
  evidence: Evidence[]
  messages: DisputeMessage[]
}

interface Evidence {
  id: string
  type: 'image' | 'document' | 'video'
  url: string
  uploadedBy: string
  uploadedAt: string
  description?: string
}

interface DisputeMessage {
  id: string
  sender: string
  senderType: 'customer' | 'vendor' | 'admin' | 'support'
  message: string
  timestamp: string
  attachments?: Evidence[]
}

interface DisputeStats {
  totalDisputes: number
  openDisputes: number
  resolvedDisputes: number
  escalatedDisputes: number
  averageResolutionTime: number
  resolutionRate: number
}

export default function DisputeManagementSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'disputes' | 'resolution' | 'analytics'>('overview')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [newMessage, setNewMessage] = useState('')
  const { formatCurrency } = useCurrency()

  // Mock dispute data
  const disputes: Dispute[] = [
    {
      id: 'DIS-001',
      orderId: 'ORD-2024-001',
      customerName: 'John Doe',
      vendorName: 'African Naturals',
      productName: 'Premium Ghana Shea Butter',
      amount: 45.99,
      reason: 'Product damaged during shipping',
      description: 'The product arrived with damaged packaging and the contents were spilled. The product is unusable.',
      status: 'in_review',
      priority: 'high',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      assignedTo: 'Support Agent Sarah',
      evidence: [
        {
          id: '1',
          type: 'image',
          url: '/api/placeholder/200/200',
          uploadedBy: 'John Doe',
          uploadedAt: '2024-01-15T11:00:00Z',
          description: 'Damaged product packaging'
        }
      ],
      messages: [
        {
          id: '1',
          sender: 'John Doe',
          senderType: 'customer',
          message: 'I received my order but the product was damaged during shipping. The packaging was torn and the contents were spilled.',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          sender: 'African Naturals',
          senderType: 'vendor',
          message: 'We apologize for the inconvenience. We will investigate this matter and provide a resolution within 24 hours.',
          timestamp: '2024-01-15T12:15:00Z'
        }
      ]
    },
    {
      id: 'DIS-002',
      orderId: 'ORD-2024-002',
      customerName: 'Jane Smith',
      vendorName: 'Heritage Crafts',
      productName: 'Handwoven Kente Cloth',
      amount: 89.50,
      reason: 'Product not as described',
      description: 'The product received does not match the description or images shown on the website.',
      status: 'open',
      priority: 'medium',
      createdAt: '2024-01-14T16:45:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      evidence: [],
      messages: [
        {
          id: '1',
          sender: 'Jane Smith',
          senderType: 'customer',
          message: 'The kente cloth I received looks completely different from what was shown in the product images. The colors and pattern are not the same.',
          timestamp: '2024-01-14T16:45:00Z'
        }
      ]
    },
    {
      id: 'DIS-003',
      orderId: 'ORD-2024-003',
      customerName: 'Mike Johnson',
      vendorName: 'Tropical Essentials',
      productName: 'Organic Coconut Oil',
      amount: 67.25,
      reason: 'Late delivery',
      description: 'Order was delivered 5 days after the estimated delivery date.',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-10T09:20:00Z',
      updatedAt: '2024-01-12T15:30:00Z',
      assignedTo: 'Support Agent Tom',
      resolution: 'Compensation provided for delayed delivery. Customer satisfied with resolution.',
      evidence: [],
      messages: [
        {
          id: '1',
          sender: 'Mike Johnson',
          senderType: 'customer',
          message: 'My order was supposed to arrive on January 8th but it only arrived today (January 13th). This is unacceptable.',
          timestamp: '2024-01-10T09:20:00Z'
        },
        {
          id: '2',
          sender: 'Support Agent Tom',
          senderType: 'support',
          message: 'We apologize for the delay. We have provided a 20% discount on your order as compensation.',
          timestamp: '2024-01-12T15:30:00Z'
        }
      ]
    }
  ]

  const stats: DisputeStats = {
    totalDisputes: disputes.length,
    openDisputes: disputes.filter(d => d.status === 'open').length,
    resolvedDisputes: disputes.filter(d => d.status === 'resolved').length,
    escalatedDisputes: disputes.filter(d => d.status === 'escalated').length,
    averageResolutionTime: 2.5,
    resolutionRate: 85.5
  }

  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dispute.productName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || dispute.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || dispute.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500'
      case 'in_review': return 'bg-yellow-500'
      case 'resolved': return 'bg-green-500'
      case 'closed': return 'bg-gray-500'
      case 'escalated': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertTriangle
      case 'in_review': return Clock
      case 'resolved': return CheckCircle
      case 'closed': return XCircle
      case 'escalated': return Flag
      default: return AlertTriangle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'high': return 'bg-orange-100 text-orange-700'
      case 'urgent': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDispute) return
    
    const message: DisputeMessage = {
      id: Date.now().toString(),
      sender: 'Support Agent',
      senderType: 'support',
      message: newMessage,
      timestamp: new Date().toISOString()
    }
    
    // In a real app, this would update the dispute in the database
    console.log('Sending message:', message)
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Gavel className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Dispute Management System</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Comprehensive dispute resolution and customer support management
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial="initial"
          animate="in"
          variants={slideInFromBottom}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
                  { id: 'resolution', label: 'Resolution', icon: Scale },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'outline'}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Disputes', value: stats.totalDisputes.toString(), icon: AlertTriangle, color: 'text-red-600' },
                  { label: 'Open Disputes', value: stats.openDisputes.toString(), icon: Clock, color: 'text-yellow-600' },
                  { label: 'Resolved Disputes', value: stats.resolvedDisputes.toString(), icon: CheckCircle, color: 'text-green-600' },
                  { label: 'Resolution Rate', value: `${stats.resolutionRate}%`, icon: TrendingUp, color: 'text-blue-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-gray-100`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Recent Disputes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Disputes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {disputes.slice(0, 5).map((dispute, index) => {
                      const StatusIcon = getStatusIcon(dispute.status)
                      return (
                        <motion.div
                          key={dispute.id}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedDispute(dispute)}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-full ${getStatusColor(dispute.status)}`}>
                                    <StatusIcon className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{dispute.id}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {dispute.customerName} vs {dispute.vendorName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{dispute.reason}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {formatCurrency(dispute.amount)}
                                  </p>
                                  <div className="flex gap-2">
                                    <Badge variant="secondary" className={getStatusColor(dispute.status)}>
                                      {dispute.status}
                                    </Badge>
                                    <Badge className={getPriorityColor(dispute.priority)}>
                                      {dispute.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'disputes' && (
            <motion.div
              key="disputes"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search disputes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        aria-label="Filter disputes by status"
                      >
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="in_review">In Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                        <option value="escalated">Escalated</option>
                      </select>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md"
                        aria-label="Filter disputes by priority"
                      >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disputes List */}
              <div className="space-y-4">
                {filteredDisputes.map((dispute, index) => {
                  const StatusIcon = getStatusIcon(dispute.status)
                  return (
                    <motion.div
                      key={dispute.id}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-full ${getStatusColor(dispute.status)}`}>
                                <StatusIcon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{dispute.id}</h3>
                                <p className="text-muted-foreground">
                                  {dispute.customerName} vs {dispute.vendorName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {dispute.productName} • {dispute.reason}
                                </p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{dispute.messages.length} messages</span>
                                  </div>
                                  {dispute.assignedTo && (
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      <span>{dispute.assignedTo}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right space-y-2">
                              <p className="text-xl font-bold">
                                {formatCurrency(dispute.amount)}
                              </p>
                              <div className="flex gap-2">
                                <Badge variant="secondary" className={getStatusColor(dispute.status)}>
                                  {dispute.status}
                                </Badge>
                                <Badge className={getPriorityColor(dispute.priority)}>
                                  {dispute.priority}
                                </Badge>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => setSelectedDispute(dispute)}>
                                  <Eye className="w-3 h-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-3 h-3 mr-1" />
                                  Resolve
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'resolution' && (
            <motion.div
              key="resolution"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Dispute Resolution Center
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Gavel className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Resolution Tools</h3>
                    <p className="text-muted-foreground mb-4">
                      Access mediation tools, evidence review, and resolution templates
                    </p>
                    <Button>
                      <Eye className="w-4 h-4 mr-2" />
                      Access Resolution Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Dispute Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                    <p className="text-muted-foreground mb-4">
                      Track dispute trends, resolution times, and customer satisfaction metrics
                    </p>
                    <Button>
                      <Eye className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDispute(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="border-0 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>Dispute Details - {selectedDispute.id}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedDispute(null)}
                  >
                    ✕
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Dispute Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Dispute Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dispute ID:</span>
                          <span className="font-medium">{selectedDispute.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order ID:</span>
                          <span className="font-medium">{selectedDispute.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedDispute.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="secondary" className={getStatusColor(selectedDispute.status)}>
                            {selectedDispute.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Priority:</span>
                          <Badge className={getPriorityColor(selectedDispute.priority)}>
                            {selectedDispute.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Parties Involved</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Customer</p>
                            <p className="text-sm text-muted-foreground">{selectedDispute.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Vendor</p>
                            <p className="text-sm text-muted-foreground">{selectedDispute.vendorName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Product</p>
                            <p className="text-sm text-muted-foreground">{selectedDispute.productName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dispute Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Dispute Details</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium">Reason:</h4>
                        <p className="text-muted-foreground">{selectedDispute.reason}</p>
                      </div>
                      <div>
                        <h4 className="font-medium">Description:</h4>
                        <p className="text-muted-foreground">{selectedDispute.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Messages</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {selectedDispute.messages.map((message) => (
                        <div key={message.id} className="flex gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.senderType === 'customer' ? 'bg-blue-100' :
                            message.senderType === 'vendor' ? 'bg-green-100' :
                            'bg-purple-100'
                          }`}>
                            <User className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{message.sender}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Message Input */}
                    <div className="mt-4 flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Add Evidence
                    </Button>
                    <Button>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Resolve Dispute
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
