import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSettings } from '@/lib/settings-store'

function toUiProduct(p: any) {
  const stock = typeof p.stock_quantity === 'number' ? p.stock_quantity : (p.stock ?? 0)
  const image = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : (p.image || null)
  const categoryName = p.categories?.name || p.category || ''
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    brand: p.brand || '',
    category: categoryName,
    stock,
    status: p.is_active === false ? 'inactive' : (stock > 0 ? 'active' : 'out_of_stock'),
    image,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const vendorId = searchParams.get('vendorId')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const readyNowFilter = searchParams.get('readyNow')
  const hiddenFilter = searchParams.get('hidden')
  const approvalFilter = searchParams.get('approved')

  try {
    let categoryId: string | null = null
    if (category) {
      const { data: catBySlug } = await supabase.from('categories').select('id,slug,name').eq('slug', category).maybeSingle()
      if (catBySlug?.id) categoryId = catBySlug.id
      else {
        const { data: catByName } = await supabase.from('categories').select('id,slug,name').eq('name', category).maybeSingle()
        if (catByName?.id) categoryId = catByName.id
      }
    }

    let query = supabase
      .from('products')
      .select(
        'id,name,price,brand,stock_quantity,is_active,images,category_id,created_at,categories(name,slug),approved,hidden,is_ready_now,vendor_id',
        { count: 'exact' }
      )

    if (brand) query = query.eq('brand', brand)
    if (minPrice) query = query.gte('price', Number(minPrice))
    if (maxPrice) query = query.lte('price', Number(maxPrice))
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    if (categoryId) query = query.eq('category_id', categoryId)

    // Avoid DB errors for optional columns by filtering post-fetch for these
    // Sorting
    if (sort === 'price-low') query = query.order('price', { ascending: true })
    else if (sort === 'price-high') query = query.order('price', { ascending: false })
    else if (sort === 'newest') query = query.order('created_at', { ascending: false })

    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data, error, count } = await query.range(from, to)
    if (error) throw error

    let rows = data || []
    // Post-filter for optional fields
    if (vendorId) rows = rows.filter((p: any) => p.vendor_id === vendorId)
    if (approvalFilter === 'true') rows = rows.filter((p: any) => p.approved === true)
    if (approvalFilter === 'false') rows = rows.filter((p: any) => p.approved === false)
    if (hiddenFilter === 'true') rows = rows.filter((p: any) => p.hidden === true || p.is_active === false)
    if (hiddenFilter === 'false') rows = rows.filter((p: any) => p.hidden !== true && p.is_active !== false)
    if (readyNowFilter === 'true') rows = rows.filter((p: any) => p.is_ready_now === true)
    if (readyNowFilter === 'false') rows = rows.filter((p: any) => p.is_ready_now !== true)

    const uiProducts = rows.map(toUiProduct)
    return NextResponse.json({
      products: uiProducts,
      pagination: {
        page,
        limit,
        total: count ?? uiProducts.length,
        pages: Math.ceil(((count ?? uiProducts.length) || 0) / limit) || 1,
      },
    })
  } catch (e) {
    return NextResponse.json({ products: [], pagination: { page, limit, total: 0, pages: 1 } })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    let categoryId: string | null = null
    if (body.category) {
      const slugOrName = String(body.category)
      const { data: catBySlug } = await supabase.from('categories').select('id,slug,name').eq('slug', slugOrName).maybeSingle()
      if (catBySlug?.id) categoryId = catBySlug.id
      else {
        const { data: catByName } = await supabase.from('categories').select('id,slug,name').eq('name', slugOrName).maybeSingle()
        if (catByName?.id) categoryId = catByName.id
      }
    }

    const slug = (body.slug || String(body.name || '')).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${Date.now()}`
    const sku = body.sku || `${slug}-${Date.now()}`
    const images = body.image ? [body.image] : (Array.isArray(body.images) ? body.images : [])

    // Determine approved/hidden defaults (optional columns)
    const settings = getSettings()
    const isVendorProduct = !!body.vendorId
    const approved = isVendorProduct ? (!settings.approvalRequired || body.approved === true) : true
    const hidden = !!body.hidden

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name: body.name,
          slug,
          description: body.description || '',
          price: Number(body.price) || 0,
          category_id: categoryId as any,
          brand: body.brand || null,
          images,
          is_active: hidden ? false : true,
          stock_quantity: typeof body.stock === 'number' ? body.stock : 0,
          sku,
          approved: approved as any,
          hidden: hidden as any,
          vendor_id: body.vendorId || null,
          is_ready_now: body.readyNow === true ? true : false,
        } as any,
      ])
      .select('id,name,price,brand,stock_quantity,is_active,images,category_id,categories(name,slug),approved,hidden,is_ready_now,vendor_id')
      .single()

    if (error) throw error
    return NextResponse.json(toUiProduct(data), { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    let patch: any = { ...updateData }

    if (updateData.category) {
      const slugOrName = String(updateData.category)
      const { data: catBySlug } = await supabase.from('categories').select('id').eq('slug', slugOrName).maybeSingle()
      if (catBySlug?.id) patch.category_id = catBySlug.id
      else {
        const { data: catByName } = await supabase.from('categories').select('id').eq('name', slugOrName).maybeSingle()
        if (catByName?.id) patch.category_id = catByName.id
      }
      delete patch.category
    }

    if (typeof updateData.stock === 'number') {
      patch.stock_quantity = updateData.stock
      delete patch.stock
    }

    if (typeof updateData.hidden === 'boolean') {
      patch.is_active = !updateData.hidden
      patch.hidden = updateData.hidden
      delete patch.hidden
    }

    if (typeof updateData.readyNow === 'boolean') {
      patch.is_ready_now = updateData.readyNow
      delete patch.readyNow
    }

    if (updateData.image) {
      patch.images = [updateData.image]
      delete patch.image
    }

    const { data, error } = await supabase
      .from('products')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id,name,price,brand,stock_quantity,is_active,images,category_id,categories(name,slug),approved,hidden,is_ready_now,vendor_id')
      .single()

    if (error) throw error
    return NextResponse.json(toUiProduct(data))
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }
  try {
    const { error } = await supabase.from('products').update({ is_active: false }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}