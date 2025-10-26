"use client"

import { useState } from "react"
import OnboardingScreen from "@/components/onboarding-screen"
import LoginForm from "@/components/login-form"
import StorySelectionScreen from "@/components/story-selection-screen"
import ReadingScreen from "@/components/reading-screen"
import CompletionScreen from "@/components/completion-screen"
import DashboardScreen from "@/components/dashboard-screen"

type Screen = "onboarding" | "login" | "story-selection" | "reading" | "completion" | "dashboard"

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login")
  const [selectedStory, setSelectedStory] = useState<any>(null)
  const [userAge, setUserAge] = useState<number>(7)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [sessionData, setSessionData] = useState<any>(null)
  const [userData, setUserData] = useState<{
    username: string
    password: string
    age: number
    userType: "teacher" | "student"
  } | null>(null)

  const handleOnboardingComplete = (age: number) => {
    setUserAge(age)
    setCurrentScreen("story-selection")
  }

  const handleLogin = (loginData: {
    username: string
    password: string
    age: number
    userType: "teacher" | "student"
  }) => {
    setUserData(loginData)
    setUserAge(loginData.age)
    
    if (loginData.userType === "teacher") {
      setCurrentScreen("dashboard")
    } else {
      setCurrentScreen("story-selection")
    }
  }

  const handleShowLogin = () => {
    setCurrentScreen("login")
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

  const handleBackToLogin = () => {
    setCurrentScreen("login")
  }

  const handleBackToStorySelection = () => {
    setCurrentScreen("story-selection")
  }

  return (
    <main className="min-h-screen bg-background">
      {currentScreen === "onboarding" && (
        <OnboardingScreen 
          onComplete={handleOnboardingComplete} 
          onDashboard={handleDashboard}
          onLogin={handleShowLogin}
        />
      )}
      {currentScreen === "login" && (
        <LoginForm 
          onLogin={handleLogin} 
        />
      )}
      {currentScreen === "story-selection" && (
        <StorySelectionScreen userAge={userAge} onStorySelect={handleStorySelect} onBack={handleBackToLogin} />
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
      {currentScreen === "dashboard" && <DashboardScreen onBack={() => setCurrentScreen("login")} />}
    </main>
  )
}
