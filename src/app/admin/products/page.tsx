'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package
} from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  badge?: string
  brand: string
  category: string
  stock: number
  status: string
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', brand: '', category: '', price: '', stock: '', image: '', sizeScale: 'none', sizesCsv: '' })
  const [categories, setCategories] = useState<{ id: string, name: string, slug: string }[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    // Load categories for dropdown (flat list)
    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories?includeChildren=false')
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(data as any)
        }
      } catch {}
    }
    loadCategories()
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-foreground">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Products</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
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
                  image: form.image || undefined,
                  ...(sizeTags.length || scaleTag.length ? { tags: [...scaleTag, ...sizeTags] } : {}),
                }
                const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
                if (res.ok) {
                  setOpen(false)
                  setForm({ name: '', brand: '', category: '', price: '', stock: '', image: '', sizeScale: 'none', sizesCsv: '' })
                  const data = await (await fetch('/api/products')).json()
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
                    fd.append('path', 'admin')
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
                <Select value={form.category} onValueChange={(value) => {
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
                }}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug || cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size-scale">Size scale</Label>
                  <Select value={form.sizeScale} onValueChange={(value) => {
                    let defaults: string[] = []
                    if (value === 'clothing') defaults = ['XS','S','M','L','XL','XXL']
                    if (value === 'shoes_eu') defaults = ['36','37','38','39','40','41','42','43','44','45','46']
                    if (value === 'kids') defaults = ['2','4','6','8','10','12','14']
                    setForm({ ...form, sizeScale: value as any, sizesCsv: defaults.join(',') })
                  }}>
                    <SelectTrigger id="size-scale">
                      <SelectValue placeholder="Select size scale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="clothing">Clothing (XS-XXL)</SelectItem>
                      <SelectItem value="shoes_eu">Shoes (EU 36-46)</SelectItem>
                      <SelectItem value="kids">Kids (2-14)</SelectItem>
                    </SelectContent>
                  </Select>
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
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
              <thead className="bg-muted">
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
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg mr-4" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-200 rounded-lg mr-4"></div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 capitalize">{product.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">${product.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
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

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
