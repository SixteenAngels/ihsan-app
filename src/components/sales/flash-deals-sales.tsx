'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  Flame, 
  Star, 
  ShoppingCart, 
  Heart,
  Share2,
  Zap,
  TrendingDown,
  Timer,
  Eye,
  Users
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface FlashDeal {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  discount: number
  image: string
  category: string
  vendor: string
  rating: number
  reviews: number
  sold: number
  stock: number
  endTime: string
  startTime: string
  isActive: boolean
  isHot: boolean
}

interface DailySale {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  discount: number
  image: string
  category: string
  vendor: string
  rating: number
  reviews: number
  sold: number
  stock: number
  validUntil: string
  isActive: boolean
}

export default function FlashDealsAndSales() {
  const [activeTab, setActiveTab] = useState<'flash' | 'daily'>('flash')
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({})
  const [flashDeals, setFlashDeals] = useState<FlashDeal[]>([])
  const [dailySales, setDailySales] = useState<DailySale[]>([])

  useEffect(() => {
    const loadDeals = async () => {
      if (!isSupabaseConfigured) {
        setFlashDeals([])
        setDailySales([])
        return
      }

      const nowIso = new Date().toISOString()

      // Fetch flash deals
      const { data: flash, error: flashError } = await (supabase as any)
        .from('flash_deals')
        .select('*')
        .eq('sale_type', 'flash')
        .eq('is_active', true)
        .lte('start_time', nowIso)
        .gte('end_time', nowIso)
        .order('end_time', { ascending: true })

      if (!flashError && Array.isArray(flash)) {
        setFlashDeals(
          flash.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description || '',
            originalPrice: Number(d.original_price),
            salePrice: Number(d.sale_price),
            discount: Number(d.discount) || 0,
            image: d.image_url || '/api/placeholder/300/300',
            category: d.category || '',
            vendor: d.vendor || '',
            rating: Number(d.rating) || 0,
            reviews: Number(d.reviews) || 0,
            sold: Number(d.sold) || 0,
            stock: Number(d.stock) || 0,
            startTime: d.start_time,
            endTime: d.end_time,
            isActive: Boolean(d.is_active),
            isHot: Boolean(d.is_hot)
          }))
        )
      } else {
        setFlashDeals([])
      }

      // Fetch daily sales
      const { data: daily, error: dailyError } = await (supabase as any)
        .from('flash_deals')
        .select('*')
        .eq('sale_type', 'daily')
        .eq('is_active', true)
        .gte('end_time', nowIso)
        .order('end_time', { ascending: true })

      if (!dailyError && Array.isArray(daily)) {
        setDailySales(
          daily.map((d: any) => ({
            id: d.id,
            title: d.title,
            description: d.description || '',
            originalPrice: Number(d.original_price),
            salePrice: Number(d.sale_price),
            discount: Number(d.discount) || 0,
            image: d.image_url || '/api/placeholder/300/300',
            category: d.category || '',
            vendor: d.vendor || '',
            rating: Number(d.rating) || 0,
            reviews: Number(d.reviews) || 0,
            sold: Number(d.sold) || 0,
            stock: Number(d.stock) || 0,
            validUntil: d.end_time,
            isActive: Boolean(d.is_active)
          }))
        )
      } else {
        setDailySales([])
      }
    }

    loadDeals()
  }, [])

  // Calculate time remaining
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date()
      const newTimeLeft: { [key: string]: string } = {}

      // Update flash deals countdown
      flashDeals.forEach(deal => {
        const endTime = new Date(deal.endTime)
        const diff = endTime.getTime() - now.getTime()
        
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          newTimeLeft[deal.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        } else {
          newTimeLeft[deal.id] = '00:00:00'
        }
      })

      setTimeLeft(newTimeLeft)
    }

    updateTimeLeft()
    const interval = setInterval(updateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  const getStockPercentage = (sold: number, stock: number) => {
    const total = sold + stock
    return (sold / total) * 100
  }

  const renderDealCard = (deal: FlashDeal | DailySale, isFlashDeal: boolean) => {
    const stockPercentage = getStockPercentage(deal.sold, deal.stock)
    
    return (
      <motion.div
        key={deal.id}
        initial="initial"
        animate="in"
        variants={bounceIn}
        whileHover={{ scale: 1.02 }}
        className="group"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
          <div className="relative">
            <img
              src={deal.image}
              alt={deal.title}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
            />
            
            {/* Discount Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white font-bold">
                -{deal.discount}%
              </Badge>
            </div>
            
            {/* Hot Deal Badge */}
            {isFlashDeal && (deal as FlashDeal).isHot && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-orange-500 text-white font-bold">
                  <Flame className="w-3 h-3 mr-1" />
                  HOT
                </Badge>
              </div>
            )}
            
            {/* Timer for Flash Deals */}
            {isFlashDeal && timeLeft[deal.id] && (
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black/80 text-white rounded-lg p-2 text-center">
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <Timer className="w-4 h-4" />
                    <span className="font-mono">{timeLeft[deal.id]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Title and Category */}
              <div>
                <h3 className="font-semibold line-clamp-2 mb-1">{deal.title}</h3>
                <p className="text-sm text-muted-foreground">{deal.category}</p>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium ml-1">{deal.rating}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({formatNumber(deal.reviews)})
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">by {deal.vendor}</span>
              </div>
              
              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  {formatPrice(deal.salePrice)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(deal.originalPrice)}
                </span>
              </div>
              
              {/* Stock Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sold</span>
                  <span className="font-medium">{deal.sold} of {deal.sold + deal.stock}</span>
                </div>
                <Progress value={stockPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{deal.stock} left</span>
                  <span>{Math.round(stockPercentage)}% sold</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button className="flex-1" size="sm">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Zap className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Flash Deals & Daily Sales</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Limited time offers and daily discounts on amazing products
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <motion.div
          initial="initial"
          animate="in"
          variants={slideInFromBottom}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === 'flash' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('flash')}
                  className="flex items-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  Flash Deals
                  <Badge variant="secondary" className="ml-2">
                    {flashDeals.length}
                  </Badge>
                </Button>
                <Button
                  variant={activeTab === 'daily' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('daily')}
                  className="flex items-center gap-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  Daily Sales
                  <Badge variant="secondary" className="ml-2">
                    {dailySales.length}
                  </Badge>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'flash' && (
            <motion.div
              key="flash"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              transition={{ delay: 0.2 }}
            >
              {/* Flash Deals Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                    Flash Deals
                  </h2>
                  <p className="text-muted-foreground">
                    Limited time offers with countdown timers
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span>Live deals</span>
                </div>
              </div>

              {/* Flash Deals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashDeals.map((deal, index) => renderDealCard(deal, true))}
              </div>
            </motion.div>
          )}

          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              transition={{ delay: 0.2 }}
            >
              {/* Daily Sales Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <TrendingDown className="w-6 h-6 text-green-500" />
                    Daily Sales
                  </h2>
                  <p className="text-muted-foreground">
                    Special discounts available for 24 hours
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Valid until midnight</span>
                </div>
              </div>

              {/* Daily Sales Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailySales.map((deal, index) => renderDealCard(deal, false))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Call to Action */}
        <motion.div
          initial="initial"
          animate="in"
          variants={fadeIn}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Don't Miss Out!</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Get notified about new flash deals and daily sales. Turn on notifications 
                to be the first to know about amazing discounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  <Users className="w-4 h-4 mr-2" />
                  Follow for Updates
                </Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share with Friends
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
