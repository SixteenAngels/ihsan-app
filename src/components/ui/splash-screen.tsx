'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500) // Wait for exit animation
    }, 1500) // Shorter splash

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {/* Shopping cart logo with animation */}
          <div className="relative">
            {/* Animated shopping cart icon */}
            <motion.div
              initial={{ 
                scale: 0,
                rotate: -180,
                opacity: 0
              }}
              animate={{ 
                scale: 1,
                rotate: 0,
                opacity: 1
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut"
              }}
              className="relative"
            >
              <motion.div
                className="w-20 h-20 md:w-28 md:h-28 bg-primary rounded-xl flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: ["0 8px 24px rgba(0,0,0,0.12)", "0 12px 28px rgba(0,0,0,0.18)", "0 8px 24px rgba(0,0,0,0.12)"]
                }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ShoppingCart className="h-10 w-10 md:h-14 md:w-14 text-primary-foreground" />
              </motion.div>
              
              {/* Bounce effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.4, 0]
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.8,
                  ease: "easeOut"
                }}
              />
            </motion.div>

            {/* Brand text */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-4 text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ihsan</h1>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">Loading your experience…</p>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              className="mt-6 h-1 w-40 bg-muted rounded overflow-hidden"
            >
              <motion.div className="h-full bg-primary" initial={{ x: -80 }} animate={{ x: 0 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
            </motion.div>
          </div>

          {/* Clean background */}
        </motion.div>
      )}
    </AnimatePresence>
  )
}