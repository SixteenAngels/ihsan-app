'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Search, Filter, Package, Eye, Edit, Trash2, Plus } from 'lucide-react'

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: number
  stock: number
  status: string
}

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', category: '', price: '', stock: '', image: '', sizeScale: 'none', sizesCsv: '' })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?vendorId=vendor-1')
        const data = await res.json()
        setProducts(data.products || [])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
        <h2 className="text-2xl font-bold text-slate-900">My Products</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add product</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const sizeTags = (form.sizesCsv || '')
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
                  .map(s => `size:${s}`)
                const scaleTag = form.sizeScale && form.sizeScale !== 'none' ? [`size-scale:${form.sizeScale}`] : []
                const payload = {
                  name: form.name,
                  brand: form.brand || undefined,
                  category: form.category || undefined,
                  price: Number(form.price) || 0,
                  stock: Number(form.stock) || 0,
                  vendorId: 'vendor-1',
                  image: form.image || undefined,
                  ...(sizeTags.length || scaleTag.length ? { tags: [...scaleTag, ...sizeTags] } : {}),
                }
                const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                if (res.ok) {
                  setOpen(false)
                  setForm({ name: '', brand: '', category: '', price: '', stock: '', image: '', sizeScale: 'none', sizesCsv: '' })
                  const data = await (await fetch('/api/products?vendorId=vendor-1')).json()
                  setProducts(data.products || [])
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const fd = new FormData()
                    fd.append('file', file)
                    fd.append('path', 'vendor-1')
                    const res = await fetch('/api/upload', { method: 'POST', body: fd })
                    if (res.ok) {
                      const { url } = await res.json()
                      setForm({ ...form, image: url })
                    }
                  }}
                />
                {form.image && (
                  <div className="mt-2">
                    <img src={form.image} alt="Preview" className="h-20 w-20 object-cover rounded" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" value={form.category} onChange={(e) => {
                  const value = e.target.value
                  const v = value.toLowerCase()
                  let scale = 'none'
                  if (/shoe|sneaker|footwear|boot/.test(v)) scale = 'shoes_eu'
                  else if (/kid|baby|child/.test(v)) scale = 'kids'
                  else if (/cloth|fashion|apparel|shirt|dress|trouser|pant|skirt|top|wear/.test(v)) scale = 'clothing'
                  const defaultSizes = scale === 'clothing' ? ['XS','S','M','L','XL','XXL']
                    : scale === 'shoes_eu' ? ['36','37','38','39','40','41','42','43','44','45','46']
                    : scale === 'kids' ? ['2','4','6','8','10','12','14']
                    : []
                  setForm({ ...form, category: value, sizeScale: scale as any, sizesCsv: defaultSizes.join(',') })
                }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size-scale">Size scale</Label>
                  <select
                    id="size-scale"
                    className="px-3 py-2 border border-slate-300 rounded-md"
                    value={form.sizeScale}
                    onChange={(e) => {
                      const value = e.target.value
                      let defaults: string[] = []
                      if (value === 'clothing') defaults = ['XS','S','M','L','XL','XXL']
                      if (value === 'shoes_eu') defaults = ['36','37','38','39','40','41','42','43','44','45','46']
                      if (value === 'shoes_us') defaults = ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','12','13']
                      if (value === 'shoes_uk') defaults = ['5','5.5','6','6.5','7','7.5','8','8.5','9','9.5','10','11','12']
                      if (value === 'kids') defaults = ['2','4','6','8','10','12','14']
                      setForm({ ...form, sizeScale: value as any, sizesCsv: defaults.join(',') })
                    }}
                  >
                    <option value="none">None</option>
                    <option value="clothing">Clothing (XS-XXL)</option>
                    <option value="shoes_eu">Shoes (EU 36-46)</option>
                    <option value="shoes_us">Shoes (US)</option>
                    <option value="shoes_uk">Shoes (UK)</option>
                    <option value="kids">Kids (2-14)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sizes">Available sizes (comma-separated)</Label>
                  <Input id="sizes" placeholder="e.g., S,M,L,XL or 38,39,40" value={form.sizesCsv} onChange={(e) => setForm({ ...form, sizesCsv: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input placeholder="Search products..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{p.name}</div>
                      <div className="text-sm text-slate-500">{p.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${p.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{p.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
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


