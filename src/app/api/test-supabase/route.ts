import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }

    // Test if we can access the profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    if (profilesError) {
      return NextResponse.json({
        success: false,
        error: 'Profiles table not accessible',
        details: profilesError
      }, { status: 500 })
    }

    // Test if we can access products table
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('count')
      .limit(1)

    if (productsError) {
      return NextResponse.json({
        success: false,
        error: 'Products table not accessible',
        details: productsError
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      database: {
        categories: data?.length || 0,
        profiles: 'accessible',
        products: 'accessible'
      },
      config: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
