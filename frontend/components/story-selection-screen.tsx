"use client"

import { motion } from "framer-motion"
import { BookOpen, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Mascot from "@/components/mascot"
import { stories } from "@/lib/mock-data"

interface StorySelectionScreenProps {
  userAge: number
  onStorySelect: (story: any) => void
  onDashboard: () => void
}

export default function StorySelectionScreen({ userAge, onStorySelect, onDashboard }: StorySelectionScreenProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-success/10 text-success border-success/20"
      case "just-right":
        return "bg-primary/10 text-primary border-primary/20"
      case "challenge":
        return "bg-secondary/10 text-secondary border-secondary/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Easy"
      case "just-right":
        return "Just Right"
      case "challenge":
        return "Challenge"
      default:
        return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-card border-b border-border sticky top-0 z-10 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Choose Your Story</h1>
                <p className="text-sm text-muted-foreground">Pick a story that looks fun to you!</p>
              </div>
            </div>
            <Button variant="outline" onClick={onDashboard}>
              Dashboard
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Mascot Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Mascot mood="encouraging" message="Choose any story you like! I'll be here to help you read it." />
        </motion.div>

        {/* Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 cursor-pointer group">
                <CardHeader className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={story.thumbnail || "/placeholder.svg?height=200&width=300"}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl text-balance">{story.title}</CardTitle>
                      <Badge variant="outline" className="shrink-0">
                        Level {story.level}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(story.difficulty)}>
                        {getDifficultyLabel(story.difficulty)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{story.wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{story.estimatedTime}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{story.content[0]}</p>

                  <Button className="w-full" onClick={() => onStorySelect(story)}>
                    Start Reading
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Reading Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Reading Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <span className="text-lg">📗</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Easy</p>
                    <p className="text-sm text-muted-foreground">Great for building confidence</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg">📘</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Just Right</p>
                    <p className="text-sm text-muted-foreground">Perfect for learning new words</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-lg">📙</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Challenge</p>
                    <p className="text-sm text-muted-foreground">Push yourself to grow</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
