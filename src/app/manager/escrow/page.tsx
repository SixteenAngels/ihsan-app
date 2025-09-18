'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle2, Shield } from 'lucide-react'

type Order = {
  id: string
  customerName: string
  total: number
  status: string
  escrowStatus?: 'held' | 'released'
}

export default function ManagerEscrowPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'held' | 'released' | ''>('held')

  const load = async () => {
    setLoading(true)
    const qs = filter ? `?escrowStatus=${filter}` : ''
    const res = await fetch(`/api/orders${qs}`)
    const data = await res.json()
    setOrders(data.orders || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [filter])

  const release = async (id: string) => {
    await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, escrowStatus: 'released' })
    })
    load()
  }

  const filtered = orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Escrow Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Held Payments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="Search orders..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="px-3 py-2 border border-slate-300 rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              aria-label="Filter by escrow status"
              title="Filter by escrow status"
            >
              <option value="held">Held</option>
              <option value="released">Released</option>
              <option value="">All</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Escrow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map(o => (
                  <tr key={o.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">#{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{o.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${o.total}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{o.escrowStatus || 'held'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {o.escrowStatus !== 'released' && (
                        <Button size="sm" onClick={() => release(o.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Release
                        </Button>
                      )}
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


