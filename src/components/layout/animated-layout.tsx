'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/ui/splash-screen'
import { pageVariants, pageTransition } from '@/lib/animations'

interface AnimatedLayoutProps {
  children: React.ReactNode
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  const [showSplash, setShowSplash] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated to prevent SSR/client mismatch
    setIsHydrated(true)
    
    // Check if this is the user's first visit
    const hasVisited = localStorage.getItem('ihsan-visited')
    if (!hasVisited) {
      setIsFirstVisit(true)
      localStorage.setItem('ihsan-visited', 'true')
    }

    // Show splash screen for 3 seconds on first visit, 1 second on subsequent visits
    const splashDuration = isFirstVisit ? 3000 : 1000
    
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, splashDuration)

    return () => clearTimeout(timer)
  }, [isFirstVisit])

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  // During SSR and before hydration, show the app content immediately
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    )
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : (
          <motion.div
            key="app"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen flex flex-col"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
