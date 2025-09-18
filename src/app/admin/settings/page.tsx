'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Settings = {
  approvalRequired: boolean
  commissionPercent: number
  groupBuyEnabled: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/settings')
    const data = await res.json()
    setSettings(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const save = async () => {
    if (!settings) return
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Approvals & Commissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="approvalRequired">Approval required for vendor products</Label>
            <input
              id="approvalRequired"
              type="checkbox"
              checked={settings.approvalRequired}
              onChange={(e) => setSettings({ ...settings, approvalRequired: e.target.checked })}
              title="Approval required for vendor products"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="commission">Commission percentage</Label>
            <Input
              id="commission"
              type="number"
              min={0}
              max={100}
              value={settings.commissionPercent}
              onChange={(e) => setSettings({ ...settings, commissionPercent: Number(e.target.value) })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="groupBuyEnabled">Enable Group Buy</Label>
            <input
              id="groupBuyEnabled"
              type="checkbox"
              checked={settings.groupBuyEnabled}
              onChange={(e) => setSettings({ ...settings, groupBuyEnabled: e.target.checked })}
              title="Enable Group Buy"
            />
          </div>

          <div className="pt-2">
            <Button onClick={save}>Save settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


