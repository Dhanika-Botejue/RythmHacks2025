"use client"

import React from 'react'
import { motion } from 'framer-motion'

interface GazeOverlayProps {
  x: number // Ratio from 0 to 1 (0 = left edge, 1 = right edge)
  y: number // Ratio from 0 to 1 (0 = top edge, 1 = bottom edge)
  isVisible: boolean
}

export default function GazeOverlay({ x, y, isVisible }: GazeOverlayProps) {
  if (!isVisible) return null

  // Convert ratios to pixel positions
  const left = `${x * 100}%`
  const top = `${y * 100}%`

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      style={{
        left,
        top,
        transform: 'translate(-50%, -50%)', // Center the circle on the position
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.8 }}
      transition={{ duration: 0.1 }}
    >
      {/* Main gaze circle */}
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 w-8 h-8 border-2 border-red-500 rounded-full animate-pulse" />
        
        {/* Inner circle */}
        <div className="w-6 h-6 bg-red-500 rounded-full shadow-lg" />
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Coordinates display */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
        ({x.toFixed(2)}, {y.toFixed(2)})
      </div>
    </motion.div>
  )
}
