'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Mail, Lock, User, ShoppingBag, Loader2, Phone } from 'lucide-react'
import { fadeIn, slideInFromLeft, slideInFromRight, bounceIn } from '@/lib/animations'
import { useAuth } from '@/lib/auth-context'
import { supabase, isSupabaseConfigured as supaConfigured } from '@/lib/supabase'

interface AuthFormsProps {
  onSuccess?: () => void
  initialTab?: 'login' | 'signup'
}

export default function AuthForms({ onSuccess, initialTab }: AuthFormsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(initialTab ?? 'login')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || '/'
  const { login, signup, user, refreshUser } = useAuth()
  
  // Check if Supabase is configured
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true)
  
  useEffect(() => {
    setIsSupabaseConfigured(!!supaConfigured)
  }, [])
  
  const handleGoogleLogin = async () => {
    if (!isSupabaseConfigured) {
      toast.error('Google Auth is not configured. Please set up Supabase first.')
      return
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : '')
    if (!appUrl) {
      toast.error('App URL not configured. Set NEXT_PUBLIC_APP_URL or use a valid origin.')
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: new URL('/auth/callback', appUrl).toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      
      if (error) {
        console.error('Google OAuth error:', error)
        toast.error(`Google login failed: ${error.message}`)
      } else {
        toast.success('Redirecting to Google...')
      }
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Google Auth is not properly configured. Please check your Supabase setup.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleEmailLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await login(email, password)
      await refreshUser()
      toast.success('Login successful!')

      // Determine role fresh from session/profile
      const { data: { user: supaUser } } = await (supabase as any).auth.getUser()
      let role: string = 'customer'
      if (supaUser) {
        const { data: profile } = await (supabase as any)
          .from('profiles')
          .select('role')
          .eq('id', supaUser.id)
          .single()
        role = (profile?.role as string) || 'customer'
      }

      // Always redirect to homepage after successful login
      router.replace('/')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignup = async (email: string, password: string, fullName: string, phone: string) => {
    setIsLoading(true)
    try {
      await signup(email, password, fullName, phone)
      toast.success('Account created successfully!')
      router.replace(redirect || '/')
    } catch (error: any) {
      console.error('Signup error:', error)
      toast.error(error.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const phone = formData.get('phone') as string

    if (activeTab === 'login') {
      await handleEmailLogin(email, password)
    } else {
      await handleEmailSignup(email, password, fullName, phone)
    }
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={fadeIn}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border border-white/20 shadow-2xl bg-white/60 backdrop-blur-md dark:bg-slate-800/50 dark:border-white/10 rounded-xl">
        <CardHeader className="text-center space-y-2">
          <motion.div
            initial="initial"
            animate="in"
            variants={bounceIn}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-4"
          >
            <ShoppingBag className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Sign in or Sign up
          </CardTitle>
          
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google OAuth Button */}
          <motion.div
            initial="initial"
            animate="in"
            variants={slideInFromLeft}
            transition={{ delay: 0.1 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50 transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={isLoading || !isSupabaseConfigured}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              {!isSupabaseConfigured ? 'Google Auth (Not Configured)' : 'Continue with Google'}
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Email/Password Forms */}
          <motion.div
            initial="initial"
            animate="in"
            variants={slideInFromRight}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'signup')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        name="email"
                        type="email"
                        placeholder={"name@example.com"}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={"••••••••"}
                        className="pl-10 pr-10"
                        required
                        autoComplete="current-password"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Demo credentials removed for production */}

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-6">
                {isSupabaseConfigured ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          name="phone"
                          type="tel"
                          placeholder="+233 55 000 0000"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="At least 6 characters"
                          className="pl-10 pr-10"
                          required
                          minLength={6}
                          autoComplete="new-password"
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck="false"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                ) : null}
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Terms and Privacy */}
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            transition={{ delay: 0.3 }}
            className="text-center text-sm text-muted-foreground"
          >
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}