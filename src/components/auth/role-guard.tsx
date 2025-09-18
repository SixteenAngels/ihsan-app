'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

type Role = 'admin' | 'manager' | 'vendor'

interface RoleGuardProps {
  role: Role
  children: React.ReactNode
}

export function RoleGuard({ role, children }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/login')
      return
    }

    if (!isLoading && user) {
      // Check if user has the required role or higher
      const hasAccess = 
        (role === 'admin' && user.role === 'admin') ||
        (role === 'manager' && ['admin', 'manager'].includes(user.role)) ||
        (role === 'vendor' && ['admin', 'manager', 'vendor'].includes(user.role))

      if (!hasAccess) {
        router.replace('/login')
        return
      }
    }
  }, [user, isLoading, role, router])

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300">Checking access…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}