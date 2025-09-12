'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { UserRole, getUserPermissions, hasPermission } from '@/lib/roles'

interface User {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  canAccessAdminPanel: () => boolean
  canManageRoles: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated to prevent SSR/client mismatch
    setIsHydrated(true)
    
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would check Supabase auth
        const savedUser = localStorage.getItem('ihsan_user')
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login - in real app, this would use Supabase auth
      const mockUser: User = {
        id: '1',
        email: 'admin@ihsan.com',
        fullName: 'Admin User',
        role: 'admin'
      }
      
      setUser(mockUser)
      localStorage.setItem('ihsan_user', JSON.stringify(mockUser))
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('ihsan_user')
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
    logout,
    hasPermission: hasUserPermission,
    canAccessAdminPanel,
    canManageRoles,
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
    const { user, hasPermission } = useAuth()

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
  const { user, hasPermission } = useAuth()

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
