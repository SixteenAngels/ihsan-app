'use client'

import { useState, useEffect } from 'react'

export interface GuestCartItem {
  id: string
  productId: string
  productName: string
  variantName?: string
  price: number
  quantity: number
  image?: string
}

export interface GuestCartSummary {
  totalItems: number
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export interface GuestCart {
  items: GuestCartItem[]
  summary: GuestCartSummary
}

const GUEST_CART_KEY = 'ihsan_guest_cart'
const GUEST_ID_KEY = 'ihsan_guest_id'

export function useGuestCart() {
  const [cart, setCart] = useState<GuestCart>({
    items: [],
    summary: {
      totalItems: 0,
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0
    }
  })
  const [guestId, setGuestId] = useState<string>('')
  const [isHydrated, setIsHydrated] = useState(false)

  // Generate or retrieve guest ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem(GUEST_ID_KEY)
      if (!id) {
        id = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem(GUEST_ID_KEY, id)
      }
      setGuestId(id)
      setIsHydrated(true)
    }
  }, [])

  // Load cart from localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(GUEST_CART_KEY)
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
        } catch (error) {
          console.error('Failed to parse saved cart:', error)
        }
      }
    }
  }, [isHydrated])

  // Save cart to localStorage
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
    }
  }, [cart, isHydrated])

  // Calculate cart summary
  const calculateSummary = (items: GuestCartItem[]): GuestCartSummary => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const tax = subtotal * 0.15 // 15% VAT
    const shipping = subtotal > 500 ? 0 : 50 // Free shipping over 500 GHS
    const total = subtotal + tax + shipping

    return {
      totalItems,
      subtotal,
      shipping,
      tax,
      total
    }
  }

  // Add item to cart
  const addItem = (item: Omit<GuestCartItem, 'id'>) => {
    if (!isHydrated) return

    const newItem: GuestCartItem = {
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => cartItem.productId === item.productId && 
                   cartItem.variantName === item.variantName
      )

      let updatedItems: GuestCartItem[]
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = prevCart.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      } else {
        // Add new item
        updatedItems = [...prevCart.items, newItem]
      }

      const summary = calculateSummary(updatedItems)
      return {
        items: updatedItems,
        summary
      }
    })
  }

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (!isHydrated) return

    setCart(prevCart => {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        const updatedItems = prevCart.items.filter(item => item.id !== itemId)
        const summary = calculateSummary(updatedItems)
        return {
          items: updatedItems,
          summary
        }
      }

      const updatedItems = prevCart.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
      const summary = calculateSummary(updatedItems)
      return {
        items: updatedItems,
        summary
      }
    })
  }

  // Remove item from cart
  const removeItem = (itemId: string) => {
    if (!isHydrated) return

    setCart(prevCart => {
      const updatedItems = prevCart.items.filter(item => item.id !== itemId)
      const summary = calculateSummary(updatedItems)
      return {
        items: updatedItems,
        summary
      }
    })
  }

  // Clear entire cart
  const clearCart = () => {
    if (!isHydrated) return

    setCart({
      items: [],
      summary: {
        totalItems: 0,
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
      }
    })
  }

  // Get cart item count
  const getItemCount = () => {
    return cart.summary.totalItems
  }

  // Check if cart is empty
  const isEmpty = () => {
    return cart.items.length === 0
  }

  // Get cart total
  const getTotal = () => {
    return cart.summary.total
  }

  return {
    cart,
    guestId,
    isHydrated,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    isEmpty,
    getTotal
  }
}

// Utility function to generate guest ID
export function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Utility function to save guest cart
export function saveGuestCart(cart: GuestCart): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart))
  }
}

// Utility function to load guest cart
export function loadGuestCart(): GuestCart | null {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem(GUEST_CART_KEY)
    if (savedCart) {
      try {
        return JSON.parse(savedCart)
      } catch (error) {
        console.error('Failed to parse saved cart:', error)
      }
    }
  }
  return null
}

// Utility function to get guest ID
export function getGuestId(): string {
  if (typeof window !== 'undefined') {
    let id = localStorage.getItem(GUEST_ID_KEY)
    if (!id) {
      id = generateGuestId()
      localStorage.setItem(GUEST_ID_KEY, id)
    }
    return id
  }
  return ''
}
