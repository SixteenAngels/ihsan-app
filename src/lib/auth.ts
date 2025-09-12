import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './supabase'

// Client-side Supabase client
export const createClient = () => createClientComponentClient<Database>()

// Server-side Supabase client
export const createServerClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}

// Auth helper functions
export const getCurrentUser = async () => {
  const supabase = createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export const getCurrentProfile = async () => {
  const supabase = createServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return null
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  if (profileError) {
    return null
  }
  
  return profile
}

export const requireAuth = async () => {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return user
}

export const requireRole = async (allowedRoles: string[]) => {
  const profile = await getCurrentProfile()
  
  if (!profile) {
    throw new Error('Authentication required')
  }
  
  if (!allowedRoles.includes(profile.role)) {
    throw new Error('Insufficient permissions')
  }
  
  return profile
}
