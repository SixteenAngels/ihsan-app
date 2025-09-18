import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

type CategoryRow = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number | null
  is_active: boolean | null
}

function buildTree(rows: CategoryRow[]) {
  const byId: Record<string, any> = {}
  const roots: any[] = []
  rows.forEach(r => {
    byId[r.id] = { ...r, children: [] }
  })
  rows.forEach(r => {
    if (r.parent_id && byId[r.parent_id]) {
      byId[r.parent_id].children.push(byId[r.id])
    } else {
      roots.push(byId[r.id])
    }
  })
  // sort if sort_order exists
  const sortChildren = (nodes: any[]) => {
    nodes.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    nodes.forEach(n => sortChildren(n.children))
  }
  sortChildren(roots)
  return roots
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const slug = searchParams.get('slug')
  const parentId = searchParams.get('parentId')
  const includeInactive = searchParams.get('includeInactive') === 'true'
  const includeChildren = searchParams.get('includeChildren') !== 'false'

  try {
    let query = supabase
      .from('categories')
      .select('id,name,slug,description,image_url,parent_id,sort_order,is_active')

    if (!includeInactive) query = query.eq('is_active', true)
    if (id) query = query.eq('id', id)
    if (slug) query = query.eq('slug', slug)
    if (parentId) query = query.eq('parent_id', parentId)

    const { data, error } = await query
    if (error) throw error
    const rows = (data || []) as CategoryRow[]

    if (id || slug) {
      const cat = rows[0]
      if (!cat) return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      if (!includeChildren) return NextResponse.json(cat)
      // fetch all to build subtree
      const { data: allData, error: allErr } = await supabase
        .from('categories')
        .select('id,name,slug,description,image_url,parent_id,sort_order,is_active')
      if (allErr) throw allErr
      const tree = buildTree((allData || []) as CategoryRow[])
      // find node by id
      const byId: Record<string, any> = {}
      ;(allData || []).forEach((r: any) => (byId[r.id] = r))
      const findNode = (nodes: any[]): any | null => {
        for (const n of nodes) {
          if (n.id === cat.id) return n
          const c = findNode(n.children)
          if (c) return c
        }
        return null
      }
      const node = findNode(tree)
      return NextResponse.json(node || cat)
    }

    if (!includeChildren) return NextResponse.json(rows)

    const tree = buildTree(rows)
    return NextResponse.json(tree)
  } catch (e) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const slug = (body.slug || String(body.name || '')).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const { data, error } = await supabase
      .from('categories')
      .insert([
        {
          name: body.name,
          slug,
          description: body.description || null,
          image_url: body.imageUrl || null,
          parent_id: body.parentId || null,
          sort_order: body.sortOrder ?? null,
          is_active: body.isActive !== false,
        } as any,
      ])
      .select('id,name,slug,description,image_url,parent_id,sort_order,is_active')
      .single()
    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...update } = body
    const patch: any = {
      name: update.name,
      slug: update.slug,
      description: update.description,
      image_url: update.imageUrl,
      parent_id: update.parentId,
      sort_order: update.sortOrder,
      is_active: update.isActive,
    }
    Object.keys(patch).forEach(k => patch[k] === undefined && delete patch[k])
    const { data, error } = await supabase
      .from('categories')
      .update(patch)
      .eq('id', id)
      .select('id,name,slug,description,image_url,parent_id,sort_order,is_active')
      .single()
    if (error) throw error
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Category ID required' }, { status: 400 })
  try {
    const { error } = await supabase.from('categories').update({ is_active: false } as any).eq('id', id)
    if (error) throw error
    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}