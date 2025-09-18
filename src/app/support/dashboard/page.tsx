'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'react-toastify'
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  Package, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Send,
  Star,
  FileText,
  Calendar
} from 'lucide-react'
import { fadeIn, slideInFromLeft, staggerContainer, staggerItem } from '@/lib/animations'

interface SupportTicket {
  id: string
  ticketNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  subject: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  category: 'order' | 'product' | 'payment' | 'delivery' | 'technical' | 'general'
  assignedTo?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  orderId?: string
  orderNumber?: string
  messages: Array<{
    id: string
    senderId: string
    senderName: string
    senderType: 'customer' | 'agent'
    message: string
    timestamp: string
    attachments?: string[]
  }>
  customerRating?: number
  customerFeedback?: string
}

interface SupportStats {
  totalTickets: number
  openTickets: number
  resolvedToday: number
  averageResponseTime: number
  customerSatisfaction: number
}

export default function SupportAgentDashboard() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([])
  const [stats, setStats] = useState<SupportStats>({
    totalTickets: 0,
    openTickets: 0,
    resolvedToday: 0,
    averageResponseTime: 0,
    customerSatisfaction: 0
  })
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [isNewTicketDialogOpen, setIsNewTicketDialogOpen] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockTickets: SupportTicket[] = [
      {
        id: '1',
        ticketNumber: 'TKT-001',
        customerId: '1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+233 24 123 4567',
        subject: 'Order not delivered',
        description: 'My order was supposed to be delivered yesterday but I haven\'t received it yet.',
        priority: 'high',
        status: 'open',
        category: 'delivery',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        orderId: '1',
        orderNumber: 'ORD-001',
        messages: [
          {
            id: '1',
            senderId: '1',
            senderName: 'John Doe',
            senderType: 'customer',
            message: 'My order was supposed to be delivered yesterday but I haven\'t received it yet. Can you please check the status?',
            timestamp: '2024-01-15T10:00:00Z'
          }
        ]
      },
      {
        id: '2',
        ticketNumber: 'TKT-002',
        customerId: '2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+233 24 987 6543',
        subject: 'Product quality issue',
        description: 'The product I received is different from what was described on the website.',
        priority: 'medium',
        status: 'in_progress',
        category: 'product',
        assignedTo: 'agent-1',
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2024-01-15T11:30:00Z',
        orderId: '2',
        orderNumber: 'ORD-002',
        messages: [
          {
            id: '2',
            senderId: '2',
            senderName: 'Jane Smith',
            senderType: 'customer',
            message: 'The product I received is different from what was described on the website.',
            timestamp: '2024-01-15T09:00:00Z'
          },
          {
            id: '3',
            senderId: 'agent-1',
            senderName: 'Support Agent',
            senderType: 'agent',
            message: 'I apologize for the confusion. Let me check your order details and get back to you with a solution.',
            timestamp: '2024-01-15T11:30:00Z'
          }
        ]
      },
      {
        id: '3',
        ticketNumber: 'TKT-003',
        customerId: '3',
        customerName: 'Kwame Asante',
        customerEmail: 'kwame@example.com',
        customerPhone: '+233 24 555 1234',
        subject: 'Payment not processed',
        description: 'I tried to make a payment but it\'s not going through. Can you help?',
        priority: 'urgent',
        status: 'resolved',
        category: 'payment',
        assignedTo: 'agent-2',
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z',
        resolvedAt: '2024-01-15T12:00:00Z',
        messages: [
          {
            id: '4',
            senderId: '3',
            senderName: 'Kwame Asante',
            senderType: 'customer',
            message: 'I tried to make a payment but it\'s not going through. Can you help?',
            timestamp: '2024-01-15T08:00:00Z'
          },
          {
            id: '5',
            senderId: 'agent-2',
            senderName: 'Support Agent',
            senderType: 'agent',
            message: 'I\'ve checked your payment and it seems there was a temporary issue with the payment gateway. I\'ve processed your payment manually and your order is now confirmed.',
            timestamp: '2024-01-15T12:00:00Z'
          }
        ],
        customerRating: 5,
        customerFeedback: 'Excellent support! Issue resolved quickly.'
      }
    ]

    const mockStats: SupportStats = {
      totalTickets: 1250,
      openTickets: 45,
      resolvedToday: 12,
      averageResponseTime: 2.5,
      customerSatisfaction: 4.6
    }

    setTickets(mockTickets)
    setFilteredTickets(mockTickets)
    setStats(mockStats)
    setLoading(false)
  }, [])

  // Filter tickets based on search and filters
  useEffect(() => {
    let filtered = tickets

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter)
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter)
    }

    setFilteredTickets(filtered)
  }, [tickets, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'order': return Package
      case 'product': return Package
      case 'payment': return FileText
      case 'delivery': return Package
      case 'technical': return AlertCircle
      case 'general': return MessageSquare
      default: return MessageSquare
    }
  }

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          updatedAt: new Date().toISOString(),
          ...(status === 'resolved' && { resolvedAt: new Date().toISOString() })
        }),
      })

      if (response.ok) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? { 
            ...ticket, 
            status: status as any,
            updatedAt: new Date().toISOString(),
            ...(status === 'resolved' && { resolvedAt: new Date().toISOString() })
          } : ticket
        ))
        toast.success(`Ticket ${status.replace('_', ' ')} successfully`)
      } else {
        throw new Error('Failed to update ticket status')
      }
    } catch (error) {
      toast.error('Failed to update ticket status')
      console.error('Error updating ticket:', error)
    }
  }

  const sendMessage = async (ticketId: string) => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          senderType: 'agent',
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        const newMsg = {
          id: Date.now().toString(),
          senderId: 'agent-current',
          senderName: 'Support Agent',
          senderType: 'agent' as const,
          message: newMessage,
          timestamp: new Date().toISOString()
        }

        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? { 
            ...ticket, 
            messages: [...ticket.messages, newMsg],
            updatedAt: new Date().toISOString()
          } : ticket
        ))
        setNewMessage('')
        toast.success('Message sent successfully')
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      toast.error('Failed to send message')
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const openTickets = filteredTickets.filter(ticket => ticket.status === 'open')
  const inProgressTickets = filteredTickets.filter(ticket => ticket.status === 'in_progress')
  const resolvedTickets = filteredTickets.filter(ticket => ticket.status === 'resolved')

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
            <h1 className="text-4xl font-bold mb-2">Support Dashboard</h1>
            <p className="text-xl text-muted-foreground">
              Manage customer support tickets and inquiries
            </p>
          </div>
          <Button onClick={() => setIsNewTicketDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={staggerItem} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{stats.totalTickets}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{stats.openTickets}</div>
              <div className="text-sm text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
              <div className="text-sm text-muted-foreground">Today</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{stats.averageResponseTime}h</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.customerSatisfaction}</div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem}>
          <Card>
            <CardHeader>
              <CardTitle>Filters & Search</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="search">Search Tickets</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority-filter">Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category-filter">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('')
                      setStatusFilter('all')
                      setPriorityFilter('all')
                      setCategoryFilter('all')
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

        {/* Tickets Tabs */}
        <motion.div variants={staggerItem}>
          <Tabs defaultValue="open" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="open">
                Open ({openTickets.length})
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                In Progress ({inProgressTickets.length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({resolvedTickets.length})
              </TabsTrigger>
            </TabsList>

            {/* Open Tickets */}
            <TabsContent value="open" className="space-y-4">
              {openTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category)
                
                return (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                    setSelectedTicket(ticket)
                    setIsTicketDialogOpen(true)
                  }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg">{ticket.ticketNumber}</CardTitle>
                            <CardDescription>{ticket.subject}</CardDescription>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <User className="h-4 w-4 mr-2" />
                            Customer
                          </div>
                          <div className="text-sm">
                            {ticket.customerName}<br />
                            {ticket.customerEmail}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Created
                          </div>
                          <div className="text-sm">
                            {new Date(ticket.createdAt).toLocaleString('en-GH')}
                          </div>
                        </div>
                      </div>
                      {ticket.orderNumber && (
                        <div className="mt-4">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Package className="h-4 w-4 mr-2" />
                            Related Order
                          </div>
                          <div className="text-sm font-medium">{ticket.orderNumber}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            {/* In Progress Tickets */}
            <TabsContent value="in_progress" className="space-y-4">
              {inProgressTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category)
                
                return (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                    setSelectedTicket(ticket)
                    setIsTicketDialogOpen(true)
                  }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg">{ticket.ticketNumber}</CardTitle>
                            <CardDescription>{ticket.subject}</CardDescription>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <User className="h-4 w-4 mr-2" />
                            Customer
                          </div>
                          <div className="text-sm">
                            {ticket.customerName}<br />
                            {ticket.customerEmail}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            Last Updated
                          </div>
                          <div className="text-sm">
                            {new Date(ticket.updatedAt).toLocaleString('en-GH')}
                          </div>
                        </div>
                      </div>
                      {ticket.orderNumber && (
                        <div className="mt-4">
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <Package className="h-4 w-4 mr-2" />
                            Related Order
                          </div>
                          <div className="text-sm font-medium">{ticket.orderNumber}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            {/* Resolved Tickets */}
            <TabsContent value="resolved" className="space-y-4">
              {resolvedTickets.map((ticket) => {
                const CategoryIcon = getCategoryIcon(ticket.category)
                
                return (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                    setSelectedTicket(ticket)
                    setIsTicketDialogOpen(true)
                  }}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-lg">{ticket.ticketNumber}</CardTitle>
                            <CardDescription>{ticket.subject}</CardDescription>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          {ticket.customerRating && (
                            <Badge variant="outline" className="flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              {ticket.customerRating}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <User className="h-4 w-4 mr-2" />
                            Customer
                          </div>
                          <div className="text-sm">
                            {ticket.customerName}<br />
                            {ticket.customerEmail}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground mb-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolved
                          </div>
                          <div className="text-sm">
                            {ticket.resolvedAt ? 
                              new Date(ticket.resolvedAt).toLocaleString('en-GH') : 
                              'N/A'
                            }
                          </div>
                        </div>
                      </div>
                      {ticket.customerFeedback && (
                        <div className="mt-4">
                          <div className="text-sm text-muted-foreground mb-1">Customer Feedback:</div>
                          <div className="text-sm bg-muted p-2 rounded">{ticket.customerFeedback}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Ticket Detail Dialog */}
        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedTicket?.ticketNumber} - {selectedTicket?.subject}</span>
                <div className="flex space-x-2">
                  <Badge className={getStatusColor(selectedTicket?.status || '')}>
                    {selectedTicket?.status?.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(selectedTicket?.priority || '')}>
                    {selectedTicket?.priority}
                  </Badge>
                </div>
              </DialogTitle>
              <DialogDescription>
                Customer: {selectedTicket?.customerName} ({selectedTicket?.customerEmail})
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Customer Information</Label>
                  <div className="text-sm space-y-1">
                    <div><strong>Name:</strong> {selectedTicket?.customerName}</div>
                    <div><strong>Email:</strong> {selectedTicket?.customerEmail}</div>
                    {selectedTicket?.customerPhone && (
                      <div><strong>Phone:</strong> {selectedTicket.customerPhone}</div>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Ticket Information</Label>
                  <div className="text-sm space-y-1">
                    <div><strong>Category:</strong> {selectedTicket?.category}</div>
                    <div><strong>Created:</strong> {selectedTicket?.createdAt ? new Date(selectedTicket.createdAt).toLocaleString('en-GH') : 'N/A'}</div>
                    <div><strong>Updated:</strong> {selectedTicket?.updatedAt ? new Date(selectedTicket.updatedAt).toLocaleString('en-GH') : 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <div className="text-sm bg-muted p-3 rounded mt-1">
                  {selectedTicket?.description}
                </div>
              </div>

              {/* Messages */}
              <div>
                <Label>Conversation</Label>
                <div className="space-y-3 mt-2 max-h-60 overflow-y-auto">
                  {selectedTicket?.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.senderType === 'agent' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <div className="text-xs text-muted-foreground mb-1">
                          {message.senderName} • {new Date(message.timestamp).toLocaleString('en-GH')}
                        </div>
                        <div className="text-sm">{message.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Message */}
              <div>
                <Label>Send Message</Label>
                <div className="flex space-x-2 mt-1">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => selectedTicket && sendMessage(selectedTicket.id)}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col space-y-2">
              <div className="flex space-x-2 w-full">
                {selectedTicket?.status === 'open' && (
                  <Button
                    onClick={() => selectedTicket && updateTicketStatus(selectedTicket.id, 'in_progress')}
                    className="flex-1"
                  >
                    Take Over
                  </Button>
                )}
                {selectedTicket?.status === 'in_progress' && (
                  <Button
                    onClick={() => selectedTicket && updateTicketStatus(selectedTicket.id, 'resolved')}
                    className="flex-1"
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsTicketDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Ticket Dialog */}
        <Dialog open={isNewTicketDialogOpen} onOpenChange={setIsNewTicketDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Ticket</DialogTitle>
              <DialogDescription>
                Create a new support ticket for a customer
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input id="customer-name" placeholder="Enter customer name" />
                </div>
                <div>
                  <Label htmlFor="customer-email">Customer Email</Label>
                  <Input id="customer-email" placeholder="Enter customer email" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="ticket-subject">Subject</Label>
                <Input id="ticket-subject" placeholder="Enter ticket subject" />
              </div>
              
              <div>
                <Label htmlFor="ticket-description">Description</Label>
                <Textarea id="ticket-description" placeholder="Enter ticket description" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ticket-priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="ticket-category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewTicketDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Handle create ticket
                setIsNewTicketDialogOpen(false)
                toast.success('Ticket created successfully')
              }}>
                Create Ticket
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
