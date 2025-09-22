'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    try {
      // TODO: wire to /api/contact if needed
      await new Promise(res => setTimeout(res, 800))
      alert('Thanks for contacting us! We will get back to you shortly.')
      ;(e.target as HTMLFormElement).reset()
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Contact Us</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">We'd love to hear from you. Send us a message and we’ll respond as soon as possible.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="name" placeholder="Your name" required />
                  <Input type="email" name="email" placeholder="Your email" required />
                </div>
                <Input name="subject" placeholder="Subject" required />
                <Textarea name="message" placeholder="Your message" rows={6} required />
                <Button type="submit" disabled={isSending}>{isSending ? 'Sending…' : 'Send Message'}</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300 space-y-2">
              <p>Email: support@ihsan.com</p>
              <p>Phone: +233 00 000 0000</p>
              <p>Address: Accra, Ghana</p>
              <p>Hours: Mon–Fri, 9:00–17:00 GMT</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}