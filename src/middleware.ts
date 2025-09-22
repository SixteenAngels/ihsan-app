import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Force HTTPS in production (except localhost)
  if (process.env.NODE_ENV === 'production' && 
      request.headers.get('x-forwarded-proto') !== 'https' &&
      request.nextUrl.hostname !== 'localhost') {
    return NextResponse.redirect(
      `https://${request.nextUrl.hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    )
  }

  // If hitting any of the old per-role login routes, redirect to unified /login
  if (path === '/admin/login' || path === '/manager/login' || path === '/vendor/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isRoleArea = path.startsWith('/admin') || path.startsWith('/manager') || path.startsWith('/vendor')
  
  if (isRoleArea) {
    try {
      // Create Supabase client for middleware
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        // If Supabase is not configured, allow access (for development)
        return NextResponse.next()
      }

      // Get the session from the Authorization header or cookies
      const authHeader = request.headers.get('authorization')
      const accessToken = authHeader?.replace('Bearer ', '')
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
        global: accessToken
          ? { headers: { Authorization: `Bearer ${accessToken}` } }
          : undefined,
      })

      if (accessToken) {
        const { data: { user }, error } = await supabase.auth.getUser(accessToken)
        
        if (error || !user) {
          return NextResponse.redirect(new URL('/login', request.url))
        }

        // Check user role from profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        // Fallback: if profile missing, allow only login page access
        if (profileError && path !== '/login') {
          return NextResponse.redirect(new URL('/login', request.url))
        }

        const userRole = (profile as any)?.role || 'customer'
        
        // Check if user has access to the requested area
        if (path.startsWith('/admin') && userRole !== 'admin') {
          return NextResponse.redirect(new URL('/login', request.url))
        }
        if (path.startsWith('/manager') && !['admin', 'manager'].includes(userRole)) {
          return NextResponse.redirect(new URL('/login', request.url))
        }
        if (path.startsWith('/vendor') && !['admin', 'manager', 'vendor'].includes(userRole)) {
          return NextResponse.redirect(new URL('/login', request.url))
        }

        return NextResponse.next()
      }

      // Fallback: Check for legacy cookies (for backward compatibility)
      const adminAuth = request.cookies.get('adminAuth')
      const managerAuth = request.cookies.get('managerAuth')
      const vendorAuth = request.cookies.get('vendorAuth')

      const isAuthed = (adminAuth && adminAuth.value === 'true') ||
                       (managerAuth && managerAuth.value === 'true') ||
                       (vendorAuth && vendorAuth.value === 'true')

      if (!isAuthed) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

    } catch (error) {
      console.error('Middleware auth error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/manager/:path*', '/vendor/:path*', '/auth/:path*']
}