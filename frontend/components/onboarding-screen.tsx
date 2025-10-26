"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Mascot from "@/components/mascot"

interface OnboardingScreenProps {
  onComplete: (age: number) => void
  onDashboard: () => void
}

export default function OnboardingScreen({ onComplete, onDashboard }: OnboardingScreenProps) {
  const [step, setStep] = useState<"welcome" | "age" | "calibration">("welcome")
  const [selectedAge, setSelectedAge] = useState<number>(7)
  const [calibrationProgress, setCalibrationProgress] = useState(0)

  const handleAgeSelect = (age: number) => {
    setSelectedAge(age)
  }

  const handleStartCalibration = () => {
    // Skip calibration step and go directly to completion
    onComplete(selectedAge)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Step */}
        {step === "welcome" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8">
            <Mascot mood="excited" size="lg" message="Hi! I'm ReadBuddy! Let's learn to read together!" />

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">
                Welcome to <span className="text-primary">ReadBuddy</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-xl mx-auto">
                Your friendly AI reading tutor that helps you become a confident reader through fun stories and
                personalized coaching!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-lg">Fun Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Read exciting stories at your own pace</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader>
                  <Sparkles className="w-8 h-8 text-accent mx-auto mb-2" />
                  <CardTitle className="text-lg">AI Coaching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Get help exactly when you need it</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardHeader>
                  <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
                  <CardTitle className="text-lg">Track Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">See how much you're improving</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setStep("age")} className="text-lg px-8">
                Let's Get Started!
              </Button>
              <Button size="lg" variant="outline" onClick={onDashboard} className="text-lg px-8 bg-transparent">
                Teacher Dashboard
              </Button>
            </div>
          </motion.div>
        )}

        {/* Age Selection Step */}
        {step === "age" && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <Mascot mood="happy" message="How old are you?" />
                <CardTitle className="text-2xl mt-4">Tell me about yourself</CardTitle>
                <CardDescription>This helps me choose the perfect stories for you!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup
                  value={selectedAge.toString()}
                  onValueChange={(val) => handleAgeSelect(Number.parseInt(val))}
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[5, 6, 7, 8, 9, 10].map((age) => (
                      <Label
                        key={age}
                        htmlFor={`age-${age}`}
                        className={`flex items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedAge === age
                            ? "border-primary bg-primary/10 shadow-md"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={age.toString()} id={`age-${age}`} className="sr-only" />
                        <span className="text-2xl font-bold">{age} years</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>

                <div className="flex gap-4 justify-center pt-4">
                  <Button variant="outline" onClick={() => setStep("welcome")}>
                    Back
                  </Button>
                  <Button size="lg" onClick={handleStartCalibration} className="px-8">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Calibration Step */}
        {step === "calibration" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <Mascot mood="thinking" size="lg" />
                <CardTitle className="text-2xl mt-4">Setting up your reading experience</CardTitle>
                <CardDescription>Just a moment while I prepare everything for you...</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Calibrating AI coach</span>
                    <span>{calibrationProgress}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${calibrationProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl mb-1">📚</div>
                    <p className="text-sm font-medium">Loading stories</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl mb-1">🤖</div>
                    <p className="text-sm font-medium">Preparing AI coach</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="text-2xl mb-1">✨</div>
                    <p className="text-sm font-medium">Personalizing experience</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
