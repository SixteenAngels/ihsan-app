'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EnhancedAuthForms from '@/components/auth/enhanced-auth-forms'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/')
      }
    }
    checkAuth()
  }, [router])

  return <EnhancedAuthForms onSuccess={() => router.push('/')} />
}