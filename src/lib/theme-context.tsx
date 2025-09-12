'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink'

interface ThemeContextType {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (scheme: ColorScheme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('system')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('blue')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Load saved theme preferences
    const savedTheme = localStorage.getItem('ihsan-theme') as Theme || 'system'
    const savedColorScheme = localStorage.getItem('ihsan-color-scheme') as ColorScheme || 'blue'
    
    setTheme(savedTheme)
    setColorScheme(savedColorScheme)
  }, [])

  useEffect(() => {
    // Apply theme
    const root = document.documentElement
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      setIsDark(systemTheme === 'dark')
      root.classList.toggle('dark', systemTheme === 'dark')
    } else {
      setIsDark(theme === 'dark')
      root.classList.toggle('dark', theme === 'dark')
    }
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme)
    
    // Save preferences
    localStorage.setItem('ihsan-theme', theme)
    localStorage.setItem('ihsan-color-scheme', colorScheme)
  }, [theme, colorScheme])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        setIsDark(mediaQuery.matches)
        document.documentElement.classList.toggle('dark', mediaQuery.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const value = {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
    isDark
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
