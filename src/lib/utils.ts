import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number, currency: string = 'GHS') {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function getOrderStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    payment_confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    in_transit: 'bg-cyan-100 text-cyan-800',
    arrived: 'bg-teal-100 text-teal-800',
    out_for_delivery: 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800',
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

export function getOrderStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    pending: 'Pending',
    payment_confirmed: 'Payment Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    in_transit: 'In Transit',
    arrived: 'Arrived',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  }
  
  return statusTexts[status] || status
}

export function getShippingMethodText(method: string): string {
  const methodTexts: Record<string, string> = {
    air: 'Air Shipping (Fast)',
    sea: 'Sea Shipping (Economical)',
  }
  
  return methodTexts[method] || method
}

export function getShippingMethodDescription(method: string): string {
  const descriptions: Record<string, string> = {
    air: 'Fast delivery in 3-7 days',
    sea: 'Economical delivery in 14-21 days',
  }
  
  return descriptions[method] || ''
}

export function calculateShippingCost(subtotal: number, method: 'air' | 'sea'): number {
  if (method === 'air') {
    return Math.max(50, subtotal * 0.1) // Minimum 50 GHS or 10% of subtotal
  } else {
    return Math.max(20, subtotal * 0.05) // Minimum 20 GHS or 5% of subtotal
  }
}

export function calculateTax(subtotal: number): number {
  return subtotal * 0.15 // 15% VAT in Ghana
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+233|0)[0-9]{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('233')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+233${cleaned.slice(1)}`
  }
  return phone
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isGroupBuyActive(startDate: string, endDate: string): boolean {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return now >= start && now <= end
}

export function getGroupBuyTimeRemaining(endDate: string): {
  days: number
  hours: number
  minutes: number
  isExpired: boolean
} {
  const now = new Date()
  const end = new Date(endDate)
  const diff = end.getTime() - now.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return { days, hours, minutes, isExpired: false }
}

export function getGroupBuyProgress(currentQuantity: number, minQuantity: number, maxQuantity: number): {
  percentage: number
  status: 'not_started' | 'in_progress' | 'completed' | 'over_limit'
} {
  if (currentQuantity < minQuantity) {
    return {
      percentage: (currentQuantity / minQuantity) * 100,
      status: 'not_started'
    }
  } else if (currentQuantity >= minQuantity && currentQuantity < maxQuantity) {
    return {
      percentage: ((currentQuantity - minQuantity) / (maxQuantity - minQuantity)) * 100,
      status: 'in_progress'
    }
  } else if (currentQuantity >= maxQuantity) {
    return {
      percentage: 100,
      status: 'over_limit'
    }
  }
  
  return {
    percentage: 100,
    status: 'completed'
  }
}
