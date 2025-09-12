'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'react-hot-toast'
import { 
  Camera, 
  Upload, 
  Search, 
  X, 
  Image as ImageIcon, 
  Loader2,
  Sparkles,
  Filter,
  SortAsc,
  Grid3X3,
  List
} from 'lucide-react'
import { fadeIn, slideInFromBottom, bounceIn } from '@/lib/animations'

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

interface PictureSearchProps {
  onResultSelect?: (result: SearchResult) => void
}

export default function PictureSearch({ onResultSelect }: PictureSearchProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating'>('relevance')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      name: 'Ghana Shea Butter - Pure & Natural',
      price: 15.99,
      image: '/api/placeholder/300/300',
      similarity: 95,
      category: 'Beauty & Health',
      vendor: 'African Naturals',
      rating: 4.8,
      reviews: 1247
    },
    {
      id: '2',
      name: 'Organic Coconut Oil - Cold Pressed',
      price: 12.50,
      image: '/api/placeholder/300/300',
      similarity: 87,
      category: 'Beauty & Health',
      vendor: 'Tropical Essentials',
      rating: 4.6,
      reviews: 892
    },
    {
      id: '3',
      name: 'Handwoven Kente Cloth - Traditional',
      price: 45.00,
      image: '/api/placeholder/300/300',
      similarity: 82,
      category: 'Fashion & Textiles',
      vendor: 'Heritage Crafts',
      rating: 4.9,
      reviews: 156
    },
    {
      id: '4',
      name: 'Wooden African Mask - Hand Carved',
      price: 28.75,
      image: '/api/placeholder/300/300',
      similarity: 78,
      category: 'Home & Decor',
      vendor: 'Artisan Gallery',
      rating: 4.7,
      reviews: 203
    },
    {
      id: '5',
      name: 'Beaded Jewelry Set - Traditional',
      price: 22.99,
      image: '/api/placeholder/300/300',
      similarity: 75,
      category: 'Jewelry & Accessories',
      vendor: 'Beaded Beauty',
      rating: 4.5,
      reviews: 445
    }
  ]

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return
    }

    setIsUploading(true)

    try {
      // Convert file to base64 for preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Simulate image processing and search
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock search results
      setSearchResults(mockResults)
      setShowResults(true)
      
      toast.success('Image uploaded successfully! Found similar products.')
    } catch (error) {
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleSearch = async () => {
    if (!uploadedImage) {
      toast.error('Please upload an image first')
      return
    }

    setIsSearching(true)
    try {
      // Simulate AI-powered image search
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Sort results based on selected criteria
      let sortedResults = [...mockResults]
      if (sortBy === 'price') {
        sortedResults.sort((a, b) => a.price - b.price)
      } else if (sortBy === 'rating') {
        sortedResults.sort((a, b) => b.rating - a.rating)
      }
      
      setSearchResults(sortedResults)
      toast.success('Search completed! Found similar products.')
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setUploadedImage(null)
    setSearchResults([])
    setShowResults(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial="initial"
        animate="in"
        variants={fadeIn}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Picture Search
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload an image to find similar products using AI-powered visual search technology
        </p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial="initial"
        animate="in"
        variants={slideInFromBottom}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-8">
            {!uploadedImage ? (
              <div
                className="text-center space-y-6"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Upload an Image</h3>
                    <p className="text-muted-foreground mb-4">
                      Drag and drop an image here, or click to browse
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    {isUploading ? 'Uploading...' : 'Choose Image'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Simulate camera access
                      toast.info('Camera feature coming soon!')
                    }}
                    disabled={isUploading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photo
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Uploaded Image</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-medium">AI Analysis Complete</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="w-full"
                        size="lg"
                      >
                        {isSearching ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Find Similar Products
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={slideInFromBottom}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Search Results</h2>
                <p className="text-muted-foreground">
                  Found {searchResults.length} similar products
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortBy('relevance')}
                  className={sortBy === 'relevance' ? 'bg-primary text-white' : ''}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Relevance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortBy('price')}
                  className={sortBy === 'price' ? 'bg-primary text-white' : ''}
                >
                  <SortAsc className="w-4 h-4 mr-2" />
                  Price
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortBy('rating')}
                  className={sortBy === 'rating' ? 'bg-primary text-white' : ''}
                >
                  ⭐ Rating
                </Button>
                
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Grid/List */}
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }>
              {searchResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial="initial"
                  animate="in"
                  variants={bounceIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                      viewMode === 'list' ? 'flex flex-row' : ''
                    }`}
                    onClick={() => onResultSelect?.(result)}
                  >
                    <div className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}>
                      <img
                        src={result.image}
                        alt={result.name}
                        className={`w-full object-cover ${
                          viewMode === 'list' ? 'h-full rounded-l-lg' : 'h-48 rounded-t-lg'
                        }`}
                      />
                    </div>
                    
                    <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold line-clamp-2">{result.name}</h3>
                          <Badge variant="secondary" className="ml-2">
                            {result.similarity}% match
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{result.category}</p>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium ml-1">{result.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({result.reviews})
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(result.price)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            by {result.vendor}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
