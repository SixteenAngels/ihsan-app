import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/upload - Upload a file to Supabase Storage (bucket: product-images)
// Expects multipart/form-data with field name "file"
export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null
    const pathPrefix = (form.get('path') as string | null) || 'products'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    const filePath = `${pathPrefix}/${timestamp}-${sanitizedName}`

    const arrayBuffer = await file.arrayBuffer()
    const { data, error } = await supabase
      .storage
      .from('product-images')
      .upload(filePath, Buffer.from(arrayBuffer), {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('product-images')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrlData.publicUrl, path: data.path })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const runtime = 'nodejs'


