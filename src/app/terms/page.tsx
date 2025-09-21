'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Terms of Service</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">
          Welcome to Ihsan. By accessing or using our website and services, you agree to the following terms.
        </p>

        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Your Account</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              You are responsible for maintaining the confidentiality of your account and for all activities that occur
              under your account.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Orders & Payments</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Payments are processed via Paystack. Some transactions may be held in escrow until delivery milestones
              are met. Prices, availability, and promotions are subject to change.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Shipping & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Delivery estimates are provided for convenience and are not guaranteed. You will receive updates and may
              track your order in your account.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Returns & Refunds</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Where applicable, returns and refunds are handled according to our policies and applicable law. Escrow
              payments may be released or refunded based on order status.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              You agree not to misuse the platform, including by attempting to gain unauthorized access, interfering
              with normal operations, or violating others’ rights.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              We may update these Terms from time to time. Continued use constitutes acceptance of the updated Terms.
            </CardContent>
          </Card>

          <p className="text-sm text-slate-500">
            By using Ihsan, you also agree to our <a className="underline" href="/privacy">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

