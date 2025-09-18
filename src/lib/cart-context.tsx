'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'react-toastify'

interface CartItem {
  id: string
  product_id: string
  variant_id?: string
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image: string
  slug: string
  vendor?: string
  category?: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => Promise<void>
  updateQuantity: (productId: string, variantId: string | undefined, quantity: number) => Promise<void>
  removeFromCart: (productId: string, variantId: string | undefined) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Load cart from API or localStorage
  const loadCart = async () => {
    if (!user) {
      // Load from localStorage for guest users
      const savedCart = localStorage.getItem('ihsan_cart')
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
        }
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/cart')
      const data = await response.json()
      
      if (data.success) {
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save cart to localStorage for guest users
  const saveToLocalStorage = (cartItems: CartItem[]) => {
    if (!user) {
      localStorage.setItem('ihsan_cart', JSON.stringify(cartItems))
    }
  }

  // Sync guest cart to user account when user logs in
  const syncGuestCart = async () => {
    if (!user) return

    const savedCart = localStorage.getItem('ihsan_cart')
    if (savedCart) {
      try {
        const guestItems = JSON.parse(savedCart)
        if (guestItems.length > 0) {
          // Add each guest item to user's cart
          for (const item of guestItems) {
            await addToCartAPI(item)
          }
          // Clear localStorage
          localStorage.removeItem('ihsan_cart')
        }
      } catch (error) {
        console.error('Error syncing guest cart:', error)
      }
    }
  }

  useEffect(() => {
    loadCart()
  }, [user])

  useEffect(() => {
    if (user) {
      syncGuestCart()
    }
  }, [user])

  const addToCartAPI = async (item: Omit<CartItem, 'id' | 'quantity'>) => {
    if (!user) return

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: 1
        })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const addToCart = async (product: Omit<CartItem, 'id' | 'quantity'>) => {
    try {
      if (user) {
        // Add to database
        await addToCartAPI(product)
        // Refresh cart
        await loadCart()
      } else {
        // Add to localStorage for guest users
        const existingItem = items.find(
          item => item.product_id === product.product_id && 
          item.variant_id === product.variant_id
        )

        let newItems: CartItem[]
        if (existingItem) {
          newItems = items.map(item =>
            item.product_id === product.product_id && item.variant_id === product.variant_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        } else {
          const newItem: CartItem = {
            ...product,
            id: `${product.product_id}-${product.variant_id || 'default'}`,
            quantity: 1
          }
          newItems = [...items, newItem]
        }

        setItems(newItems)
        saveToLocalStorage(newItems)
      }

      toast.success('Added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const updateQuantity = async (productId: string, variantId: string | undefined, quantity: number) => {
    if (quantity < 1) return

    try {
      if (user) {
        const response = await fetch('/api/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productId,
            variant_id: variantId,
            quantity
          })
        })

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to update quantity')
        }

        await loadCart()
      } else {
        const newItems = items.map(item =>
          item.product_id === productId && item.variant_id === variantId
            ? { ...item, quantity }
            : item
        )
        setItems(newItems)
        saveToLocalStorage(newItems)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
    }
  }

  const removeFromCart = async (productId: string, variantId: string | undefined) => {
    try {
      if (user) {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            product_id: productId,
            variant_id: variantId
          })
        })

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to remove item')
        }

        await loadCart()
      } else {
        const newItems = items.filter(
          item => !(item.product_id === productId && item.variant_id === variantId)
        )
        setItems(newItems)
        saveToLocalStorage(newItems)
      }

      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      if (user) {
        const response = await fetch('/api/cart', {
          method: 'DELETE'
        })

        const data = await response.json()
        if (!data.success) {
          throw new Error(data.error || 'Failed to clear cart')
        }
      }

      setItems([])
      if (!user) {
        localStorage.removeItem('ihsan_cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  const refreshCart = async () => {
    await loadCart()
  }

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
