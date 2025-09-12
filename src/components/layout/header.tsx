import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, Heart, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencySelector } from '@/components/currency/currency-selector'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">I</span>
            </div>
            <span className="font-bold text-xl">Ihsan</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                className="pl-10 pr-4"
              />
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              Categories
            </Link>
            <Link href="/ready-now" className="text-sm font-medium hover:text-primary transition-colors">
              Ready Now
            </Link>
            <Link href="/group-buy" className="text-sm font-medium hover:text-primary transition-colors">
              Group Buy
            </Link>
            <Link href="/flash-deals" className="text-sm font-medium hover:text-primary transition-colors">
              Flash Deals
            </Link>
            <Link href="/vendors" className="text-sm font-medium hover:text-primary transition-colors">
              Vendors
            </Link>
            <Link href="/picture-search" className="text-sm font-medium hover:text-primary transition-colors">
              Picture Search
            </Link>
            <Link href="/chat" className="text-sm font-medium hover:text-primary transition-colors">
              Support
            </Link>
            <Link href="/escrow" className="text-sm font-medium hover:text-primary transition-colors">
              Escrow
            </Link>
            <Link href="/currency" className="text-sm font-medium hover:text-primary transition-colors">
              Currency
            </Link>
            <Link href="/disputes" className="text-sm font-medium hover:text-primary transition-colors">
              Disputes
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Currency Selector */}
            <CurrencySelector className="hidden md:block" />
            
            {/* Search Button - Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  0
                </span>
              </Link>
            </Button>

            {/* User Menu */}
            <Button variant="ghost" size="icon" asChild>
              <Link href="/profile">
                <User className="h-5 w-5" />
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-4"
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-xl">Ihsan</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Modern e-commerce platform for Ghana and Africa. Making shopping simple, fast, and affordable.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/support" className="text-muted-foreground hover:text-primary">Support</Link></li>
              <li><Link href="/track-order" className="text-muted-foreground hover:text-primary">Track Order</Link></li>
              <li><Link href="/search" className="text-muted-foreground hover:text-primary">Search</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/categories/fashion" className="text-muted-foreground hover:text-primary">Fashion</Link></li>
              <li><Link href="/categories/electronics" className="text-muted-foreground hover:text-primary">Electronics</Link></li>
              <li><Link href="/categories/beauty" className="text-muted-foreground hover:text-primary">Beauty</Link></li>
              <li><Link href="/categories/bulk-deals" className="text-muted-foreground hover:text-primary">Bulk Deals</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Email: support@ihsan.com</p>
              <p>Phone: +233 123 456 789</p>
              <p>Address: Accra, Ghana</p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Ihsan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
