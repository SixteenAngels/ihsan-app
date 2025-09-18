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
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    rate: 1.0,
    change: 0,
    flag: '🇬🇭',
    region: 'Ghana'
  },
]

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>(defaultCurrencies)
  const [selectedCurrency, setSelectedCurrency] = useState<string>('GHS')

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

  // No exchange rate fetching needed for single-currency (GHS) mode

  const convertAmount = (amount: number, from: string, to?: string): number => {
    // Only GHS supported, so just return the amount
    return amount;
  }

  const formatCurrency = (amount: number, currency?: string): string => {
    // Only GHS supported
    return `₵${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
