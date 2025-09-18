'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Store = {
  vendorId: string
  name: string
  logoUrl?: string
  bannerUrl?: string
  description?: string
}

export default function VendorSettingsPage() {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/vendor/store?vendorId=vendor-1')
    const data = await res.json()
    setStore(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!store) return
    await fetch('/api/vendor/store', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store)
    })
  }

  if (loading || !store) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Store Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Storefront</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" value={store.logoUrl || ''} onChange={(e) => setStore({ ...store, logoUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="banner">Banner URL</Label>
            <Input id="banner" value={store.bannerUrl || ''} onChange={(e) => setStore({ ...store, bannerUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={store.description || ''} onChange={(e) => setStore({ ...store, description: e.target.value })} />
          </div>
          <div className="pt-2">
            <Button onClick={save}>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


