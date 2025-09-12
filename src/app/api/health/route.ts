import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Test Supabase connection by fetching categories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Database connection failed',
          error: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      data: {
        categories: categories || [],
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
