"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, ThumbsUp, Sparkles, ArrowRight, Volume2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Mascot from "@/components/mascot"

interface ReadingScreenProps {
  story: any
  onComplete: () => void
  isDemoMode?: boolean
}

export default function ReadingScreen({ story, onComplete, isDemoMode = false }: ReadingScreenProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [showIntervention, setShowIntervention] = useState(false)
  const [interventionType, setInterventionType] = useState<"stuck" | "encouragement" | "hint">("stuck")
  const [wordsRead, setWordsRead] = useState(0)
  const [struggledWords, setStruggledWords] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null)

  const currentSentence = story.content[currentSentenceIndex]
  const progress = ((currentSentenceIndex + 1) / story.content.length) * 100

  // Simulate AI detection of reading struggles
  useEffect(() => {
    if (isDemoMode && currentSentenceIndex > 0 && currentSentenceIndex % 3 === 0) {
      const timer = setTimeout(() => {
        setInterventionType(currentSentenceIndex % 2 === 0 ? "stuck" : "encouragement")
        setShowIntervention(true)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [currentSentenceIndex, isDemoMode])

  const handleNextSentence = () => {
    setShowIntervention(false)
    const words = currentSentence.split(" ").length
    setWordsRead((prev) => prev + words)

    if (currentSentenceIndex < story.content.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const handleHelpRequest = () => {
    setInterventionType("hint")
    setShowIntervention(true)
  }

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setSelectedWord(word)
    setWordPosition({ x: rect.left + rect.width / 2, y: rect.top })
  }

  const playPronunciation = (word: string) => {
    // In a real app, this would use Web Speech API or audio files
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.rate = 0.7 // Slower for learning
    window.speechSynthesis.speak(utterance)
  }

  const getSyllables = (word: string): string[] => {
    // Simple syllable breakdown (in real app, use a proper library)
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")
    // Basic syllable patterns
    const syllables = cleanWord.match(/[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi) || [cleanWord]
    return syllables
  }

  const getInterventionMessage = () => {
    switch (interventionType) {
      case "stuck":
        return "I noticed you paused. Would you like me to help with this word?"
      case "encouragement":
        return "You're doing great! Keep going!"
      case "hint":
        return "Let's sound it out together: Try breaking the word into smaller parts."
      default:
        return "I'm here to help!"
    }
  }

  const getMascotMood = () => {
    switch (interventionType) {
      case "stuck":
        return "thinking"
      case "encouragement":
        return "celebrating"
      case "hint":
        return "encouraging"
      default:
        return "happy"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      {/* Progress Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{story.title}</h2>
              <span className="text-sm text-muted-foreground">
                {currentSentenceIndex + 1} / {story.content.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </motion.header>

      {/* Main Reading Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          {/* Reading Text */}
          <motion.div
            key={currentSentenceIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-8 md:p-12">
                <p className="text-2xl md:text-4xl font-medium text-foreground reading-text leading-relaxed">
                  {currentSentence.split(" ").map((word: string, index: number) => (
                    <span key={index}>
                      <span
                        className="cursor-pointer hover:text-primary hover:underline decoration-2 decoration-primary/50 transition-colors"
                        onClick={(e) => handleWordClick(word, e)}
                      >
                        {word}
                      </span>
                      {index < currentSentence.split(" ").length - 1 && " "}
                    </span>
                  ))}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {selectedWord && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedWord(null)}
              >
                <Card
                  className="border-2 border-primary bg-card max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-primary">{selectedWord}</h3>
                      <Button size="sm" variant="ghost" onClick={() => setSelectedWord(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Syllable Breakdown */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-muted-foreground mb-2">Break it down:</p>
                      <div className="flex gap-2 flex-wrap">
                        {getSyllables(selectedWord).map((syllable, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-accent/20 text-accent font-bold text-xl rounded-lg border-2 border-accent/30"
                          >
                            {syllable}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pronunciation Button */}
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        playPronunciation(selectedWord)
                      }}
                    >
                      <Volume2 className="w-5 h-5 mr-2" />
                      Hear it pronounced
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                      Click any word in the story to get help!
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Intervention */}
          <AnimatePresence>
            {showIntervention && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="flex justify-center"
              >
                <Card className="border-2 border-primary bg-primary/5 max-w-md">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4 text-center">
                      <Mascot mood={getMascotMood()} message={getInterventionMessage()} />
                      <div className="flex gap-2">
                        {interventionType === "stuck" && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => setShowIntervention(false)}>
                              I got it!
                            </Button>
                            <Button size="sm" onClick={handleHelpRequest}>
                              <Lightbulb className="w-4 h-4 mr-2" />
                              Help me
                            </Button>
                          </>
                        )}
                        {interventionType === "encouragement" && (
                          <Button size="sm" onClick={() => setShowIntervention(false)}>
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Thanks!
                          </Button>
                        )}
                        {interventionType === "hint" && (
                          <Button size="sm" onClick={() => setShowIntervention(false)}>
                            Got it!
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={handleHelpRequest}>
              <Lightbulb className="w-5 h-5 mr-2" />
              Need Help
            </Button>
            <Button size="lg" onClick={handleNextSentence} className="px-8">
              {currentSentenceIndex < story.content.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Finish
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Reading Stats */}
          <div className="flex justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{wordsRead}</p>
              <p className="text-sm text-muted-foreground">Words Read</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{Math.round(progress)}%</p>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>

          {/* Hint about clicking words */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">💡 Click any word to hear how it sounds!</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
