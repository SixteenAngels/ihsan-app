import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Strict production behavior: require env vars
if (process.env.NODE_ENV === 'production' && !isSupabaseConfigured) {
  throw new Error('Supabase configuration is missing in production environment')
}

export const supabase = createClient(supabaseUrl as string, supabaseAnonKey as string)

export type HomepageBanner = {
  id: string
  title: string
  subtitle?: string | null
  cta_label?: string | null
  cta_href?: string | null
  secondary_label?: string | null
  secondary_href?: string | null
  image_url?: string | null
  bg_gradient?: string | null
  is_active: boolean
  sort_order: number
  starts_at?: string | null
  ends_at?: string | null
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin' | 'manager' | 'support' | 'delivery'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin' | 'manager' | 'support' | 'delivery'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin' | 'manager' | 'support' | 'delivery'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          short_description: string | null
          price: number
          compare_price: number | null
          cost_price: number | null
          sku: string
          barcode: string | null
          weight: number | null
          dimensions: string | null
          category_id: string
          brand: string | null
          tags: string[]
          images: string[]
          is_active: boolean
          is_featured: boolean
          is_ready_now: boolean
          stock_quantity: number
          min_stock_level: number
          track_inventory: boolean
          allow_backorder: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          short_description?: string | null
          price: number
          compare_price?: number | null
          cost_price?: number | null
          sku: string
          barcode?: string | null
          weight?: number | null
          dimensions?: string | null
          category_id: string
          brand?: string | null
          tags?: string[]
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          is_ready_now?: boolean
          stock_quantity?: number
          min_stock_level?: number
          track_inventory?: boolean
          allow_backorder?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string | null
          price?: number
          compare_price?: number | null
          cost_price?: number | null
          sku?: string
          barcode?: string | null
          weight?: number | null
          dimensions?: string | null
          category_id?: string
          brand?: string | null
          tags?: string[]
          images?: string[]
          is_active?: boolean
          is_featured?: boolean
          is_ready_now?: boolean
          stock_quantity?: number
          min_stock_level?: number
          track_inventory?: boolean
          allow_backorder?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          name: string
          sku: string
          price: number
          compare_price: number | null
          stock_quantity: number
          attributes: Record<string, unknown>
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          sku: string
          price: number
          compare_price?: number | null
          stock_quantity?: number
          attributes?: Record<string, unknown>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          sku?: string
          price?: number
          compare_price?: number | null
          stock_quantity?: number
          attributes?: Record<string, unknown>
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          type: 'billing' | 'shipping'
          full_name: string
          company: string | null
          address_line_1: string
          address_line_2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'billing' | 'shipping'
          full_name: string
          company?: string | null
          address_line_1: string
          address_line_2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'billing' | 'shipping'
          full_name?: string
          company?: string | null
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          status: 'pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'in_transit' | 'arrived' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
          shipping_method: 'air' | 'sea'
          shipping_cost: number
          subtotal: number
          tax_amount: number
          total_amount: number
          currency: string
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method: string | null
          payment_reference: string | null
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown>
          notes: string | null
          estimated_delivery_date: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id: string
          status?: 'pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'in_transit' | 'arrived' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
          shipping_method: 'air' | 'sea'
          shipping_cost: number
          subtotal: number
          tax_amount: number
          total_amount: number
          currency?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_reference?: string | null
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown>
          notes?: string | null
          estimated_delivery_date?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          status?: 'pending' | 'payment_confirmed' | 'processing' | 'shipped' | 'in_transit' | 'arrived' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded'
          shipping_method?: 'air' | 'sea'
          shipping_cost?: number
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          currency?: string
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          payment_method?: string | null
          payment_reference?: string | null
          shipping_address?: Record<string, unknown>
          billing_address?: Record<string, unknown>
          notes?: string | null
          estimated_delivery_date?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      group_buys: {
        Row: {
          id: string
          product_id: string
          name: string
          description: string | null
          min_quantity: number
          max_quantity: number
          current_quantity: number
          price_tiers: Record<string, unknown>
          start_date: string
          end_date: string
          is_active: boolean
          is_extended: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          description?: string | null
          min_quantity: number
          max_quantity: number
          current_quantity?: number
          price_tiers: Record<string, unknown>
          start_date: string
          end_date: string
          is_active?: boolean
          is_extended?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          description?: string | null
          min_quantity?: number
          max_quantity?: number
          current_quantity?: number
          price_tiers?: Record<string, unknown>
          start_date?: string
          end_date?: string
          is_active?: boolean
          is_extended?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      group_buy_participants: {
        Row: {
          id: string
          group_buy_id: string
          user_id: string
          quantity: number
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_buy_id: string
          user_id: string
          quantity: number
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_buy_id?: string
          user_id?: string
          quantity?: number
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          order_id: string
          rating: number
          title: string | null
          comment: string | null
          is_verified: boolean
          is_approved: boolean
          helpful_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          order_id: string
          rating: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          order_id?: string
          rating?: number
          title?: string | null
          comment?: string | null
          is_verified?: boolean
          is_approved?: boolean
          helpful_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          variant_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          variant_id?: string | null
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          variant_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'order_update' | 'group_buy_reminder' | 'ready_now_alert' | 'general'
          title: string
          message: string
          data: Record<string, unknown> | null
          is_read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'order_update' | 'group_buy_reminder' | 'ready_now_alert' | 'general'
          title: string
          message: string
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'order_update' | 'group_buy_reminder' | 'ready_now_alert' | 'general'
          title?: string
          message?: string
          data?: Record<string, unknown> | null
          is_read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
