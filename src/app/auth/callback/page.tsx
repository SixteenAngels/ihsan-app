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
          // Success - redirect to home or intended page
          setTimeout(() => {
            router.push('/')
          }, 1500)
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
          <p className="text-muted-foreground">
            Please wait while we complete your authentication...
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </motion.div>
    </motion.div>
  )
}
