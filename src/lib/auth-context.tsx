'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { UserRole, getUserPermissions, hasPermission } from '@/lib/roles'

interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl?: string
  phone?: string
  vendorStatus?: string
  isActive?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName?: string, phone?: string, role?: UserRole) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  canAccessAdminPanel: () => boolean
  canManageRoles: () => boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  // Convert Supabase user to our User interface
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Fetch user profile from our profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      if (error) {
        // Attempt to create minimal profile if missing (avoid non-existent columns)
        try {
          await supabase.from('profiles').upsert({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            full_name: (supabaseUser as any).user_metadata?.full_name || '',
            phone: (supabaseUser as any).user_metadata?.phone || null,
            role: 'customer'
          } as any)
          const retry = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseUser.id)
            .single()
          if (retry.data) {
            return {
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              fullName: retry.data.full_name || '',
              role: (retry.data.role as UserRole) || 'customer',
              avatarUrl: retry.data.avatar_url || undefined,
              phone: retry.data.phone || undefined,
              vendorStatus: (retry.data as any).vendor_status || undefined,
              isActive: (retry.data as any).is_active ?? true
            }
          }
        } catch (e) {
          console.error('Profile upsert failed:', e)
        }
        console.error('Error fetching user profile:', error)
        // Fallback to minimal user from auth if profile cannot be read/created
        return {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          fullName: (supabaseUser as any).user_metadata?.full_name || '',
          role: ((supabaseUser as any).user_metadata?.role as UserRole) || 'customer',
          avatarUrl: (supabaseUser as any).user_metadata?.avatar_url || undefined,
          phone: (supabaseUser as any).user_metadata?.phone || undefined,
          vendorStatus: undefined,
          isActive: true
        }
      }

      return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        fullName: profile?.full_name || '',
        role: (profile?.role as UserRole) || 'customer',
        avatarUrl: profile?.avatar_url || undefined,
        phone: profile?.phone || undefined,
        vendorStatus: profile?.vendor_status || undefined,
        isActive: profile?.is_active ?? true
      }
    } catch (error) {
      console.error('Error converting Supabase user:', error)
      return null
    }
  }

  // Check authentication status
  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setUser(null)
        return
      }

      if (session?.user) {
        const userData = await convertSupabaseUser(session.user)
        setUser(userData)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Listen for auth changes
  useEffect(() => {
    setIsHydrated(true)
    checkAuth()

    const authAny = (supabase as any).auth
    const hasOnAuthStateChange = authAny && typeof authAny.onAuthStateChange === 'function'

    const { data: { subscription } } = hasOnAuthStateChange
      ? authAny.onAuthStateChange(
          async (event: any, session: any) => {
            console.log('Auth state changed:', event, session?.user?.email)
            
            if (session?.user) {
              const userData = await convertSupabaseUser(session.user)
              setUser(userData)
            } else {
              setUser(null)
            }
            
            setIsLoading(false)
          }
        )
      : { data: { subscription: { unsubscribe: () => {} } } }

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      if (data.user) {
        const userData = await convertSupabaseUser(data.user)
        setUser(userData)
      }
    } catch (error: unknown) {
      console.error('Login failed:', error)
      const message = error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      throw new Error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    fullName?: string, 
    phone?: string, 
    role: UserRole = 'customer'
  ) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            role: role
          }
        }
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // The profile will be created automatically by the database trigger
        // But we can also create it manually to ensure it exists
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            email: email,
            full_name: fullName || '',
            phone: phone || '',
            role: role
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't fail the signup if profile creation fails
        }

        const userData = await convertSupabaseUser(data.user)
        setUser(userData)
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const refreshUser = async () => {
    try {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      if (supabaseUser) {
        const userData = await convertSupabaseUser(supabaseUser)
        setUser(userData)
      }
    } catch (error) {
      console.error('Refresh user failed:', error)
    }
  }

  const hasUserPermission = (permission: string) => {
    if (!user) return false
    return hasPermission(user.role, permission as any)
  }

  const canAccessAdminPanel = () => {
    if (!user) return false
    return ['admin', 'manager'].includes(user.role)
  }

  const canManageRoles = () => {
    if (!user) return false
    return user.role === 'admin'
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    hasPermission: hasUserPermission,
    canAccessAdminPanel,
    canManageRoles,
    refreshUser,
  }

  // During SSR and before hydration, show loading state
  if (!isHydrated) {
    return (
      <AuthContext.Provider value={{ ...value, isLoading: true }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for role-based access control
export function withRoleAccess(
  Component: React.ComponentType<any>,
  requiredPermission?: string,
  requiredRole?: UserRole
) {
  return function RoleProtectedComponent(props: any) {
    const { user, hasPermission, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">Please log in to access this page.</p>
          </div>
        </div>
      )
    }

    if (requiredRole && user.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have the required role to access this page.</p>
          </div>
        </div>
      )
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You do not have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

// Component for conditional rendering based on permissions
export function PermissionGate({ 
  permission, 
  role, 
  children, 
  fallback 
}: { 
  permission?: string
  role?: UserRole
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { user, hasPermission, isLoading } = useAuth()

  if (isLoading) {
    return fallback || null
  }

  if (!user) {
    return fallback || null
  }

  if (role && user.role !== role) {
    return fallback || null
  }

  if (permission && !hasPermission(permission)) {
    return fallback || null
  }

  return <>{children}</>
}