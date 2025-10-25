"use client"

import { motion } from "framer-motion"
import { Trophy, Star, BookOpen, TrendingUp, Sparkles, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Mascot from "@/components/mascot"
import { mockSessionData } from "@/lib/mock-data"

interface CompletionScreenProps {
  onPlayAgain: () => void
}

export default function CompletionScreen({ onPlayAgain }: CompletionScreenProps) {
  const { wordsRead, newWordsLearned, readingTime, accuracy, struggledWords, confidenceScore } = mockSessionData

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Celebration Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center space-y-6"
        >
          <Mascot mood="celebrating" size="lg" message="Amazing job! You did it!" />

          <div className="space-y-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex justify-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg">
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">Story Complete!</h1>
            <p className="text-lg text-muted-foreground">You're becoming a better reader every day!</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="border-2 border-primary/30 bg-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Words Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{wordsRead}</p>
              <p className="text-sm text-foreground/70 mt-1">in {readingTime}</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/30 bg-accent/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <Star className="w-4 h-4" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-accent">{accuracy}%</p>
              <Progress value={accuracy} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/30 bg-secondary/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                New Words
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-secondary">{newWordsLearned}</p>
              <p className="text-sm text-foreground/70 mt-1">learned today</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Today's Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Great Accuracy!</p>
                    <p className="text-sm text-muted-foreground">You read {accuracy}% of words correctly</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Word Master!</p>
                    <p className="text-sm text-muted-foreground">Learned {newWordsLearned} new words</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Speed Reader!</p>
                    <p className="text-sm text-muted-foreground">Finished in {readingTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                    <span className="text-2xl">💪</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Confidence Boost!</p>
                    <p className="text-sm text-muted-foreground">{confidenceScore}% confidence score</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Words to Practice */}
        {struggledWords.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Words to Practice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  These words were a bit tricky. Let's practice them next time!
                </p>
                <div className="flex flex-wrap gap-2">
                  {struggledWords.map((word, index) => (
                    <Badge key={index} variant="secondary" className="text-base px-4 py-2">
                      {word}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <Button size="lg" onClick={onPlayAgain} className="text-lg px-8">
            <RotateCcw className="w-5 h-5 mr-2" />
            Read Another Story
          </Button>
        </motion.div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6">
              <p className="text-lg font-medium text-foreground">
                "Every book you read makes you a stronger reader. Keep up the amazing work!"
              </p>
              <p className="text-sm text-muted-foreground mt-2">- Your ReadBuddy Team</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
