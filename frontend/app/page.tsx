"use client"

import { useState } from "react"
import OnboardingScreen from "@/components/onboarding-screen"
import StorySelectionScreen from "@/components/story-selection-screen"
import ReadingScreen from "@/components/reading-screen"
import CompletionScreen from "@/components/completion-screen"
import DashboardScreen from "@/components/dashboard-screen"

type Screen = "onboarding" | "story-selection" | "reading" | "completion" | "dashboard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding")
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [userAge, setUserAge] = useState<number>(7)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [sessionData, setSessionData] = useState<any>(null)

  const handleOnboardingComplete = (age: number) => {
    setUserAge(age)
    setCurrentScreen("story-selection")
  }

  const handleStorySelect = (story: any) => {
    setSelectedStory(story)
    setCurrentScreen("reading")
  }

  const handleReadingComplete = (data: any) => {
    setSessionData(data)
    setCurrentScreen("completion")
  }

  const handlePlayAgain = () => {
    setCurrentScreen("story-selection")
  }

  const handleDashboard = () => {
    setCurrentScreen("dashboard")
  }

  const handleBackToOnboarding = () => {
    setCurrentScreen("onboarding")
  }

  const handleBackToStorySelection = () => {
    setCurrentScreen("story-selection")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "onboarding" && (
        <OnboardingScreen onComplete={handleOnboardingComplete} onDashboard={handleDashboard} />
      )}
      {currentScreen === "story-selection" && (
        <StorySelectionScreen userAge={userAge} onStorySelect={handleStorySelect} onBack={handleBackToOnboarding} />
      )}
      {currentScreen === "reading" && selectedStory && (
        <ReadingScreen
          story={selectedStory}
          onComplete={handleReadingComplete}
          onBack={handleBackToStorySelection}
          isDemoMode={isDemoMode}
        />
      )}
      {currentScreen === "completion" && <CompletionScreen onPlayAgain={handlePlayAgain} sessionData={sessionData} />}
      {currentScreen === "dashboard" && <DashboardScreen onBack={() => setCurrentScreen("onboarding")} />}
    </main>
  )
}
