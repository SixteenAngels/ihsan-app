'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Coins, 
  Gift, 
  Star, 
  Trophy, 
  Calendar, 
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  Zap,
  Crown,
  Diamond
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'

interface Reward {
  id: string
  title: string
  description: string
  cost: number
  type: 'discount' | 'free_shipping' | 'product' | 'cashback'
  icon: React.ComponentType<any>
  available: boolean
  expiresAt?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  target: number
  reward: number
  completed: boolean
  icon: React.ComponentType<any>
}

interface LoyaltyTier {
  name: string
  level: number
  minCoins: number
  benefits: string[]
  color: string
  icon: React.ComponentType<any>
}

export default function LoyaltyProgram() {
  const [userCoins, setUserCoins] = useState(1250)
  const [userLevel, setUserLevel] = useState(2)
  const [activeTab, setActiveTab] = useState<'overview' | 'rewards' | 'achievements' | 'history'>('overview')

  const loyaltyTiers: LoyaltyTier[] = [
    {
      name: 'Bronze',
      level: 1,
      minCoins: 0,
      benefits: ['Basic rewards', 'Email support'],
      color: 'bg-amber-500',
      icon: Star
    },
    {
      name: 'Silver',
      level: 2,
      minCoins: 1000,
      benefits: ['Enhanced rewards', 'Priority support', 'Free shipping on orders over $50'],
      color: 'bg-gray-400',
      icon: Trophy
    },
    {
      name: 'Gold',
      level: 3,
      minCoins: 5000,
      benefits: ['Premium rewards', '24/7 support', 'Free shipping on all orders', 'Early access to sales'],
      color: 'bg-yellow-500',
      icon: Crown
    },
    {
      name: 'Diamond',
      level: 4,
      minCoins: 15000,
      benefits: ['Exclusive rewards', 'Personal concierge', 'Free shipping worldwide', 'VIP events access'],
      color: 'bg-blue-500',
      icon: Diamond
    }
  ]

  const rewards: Reward[] = [
    {
      id: '1',
      title: '10% Off Next Order',
      description: 'Get 10% discount on your next purchase',
      cost: 500,
      type: 'discount',
      icon: Gift,
      available: true
    },
    {
      id: '2',
      title: 'Free Shipping',
      description: 'Free shipping on your next order',
      cost: 300,
      type: 'free_shipping',
      icon: Zap,
      available: true
    },
    {
      id: '3',
      title: 'Premium Shea Butter',
      description: 'Free premium shea butter sample',
      cost: 800,
      type: 'product',
      icon: Coins,
      available: true
    },
    {
      id: '4',
      title: '5% Cashback',
      description: 'Earn 5% cashback on next purchase',
      cost: 600,
      type: 'cashback',
      icon: Target,
      available: false
    }
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Purchase',
      description: 'Complete your first order',
      progress: 1,
      target: 1,
      reward: 100,
      completed: true,
      icon: CheckCircle
    },
    {
      id: '2',
      title: 'Loyal Customer',
      description: 'Make 10 purchases',
      progress: 7,
      target: 10,
      reward: 500,
      completed: false,
      icon: Star
    },
    {
      id: '3',
      title: 'Review Master',
      description: 'Write 5 product reviews',
      progress: 3,
      target: 5,
      reward: 300,
      completed: false,
      icon: Sparkles
    },
    {
      id: '4',
      title: 'Social Butterfly',
      description: 'Share 10 products on social media',
      progress: 2,
      target: 10,
      reward: 400,
      completed: false,
      icon: Target
    }
  ]

  const currentTier = loyaltyTiers[userLevel - 1]
  const nextTier = loyaltyTiers[userLevel]
  const progressToNext = nextTier && currentTier ? ((userCoins - currentTier.minCoins) / (nextTier.minCoins - currentTier.minCoins)) * 100 : 100

  const redeemReward = (reward: Reward) => {
    if (userCoins >= reward.cost && reward.available) {
      setUserCoins(userCoins - reward.cost)
      // Show success message
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Coins className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Loyalty Program</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Earn coins with every purchase and unlock amazing rewards
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Coins Balance */}
        <motion.div
          initial="initial"
          animate="in"
          variants={slideInFromBottom}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Coins className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{userCoins.toLocaleString()}</h2>
                    <p className="text-muted-foreground">Ihsan Coins</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge variant="secondary" className="mb-2">
                    {currentTier?.name || 'Bronze'} Member
                  </Badge>
                  {nextTier && (
                    <div className="text-sm text-muted-foreground">
                      {nextTier.minCoins - userCoins} coins to {nextTier.name}
                    </div>
                  )}
                </div>
              </div>
              
              {nextTier && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to {nextTier.name}</span>
                    <span>{Math.round(progressToNext)}%</span>
                  </div>
                  <Progress value={progressToNext} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="initial"
          animate="in"
          variants={slideInFromBottom}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Star },
                  { id: 'rewards', label: 'Rewards', icon: Gift },
                  { id: 'achievements', label: 'Achievements', icon: Trophy },
                  { id: 'history', label: 'History', icon: Calendar }
                ].map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? 'default' : 'outline'}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              {/* Tier Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Your Tier Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${currentTier?.color || 'bg-yellow-500'}`}>
                          {currentTier?.icon && <currentTier.icon className="w-6 h-6 text-white" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{currentTier?.name || 'Bronze'} Member</h3>
                          <p className="text-sm text-muted-foreground">Level {currentTier?.level || 1}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {currentTier?.benefits?.map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {nextTier && (
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-full ${nextTier.color}`}>
                            <nextTier.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{nextTier.name} Member</h3>
                            <p className="text-sm text-muted-foreground">Next Level</p>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {nextTier.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Earned 50 coins', reason: 'Product review', time: '2 hours ago' },
                      { action: 'Earned 100 coins', reason: 'Purchase completed', time: '1 day ago' },
                      { action: 'Redeemed reward', reason: 'Free shipping', time: '3 days ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.reason}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward, index) => {
                  const Icon = reward.icon
                  const canRedeem = userCoins >= reward.cost && reward.available
                  
                  return (
                    <motion.div
                      key={reward.id}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`transition-all duration-200 ${
                        canRedeem ? 'hover:shadow-lg cursor-pointer' : 'opacity-60'
                      }`}>
                        <CardContent className="p-6">
                          <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon className="w-8 h-8 text-primary" />
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold">{reward.title}</h3>
                              <p className="text-sm text-muted-foreground">{reward.description}</p>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold">{reward.cost} coins</span>
                            </div>
                            
                            <Button
                              onClick={() => redeemReward(reward)}
                              disabled={!canRedeem}
                              className="w-full"
                            >
                              {reward.available ? 'Redeem' : 'Unavailable'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  const progressPercent = (achievement.progress / achievement.target) * 100
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`transition-all duration-200 ${
                        achievement.completed ? 'ring-2 ring-green-500' : ''
                      }`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${
                              achievement.completed ? 'bg-green-500' : 'bg-muted'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                achievement.completed ? 'text-white' : 'text-muted-foreground'
                              }`} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">{achievement.title}</h3>
                                <Badge variant={achievement.completed ? 'default' : 'secondary'}>
                                  {achievement.reward} coins
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">
                                {achievement.description}
                              </p>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{achievement.progress}/{achievement.target}</span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: 'earned', amount: 50, reason: 'Product review', date: '2024-01-15' },
                      { type: 'earned', amount: 100, reason: 'Purchase completed', date: '2024-01-14' },
                      { type: 'redeemed', amount: -300, reason: 'Free shipping reward', date: '2024-01-12' },
                      { type: 'earned', amount: 25, reason: 'Daily check-in', date: '2024-01-11' }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.type === 'earned' ? (
                              <Coins className="w-4 h-4 text-green-600" />
                            ) : (
                              <Gift className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.reason}</p>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'earned' ? '+' : ''}{transaction.amount} coins
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
