'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function TopNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname()
  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <div className="px-4 py-2 overflow-x-auto">
        <div className="flex gap-3">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function AdminTopNav() {
  return (
    <TopNav
      links={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/products', label: 'Products' },
        { href: '/admin/orders', label: 'Orders' },
        { href: '/admin/users', label: 'Users' },
        { href: '/admin/approvals', label: 'Approvals' },
        { href: '/admin/vendors', label: 'Vendors' },
        { href: '/admin/settings', label: 'Settings' },
        { href: '/admin/store', label: 'Admin Store' },
      ]}
    />
  )
}

export function ManagerTopNav() {
  return (
    <TopNav
      links={[
        { href: '/manager', label: 'Dashboard' },
        { href: '/manager/products', label: 'Products' },
        { href: '/manager/orders', label: 'Orders' },
        { href: '/manager/customers', label: 'Customers' },
        { href: '/manager/analytics', label: 'Analytics' },
        { href: '/manager/reports', label: 'Reports' },
        { href: '/manager/escrow', label: 'Escrow' },
        { href: '/manager/moderation', label: 'Moderation' },
        { href: '/manager/homepage', label: 'Homepage' },
        { href: '/manager/notifications', label: 'Notifications' },
        { href: '/manager/ready-now', label: 'Ready Now' },
      ]}
    />
  )
}

export function VendorTopNav() {
  return (
    <TopNav
      links={[
        { href: '/vendor', label: 'Dashboard' },
        { href: '/vendor/products', label: 'Products' },
        { href: '/vendor/orders', label: 'Orders' },
        { href: '/vendor/settings', label: 'Settings' },
      ]}
    />
  )
}


