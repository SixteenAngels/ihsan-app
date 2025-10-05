import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPages() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      try {
        // Hash tokens flow
        if (typeof window !== 'undefined' && window.location.hash) {
          const rawHash = window.location.hash.startsWith('#')
            ? window.location.hash.slice(1)
            : window.location.hash
          const hashParams = new URLSearchParams(rawHash)
          const accessToken = hashParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token')

          if (accessToken && refreshToken) {
            try {
              await (supabase as any).auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
            } catch (e) {
              // ignore and continue to code exchange
            }

            // Clean hash
            const url = new URL(window.location.href)
            url.hash = ''
            window.history.replaceState({}, document.title, url.toString())
          }
        }

        // PKCE code exchange flow
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search)
          const code = params.get('code')
          if (code) {
            try {
              await (supabase as any).auth.exchangeCodeForSession({ code })
            } catch (e) {
              // no-op
            }
            const url = new URL(window.location.href)
            url.searchParams.delete('code')
            url.searchParams.delete('state')
            window.history.replaceState({}, document.title, url.toString())
          }
        }

        // Confirm session and redirect
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          router.replace('/login?error=auth_failed')
          return
        }
        if (data.session) {
          router.replace('/')
          return
        }
        router.replace('/login')
      } catch (e) {
        router.replace('/login?error=auth_failed')
      }
    }
    run()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-3" />
        <p>Completing Sign In…</p>
      </div>
    </div>
  )
}
