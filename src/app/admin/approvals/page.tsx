'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Check, X } from 'lucide-react'

type Product = {
  id: string
  name: string
  brand?: string
  category?: string
  price: number
  vendorId?: string
  approved?: boolean
}

export default function AdminApprovalsPage() {
  const [pending, setPending] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/products?approved=false')
    const data = await res.json()
    setPending(data.products || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const approve = async (id: string) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved: true })
    })
    load()
  }

  const reject = async (id: string) => {
    await fetch(`/api/products?id=${id}`, { method: 'DELETE' })
    load()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Product Approvals</h1>

      <Card>
        <CardHeader>
          <CardTitle>Pending Products</CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-slate-600">No pending products.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {pending.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-slate-200 rounded-lg mr-4 flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">{p.name}</div>
                            <div className="text-sm text-slate-500">#{p.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.brand || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${p.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.vendorId || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => approve(p.id)}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => reject(p.id)}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


