'use client'

import { usePathname } from 'next/navigation'
import { Header, Footer } from '@/components/layout/header'

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isRoleArea = pathname?.startsWith('/admin') || pathname?.startsWith('/manager') || pathname?.startsWith('/vendor')
  const isAuthArea = pathname === '/login' || pathname === '/signup' || pathname?.startsWith('/auth/')

  if (isRoleArea || isAuthArea) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}


