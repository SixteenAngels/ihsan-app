'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, Heart, ChevronDown, Grid3X3, X, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencySelector } from '@/components/currency/currency-selector'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { NotificationDropdown } from '@/components/notifications/notification-dropdown'
import { useAuth } from '@/lib/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'

type CategoryNavItem = { id: string; name: string; href: string; children: { name: string; href: string }[] }

export function Header() {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [roleDashboardHref, setRoleDashboardHref] = useState<string | null>(null)
  const router = useRouter()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null)
  const [navCategories, setNavCategories] = useState<CategoryNavItem[]>([])
  const { totalItems: cartCount } = useCart()
  const { totalItems: wishlistCount } = useWishlist()
  const { user, logout } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Detect role from cookies to show role-aware dashboard link
  useEffect(() => {
    try {
      const cookie = document.cookie
      if (cookie.includes('adminAuth=true')) setRoleDashboardHref('/admin')
      else if (cookie.includes('managerAuth=true')) setRoleDashboardHref('/manager')
      else if (cookie.includes('vendorAuth=true')) setRoleDashboardHref('/vendor')
      else setRoleDashboardHref(null)
    } catch {}
  }, [])

  // Load categories from API
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/categories?includeChildren=true')
        const data = await res.json()
        const items: CategoryNavItem[] = (Array.isArray(data) ? data : []).map((c: any) => ({
          id: c.id,
          name: c.name,
          href: `/categories/${c.slug || c.id}`,
          children: Array.isArray(c.children) ? c.children.map((s: any) => ({ name: s.name, href: `/categories/${s.slug || s.id}` })) : [],
        }))
        setNavCategories(items)
      } catch {
        setNavCategories([])
      }
    }
    load()
  }, [])

  const computedDashboardHref = user
    ? (user.role === 'admin'
        ? '/admin'
        : (['manager', 'vendor_manager'].includes(user.role)
            ? '/manager'
            : (user.role === 'vendor' ? '/vendor' : null)))
    : null

  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-black text-white py-2 text-center text-sm" role="region" aria-label="Promotional banner">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span>Summer Sale: Swimwear + Free Express Delivery — 50% off</span>
          <div className="flex items-center space-x-4">
            <Link href="/flash-deals" className="underline hover:no-underline" aria-label="Shop now, flash deals">
              Shop now
            </Link>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-1" aria-label="Language">
                <span>English</span>
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </div>
              <CurrencySelector />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Ihsan home">
            <span className="font-bold text-2xl text-slate-900 dark:text-slate-100">Ihsan</span>
          </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                Home
          </Link>
              
              {/* Categories Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors flex items-center space-x-1 dark:text-slate-300 dark:hover:text-slate-50"
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  id="categories-button"
                  aria-haspopup="true"
                  aria-expanded={isCategoriesOpen}
                  aria-controls="categories-menu"
                >
                  <span>Categories</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Button>
                
                {/* Categories Dropdown Menu */}
                {isCategoriesOpen && (
                  <div id="categories-menu" aria-labelledby="categories-button" className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {navCategories.map((category) => (
                          <div key={category.id} className="space-y-2">
                            <Link
                              href={category.href}
                              className="flex items-center space-x-2 text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-primary dark:hover:text-primary transition-colors"
                              onClick={() => setIsCategoriesOpen(false)}
                            >
                              <span>{category.name}</span>
                            </Link>
                            <div className="space-y-1 ml-6">
                              {category.children.map((subcategory) => (
                                <Link
                                  key={subcategory.name}
                                  href={subcategory.href}
                                  className="block text-xs text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <Link href="/contact" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                Contact
              </Link>
              <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                About
              </Link>
              {!user && (
                <Link href="/signup" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Sign up
                </Link>
              )}
            </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" aria-hidden="true" />
              <Input
                  placeholder="What are you looking for?"
                  aria-label="Search products"
                  className="pl-10 pr-4 border-slate-300 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
            {/* Wishlist */}
              <Link href="/wishlist" className="text-slate-600 hover:text-slate-900 transition-colors relative dark:text-slate-300 dark:hover:text-slate-50" aria-label="Wishlist">
                <Heart className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {wishlistCount}
                </span>
              </Link>

            {/* Notifications */}
              <NotificationDropdown />

            {/* Tracking */}
              <Link href="/tracking" className="text-slate-600 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:text-slate-50" aria-label="Track Order">
                <Truck className="h-5 w-5" aria-hidden="true" />
              </Link>

            {/* Cart */}
              <Link href="/cart" className="text-slate-600 hover:text-slate-900 transition-colors relative dark:text-slate-300 dark:hover:text-slate-50" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || ''} />
                      <AvatarFallback>{(user.fullName || user.email || 'U').slice(0,1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold truncate">{user.fullName || user.email}</span>
                      <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/my-account')}>My Account</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                  {computedDashboardHref && (
                    <DropdownMenuItem onClick={() => router.push(computedDashboardHref)}>Dashboard</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={async () => { await logout(); router.push('/'); }}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">Login</Link>
                <Link href="/signup" className="text-sm font-medium text-slate-700 hover:text-slate-900">Sign up</Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" aria-hidden="true" />
            <Input
                placeholder="What are you looking for?"
              aria-label="Search products"
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Panel */}
    {isMobileOpen && (
      <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
        <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileOpen(false)} />
        <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white dark:bg-slate-900 shadow-xl p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="font-bold text-xl text-slate-900 dark:text-slate-100" onClick={() => setIsMobileOpen(false)}>Ihsan</Link>
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setIsMobileOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <Input aria-label="Search products" placeholder="What are you looking for?" className="pl-10 pr-4" />
            </div>
          </div>

          <nav className="space-y-1">
            <Link href="/" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>Home</Link>

            {/* Mobile Categories Accordion */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3">
              <p className="px-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Categories</p>
              <div className="space-y-1">
                {navCategories.map((cat) => {
                  const isOpen = mobileOpenCategory === cat.id
                  const panelId = `mobile-cat-panel-${cat.id}`
                  const buttonId = `mobile-cat-button-${cat.id}`
                  return (
                    <div key={cat.id} className="">
                      <button
                        id={buttonId}
                        className="w-full flex items-center justify-between px-2 py-2 rounded text-left text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-controls={panelId}
                        onClick={() => setMobileOpenCategory(isOpen ? null : cat.id)}
                      >
                        <span className="flex items-center space-x-2"><span>{cat.name}</span></span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                      </button>
                      {isOpen && (
                        <div id={panelId} aria-labelledby={buttonId} className="pl-8 py-1">
                          <Link href={cat.href} className="block px-2 py-1 text-sm text-slate-700 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileOpen(false)}>All {cat.name}</Link>
                          {cat.children.map((sub) => (
                            <Link key={sub.name} href={sub.href} className="block px-2 py-1 text-sm text-slate-700 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileOpen(false)}>{sub.name}</Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-3 mt-3 space-y-1">
              <Link href="/contact" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>Contact</Link>
              <Link href="/about" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>About</Link>
              <Link href="/wishlist" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>Wishlist</Link>
              <Link href="/cart" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>Cart</Link>
              <Link href="/my-account" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>My Account</Link>
              {roleDashboardHref ? (
                <Link href={roleDashboardHref} className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>Dashboard</Link>
              ) : (
                <Link href="/login" className="block px-2 py-2 rounded text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setIsMobileOpen(false)}>Login</Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    )}
    </>
  )
}

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Ihsan Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl">Ihsan</h3>
            <div className="space-y-3">
              <h4 className="font-semibold">Subscribe</h4>
              <p className="text-sm text-gray-300">Get 10% off your first order</p>
              <div className="flex">
                <Input 
                  placeholder="Enter your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 rounded-r-none"
                />
                <Button className="bg-red-500 hover:bg-red-600 rounded-l-none px-3">
                  →
                </Button>
              </div>
            </div>
              </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
              <p>support@ihsan.com</p>
              <p>+88015-88888-9999</p>
            </div>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="font-semibold">Account</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/my-account" className="text-gray-300 hover:text-white">My Account</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-white">Login / Register</Link></li>
              <li><Link href="/cart" className="text-gray-300 hover:text-white">Cart</Link></li>
              <li><Link href="/wishlist" className="text-gray-300 hover:text-white">Wishlist</Link></li>
              <li><Link href="/shop" className="text-gray-300 hover:text-white">Shop</Link></li>
            </ul>
          </div>

          {/* Quick Link */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Link</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms Of Use</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div className="space-y-4">
            <h3 className="font-semibold">Download App</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Save $3 with App Now User Only</p>
              <div className="w-20 h-20 bg-white rounded flex items-center justify-center">
                <span className="text-black text-xs">QR Code</span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white">
                  Google Play
                </Button>
                <Button size="sm" className="bg-gray-800 hover:bg-gray-700 text-white">
                  App Store
                </Button>
              </div>
              <div className="flex space-x-2">
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
                <div className="w-6 h-6 bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
          <p>Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  )
}
