'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Check,
  Sparkles,
  Settings
} from 'lucide-react'
import { useTheme } from '@/lib/theme-context'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'

interface ThemeSelectorProps {
  onClose?: () => void
}

export default function ThemeSelector({ onClose }: ThemeSelectorProps) {
  const { theme, colorScheme, setTheme, setColorScheme, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState<'theme' | 'colors'>('theme')

  const themes = [
    {
      id: 'light' as const,
      name: 'Light',
      icon: Sun,
      description: 'Clean and bright interface',
      preview: 'bg-white border border-gray-200'
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
      preview: 'bg-gray-900 border border-gray-700'
    },
    {
      id: 'system' as const,
      name: 'System',
      icon: Monitor,
      description: 'Follows your device setting',
      preview: 'bg-gradient-to-r from-white to-gray-900 border border-gray-300'
    }
  ]

  const colorSchemes = [
    {
      id: 'blue' as const,
      name: 'Ocean Blue',
      primary: 'bg-blue-500',
      secondary: 'bg-blue-100',
      accent: 'bg-blue-200'
    },
    {
      id: 'green' as const,
      name: 'Forest Green',
      primary: 'bg-green-500',
      secondary: 'bg-green-100',
      accent: 'bg-green-200'
    },
    {
      id: 'purple' as const,
      name: 'Royal Purple',
      primary: 'bg-purple-500',
      secondary: 'bg-purple-100',
      accent: 'bg-purple-200'
    },
    {
      id: 'orange' as const,
      name: 'Sunset Orange',
      primary: 'bg-orange-500',
      secondary: 'bg-orange-100',
      accent: 'bg-orange-200'
    },
    {
      id: 'red' as const,
      name: 'Cherry Red',
      primary: 'bg-red-500',
      secondary: 'bg-red-100',
      accent: 'bg-red-200'
    },
    {
      id: 'pink' as const,
      name: 'Rose Pink',
      primary: 'bg-pink-500',
      secondary: 'bg-pink-100',
      accent: 'bg-pink-200'
    }
  ]

  return (
    <motion.div
      initial="initial"
      animate="in"
      variants={fadeIn}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <motion.div
            initial="initial"
            animate="in"
            variants={bounceIn}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center"
          >
            <Palette className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Customize Your Experience
          </CardTitle>
          <p className="text-muted-foreground">
            Choose your preferred theme and color scheme
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'theme' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setActiveTab('theme')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Theme
            </Button>
            <Button
              variant={activeTab === 'colors' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setActiveTab('colors')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Colors
            </Button>
          </div>

          {/* Theme Selection */}
          <AnimatePresence mode="wait">
            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial="initial"
                animate="in"
                exit="out"
                variants={slideInFromBottom}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Choose Theme</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {themes.map((themeOption) => {
                    const Icon = themeOption.icon
                    const isSelected = theme === themeOption.id
                    
                    return (
                      <motion.div
                        key={themeOption.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-primary shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setTheme(themeOption.id)}
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{themeOption.name}</span>
                              </div>
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            
                            <div className={`w-full h-16 rounded-lg ${themeOption.preview}`} />
                            
                            <p className="text-sm text-muted-foreground">
                              {themeOption.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Color Scheme Selection */}
            {activeTab === 'colors' && (
              <motion.div
                key="colors"
                initial="initial"
                animate="in"
                exit="out"
                variants={slideInFromBottom}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold">Choose Color Scheme</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorSchemes.map((scheme) => {
                    const isSelected = colorScheme === scheme.id
                    
                    return (
                      <motion.div
                        key={scheme.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'ring-2 ring-primary shadow-lg' 
                              : 'hover:shadow-md'
                          }`}
                          onClick={() => setColorScheme(scheme.id)}
                        >
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{scheme.name}</span>
                              {isSelected && (
                                <Badge variant="default" className="text-xs">
                                  <Check className="w-3 h-3 mr-1" />
                                  Active
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className={`w-full h-8 rounded ${scheme.primary}`} />
                              <div className="flex gap-1">
                                <div className={`flex-1 h-6 rounded ${scheme.secondary}`} />
                                <div className={`flex-1 h-6 rounded ${scheme.accent}`} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full" />
                <div className="flex-1">
                  <div className="h-2 bg-primary rounded w-3/4 mb-1" />
                  <div className="h-2 bg-muted-foreground/20 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 bg-primary/10 rounded" />
                <div className="h-16 bg-primary/20 rounded" />
                <div className="h-16 bg-primary/30 rounded" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={onClose}>
              Apply Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
