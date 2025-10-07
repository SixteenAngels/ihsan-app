'use client'

import { useEffect } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { fadeIn, scaleIn } from '@/lib/animations'

export default function OAuthHandler() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handle = async () => {
      try {
        // Hash tokens flow
        if (typeof window !== 'undefined' && window.location.hash) {
          const rawHash = window.location.hash.slice(1)
          const hashParams = new URLSearchParams(rawHash)
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')
          if (accessToken && refreshToken) {
            try {
              await (supabase as any).auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
            } catch {}
            const url = new URL(window.location.href)
            url.hash = ''
            window.history.replaceState({}, document.title, url.toString())
          }
        }

        // PKCE code exchange flow
        if (typeof window !== 'undefined') {
          const code = searchParams?.get('code')
          if (code) {
            try {
              await (supabase as any).auth.exchangeCodeForSession({ code })
            } catch {}
            const url = new URL(window.location.href)
            url.searchParams.delete('code')
            url.searchParams.delete('state')
            window.history.replaceState({}, document.title, url.toString())
          }
        }

        // Confirm session and redirect home
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          router.replace('/')
        } else {
          router.replace('/login')
        }
      } catch {
        router.replace('/login?error=auth_failed')
      }
    }
    handle()
  }, [router, params, searchParams])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/10"
    >
      <motion.div variants={scaleIn} className="text-center space-y-6 p-8">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Completing Sign In</h1>
          <p className="text-muted-foreground">Please wait while we complete your authentication...</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
