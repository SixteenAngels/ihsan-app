'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  Euro, 
  PoundSterling, 
  Coins,
  TrendingUp,
  TrendingDown,
  Globe,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'

interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
  change: number
  flag: string
  region: string
}

interface CurrencyStats {
  totalCurrencies: number
  activeCurrencies: number
  totalVolume: number
  averageRate: number
}

export default function MultiCurrencySystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'rates' | 'converter' | 'settings'>('overview')
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')
  const [amount, setAmount] = useState<number>(100)
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [targetCurrency, setTargetCurrency] = useState<string>('NGN')

  // Mock currency data with real exchange rates (approximate)
  const currencies: Currency[] = [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      rate: 1.0,
      change: 0.0,
      flag: '🇺🇸',
      region: 'United States'
    },
    {
      code: 'NGN',
      name: 'Nigerian Naira',
      symbol: '₦',
      rate: 1500.0,
      change: 2.5,
      flag: '🇳🇬',
      region: 'Nigeria'
    },
    {
      code: 'GHS',
      name: 'Ghanaian Cedi',
      symbol: '₵',
      rate: 12.5,
      change: -1.2,
      flag: '🇬🇭',
      region: 'Ghana'
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      rate: 0.85,
      change: 0.8,
      flag: '🇪🇺',
      region: 'Europe'
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      rate: 0.73,
      change: -0.5,
      flag: '🇬🇧',
      region: 'United Kingdom'
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'C$',
      rate: 1.35,
      change: 1.1,
      flag: '🇨🇦',
      region: 'Canada'
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      rate: 1.48,
      change: 0.3,
      flag: '🇦🇺',
      region: 'Australia'
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      rate: 110.0,
      change: -0.8,
      flag: '🇯🇵',
      region: 'Japan'
    }
  ]

  const stats: CurrencyStats = {
    totalCurrencies: currencies.length,
    activeCurrencies: currencies.filter(c => Math.abs(c.change) < 5).length,
    totalVolume: 1250000,
    averageRate: currencies.reduce((sum, c) => sum + c.rate, 0) / currencies.length
  }

  const getCurrencyIcon = (code: string) => {
    switch (code) {
      case 'USD': return DollarSign
      case 'EUR': return Euro
      case 'GBP': return PoundSterling
      default: return Coins
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    const currencyData = currencies.find(c => c.code === currency)
    if (!currencyData) return `${amount.toFixed(2)}`
    
    return `${currencyData.symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  const convertCurrency = (from: string, to: string, amount: number) => {
    const fromCurrency = currencies.find(c => c.code === from)
    const toCurrency = currencies.find(c => c.code === to)
    
    if (!fromCurrency || !toCurrency) return 0
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromCurrency.rate
    return usdAmount * toCurrency.rate
  }

  useEffect(() => {
    const converted = convertCurrency(selectedCurrency, targetCurrency, amount)
    setConvertedAmount(converted)
  }, [selectedCurrency, targetCurrency, amount])

  const handleCurrencyChange = (from: string, to: string) => {
    setSelectedCurrency(from)
    setTargetCurrency(to)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={fadeIn}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Globe className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Multi-Currency System</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Support for multiple currencies with real-time exchange rates and seamless conversion
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
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Globe },
                  { id: 'rates', label: 'Exchange Rates', icon: TrendingUp },
                  { id: 'converter', label: 'Currency Converter', icon: RefreshCw },
                  { id: 'settings', label: 'Settings', icon: Settings }
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
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Currencies', value: stats.totalCurrencies.toString(), icon: Globe, color: 'text-blue-600' },
                  { label: 'Active Currencies', value: stats.activeCurrencies.toString(), icon: CheckCircle, color: 'text-green-600' },
                  { label: 'Daily Volume', value: formatCurrency(stats.totalVolume, 'USD'), icon: TrendingUp, color: 'text-purple-600' },
                  { label: 'Avg Exchange Rate', value: stats.averageRate.toFixed(2), icon: Coins, color: 'text-orange-600' }
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial="initial"
                      animate="in"
                      variants={bounceIn}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-full bg-gray-100`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>

              {/* Popular Currencies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Popular Currencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {currencies.slice(0, 8).map((currency, index) => {
                      const Icon = getCurrencyIcon(currency.code)
                      const isPositive = currency.change >= 0
                      return (
                        <motion.div
                          key={currency.code}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleCurrencyChange('USD', currency.code)}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{currency.flag}</div>
                                  <div>
                                    <h3 className="font-semibold">{currency.code}</h3>
                                    <p className="text-sm text-muted-foreground">{currency.name}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {formatCurrency(currency.rate, 'USD')}
                                  </p>
                                  <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    <span>{Math.abs(currency.change).toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'rates' && (
            <motion.div
              key="rates"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Live Exchange Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currencies.map((currency, index) => {
                      const Icon = getCurrencyIcon(currency.code)
                      const isPositive = currency.change >= 0
                      return (
                        <motion.div
                          key={currency.code}
                          initial="initial"
                          animate="in"
                          variants={bounceIn}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="text-3xl">{currency.flag}</div>
                                  <div>
                                    <h3 className="font-semibold text-lg">{currency.code}</h3>
                                    <p className="text-sm text-muted-foreground">{currency.name}</p>
                                    <p className="text-xs text-muted-foreground">{currency.region}</p>
                                  </div>
                                </div>
                                
                                <div className="text-right space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-2xl font-bold">
                                      {formatCurrency(currency.rate, 'USD')}
                                    </span>
                                  </div>
                                  
                                  <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                    <span className="font-medium">{Math.abs(currency.change).toFixed(2)}%</span>
                                    <Badge variant="secondary" className={isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                      {isPositive ? 'Up' : 'Down'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'converter' && (
            <motion.div
              key="converter"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Currency Converter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* From Currency */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">From</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Amount</label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="w-full p-3 border rounded-lg text-lg font-semibold"
                            placeholder="Enter amount"
                            aria-label="Amount to convert"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Currency</label>
                          <select
                            value={selectedCurrency}
                            onChange={(e) => setSelectedCurrency(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            aria-label="Select source currency"
                          >
                            {currencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.flag} {currency.code} - {currency.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* To Currency */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">To</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Converted Amount</label>
                          <div className="w-full p-3 border rounded-lg text-lg font-semibold bg-gray-50">
                            {formatCurrency(convertedAmount, targetCurrency)}
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Target Currency</label>
                          <select
                            value={targetCurrency}
                            onChange={(e) => setTargetCurrency(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            aria-label="Select target currency"
                          >
                            {currencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.flag} {currency.code} - {currency.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exchange Rate Info */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900">Exchange Rate</h4>
                        <p className="text-sm text-blue-700">
                          1 {selectedCurrency} = {formatCurrency(convertCurrency(selectedCurrency, targetCurrency, 1), targetCurrency)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Rate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial="initial"
              animate="in"
              exit="out"
              variants={slideInFromBottom}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Currency Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Default Currency</h3>
                      <select className="w-full p-3 border rounded-lg" aria-label="Select default currency">
                        {currencies.map((currency) => (
                          <option key={currency.code} value={currency.code}>
                            {currency.flag} {currency.code} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Auto-Update Rates</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Update rates every 5 minutes</span>
                          <input type="checkbox" defaultChecked aria-label="Update rates every 5 minutes" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Show rate changes in notifications</span>
                          <input type="checkbox" defaultChecked aria-label="Show rate changes in notifications" />
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <span>Auto-convert prices in product listings</span>
                          <input type="checkbox" aria-label="Auto-convert prices in product listings" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Supported Regions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {currencies.map((currency) => (
                          <div key={currency.code} className="flex items-center gap-2 p-2 border rounded">
                            <span className="text-lg">{currency.flag}</span>
                            <span className="text-sm">{currency.region}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Save Settings
                    </Button>
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
