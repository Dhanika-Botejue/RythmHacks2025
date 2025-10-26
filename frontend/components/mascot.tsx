"use client"

import { motion } from "framer-motion"
import { Sparkles, Star, Heart } from "lucide-react"

type MascotMood = "happy" | "encouraging" | "celebrating" | "thinking" | "excited"

interface MascotProps {
  mood?: MascotMood
  message?: string
  size?: "sm" | "md" | "lg"
}

export default function Mascot({ mood = "happy", message, size = "md" }: MascotProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const moodAnimations = {
    happy: { rotate: [0, 5, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 } },
    encouraging: { y: [0, -5, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 } },
    celebrating: {
      scale: [1, 1.1, 1],
      rotate: [0, 10, -10, 0],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.8 },
    },
    thinking: { rotate: [0, -3, 3, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 3 } },
    excited: { y: [0, -10, 0], transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.6 } },
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div className={`${sizeClasses[size]} relative`} animate={moodAnimations[mood]}>
        {/* Mascot body - friendly colorful owl character */}
        <div className="relative w-full h-full">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          />

          {/* Main owl body - gradient purple to teal */}
          <div className="relative w-full h-full bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            {/* Owl face features */}
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {/* Eyes - big and friendly */}
              <div className="flex gap-2 mb-1">
                <motion.div
                  className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"
                  animate={{ scale: [1, 0.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatDelay: 2 }}
                >
                  <div className="w-2 h-2 bg-foreground rounded-full" />
                </motion.div>
                <motion.div
                  className="w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md"
                  animate={{ scale: [1, 0.1, 1] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 3, repeatDelay: 2 }}
                >
                  <div className="w-2 h-2 bg-foreground rounded-full" />
                </motion.div>
              </div>

              {/* Beak - small orange triangle */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-secondary" />

              {/* Cheek blush marks */}
              <div className="absolute left-2 top-1/2 w-3 h-2 bg-secondary/40 rounded-full" />
              <div className="absolute right-2 top-1/2 w-3 h-2 bg-secondary/40 rounded-full" />
            </div>

            {/* Sparkle effects */}
            {mood === "celebrating" && (
              <>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360, scale: [0, 1, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                >
                  <Star className="w-5 h-5 text-secondary fill-secondary drop-shadow-lg" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -left-2"
                  animate={{ rotate: -360, scale: [0, 1, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 0.5 }}
                >
                  <Sparkles className="w-5 h-5 text-accent drop-shadow-lg" />
                </motion.div>
                <motion.div
                  className="absolute top-0 left-0"
                  animate={{ rotate: 180, scale: [0, 1, 0] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, delay: 1 }}
                >
                  <Heart className="w-4 h-4 text-primary fill-primary drop-shadow-lg" />
                </motion.div>
              </>
            )}

            {mood === "encouraging" && (
              <motion.div
                className="absolute -top-1 right-1/4"
                animate={{ y: [-5, -10, -5], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              >
                <Sparkles className="w-4 h-4 text-secondary drop-shadow-lg" />
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Message bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card px-4 py-2 rounded-2xl shadow-lg border-2 border-primary/30 max-w-xs text-center"
        >
          <p className="text-sm font-medium text-foreground">{message}</p>
        </motion.div>
      )}
    </div>
  )
}
