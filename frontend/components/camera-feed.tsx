"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CameraFeedProps {
  imageData: string | null
  isVisible: boolean
  onToggle: () => void
  className?: string
}

export default function CameraFeed({ imageData, isVisible, onToggle, className = "" }: CameraFeedProps) {
  return (
    <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
      <AnimatePresence>
        {isVisible && imageData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative"
          >
            {/* Camera feed container */}
            <div className="relative w-48 h-36 bg-black rounded-lg overflow-hidden shadow-lg border-2 border-primary/20">
              {/* Close button */}
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 p-0 z-10"
                onClick={onToggle}
              >
                <X className="w-3 h-3" />
              </Button>
              
              {/* Camera icon overlay when no image */}
              {!imageData && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              {/* Camera feed image */}
              {imageData && (
                <img
                  src={`data:image/jpeg;base64,${imageData}`}
                  alt="Eye tracking camera feed"
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Status indicator */}
              <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                Live
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle button when camera feed is hidden */}
      {!isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <Button
            size="sm"
            variant="outline"
            className="h-10 w-10 p-0 bg-background/80 backdrop-blur-sm"
            onClick={onToggle}
            title="Show camera feed"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}
