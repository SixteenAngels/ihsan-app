import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/group-buys/[id]/join - Join a group buy
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { user_id, quantity } = body

    if (!user_id || !quantity || quantity <= 0) {
      return NextResponse.json({
        success: false,
        error: 'User ID and valid quantity are required'
      }, { status: 400 })
    }

    // Check if group buy exists and is active
    const { data: groupBuy, error: groupBuyError } = await supabase
      .from('group_buys')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (groupBuyError || !groupBuy) {
      return NextResponse.json({
        success: false,
        error: 'Group buy not found or inactive'
      }, { status: 404 })
    }

    // Check if group buy is still accepting participants
    const now = new Date()
    const endDate = new Date(groupBuy.end_date)
    
    if (now > endDate) {
      return NextResponse.json({
        success: false,
        error: 'Group buy has ended'
      }, { status: 400 })
    }

    // Check if user already joined
    const { data: existingParticipation } = await supabase
      .from('group_buy_participants')
      .select('id, quantity')
      .eq('group_buy_id', id)
      .eq('user_id', user_id)
      .single()

    if (existingParticipation) {
      return NextResponse.json({
        success: false,
        error: 'You have already joined this group buy'
      }, { status: 400 })
    }

    // Check if adding this quantity would exceed max_quantity
    const newTotalQuantity = groupBuy.current_quantity + quantity
    if (newTotalQuantity > groupBuy.max_quantity) {
      return NextResponse.json({
        success: false,
        error: `Adding ${quantity} items would exceed the maximum quantity of ${groupBuy.max_quantity}`
      }, { status: 400 })
    }

    // Join the group buy
    const { data, error } = await supabase
      .from('group_buy_participants')
      .insert({
        group_buy_id: id,
        user_id,
        quantity
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Successfully joined group buy'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// DELETE /api/group-buys/[id]/join - Leave a group buy
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('group_buy_participants')
      .delete()
      .eq('group_buy_id', id)
      .eq('user_id', userId)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully left group buy'
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
