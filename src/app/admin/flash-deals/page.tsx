'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-toastify'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { RoleGuard } from '@/components/auth/role-guard'

type SaleType = 'flash' | 'daily'

interface DealForm {
  id?: string
  sale_type: SaleType
  title: string
  description?: string
  image_url?: string
  category?: string
  vendor?: string
  original_price: number
  sale_price: number
  rating?: number
  reviews?: number
  sold?: number
  stock?: number
  start_time: string
  end_time: string
  is_active: boolean
  is_hot: boolean
}

export default function AdminFlashDealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<DealForm>({
    sale_type: 'flash',
    title: '',
    original_price: 0,
    sale_price: 0,
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    is_hot: false,
  })

  const discount = useMemo(() => {
    if (!form.original_price) return 0
    return Math.max(0, Math.min(100, Math.round(((form.original_price - form.sale_price) / form.original_price) * 100)))
  }, [form.original_price, form.sale_price])

  const load = async () => {
    if (!isSupabaseConfigured) return
    setLoading(true)
    const { data, error } = await (supabase as any)
      .from('flash_deals')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      toast.error(error.message)
    } else {
      setDeals(data || [])
    }
    const { data: bannerData } = await (supabase as any)
      .from('homepage_banners')
      .select('*')
      .order('sort_order', { ascending: true })
    setBanners(bannerData || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!isSupabaseConfigured) {
      toast.error('Supabase not configured')
      return
    }
    setLoading(true)
    const payload = { ...form }
    const query = (supabase as any).from('flash_deals')
    const { error } = form.id
      ? await query.update(payload).eq('id', form.id)
      : await query.insert(payload)
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Saved')
      setForm({
        sale_type: 'flash',
        title: '',
        original_price: 0,
        sale_price: 0,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        is_hot: false,
      })
      load()
    }
  }

  const edit = (deal: any) => {
    setForm({
      id: deal.id,
      sale_type: deal.sale_type,
      title: deal.title,
      description: deal.description ?? '',
      image_url: deal.image_url ?? '',
      category: deal.category ?? '',
      vendor: deal.vendor ?? '',
      original_price: Number(deal.original_price) || 0,
      sale_price: Number(deal.sale_price) || 0,
      rating: Number(deal.rating) || 0,
      reviews: Number(deal.reviews) || 0,
      sold: Number(deal.sold) || 0,
      stock: Number(deal.stock) || 0,
      start_time: deal.start_time,
      end_time: deal.end_time,
      is_active: Boolean(deal.is_active),
      is_hot: Boolean(deal.is_hot),
    })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this deal?')) return
    const { error } = await (supabase as any).from('flash_deals').delete().eq('id', id)
    if (error) toast.error(error.message)
    else {
      toast.success('Deleted')
      load()
    }
  }

  return (
    <RoleGuard role="admin">
      <div className="space-y-6">
        {/* Banners Manager (quick view) */}
        <Card>
          <CardHeader>
            <CardTitle>Homepage Banners</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {banners.length === 0 ? (
              <p className="text-sm text-muted-foreground">No banners yet. Use SQL or a future UI to create some.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">{b.title}</div>
                      <span className="text-xs px-2 py-1 rounded bg-slate-100">{b.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{b.subtitle}</div>
                    <div className="text-xs text-muted-foreground">CTA: {b.cta_label} → {b.cta_href}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h1 className="text-2xl font-bold">Flash Deals Manager</h1>
          <p className="text-muted-foreground">Admins and managers can create or update flash and daily sales.</p>
        </div>

        {/* Editor */}
        <Card>
          <CardHeader>
            <CardTitle>{form.id ? 'Edit Deal' : 'Create Deal'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select value={form.sale_type} onValueChange={(v: SaleType) => setForm(f => ({ ...f, sale_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Sale type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flash">Flash</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={form.image_url || ''} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
              </div>
              <div>
                <Label>Category</Label>
                <Input value={form.category || ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div>
                <Label>Vendor</Label>
                <Input value={form.vendor || ''} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} />
              </div>
              <div>
                <Label>Original Price</Label>
                <Input type="number" value={form.original_price} onChange={e => setForm(f => ({ ...f, original_price: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Sale Price</Label>
                <Input type="number" value={form.sale_price} onChange={e => setForm(f => ({ ...f, sale_price: Number(e.target.value) }))} />
              </div>
              <div className="flex items-end"><Badge>-{discount}%</Badge></div>
              <div>
                <Label>Start Time</Label>
                <Input type="datetime-local" value={form.start_time.slice(0,16)} onChange={e => setForm(f => ({ ...f, start_time: new Date(e.target.value).toISOString() }))} />
              </div>
              <div>
                <Label>End Time</Label>
                <Input type="datetime-local" value={form.end_time.slice(0,16)} onChange={e => setForm(f => ({ ...f, end_time: new Date(e.target.value).toISOString() }))} />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={save} disabled={loading}>{form.id ? 'Update' : 'Create'}</Button>
              {form.id && (
                <Button variant="outline" onClick={() => setForm({
                  sale_type: 'flash', title: '', original_price: 0, sale_price: 0,
                  start_time: new Date().toISOString(), end_time: new Date(Date.now() + 86400000).toISOString(), is_active: true, is_hot: false
                })}>Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Deals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deals.length === 0 && <p className="text-muted-foreground">No deals yet.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map(deal => (
                <div key={deal.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{deal.sale_type}</Badge>
                      {deal.is_hot && <Badge className="bg-orange-500 text-white">HOT</Badge>}
                    </div>
                    <Badge>-{deal.discount}%</Badge>
                  </div>
                  <div className="font-semibold">{deal.title}</div>
                  <div className="text-sm text-muted-foreground">{deal.category} {deal.vendor ? `• ${deal.vendor}` : ''}</div>
                  <div className="text-sm">{new Date(deal.start_time).toLocaleString()} → {new Date(deal.end_time).toLocaleString()}</div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="line-through">{deal.original_price}</span>
                    <span className="font-semibold">{deal.sale_price}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => edit(deal)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => remove(deal.id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}

