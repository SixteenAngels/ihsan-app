'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Star, Users, Clock, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { formatPrice, getGroupBuyTimeRemaining } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'react-toastify'

interface GroupBuy {
  id: string
  product_id: string
  name: string
  description: string
  min_quantity: number
  max_quantity: number
  current_quantity: number
  price_tiers: Record<string, number>
  start_date: string
  end_date: string
  is_active: boolean
  products: {
    id: string
    name: string
    slug: string
    images: string[]
    price: number
  }
  profiles: {
    full_name: string
  }
  group_buy_participants: Array<{
    id: string
    quantity: number
    joined_at: string
    profiles: {
      full_name: string
    }
  }>
}

export default function GroupBuyPage() {
  const [groupBuys, setGroupBuys] = useState<GroupBuy[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [joiningGroupBuy, setJoiningGroupBuy] = useState<string | null>(null)
  const [joinQuantity, setJoinQuantity] = useState<Record<string, number>>({})
  const { user } = useAuth()

  useEffect(() => {
    fetchGroupBuys()
  }, [])

  const fetchGroupBuys = async () => {
    try {
      const response = await fetch('/api/group-buys?limit=20')
      const data = await response.json()
      
      if (data.success) {
        setGroupBuys(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching group buys:', error)
      toast.error('Failed to load group buys')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinGroupBuy = async (groupBuyId: string) => {
    if (!user) {
      toast.error('Please login to join group buys')
      return
    }

    const quantity = joinQuantity[groupBuyId] || 1
    if (quantity < 1) {
      toast.error('Please enter a valid quantity')
      return
    }

    setJoiningGroupBuy(groupBuyId)
    try {
      const response = await fetch(`/api/group-buys/${groupBuyId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          quantity
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Successfully joined the group buy!')
        fetchGroupBuys() // Refresh the data
      } else {
        toast.error(data.error || 'Failed to join group buy')
      }
    } catch (error) {
      console.error('Error joining group buy:', error)
      toast.error('Failed to join group buy')
    } finally {
      setJoiningGroupBuy(null)
    }
  }

  const getCurrentPrice = (groupBuy: GroupBuy) => {
    const tiers = groupBuy.price_tiers
    const currentQty = groupBuy.current_quantity
    
    // Find the best price tier for current quantity
    const sortedTiers = Object.entries(tiers)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .reverse()
    
    for (const [minQty, price] of sortedTiers) {
      if (currentQty >= parseInt(minQty)) {
        return price
      }
    }
    
    return groupBuy.products.price
  }

  const getProgressPercentage = (groupBuy: GroupBuy) => {
    return Math.min((groupBuy.current_quantity / groupBuy.max_quantity) * 100, 100)
  }

  const getTimeRemaining = (endDate: string) => {
    return getGroupBuyTimeRemaining(endDate)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading group buys...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Group Buy Deals</h1>
              <p className="text-muted-foreground">
                Join group purchases and save more together
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{groupBuys.length}</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {groupBuys.reduce((sum, gb) => sum + gb.group_buy_participants.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Up to 50%</div>
              <div className="text-sm text-muted-foreground">Maximum Savings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">24h</div>
              <div className="text-sm text-muted-foreground">Campaign Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Group Buy Campaigns */}
        <div className="space-y-6">
          {groupBuys.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Group Buys</h3>
                <p className="text-gray-600 mb-4">
                  There are currently no active group buy campaigns. Check back later for new deals!
                </p>
                <Button asChild>
                  <Link href="/categories">Browse Products</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            groupBuys.map((groupBuy) => {
              const timeRemaining = getTimeRemaining(groupBuy.end_date)
              const progressPercentage = getProgressPercentage(groupBuy)
              const currentPrice = getCurrentPrice(groupBuy)
              const isExpired = timeRemaining.isExpired
              const isFull = groupBuy.current_quantity >= groupBuy.max_quantity
              const canJoin = !isExpired && !isFull && user

              return (
                <Card key={groupBuy.id} className="overflow-hidden">
                  <div className="md:flex">
                    {/* Product Image */}
                    <div className="md:w-1/3">
                      <div className="aspect-square bg-muted relative">
                        <img
                          src={groupBuy.products.images?.[0] || '/api/placeholder/300/300'}
                          alt={groupBuy.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-500 text-white">
                            <Users className="h-3 w-3 mr-1" />
                            Group Buy
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="bg-white/90 text-black">
                            <Clock className="h-3 w-3 mr-1" />
                            {isExpired ? 'Expired' : 
                             `${timeRemaining.hours}h ${timeRemaining.minutes}m left`}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="md:w-2/3 p-6">
                      <div className="space-y-4">
                        {/* Header */}
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{groupBuy.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">
                            {groupBuy.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Created by {groupBuy.profiles.full_name}</span>
                            <span>•</span>
                            <span>{groupBuy.group_buy_participants.length} participants</span>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress: {groupBuy.current_quantity}/{groupBuy.max_quantity}</span>
                            <span className="font-medium">{Math.round(progressPercentage)}%</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Min: {groupBuy.min_quantity}</span>
                            <span>Max: {groupBuy.max_quantity}</span>
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">
                              GHS {currentPrice.toFixed(2)}
                            </span>
                            <span className="text-lg text-muted-foreground line-through">
                              GHS {groupBuy.products.price.toFixed(2)}
                            </span>
                            <Badge variant="secondary" className="text-green-600">
                              Save {((groupBuy.products.price - currentPrice) / groupBuy.products.price * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          
                          {/* Price Tiers */}
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Price Tiers: </span>
                            {Object.entries(groupBuy.price_tiers)
                              .sort(([a], [b]) => parseInt(a) - parseInt(b))
                              .map(([qty, price], index) => (
                                <span key={qty}>
                                  {index > 0 && ' • '}
                                  {qty}+: GHS {price.toFixed(2)}
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Join Section */}
                        <div className="flex items-center gap-4 pt-4 border-t">
                          {canJoin ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Label htmlFor={`quantity-${groupBuy.id}`} className="text-sm">
                                  Quantity:
                                </Label>
                                <Input
                                  id={`quantity-${groupBuy.id}`}
                                  type="number"
                                  min="1"
                                  max={groupBuy.max_quantity - groupBuy.current_quantity}
                                  value={joinQuantity[groupBuy.id] || 1}
                                  onChange={(e) => setJoinQuantity(prev => ({
                                    ...prev,
                                    [groupBuy.id]: parseInt(e.target.value) || 1
                                  }))}
                                  className="w-20"
                                />
                              </div>
                              <Button
                                onClick={() => handleJoinGroupBuy(groupBuy.id)}
                                disabled={joiningGroupBuy === groupBuy.id}
                                className="flex-1"
                              >
                                {joiningGroupBuy === groupBuy.id ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Joining...
                                  </>
                                ) : (
                                  <>
                                    <Users className="h-4 w-4 mr-2" />
                                    Join Group Buy
                                  </>
                                )}
                              </Button>
                            </>
                          ) : (
                            <div className="flex-1 text-center">
                              {!user ? (
                                <Button asChild>
                                  <Link href="/login">Login to Join</Link>
                                </Button>
                              ) : isExpired ? (
                                <Badge variant="outline" className="text-red-600">
                                  Campaign Ended
                                </Badge>
                              ) : isFull ? (
                                <Badge variant="outline" className="text-green-600">
                                  Group Buy Full
                                </Badge>
                              ) : null}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}