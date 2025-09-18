import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/lib/settings-store'

// POST /api/vendor/apply - Request vendor status (sets vendor_status='pending')
export async function POST(request: NextRequest) {
  try {
    const settings = getSettings()
    if (!settings.vendorFeaturesEnabled) {
      return NextResponse.json({ success: false, error: 'Vendor features disabled' }, { status: 403 })
    }
    const body = await request.json()
    const { user_id, company_name, description, website } = body

    if (!user_id) {
      return NextResponse.json({ success: false, error: 'user_id required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('profiles')
      .update({ vendor_status: 'pending' as any, company_name, company_description: description, website })
      .eq('id', user_id)

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })

    return NextResponse.json({ success: true, message: 'Application submitted. We will review shortly.' })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
}

