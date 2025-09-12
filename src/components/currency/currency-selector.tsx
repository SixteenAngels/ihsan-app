'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  Check, 
  Globe,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { useCurrency } from '@/lib/currency-context'
import { cn } from '@/lib/utils'

interface CurrencySelectorProps {
  className?: string
  showRate?: boolean
  showChange?: boolean
}

export function CurrencySelector({ 
  className, 
  showRate = false, 
  showChange = false 
}: CurrencySelectorProps) {
  const { currencies, selectedCurrency, setSelectedCurrency, getCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const currentCurrency = getCurrency(selectedCurrency)

  const handleCurrencySelect = (code: string) => {
    setSelectedCurrency(code)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[120px] justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{currentCurrency?.flag}</span>
          <span className="font-medium">{currentCurrency?.code}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 z-50"
          >
            <Card className="shadow-lg border">
              <CardContent className="p-2">
                <div className="space-y-1">
                  {currencies.map((currency) => {
                    const isSelected = currency.code === selectedCurrency
                    const isPositive = currency.change >= 0
                    
                    return (
                      <motion.div
                        key={currency.code}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleCurrencySelect(currency.code)}
                          className={cn(
                            "w-full justify-start p-3 h-auto",
                            isSelected && "bg-primary/10"
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{currency.flag}</span>
                              <div className="text-left">
                                <div className="font-medium">{currency.code}</div>
                                <div className="text-sm text-muted-foreground">
                                  {currency.name}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {showRate && (
                                <div className="text-sm font-medium">
                                  {currency.symbol}{currency.rate.toFixed(2)}
                                </div>
                              )}
                              
                              {showChange && (
                                <div className={cn(
                                  "flex items-center gap-1 text-xs",
                                  isPositive ? "text-green-600" : "text-red-600"
                                )}>
                                  {isPositive ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  <span>{Math.abs(currency.change).toFixed(1)}%</span>
                                </div>
                              )}
                              
                              {isSelected && (
                                <Check className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Compact currency display component
export function CurrencyDisplay({ 
  amount, 
  currency, 
  className 
}: { 
  amount: number
  currency?: string
  className?: string 
}) {
  const { formatCurrency } = useCurrency()
  
  return (
    <span className={cn("font-medium", className)}>
      {formatCurrency(amount, currency)}
    </span>
  )
}

// Currency converter component
export function CurrencyConverter({ 
  amount, 
  fromCurrency, 
  toCurrency,
  className 
}: { 
  amount: number
  fromCurrency: string
  toCurrency: string
  className?: string 
}) {
  const { convertAmount, formatCurrency } = useCurrency()
  
  const convertedAmount = convertAmount(amount, fromCurrency, toCurrency)
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm text-muted-foreground">
        {formatCurrency(amount, fromCurrency)} =
      </div>
      <div className="text-lg font-semibold">
        {formatCurrency(convertedAmount, toCurrency)}
      </div>
    </div>
  )
}
