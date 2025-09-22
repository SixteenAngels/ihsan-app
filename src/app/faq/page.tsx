'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does delivery take?',
      a: 'Ready Now items deliver in 24–48 hours within Ghana. International items depend on Air or Sea shipping selection.'
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support Paystack (cards, mobile money, bank). Some orders may use escrow until delivery is confirmed.'
    },
    {
      q: 'Can I track my order?',
      a: 'Yes. Go to My Account → Orders or use the Track Order page to see status updates.'
    },
    {
      q: 'How do returns and refunds work?',
      a: 'Eligible orders can be returned within the policy window. Escrow can be released or refunded depending on status.'
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Frequently Asked Questions</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">Quick answers to common questions about shopping on Ihsan.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle>{item.q}</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 dark:text-slate-300">{item.a}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}