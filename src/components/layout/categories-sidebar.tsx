'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight, Smartphone, Laptop, Camera, Headphones, Watch, Gamepad2, Shirt, Home, Car, BookOpen, Music, Heart, Baby, Wrench, GamepadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface Category {
  id: string
  name: string
  icon: any
  href: string
  children?: Category[]
}

const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Smartphone,
    href: '/categories/electronics',
    children: [
      { id: 'phones', name: 'Phones', icon: Smartphone, href: '/categories/phones' },
      { id: 'laptops', name: 'Laptops', icon: Laptop, href: '/categories/laptops' },
      { id: 'cameras', name: 'Cameras', icon: Camera, href: '/categories/cameras' },
      { id: 'headphones', name: 'Headphones', icon: Headphones, href: '/categories/headphones' },
      { id: 'smartwatches', name: 'Smart Watches', icon: Watch, href: '/categories/smartwatches' },
      { id: 'gaming', name: 'Gaming', icon: Gamepad2, href: '/categories/gaming' }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    href: '/categories/fashion',
    children: [
      { id: 'mens-clothing', name: "Men's Clothing", icon: Shirt, href: '/categories/mens-clothing' },
      { id: 'womens-clothing', name: "Women's Clothing", icon: Shirt, href: '/categories/womens-clothing' },
      { id: 'shoes', name: 'Shoes', icon: Shirt, href: '/categories/shoes' },
      { id: 'accessories', name: 'Accessories', icon: Shirt, href: '/categories/accessories' }
    ]
  },
  {
    id: 'home-garden',
    name: 'Home & Garden',
    icon: Home,
    href: '/categories/home-garden',
    children: [
      { id: 'furniture', name: 'Furniture', icon: Home, href: '/categories/furniture' },
      { id: 'decor', name: 'Home Decor', icon: Home, href: '/categories/decor' },
      { id: 'kitchen', name: 'Kitchen & Dining', icon: Home, href: '/categories/kitchen' },
      { id: 'garden', name: 'Garden & Outdoor', icon: Home, href: '/categories/garden' }
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: Car,
    href: '/categories/automotive',
    children: [
      { id: 'car-parts', name: 'Car Parts', icon: Car, href: '/categories/car-parts' },
      { id: 'tools', name: 'Tools', icon: Wrench, href: '/categories/tools' },
      { id: 'accessories', name: 'Car Accessories', icon: Car, href: '/categories/car-accessories' }
    ]
  },
  {
    id: 'books-media',
    name: 'Books & Media',
    icon: BookOpen,
    href: '/categories/books-media',
    children: [
      { id: 'books', name: 'Books', icon: BookOpen, href: '/categories/books' },
      { id: 'music', name: 'Music', icon: Music, href: '/categories/music' },
      { id: 'movies', name: 'Movies & TV', icon: BookOpen, href: '/categories/movies' }
    ]
  },
  {
    id: 'health-beauty',
    name: 'Health & Beauty',
    icon: Heart,
    href: '/categories/health-beauty',
    children: [
      { id: 'skincare', name: 'Skincare', icon: Heart, href: '/categories/skincare' },
      { id: 'makeup', name: 'Makeup', icon: Heart, href: '/categories/makeup' },
      { id: 'fragrance', name: 'Fragrance', icon: Heart, href: '/categories/fragrance' }
    ]
  },
  {
    id: 'baby-kids',
    name: 'Baby & Kids',
    icon: Baby,
    href: '/categories/baby-kids',
    children: [
      { id: 'baby-clothing', name: 'Baby Clothing', icon: Baby, href: '/categories/baby-clothing' },
      { id: 'toys', name: 'Toys', icon: Baby, href: '/categories/toys' },
      { id: 'baby-gear', name: 'Baby Gear', icon: Baby, href: '/categories/baby-gear' }
    ]
  }
]

interface CategoriesSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function CategoriesSidebar({ isOpen, onClose }: CategoriesSidebarProps) {
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r
      `}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="lg:hidden"
            >
              ×
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto h-full pb-20">
          <nav className="p-4 space-y-2">
            {categories.map((category) => (
              <div key={category.id}>
                <Collapsible
                  open={openCategories.includes(category.id)}
                  onOpenChange={() => toggleCategory(category.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-2 h-auto"
                    >
                      <div className="flex items-center space-x-3">
                        <category.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      {category.children && (
                        openCategories.includes(category.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  
                  {category.children && (
                    <CollapsibleContent className="space-y-1 ml-6">
                      {category.children.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          href={subcategory.href}
                          className="flex items-center space-x-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                          onClick={onClose}
                        >
                          <subcategory.icon className="h-3 w-3" />
                          <span>{subcategory.name}</span>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  )}
                </Collapsible>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
