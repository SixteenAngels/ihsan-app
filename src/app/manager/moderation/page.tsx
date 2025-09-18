'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, EyeOff, Eye, Package } from 'lucide-react'

type Product = {
  id: string
  name: string
  brand?: string
  hidden?: boolean
  readyNow?: boolean
  readyNowVerified?: boolean
}

export default function ManagerModerationPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterHidden, setFilterHidden] = useState('')

  const load = async () => {
    setLoading(true)
    const qs = filterHidden ? `?hidden=${filterHidden}` : ''
    const res = await fetch(`/api/products${qs}`)
    const data = await res.json()
    setProducts(data.products || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [filterHidden])

  const toggleHidden = async (id: string, hidden: boolean) => {
    await fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, hidden })
    })
    load()
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Product Moderation</h1>
      <Card>
        <CardHeader>
          <CardTitle>Hide/Unhide Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              className="px-3 py-2 border border-slate-300 rounded-md"
              value={filterHidden}
              onChange={(e) => setFilterHidden(e.target.value)}
              aria-label="Filter by hidden"
              title="Filter by hidden"
            >
              <option value="">All</option>
              <option value="true">Hidden</option>
              <option value="false">Visible</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hidden</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-slate-200 rounded-lg mr-4 flex items-center justify-center">
                          <Package className="h-5 w-5 text-slate-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900">{p.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.brand || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.hidden ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {p.hidden ? (
                        <Button size="sm" variant="outline" onClick={() => toggleHidden(p.id, false)}>
                          <Eye className="h-4 w-4 mr-1" /> Unhide
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => toggleHidden(p.id, true)}>
                          <EyeOff className="h-4 w-4 mr-1" /> Hide
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


