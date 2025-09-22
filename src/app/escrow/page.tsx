'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Truck,
  Package,
  DollarSign,
  Calendar,
  User,
  Store,
  Eye,
  Download
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'

interface EscrowTransaction {
  id: string
  orderNumber: string
  customerName: string
  vendorName: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'disputed' | 'refunded'
  createdAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
  estimatedDelivery: string
  products: EscrowProduct[]
  trackingNumber?: string
  disputeReason?: string
}

interface EscrowProduct {
  id: string
  name: string
  quantity: number
  price: number
  image: string
}

interface EscrowStats {
  totalTransactions: number
  pendingAmount: number
  completedAmount: number
  disputedAmount: number
  averageProcessingTime: number
}

export default function PaystackEscrowSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'disputes' | 'settings'>('overview')
  const [selectedTransaction, setSelectedTransaction] = useState<EscrowTransaction | null>(null)

  // Mock data
  const escrowStats: EscrowStats = {
    totalTransactions: 1247,
    pendingAmount: 15420.50,
    completedAmount: 89456.80,
    disputedAmount: 2340.25,
    averageProcessingTime: 3.2
  }

  const escrowTransactions: EscrowTransaction[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      vendorName: 'African Naturals',
      amount: 45.99,
      currency: 'USD',
      status: 'paid',
      createdAt: '2024-01-15T10:30:00Z',
      paidAt: '2024-01-15T10:35:00Z',
      estimatedDelivery: '2024-01-22T00:00:00Z',
      products: [
        {
          id: '1',
          name: 'Premium Ghana Shea Butter',
          quantity: 2,
          price: 22.99,
          image: '/api/placeholder/100/100'
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Jane Smith',
      vendorName: 'Heritage Crafts',
      amount: 89.50,
      currency: 'USD',
      status: 'shipped',
      createdAt: '2024-01-14T14:20:00Z',
      paidAt: '2024-01-14T14:25:00Z',
      shippedAt: '2024-01-16T09:15:00Z',
      estimatedDelivery: '2024-01-23T00:00:00Z',
      trackingNumber: 'TRK-789456123',
      products: [
        {
          id: '2',
          name: 'Handwoven Kente Cloth',
          quantity: 1,
          price: 89.50,
          image: '/api/placeholder/100/100'
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Mike Johnson',
      vendorName: 'Tropical Essentials',
      amount: 67.25,
      currency: 'USD',
      status: 'delivered',
      createdAt: '2024-01-10T16:45:00Z',
      paidAt: '2024-01-10T16:50:00Z',
      shippedAt: '2024-01-12T11:30:00Z',
      deliveredAt: '2024-01-18T14:20:00Z',
      estimatedDelivery: '2024-01-19T00:00:00Z',
      trackingNumber: 'TRK-456789123',
      products: [
        {
          id: '3',
          name: 'Organic Coconut Oil',
          quantity: 3,
          price: 22.42,
          image: '/api/placeholder/100/100'
        }
      ]
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Sarah Wilson',
      vendorName: 'Artisan Gallery',
      amount: 125.00,
      currency: 'USD',
      status: 'disputed',
      createdAt: '2024-01-08T12:15:00Z',
      paidAt: '2024-01-08T12:20:00Z',
      shippedAt: '2024-01-10T08:45:00Z',
      estimatedDelivery: '2024-01-17T00:00:00Z',
      trackingNumber: 'TRK-123456789',
      disputeReason: 'Product damaged during shipping',
      products: [
        {
          id: '4',
          name: 'Wooden African Mask',
          quantity: 1,
          price: 125.00,
          image: '/api/placeholder/100/100'
        }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'paid': return 'bg-blue-500'
      case 'shipped': return 'bg-purple-500'
      case 'delivered': return 'bg-green-500'
      case 'disputed': return 'bg-red-500'
      case 'refunded': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'paid': return CreditCard
      case 'shipped': return Truck
      case 'delivered': return CheckCircle
      case 'disputed': return AlertCircle
      case 'refunded': return DollarSign
      default: return Clock
    }
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'pending': return 25
      case 'paid': return 50
      case 'shipped': return 75
      case 'delivered': return 100
      case 'disputed': return 0
      case 'refunded': return 0
      default: return 0
    }
  }

  const handlePaystackPayment = async (transaction: EscrowTransaction) => {
    try {
      // Simulate Paystack payment initialization
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: transaction.amount * 100, // Convert to kobo/cents
          email: 'customer@example.com',
          reference: transaction.orderNumber,
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/payment/callback`,
          metadata: {
            order_id: transaction.id,
            customer_name: transaction.customerName,
            vendor_name: transaction.vendorName
          }
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url
      }
    } catch (error) {
      console.error('Payment initialization failed:', error)
    }
  }

  const handleReleaseFunds = async (transaction: EscrowTransaction) => {
    try {
      const response = await fetch('/api/paystack/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_id: transaction.id,
          amount: transaction.amount * 100,
          recipient_code: 'vendor_recipient_code', // This would be the vendor's Paystack recipient code
          reason: 'Order delivered successfully'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        // Update transaction status
        console.log('Funds released successfully')
      }
    } catch (error) {
      console.error('Fund release failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Paystack Escrow System</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Secure payment processing with automatic fund release upon delivery confirmation
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
                  { id: 'overview', label: 'Overview', icon: Package },
                  { id: 'transactions', label: 'Transactions', icon: CreditCard },
                  { id: 'disputes', label: 'Disputes', icon: AlertCircle },
                  { id: 'settings', label: 'Settings', icon: Shield }
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
                  { label: 'Total Transactions', value: escrowStats.totalTransactions.toLocaleString(), icon: CreditCard, color: 'text-blue-600' },
                  { label: 'Pending Amount', value: formatCurrency(escrowStats.pendingAmount), icon: Clock, color: 'text-yellow-600' },
                  { label: 'Completed Amount', value: formatCurrency(escrowStats.completedAmount), icon: CheckCircle, color: 'text-green-600' },
                  { label: 'Disputed Amount', value: formatCurrency(escrowStats.disputedAmount), icon: AlertCircle, color: 'text-red-600' }
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

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrowTransactions.slice(0, 5).map((transaction, index) => {
                      const StatusIcon = getStatusIcon(transaction.status)
                      return (
                        <motion.div
                          key={transaction.id}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedTransaction(transaction)}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className={`p-2 rounded-full ${getStatusColor(transaction.status)}`}>
                                    <StatusIcon className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold">{transaction.orderNumber}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      {transaction.customerName} → {transaction.vendorName}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {formatCurrency(transaction.amount, transaction.currency)}
                                  </p>
                                  <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                                    {transaction.status}
                                  </Badge>
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

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    All Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrowTransactions.map((transaction, index) => {
                      const StatusIcon = getStatusIcon(transaction.status)
                      return (
                        <motion.div
                          key={transaction.id}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Transaction Info */}
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${getStatusColor(transaction.status)}`}>
                                      <StatusIcon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg">{transaction.orderNumber}</h3>
                                      <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                                        {transaction.status}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-muted-foreground" />
                                      <span>{transaction.customerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Store className="w-4 h-4 text-muted-foreground" />
                                      <span>{transaction.vendorName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4 text-muted-foreground" />
                                      <span>{formatDate(transaction.createdAt)}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Progress */}
                                <div className="space-y-3">
                                  <h4 className="font-medium">Transaction Progress</h4>
                                  <Progress value={getProgressPercentage(transaction.status)} className="h-2" />
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Ordered</span>
                                    <span>Paid</span>
                                    <span>Shipped</span>
                                    <span>Delivered</span>
                                  </div>
                                  
                                  {transaction.trackingNumber && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Truck className="w-4 h-4 text-muted-foreground" />
                                      <span>Tracking: {transaction.trackingNumber}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Actions */}
                                <div className="space-y-3">
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">
                                      {formatCurrency(transaction.amount, transaction.currency)}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedTransaction(transaction)}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                    
                                    {transaction.status === 'delivered' && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleReleaseFunds(transaction)}
                                      >
                                        Release Funds
                                      </Button>
                                    )}
                                    
                                    {transaction.status === 'pending' && (
                                      <Button
                                        size="sm"
                                        onClick={() => handlePaystackPayment(transaction)}
                                      >
                                        Process Payment
                                      </Button>
                                    )}
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Dispute Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {escrowTransactions.filter(t => t.status === 'disputed').map((transaction, index) => (
                      <motion.div
                        key={transaction.id}
                        initial="initial"
                        animate="in"
                        variants={bounceIn}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="border-red-200 bg-red-50">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{transaction.orderNumber}</h3>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {transaction.customerName} vs {transaction.vendorName}
                                </p>
                                <p className="text-sm text-red-700">
                                  <strong>Dispute Reason:</strong> {transaction.disputeReason}
                                </p>
                              </div>
                              <div className="text-right space-y-2">
                                <p className="text-xl font-bold text-red-600">
                                  {formatCurrency(transaction.amount, transaction.currency)}
                                </p>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    Review Case
                                  </Button>
                                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                                    Resolve Dispute
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Escrow Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Paystack Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Public Key</label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded-md"
                            placeholder="pk_test_..."
                            defaultValue="pk_test_your-paystack-public-key"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Secret Key</label>
                          <input
                            type="password"
                            className="w-full p-2 border rounded-md"
                            placeholder="sk_test_..."
                            defaultValue="sk_test_your-paystack-secret-key"
                            aria-label="Paystack secret key"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Escrow Rules</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Auto-release funds after delivery confirmation</span>
                          <input type="checkbox" defaultChecked aria-label="Auto-release funds after delivery confirmation" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Hold funds for 24 hours after delivery</span>
                          <input type="checkbox" aria-label="Hold funds for 24 hours after delivery" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Require customer confirmation for release</span>
                          <input type="checkbox" defaultChecked aria-label="Require customer confirmation for release" />
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedTransaction(null)}
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
                  <CardTitle>Transaction Details - {selectedTransaction.orderNumber}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTransaction(null)}
                  >
                    ✕
                  </Button>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Transaction Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Transaction Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Order Number:</span>
                          <span className="font-medium">{selectedTransaction.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="secondary" className={getStatusColor(selectedTransaction.status)}>
                            {selectedTransaction.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Created:</span>
                          <span className="font-medium">{formatDate(selectedTransaction.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Parties */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Parties Involved</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Customer</p>
                            <p className="text-sm text-muted-foreground">{selectedTransaction.customerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Store className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Vendor</p>
                            <p className="text-sm text-muted-foreground">{selectedTransaction.vendorName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Products */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Products</h3>
                    <div className="space-y-3">
                      {selectedTransaction.products.map((product) => (
                        <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {product.quantity} × {formatCurrency(product.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {formatCurrency(product.price * product.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-4 pt-4 border-t">
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                    {selectedTransaction.status === 'delivered' && (
                      <Button onClick={() => handleReleaseFunds(selectedTransaction)}>
                        Release Funds to Vendor
                      </Button>
                    )}
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
