'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Loader2, ShoppingBag, Heart, Users, Truck } from 'lucide-react'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const steps = [
    'Initializing Ihsan...',
    'Loading products...',
    'Setting up authentication...',
    'Preparing your experience...',
    'Almost ready...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        const currentIndex = steps.findIndex(step => step === prev)
        const nextIndex = (currentIndex + 1) % steps.length
        return steps[nextIndex]
      })
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10"
    >
      <div className="flex flex-col items-center space-y-8 p-8">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 1
          }}
          className="relative"
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-2xl">
            <ShoppingBag className="h-10 w-10 text-white" />
          </div>
          
          {/* Floating icons */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 flex items-center justify-center"
          >
            <Heart className="h-3 w-3 text-white fill-white" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute -bottom-2 -left-2 h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center"
          >
            <Users className="h-3 w-3 text-white" />
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }}
            className="absolute top-1/2 -right-8 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center"
          >
            <Truck className="h-3 w-3 text-white" />
          </motion.div>
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Ihsan
          </h1>
          <p className="text-muted-foreground mt-2">
            Modern e-commerce for Ghana & Africa
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="w-64 space-y-2"
        >
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentStep}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="h-6 w-6 text-primary" />
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex space-x-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>Ready Now</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span>Group Buy</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-purple-500" />
            <span>Air & Sea</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
