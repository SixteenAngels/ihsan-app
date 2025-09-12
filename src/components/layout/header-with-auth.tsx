'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  Heart, 
  Bell,
  Shield,
  Settings,
  LogOut,
  Package,
  Users,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { PermissionGate } from '@/lib/auth-context'
import { getRoleDisplayName } from '@/lib/roles'

export function Header() {
  const { user, logout } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
              <input
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
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
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge className="w-fit text-xs">
                        {getRoleDisplayName(user.role)}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Customer Menu Items */}
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Admin/Manager Menu Items */}
                  <PermissionGate permission="canAccessAdminPanel">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGate>
                  
                  <PermissionGate permission="canManageProducts">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/products">
                        <Package className="mr-2 h-4 w-4" />
                        Manage Products
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGate>
                  
                  <PermissionGate permission="canManageOrders">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Manage Orders
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGate>
                  
                  <PermissionGate permission="canManageUsers">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGate>
                  
                  <PermissionGate permission="canViewAnalytics">
                    <DropdownMenuItem asChild>
                      <Link href="/admin/analytics">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                  </PermissionGate>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/support">
                      <Bell className="mr-2 h-4 w-4" />
                      Support
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-2">
              <Link 
                href="/categories" 
                className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Categories
              </Link>
              <Link 
                href="/ready-now" 
                className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Ready Now
              </Link>
              <Link 
                href="/group-buy" 
                className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Group Buy
              </Link>
              <Link 
                href="/support" 
                className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Support
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
