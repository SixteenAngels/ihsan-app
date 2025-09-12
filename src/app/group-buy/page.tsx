'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Users, Clock, Zap, ArrowRight } from 'lucide-react'
import { formatPrice, getGroupBuyTimeRemaining } from '@/lib/utils'

// Mock data for Group Buy campaigns
const groupBuyCampaigns = [
  {
    id: '1',
    productId: '3',
    name: 'Ghana Made Shea Butter',
    slug: 'ghana-shea-butter',
    price: 25,
    originalPrice: 30,
    images: ['/api/placeholder/300/300'],
    category: 'Beauty',
    rating: 4.9,
    reviewCount: 156,
    minQuantity: 5,
    maxQuantity: 10,
    currentQuantity: 7,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(), // 20 hours from now
    isActive: true,
    priceTiers: {
      5: 25,
      7: 23,
      10: 20
    },
    participants: 7,
    description: 'Pure, organic shea butter made in Ghana. Perfect for skincare and hair care.'
  },
  {
    id: '2',
    productId: '6',
    name: 'Organic Coconut Oil',
    slug: 'organic-coconut-oil',
    price: 18,
    originalPrice: 22,
    images: ['/api/placeholder/300/300'],
    category: 'Beauty',
    rating: 4.8,
    reviewCount: 92,
    minQuantity: 10,
    maxQuantity: 20,
    currentQuantity: 15,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 15 * 60 * 60 * 1000).toISOString(), // 15 hours from now
    isActive: true,
    priceTiers: {
      10: 18,
      15: 16,
      20: 14
    },
    participants: 15,
    description: 'Cold-pressed organic coconut oil for cooking and beauty uses.'
  },
  {
    id: '3',
    productId: '8',
    name: 'Bulk Rice (50kg)',
    slug: 'bulk-rice-50kg',
    price: 180,
    originalPrice: 220,
    images: ['/api/placeholder/300/300'],
    category: 'Bulk Deals',
    rating: 4.7,
    reviewCount: 45,
    minQuantity: 3,
    maxQuantity: 8,
    currentQuantity: 5,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours from now
    isActive: true,
    priceTiers: {
      3: 180,
      5: 170,
      8: 160
    },
    participants: 5,
    description: 'Premium quality rice in bulk quantities. Perfect for restaurants and families.'
  }
]

export default function GroupBuyPage() {
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
              <h1 className="text-3xl font-bold">Group Buy</h1>
              <p className="text-muted-foreground">
                Join group purchases to unlock tiered discounts
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Users className="h-4 w-4" />
              <span className="font-medium">How Group Buy Works</span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              Join group purchases to unlock better prices. The more people join, the lower the price gets!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{groupBuyCampaigns.length}</div>
              <div className="text-sm text-muted-foreground">Active Campaigns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {groupBuyCampaigns.reduce((sum, campaign) => sum + campaign.participants, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">Up to 30%</div>
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
          {groupBuyCampaigns.map((campaign) => {
            const timeRemaining = getGroupBuyTimeRemaining(campaign.endDate)
            const progressPercentage = (campaign.currentQuantity / campaign.maxQuantity) * 100
            const currentTier = Object.keys(campaign.priceTiers)
              .map(Number)
              .filter(tier => campaign.currentQuantity >= tier)
              .sort((a, b) => b - a)[0] || campaign.minQuantity
            
            const currentPrice = campaign.priceTiers[currentTier as keyof typeof campaign.priceTiers]

            return (
              <Card key={campaign.id} className="overflow-hidden">
                <div className="md:flex">
                  {/* Product Image */}
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-muted relative">
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-500 text-white">
                          <Users className="h-3 w-3 mr-1" />
                          Group Buy
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="bg-white/90 text-black">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeRemaining.isExpired ? 'Expired' : 
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
                        <h3 className="text-xl font-semibold mb-2">{campaign.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{campaign.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{campaign.category}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{campaign.rating} ({campaign.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: {campaign.currentQuantity}/{campaign.maxQuantity} participants</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      {/* Price Tiers */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Price Tiers:</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          {Object.entries(campaign.priceTiers).map(([quantity, price]) => (
                            <div
                              key={quantity}
                              className={`p-2 rounded text-center ${
                                campaign.currentQuantity >= Number(quantity)
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              <div className="font-medium">{quantity}+</div>
                              <div className="text-xs">{formatPrice(price)}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Current Price */}
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-2xl font-bold">{formatPrice(currentPrice)}</div>
                          <div className="text-sm text-muted-foreground line-through">
                            {formatPrice(campaign.originalPrice)}
                          </div>
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Save {Math.round(((campaign.originalPrice - currentPrice) / campaign.originalPrice) * 100)}%
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Users className="h-4 w-4 mr-2" />
                          Join Group Buy
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href={`/products/${campaign.slug}`}>
                            View Product
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Start Your Own Group Buy</h2>
            <p className="text-muted-foreground mb-6">
              Have a product you want to buy in bulk? Start a group buy campaign!
            </p>
            <Button size="lg">
              <Users className="h-4 w-4 mr-2" />
              Create Group Buy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
