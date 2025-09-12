'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface SupportTicket {
  id: string
  subject: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  lastUpdated: string
  category: string
}

const faqData: FAQ[] = [
  {
    id: '1',
    question: 'How does Ready Now delivery work?',
    answer: 'Ready Now items are stocked in our Ghana warehouse and can be delivered within 24-48 hours to major cities. We use local delivery partners for fast, reliable service.',
    category: 'Delivery',
    helpful: 45
  },
  {
    id: '2',
    question: 'What is Group Buy and how does it work?',
    answer: 'Group Buy allows customers to get discounts by purchasing items together. The more people join, the bigger the discount. Campaigns are time-limited and you can see the current discount tier.',
    category: 'Group Buy',
    helpful: 38
  },
  {
    id: '3',
    question: 'What is the difference between Air and Sea shipping?',
    answer: 'Air shipping is faster (7-14 days) but more expensive, while Sea shipping is slower (21-45 days) but more cost-effective for larger items. You can choose based on your needs and budget.',
    category: 'Shipping',
    helpful: 52
  },
  {
    id: '4',
    question: 'How do I track my order?',
    answer: 'You can track your order by going to the Track Order page and entering your order number. You\'ll see real-time updates on your package location and estimated delivery time.',
    category: 'Orders',
    helpful: 67
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, Mobile Money (MTN, Vodafone, AirtelTigo), and bank transfers. All payments are processed securely through our payment partners.',
    category: 'Payment',
    helpful: 41
  },
  {
    id: '6',
    question: 'Can I return or exchange items?',
    answer: 'Yes, we offer a 14-day return policy for most items. Items must be in original condition with packaging. Some items like electronics have specific return conditions.',
    category: 'Returns',
    helpful: 29
  },
  {
    id: '7',
    question: 'How do I install the Ihsan mobile app?',
    answer: 'Ihsan is a Progressive Web App (PWA). Visit our website on your mobile browser and look for the "Install App" prompt, or add it to your home screen manually.',
    category: 'App',
    helpful: 33
  },
  {
    id: '8',
    question: 'Is my personal information secure?',
    answer: 'Yes, we use industry-standard encryption and security measures to protect your personal information. We never share your data with third parties without your consent.',
    category: 'Security',
    helpful: 25
  }
]

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-001',
    subject: 'Order delivery delay',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-16T14:20:00Z',
    category: 'Delivery'
  },
  {
    id: 'TKT-002',
    subject: 'Payment not processed',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-12T09:15:00Z',
    lastUpdated: '2024-01-13T16:45:00Z',
    category: 'Payment'
  },
  {
    id: 'TKT-003',
    subject: 'Product quality issue',
    status: 'open',
    priority: 'medium',
    createdAt: '2024-01-18T11:20:00Z',
    lastUpdated: '2024-01-18T11:20:00Z',
    category: 'Product'
  }
]

const categories = ['All', 'Delivery', 'Group Buy', 'Shipping', 'Orders', 'Payment', 'Returns', 'App', 'Security']

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [tickets] = useState<SupportTicket[]>(mockTickets)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: ''
  })

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSubmitTicket = () => {
    // Simulate ticket submission
    console.log('Submitting ticket:', newTicket)
    setNewTicket({ subject: '', category: '', priority: 'medium', description: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
          <p className="text-gray-600 mt-2">We&apos;re here to help you with any questions or issues</p>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600 mb-3">Speak with our support team</p>
              <p className="text-lg font-semibold text-primary">+233 30 123 4567</p>
              <p className="text-xs text-gray-500 mt-1">Mon-Fri: 8AM-6PM</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600 mb-3">Get instant help online</p>
              <Button className="w-full">
                Start Chat
              </Button>
              <p className="text-xs text-gray-500 mt-1">Available 24/7</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-medium text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-600 mb-3">Send us a detailed message</p>
              <p className="text-sm font-medium text-primary">support@ihsan.com</p>
              <p className="text-xs text-gray-500 mt-1">Response within 24h</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          {/* FAQ Section */}
          <TabsContent value="faq">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                          placeholder="Search FAQ..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {categories.map(category => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <Card key={faq.id}>
                    <CardContent className="p-6">
                      <div
                        className="cursor-pointer"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{faq.category}</Badge>
                              <span className="text-sm text-gray-500">
                                {faq.helpful} people found this helpful
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            {expandedFAQ === faq.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {expandedFAQ === faq.id && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Helpful
                            </Button>
                            <Button size="sm" variant="outline">
                              <AlertCircle className="w-4 h-4 mr-2" />
                              Not Helpful
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* My Tickets */}
          <TabsContent value="tickets">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Support Tickets</h2>
                <Button>Create New Ticket</Button>
              </div>

              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>#{ticket.id}</span>
                            <span>Created: {formatDate(ticket.createdAt)}</span>
                            <span>Updated: {formatDate(ticket.lastUpdated)}</span>
                            <Badge variant="outline">{ticket.category}</Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Contact Us */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select category</option>
                      <option value="delivery">Delivery</option>
                      <option value="payment">Payment</option>
                      <option value="product">Product</option>
                      <option value="account">Account</option>
                      <option value="technical">Technical</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={6}
                    placeholder="Please provide detailed information about your issue..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button onClick={handleSubmitTicket} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Ticket
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Status */}
          <TabsContent value="status">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Website</h4>
                        <p className="text-sm text-gray-600">Main website and app</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Payment System</h4>
                        <p className="text-sm text-gray-600">Payment processing</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Order Processing</h4>
                        <p className="text-sm text-gray-600">Order management system</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Delivery Tracking</h4>
                        <p className="text-sm text-gray-600">Package tracking system</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-1" />
                        Minor Issues
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
