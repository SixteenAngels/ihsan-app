'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">About Ihsan</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-3xl">
            Ihsan is a modern e‑commerce platform for Ghana and Africa, built to make buying and selling simpler,
            faster, and more transparent. We connect customers, vendors, and delivery partners with a secure checkout,
            escrow support, and real‑time order tracking.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Empower merchants and delight customers with a trusted marketplace experience across the continent.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300 space-y-2">
              <ul className="list-disc list-inside space-y-1">
                <li>Secure Paystack payments and optional escrow</li>
                <li>Flash deals and daily sales managed by admins</li>
                <li>Ready‑Now and Group Buy shopping options</li>
                <li>Order tracking and delivery updates</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Need help? Visit our Support page or email support@ihsan.com.
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trust & Safety</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              We take security seriously. Payments are processed via Paystack, sensitive data is protected, and your
              privacy choices are respected. Read our <a className="underline" href="/privacy">Privacy Policy</a> and
              <a className="underline ml-1" href="/terms">Terms of Service</a>.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Vendors</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 dark:text-slate-300">
              Grow with Ihsan: list products, manage stock, and reach new customers. Admins and managers help keep the
              catalog high‑quality and compliant.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

