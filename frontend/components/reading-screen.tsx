"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, ThumbsUp, Sparkles, ArrowRight, ArrowLeft, Volume2, X, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Mascot from "@/components/mascot"

interface ReadingScreenProps {
  story: any
  onComplete: () => void
  onBack: () => void
  isDemoMode?: boolean
}

export default function ReadingScreen({ story, onComplete, onBack, isDemoMode = false }: ReadingScreenProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [showIntervention, setShowIntervention] = useState(false)
  const [interventionType, setInterventionType] = useState<"stuck" | "encouragement" | "hint">("stuck")
  const [wordsRead, setWordsRead] = useState(0)
  const [struggledWords, setStruggledWords] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null)
  const [showSentenceHelp, setShowSentenceHelp] = useState(false)

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

  const handlePreviousSentence = () => {
    if (currentSentenceIndex > 0) {
      setShowIntervention(false)
      setCurrentSentenceIndex((prev) => prev - 1)
    }
  }

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
    setShowSentenceHelp(true)
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

  const getSimpleExplanation = (sentence: string): string => {
    const lowerSentence = sentence.toLowerCase()

    // Story-specific contextual explanations
    if (lowerSentence.includes("sam") && lowerSentence.includes("explorer")) {
      return "Sam is a person who likes to go on adventures and discover new things. This sentence tells us about Sam starting a journey."
    } else if (lowerSentence.includes("backyard") && lowerSentence.includes("mysterious")) {
      return "The backyard is the area behind a house. Something mysterious means it's interesting and makes you want to learn more about it."
    } else if (lowerSentence.includes("discovered") || lowerSentence.includes("found")) {
      return "When you discover or find something, it means you see it for the first time. It's like finding a hidden treasure!"
    } else if (lowerSentence.includes("glowing") || lowerSentence.includes("shining")) {
      return "When something glows or shines, it gives off light. Like how a flashlight lights up in the dark!"
    } else if (lowerSentence.includes("carefully") || lowerSentence.includes("slowly")) {
      return "Doing something carefully means taking your time and being very gentle. Like when you carry something special so you don't drop it."
    } else if (lowerSentence.includes("wondered") || lowerSentence.includes("thought")) {
      return "When you wonder about something, you're asking yourself questions. Like when you see clouds and think about what shapes they look like."
    } else if (
      lowerSentence.includes("beautiful") ||
      lowerSentence.includes("amazing") ||
      lowerSentence.includes("magnificent")
    ) {
      return "This word describes something that looks really, really nice. So nice that it makes you smile and feel happy inside!"
    } else if (lowerSentence.includes("decided") || lowerSentence.includes("chose")) {
      return "When you decide or choose something, you think about your options and pick what you want to do. Like choosing your favorite ice cream flavor!"
    } else if (lowerSentence.includes("friends") && lowerSentence.includes("festival")) {
      return "A festival is a special celebration where people come together to have fun. Friends are people who care about each other and like spending time together."
    } else if (lowerSentence.includes("excited") || lowerSentence.includes("happy")) {
      return "This describes a feeling when something good is happening. It's like how you feel on your birthday or when you're going somewhere fun!"
    } else if (lowerSentence.includes("telescope") || lowerSentence.includes("stars")) {
      return "A telescope is a special tool that makes faraway things look closer. People use it to look at stars, planets, and the moon in the night sky."
    } else if (lowerSentence.includes("disappeared") || lowerSentence.includes("missing")) {
      return "When something disappears or goes missing, it means you can't find it anymore. It was there before, but now it's gone somewhere."
    } else if (lowerSentence.includes("investigate") || lowerSentence.includes("search")) {
      return "To investigate or search means to look carefully for clues to solve a mystery. Like being a detective trying to figure out what happened!"
    } else if (lowerSentence.includes("community") || lowerSentence.includes("neighborhood")) {
      return "A community or neighborhood is a group of people who live near each other. They help each other and work together to make their area a nice place to live."
    } else if (lowerSentence.includes("responsible") || lowerSentence.includes("responsibility")) {
      return "Being responsible means you take care of things you're supposed to do. Like feeding your pet or cleaning your room when asked."
    } else if (lowerSentence.includes("proud") || lowerSentence.includes("accomplished")) {
      return "Feeling proud means you feel really good about something you did. Like when you work hard on something and it turns out great!"
    } else {
      return "This sentence tells us what's happening in the story. Let's read each word together and figure out what it means!"
    }
  }

  const getWordDefinition = (word: string): string => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "")

    // Simple definitions for common challenging words
    const definitions: { [key: string]: string } = {
      explorer: "A person who travels to new places to discover things",
      adventure: "An exciting experience or journey",
      mysterious: "Something that is hard to understand or explain",
      discovered: "Found something for the first time",
      magnificent: "Very beautiful or impressive",
      carefully: "Doing something with a lot of attention",
      wondered: "Thought about something or asked yourself a question",
      telescope: "A tool that helps you see things that are far away, like stars",
      astronomer: "A scientist who studies stars and planets",
      observatory: "A building where scientists look at stars",
      community: "A group of people who live in the same area",
      responsibilities: "Things you need to do or take care of",
      atmosphere: "The feeling or mood of a place",
      disappeared: "Went away and could not be found",
      investigate: "To try to find out what happened",
      suspicious: "Something that makes you think something wrong happened",
    }

    return definitions[cleanWord] || "A word in our story"
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
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Stories
                </Button>
                <h2 className="text-lg font-semibold text-foreground">{story.title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Page</span>
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-lg rounded-md border border-primary/20">
                  {currentSentenceIndex + 1}
                </span>
                <span className="text-muted-foreground">/</span>
                <span className="px-3 py-1 bg-muted text-muted-foreground font-bold text-lg rounded-md">
                  {story.content.length}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </motion.header>

      {/* Main Reading Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-8">
          <motion.div
            key={`page-${currentSentenceIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border-2 border-primary/20 rounded-full shadow-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                Page {currentSentenceIndex + 1} of {story.content.length}
              </span>
            </div>
          </motion.div>

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

          <AnimatePresence>
            {showSentenceHelp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
                onClick={() => setShowSentenceHelp(false)}
              >
                <Card
                  className="border-2 border-primary bg-card max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardContent className="p-6 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <h3 className="text-xl font-bold text-primary">Let's Break It Down!</h3>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setShowSentenceHelp(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Original Sentence */}
                    <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground mb-2">The sentence:</p>
                      <p className="text-lg font-medium text-foreground leading-relaxed">{currentSentence}</p>
                    </div>

                    {/* Simple Explanation */}
                    <div className="p-4 bg-accent/10 rounded-lg border-2 border-accent/30">
                      <p className="text-sm font-medium text-muted-foreground mb-2">What does it mean?</p>
                      <p className="text-base text-foreground leading-relaxed">
                        {getSimpleExplanation(currentSentence)}
                      </p>
                    </div>

                    {/* Word Breakdown */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Let's look at each word:</p>
                      <div className="space-y-3">
                        {currentSentence.split(" ").map((word: string, index: number) => {
                          const cleanWord = word.replace(/[^a-zA-Z]/g, "")
                          if (cleanWord.length < 2) return null

                          return (
                            <div key={index} className="p-3 bg-background rounded-lg border border-border">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg font-bold text-primary">{word}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                      onClick={() => playPronunciation(cleanWord)}
                                    >
                                      <Volume2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  <div className="flex gap-1 flex-wrap mb-2">
                                    {getSyllables(cleanWord).map((syllable, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-accent/20 text-accent text-sm font-medium rounded border border-accent/30"
                                      >
                                        {syllable}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{getWordDefinition(word)}</p>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mascot Encouragement */}
                    <div className="flex justify-center pt-4">
                      <Mascot
                        mood="encouraging"
                        message="You're doing great! Take your time and sound out each word."
                      />
                    </div>

                    <Button size="lg" className="w-full" onClick={() => setShowSentenceHelp(false)}>
                      Got it! Let's keep reading
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" onClick={handlePreviousSentence} disabled={currentSentenceIndex === 0}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
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
