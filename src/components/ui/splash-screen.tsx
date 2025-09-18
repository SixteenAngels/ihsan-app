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
    }, 5000) // Show for 5 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
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
                className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    "0 4px 20px rgba(59, 130, 246, 0.3)",
                    "0 8px 30px rgba(59, 130, 246, 0.4)",
                    "0 4px 20px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ShoppingCart className="h-12 w-12 md:h-16 md:w-16 text-white" />
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

            {/* IHSAN text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-blue-600">
                IHSAN
              </h1>
              <p className="text-sm md:text-base text-blue-500 mt-2">
                Your Gateway to Premium Shopping
              </p>
            </motion.div>

            {/* Loading indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30" />
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-200/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 0.5, 0],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}