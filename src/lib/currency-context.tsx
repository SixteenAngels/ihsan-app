'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
  change: number
  flag: string
  region: string
}

interface CurrencyContextType {
  currencies: Currency[]
  selectedCurrency: string
  setSelectedCurrency: (currency: string) => void
  convertAmount: (amount: number, from: string, to?: string) => number
  formatCurrency: (amount: number, currency?: string) => string
  getCurrency: (code: string) => Currency | undefined
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Default currencies with approximate rates
const defaultCurrencies: Currency[] = [
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

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')

  // Load saved currency preference
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency')
    if (savedCurrency && currencies.find(c => c.code === savedCurrency)) {
      setSelectedCurrency(savedCurrency)
    }
  }, [currencies])

  // Save currency preference
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency)
  }, [selectedCurrency])

  // Fetch real-time exchange rates (mock implementation)
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        // In a real implementation, you would fetch from an API like:
        // const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
        // const data = await response.json()
        
        // For now, we'll simulate rate updates
        setCurrencies(prevCurrencies => 
          prevCurrencies.map(currency => ({
            ...currency,
            change: (Math.random() - 0.5) * 2, // Random change between -1% and 1%
            rate: currency.code === 'USD' ? 1.0 : currency.rate * (1 + (Math.random() - 0.5) * 0.01)
          }))
        )
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error)
      }
    }

    // Fetch rates every 5 minutes
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000)
    
    // Initial fetch
    fetchExchangeRates()

    return () => clearInterval(interval)
  }, [])

  const convertAmount = (amount: number, from: string, to?: string): number => {
    const targetCurrency = to || selectedCurrency
    const fromCurrency = currencies.find(c => c.code === from)
    const toCurrency = currencies.find(c => c.code === targetCurrency)
    
    if (!fromCurrency || !toCurrency) return amount
    
    // Convert to USD first, then to target currency
    const usdAmount = amount / fromCurrency.rate
    return usdAmount * toCurrency.rate
  }

  const formatCurrency = (amount: number, currency?: string): string => {
    const targetCurrency = currency || selectedCurrency
    const currencyData = currencies.find(c => c.code === targetCurrency)
    
    if (!currencyData) return `${amount.toFixed(2)}`
    
    return `${currencyData.symbol}${amount.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`
  }

  const getCurrency = (code: string): Currency | undefined => {
    return currencies.find(c => c.code === code)
  }

  const value: CurrencyContextType = {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    convertAmount,
    formatCurrency,
    getCurrency
  }

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
