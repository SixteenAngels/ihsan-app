'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Filter, ShoppingCart, Eye } from 'lucide-react'

interface Order {
  id: string
  customerName: string
  customerEmail: string
  total: number
  status: string
  escrowStatus?: 'held' | 'released'
  createdAt: string
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?vendorId=vendor-1')
        const data = await res.json()
        setOrders(data.orders || [])
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filtered = orders.filter(o => o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">My Orders</h2>
        <Button>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search orders..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Escrow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">#{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{o.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${o.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{o.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{o.escrowStatus || 'held'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button asChild variant="ghost" size="sm">
                        <a href={`/vendor/orders/${o.id}`} aria-label={`View order ${o.id}`} title={`View order ${o.id}`} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


