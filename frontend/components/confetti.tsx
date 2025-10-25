"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfettiProps {
  show: boolean
  duration?: number
  onComplete?: () => void
}

export default function Confetti({ show, duration = 4000, onComplete }: ConfettiProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        onComplete?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="confetti-container"
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="confetti" />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}