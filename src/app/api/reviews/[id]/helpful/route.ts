import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/reviews/[id]/helpful - Mark a review as helpful
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Review ID is required'
      }, { status: 400 })
    }

    // Increment helpful count without raw
    const { data: current, error: fetchErr } = await supabase
      .from('reviews')
      .select('helpful_count')
      .eq('id', id)
      .single()

    if (fetchErr) {
      console.error('Fetch review error:', fetchErr)
      return NextResponse.json({ success: false, error: fetchErr.message }, { status: 500 })
    }

    const nextCount = (current?.helpful_count || 0) + 1

    const { data, error } = await supabase
      .from('reviews')
      .update({ 
        helpful_count: nextCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('helpful_count')
      .single()

    if (error) {
      console.error('Supabase review helpful update error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      helpful_count: data.helpful_count
    })

  } catch (error) {
    console.error('Review helpful update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
