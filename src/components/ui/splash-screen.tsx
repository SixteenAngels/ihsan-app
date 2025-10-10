"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 5000) // 5 seconds
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 min-h-screen bg-background flex items-center justify-center"
        >
          <div className="text-center space-y-6">
            {/* Brand */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              Ihsan
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm md:text-base text-muted-foreground"
            >
              Loading your experience…
            </motion.p>

            {/* 3D cart push animation on a short track */}
            <div className="mt-4 flex flex-col items-center">
              <div className="h-2 w-56 bg-muted rounded-full relative overflow-hidden" />
              <motion.div
                className="relative mt-[-18px]"
                style={{ transformPerspective: 600 as any }}
                animate={{ x: [-60, 60, -60], rotateY: [-10, 10, -10], scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-xl shadow-xl flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SplashScreen