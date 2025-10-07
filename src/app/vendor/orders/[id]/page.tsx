'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function VendorOrderReceiptPage() {
  const params = useParams() as { id?: string }
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/orders?id=${params?.id}`)
      const data = await res.json()
      setOrder(data)
      setLoading(false)
    }
    load()
  }, [params?.id])

  const print = () => {
    window.print()
  }

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <div>
              <div className="font-medium text-slate-900">Customer</div>
              <div className="text-slate-600">{order.customerName}</div>
              <div className="text-slate-600">{order.customerEmail}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-slate-900">Total</div>
              <div className="text-slate-600">${order.total}</div>
              <div className="text-slate-600">Status: {order.status}</div>
              <div className="text-slate-600">Escrow: {order.escrowStatus || 'held'}</div>
            </div>
          </div>

          <div>
            <div className="font-medium text-slate-900 mb-2">Items</div>
            <div className="border rounded">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                    <th className="px-4 py-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((it: any) => (
                    <tr key={it.productId}>
                      <td className="px-4 py-2">{it.name}</td>
                      <td className="px-4 py-2">{it.quantity}</td>
                      <td className="px-4 py-2">${it.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2 print:hidden">
            <Button onClick={print}>Print receipt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


