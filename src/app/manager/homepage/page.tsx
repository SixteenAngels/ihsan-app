'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Homepage = {
  banners: string[]
  featuredProductIds: string[]
  discountsNote?: string
}

export default function ManagerHomepagePage() {
  const [data, setData] = useState<Homepage | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/homepage')
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!data) return
    await fetch('/api/homepage', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const addBanner = () => setData({ ...data, banners: [...data.banners, ''] })
  const updateBanner = (i: number, val: string) => {
    const copy = [...data.banners]
    copy[i] = val
    setData({ ...data, banners: copy })
  }
  const addFeatured = () => setData({ ...data, featuredProductIds: [...data.featuredProductIds, ''] })
  const updateFeatured = (i: number, val: string) => {
    const copy = [...data.featuredProductIds]
    copy[i] = val
    setData({ ...data, featuredProductIds: copy })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Homepage Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Banners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.banners.map((b, i) => (
            <Input key={i} placeholder="https://banner.url" value={b} onChange={(e) => updateBanner(i, e.target.value)} />
          ))}
          <Button variant="outline" onClick={addBanner}>Add banner</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data.featuredProductIds.map((p, i) => (
            <Input key={i} placeholder="Product ID" value={p} onChange={(e) => updateFeatured(i, e.target.value)} />
          ))}
          <Button variant="outline" onClick={addFeatured}>Add featured</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discounts Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="e.g., Summer promo details" value={data.discountsNote || ''} onChange={(e) => setData({ ...data, discountsNote: e.target.value })} />
        </CardContent>
      </Card>

      <div>
        <Button onClick={save}>Save changes</Button>
      </div>
    </div>
  )
}


