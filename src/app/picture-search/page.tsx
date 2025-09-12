'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import PictureSearch from '@/components/search/picture-search'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ShoppingCart, Heart, Share2 } from 'lucide-react'
import { fadeIn, slideInFromLeft } from '@/lib/animations'

interface SearchResult {
  id: string
  name: string
  price: number
  image: string
  similarity: number
  category: string
  vendor: string
  rating: number
  reviews: number
}

export default function PictureSearchPage() {
  const router = useRouter()
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold">Picture Search</h1>
                <p className="text-sm text-muted-foreground">
                  Find products using AI-powered visual search
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <PictureSearch onResultSelect={handleResultSelect} />
      </div>

      {/* Product Quick View Modal */}
      {selectedResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedResult(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg">Product Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedResult(null)}
                >
                  ✕
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedResult.image}
                      alt={selectedResult.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold">{selectedResult.name}</h2>
                      <p className="text-muted-foreground">{selectedResult.category}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {selectedResult.similarity}% match
                      </Badge>
                      <div className="flex items-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium ml-1">{selectedResult.rating}</span>
                        <span className="text-xs text-muted-foreground ml-1">
                          ({selectedResult.reviews} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(selectedResult.price)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Sold by {selectedResult.vendor}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        router.push(`/products/${selectedResult.id}`)
                        setSelectedResult(null)
                      }}
                    >
                      View Full Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
