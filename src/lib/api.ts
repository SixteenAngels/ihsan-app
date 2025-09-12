import { createClient } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

// Product-related functions
export const getProducts = async (filters?: {
  category?: string
  search?: string
  isReadyNow?: boolean
  isFeatured?: boolean
  limit?: number
  offset?: number
}) => {
  const supabase = createClient()
  
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_variants (
        id,
        name,
        price,
        stock_quantity,
        attributes
      )
    `)
    .eq('is_active', true)
  
  if (filters?.category) {
    query = query.eq('category_id', filters.category)
  }
  
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`)
  }
  
  if (filters?.isReadyNow !== undefined) {
    query = query.eq('is_ready_now', filters.isReadyNow)
  }
  
  if (filters?.isFeatured !== undefined) {
    query = query.eq('is_featured', filters.isFeatured)
  }
  
  if (filters?.limit) {
    query = query.limit(filters.limit)
  }
  
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch products: ${error.message}`)
  }
  
  return data
}

export const getProduct = async (slug: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_variants (
        id,
        name,
        sku,
        price,
        compare_price,
        stock_quantity,
        attributes,
        is_active
      )
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  
  if (error) {
    throw new Error(`Failed to fetch product: ${error.message}`)
  }
  
  return data
}

export const getCategories = async () => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  
  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
  
  return data
}

// Cart functions
export const getCartItems = async (userId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      products (
        id,
        name,
        slug,
        price,
        images,
        is_active,
        stock_quantity
      ),
      product_variants (
        id,
        name,
        price,
        stock_quantity
      )
    `)
    .eq('user_id', userId)
  
  if (error) {
    throw new Error(`Failed to fetch cart items: ${error.message}`)
  }
  
  return data
}

export const addToCart = async (userId: string, productId: string, variantId: string | null, quantity: number) => {
  const supabase = createClient()
  
  // Check if item already exists in cart
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('variant_id', variantId)
    .single()
  
  if (existingItem) {
    // Update existing item
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to update cart item: ${error.message}`)
    }
    
    return data
  } else {
    // Add new item
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: userId,
        product_id: productId,
        variant_id: variantId,
        quantity
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to add to cart: ${error.message}`)
    }
    
    return data
  }
}

export const updateCartItem = async (itemId: string, quantity: number) => {
  const supabase = createClient()
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)
    
    if (error) {
      throw new Error(`Failed to remove cart item: ${error.message}`)
    }
    
    return null
  }
  
  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to update cart item: ${error.message}`)
  }
  
  return data
}

export const removeFromCart = async (itemId: string) => {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', itemId)
  
  if (error) {
    throw new Error(`Failed to remove cart item: ${error.message}`)
  }
}

export const clearCart = async (userId: string) => {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
  
  if (error) {
    throw new Error(`Failed to clear cart: ${error.message}`)
  }
}

// Order functions
export const createOrder = async (orderData: {
  userId: string
  shippingMethod: 'air' | 'sea'
  shippingCost: number
  subtotal: number
  taxAmount: number
  totalAmount: number
  shippingAddress: any
  billingAddress: any
  items: Array<{
    productId: string
    variantId?: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
}) => {
  const supabase = createClient()
  
  // Generate order number
  const { data: orderNumberData } = await supabase.rpc('generate_order_number')
  const orderNumber = orderNumberData || `IH-${Date.now()}`
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: orderData.userId,
      shipping_method: orderData.shippingMethod,
      shipping_cost: orderData.shippingCost,
      subtotal: orderData.subtotal,
      tax_amount: orderData.taxAmount,
      total_amount: orderData.totalAmount,
      shipping_address: orderData.shippingAddress,
      billing_address: orderData.billingAddress,
      status: 'pending',
      payment_status: 'pending'
    })
    .select()
    .single()
  
  if (orderError) {
    throw new Error(`Failed to create order: ${orderError.message}`)
  }
  
  // Create order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice
  }))
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) {
    throw new Error(`Failed to create order items: ${itemsError.message}`)
  }
  
  return order
}

export const getOrders = async (userId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        products (
          id,
          name,
          slug,
          images
        ),
        product_variants (
          id,
          name
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`)
  }
  
  return data
}

export const getOrder = async (orderId: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        total_price,
        products (
          id,
          name,
          slug,
          images
        ),
        product_variants (
          id,
          name
        )
      )
    `)
    .eq('id', orderId)
    .single()
  
  if (error) {
    throw new Error(`Failed to fetch order: ${error.message}`)
  }
  
  return data
}

// Group buy functions
export const getGroupBuys = async () => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('group_buys')
    .select(`
      *,
      products (
        id,
        name,
        slug,
        images,
        price
      )
    `)
    .eq('is_active', true)
    .gte('end_date', new Date().toISOString())
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch group buys: ${error.message}`)
  }
  
  return data
}

export const joinGroupBuy = async (groupId: string, userId: string, quantity: number) => {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('group_buy_participants')
    .insert({
      group_buy_id: groupId,
      user_id: userId,
      quantity
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to join group buy: ${error.message}`)
  }
  
  return data
}

export const leaveGroupBuy = async (groupId: string, userId: string) => {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('group_buy_participants')
    .delete()
    .eq('group_buy_id', groupId)
    .eq('user_id', userId)
  
  if (error) {
    throw new Error(`Failed to leave group buy: ${error.message}`)
  }
}
