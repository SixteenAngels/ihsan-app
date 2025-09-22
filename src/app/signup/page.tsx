'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EnhancedAuthForms from '@/components/auth/enhanced-auth-forms'

export const dynamic = 'force-dynamic'

function SignupContent() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Redirect based on user role
        const userRole = (session.user.user_metadata && session.user.user_metadata.role) || 'customer'
        if (userRole === 'admin') router.push('/admin')
        else if (userRole === 'manager') router.push('/manager')
        else if (userRole === 'vendor') router.push('/vendor')
        else router.push('/')
      }
    }
    checkAuth()
  }, [router])

  return <EnhancedAuthForms initialTab="signup" onSuccess={() => router.push('/')} />
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <SignupContent />
    </Suspense>
  )
}