'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from './splash-screen'

export function ClientSplashScreen() {
  const [showSplash, setShowSplash] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Check if splash screen was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown')
    if (splashShown) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    sessionStorage.setItem('splashShown', 'true')
  }

  if (!isClient || !showSplash) {
    return null
  }

  return <SplashScreen onComplete={handleSplashComplete} />
}
