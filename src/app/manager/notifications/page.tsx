'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Notification = {
  id: string
  title: string
  body: string
  createdAt: string
}

export default function ManagerNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    const res = await fetch('/api/notifications')
    const data = await res.json()
    setItems(data.notifications || [])
  }

  useEffect(() => { load() }, [])

  const send = async () => {
    if (!title || !message) return
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message })
    })
    setTitle('')
    setMessage('')
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>

      <Card>
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Input placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button onClick={send}>Send</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map(n => (
            <div key={n.id} className="p-3 border rounded">
              <div className="font-medium text-slate-900">{n.title}</div>
              <div className="text-sm text-slate-600">{n.body}</div>
              <div className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}


