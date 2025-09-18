'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle2, XCircle, Store } from 'lucide-react'

type Vendor = {
  id: string
  name: string
  email: string
  status: string
  vendorStatus?: 'pending' | 'approved' | 'suspended'
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')

  const load = async () => {
    setLoading(true)
    const res = await fetch(`/api/users?role=vendor${filter ? `&vendorStatus=${filter}` : ''}`)
    const data = await res.json()
    setVendors(data.users || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [filter])

  const approve = async (id: string) => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, vendorStatus: 'approved' })
    })
    load()
  }

  const suspend = async (id: string) => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, vendorStatus: 'suspended' })
    })
    load()
  }

  const filtered = vendors.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search vendors..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          className="px-3 py-2 border border-slate-300 rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter by vendor status"
          title="Filter by vendor status"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map(v => (
                  <tr key={v.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{v.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{v.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={
                        v.vendorStatus === 'approved' ? 'bg-green-100 text-green-800' :
                        v.vendorStatus === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {v.vendorStatus || 'pending'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => approve(v.id)}>
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => suspend(v.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      </div>
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


