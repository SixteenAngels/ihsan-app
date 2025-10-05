'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { fadeIn, scaleIn } from '@/lib/animations'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        // Clean up URL hash if provider returned tokens in fragment
        if (typeof window !== 'undefined' && window.location.hash) {
          const url = new URL(window.location.href)
          url.hash = ''
          window.history.replaceState({}, document.title, url.toString())
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          // Show error state briefly then redirect
          setTimeout(() => {
            router.push('/login?error=auth_failed')
          }, 2000)
          return
        }

        if (data.session) {
          // Set role cookies based on metadata if present (fallback to customer)
          const user = data.session.user
          let role = (user.user_metadata && (user.user_metadata.role as string)) || 'customer'

          // If profile exists, prefer its role
          try {
            const { data: profile } = await (supabase as any)
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single()
            if (profile?.role) role = profile.role
          } catch {}

          // Clear existing auth cookies
          document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'managerAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
          document.cookie = 'vendorAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

          // Set appropriate auth cookie based on role
          if (role === 'admin') document.cookie = 'adminAuth=true; path=/; max-age=86400'
          if (role === 'manager' || role === 'vendor_manager') document.cookie = 'managerAuth=true; path=/; max-age=86400'
          if (role === 'vendor') document.cookie = 'vendorAuth=true; path=/; max-age=86400'

          // Always redirect to homepage after successful OAuth login
          router.replace('/')
        } else {
          // No session - redirect to login
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setTimeout(() => {
          router.push('/login?error=auth_failed')
        }, 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/10"
    >
      <motion.div
        variants={scaleIn}
        className="text-center space-y-6 p-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
        >
          <Loader2 className="h-8 w-8 text-primary" />
        </motion.div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Completing Sign In</h1>
          <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-200" />
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-400" />
        </div>
      </motion.div>
    </motion.div>
  )
}
