import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    // Fix the infinite recursion in profiles policy
    const fixPolicySQL = `
      -- Drop the problematic policy
      DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
      
      -- Create a fixed policy that doesn't cause recursion
      CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM profiles p 
          WHERE p.id = auth.uid() 
          AND p.role IN ('admin', 'manager')
        )
      );
    `

    const { data, error } = await supabase.rpc('exec_sql', { sql: fixPolicySQL })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profiles policy fixed successfully!',
      data: data
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
