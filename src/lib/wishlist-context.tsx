'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'react-toastify'

interface WishlistItem {
  id: string
  product_id: string
  variant_id?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  slug: string
  vendor?: string
  category?: string
  added_at: string
}

interface WishlistContextType {
  items: WishlistItem[]
  totalItems: number
  isLoading: boolean
  addToWishlist: (product: Omit<WishlistItem, 'id' | 'added_at'>) => Promise<void>
  removeFromWishlist: (productId: string, variantId?: string) => Promise<void>
  isInWishlist: (productId: string, variantId?: string) => boolean
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const totalItems = items.length

  // Load wishlist from API or localStorage
  const loadWishlist = async () => {
    if (!user) {
      // Load from localStorage for guest users
      const savedWishlist = localStorage.getItem('ihsan_wishlist')
      if (savedWishlist) {
        try {
          setItems(JSON.parse(savedWishlist))
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error)
        }
      }
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/wishlist')
      const data = await response.json()
      
      if (data.success) {
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save wishlist to localStorage for guest users
  const saveToLocalStorage = (wishlistItems: WishlistItem[]) => {
    if (!user) {
      localStorage.setItem('ihsan_wishlist', JSON.stringify(wishlistItems))
    }
  }

  // Sync guest wishlist to user account when user logs in
  const syncGuestWishlist = async () => {
    if (!user) return

    const savedWishlist = localStorage.getItem('ihsan_wishlist')
    if (savedWishlist) {
      try {
        const guestItems = JSON.parse(savedWishlist)
        if (guestItems.length > 0) {
          // Add each guest item to user's wishlist
          for (const item of guestItems) {
            await addToWishlistAPI(item)
          }
          // Clear localStorage
          localStorage.removeItem('ihsan_wishlist')
        }
      } catch (error) {
        console.error('Error syncing guest wishlist:', error)
      }
    }
  }

  useEffect(() => {
    loadWishlist()
  }, [user])

  useEffect(() => {
    if (user) {
      syncGuestWishlist()
    }
  }, [user])

  const addToWishlistAPI = async (item: Omit<WishlistItem, 'id' | 'added_at'>) => {
    if (!user) return

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: item.product_id,
          variant_id: item.variant_id
        })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      throw error
    }
  }

  const addToWishlist = async (product: Omit<WishlistItem, 'id' | 'added_at'>) => {
    try {
      if (user) {
        // Add to database
        await addToWishlistAPI(product)
        // Refresh wishlist
        await loadWishlist()
      } else {
        // Add to localStorage for guest users
        const existingItem = items.find(
          item => item.product_id === product.product_id && 
          item.variant_id === product.variant_id
        )

        if (!existingItem) {
          const newItem: WishlistItem = {
            ...product,
            id: `${product.product_id}-${product.variant_id || 'default'}`,
            added_at: new Date().toISOString()
          }
          const newItems = [...items, newItem]
          setItems(newItems)
          saveToLocalStorage(newItems)
        }
      }

      toast.success('Added to wishlist!')
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      toast.error('Failed to add to wishlist')
    }
  }

  const removeFromWishlist = async (productId: string, variantId?: string) => {
    try {
      if (user) {
        const response = await fetch('/api/wishlist', {
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

        await loadWishlist()
      } else {
        const newItems = items.filter(
          item => !(item.product_id === productId && item.variant_id === variantId)
        )
        setItems(newItems)
        saveToLocalStorage(newItems)
      }

      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      toast.error('Failed to remove from wishlist')
    }
  }

  const isInWishlist = (productId: string, variantId?: string) => {
    return items.some(
      item => item.product_id === productId && item.variant_id === variantId
    )
  }

  const refreshWishlist = async () => {
    await loadWishlist()
  }

  const value: WishlistContextType = {
    items,
    totalItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
