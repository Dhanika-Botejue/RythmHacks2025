"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, User, Lock, Calendar, GraduationCap, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Mascot from "@/components/mascot"
import { signin, signup } from "@/lib/simple-auth"

interface LoginFormProps {
  onLogin: (userData: {
    username: string
    password: string
    age: number
    userType: "teacher" | "student"
  }) => void
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    age: 7,
    userType: "student" as "teacher" | "student"
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Only validate age and user type when signing up
    if (!isLogin) {
      if (formData.userType === "student" && (formData.age < 5 || formData.age > 10)) {
        newErrors.age = "Students must be between 5 and 10 years old"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      setErrors({})
      
      try {
        let response
        if (isLogin) {
          response = await signin(formData.username, formData.password)
          localStorage.setItem('auth_token', response.token)
        } else {
          response = await signup(formData.username, formData.password, formData.age, formData.userType)
          localStorage.setItem('auth_token', response.token)
        }
        
        onLogin({
          username: response.username,
          password: formData.password,
          age: response.age,
          userType: response.userType
        })
      } catch (error: any) {
        setErrors({ general: error.message || 'Authentication failed' })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardHeader className="text-center space-y-4">
              <Mascot 
                mood="excited" 
                size="lg" 
                message="Welcome to ReadBuddy! Let's start your reading journey!" 
              />
              <div>
                <CardTitle className="text-2xl">
                  Welcome to <span className="text-primary">ReadBuddy</span>
                </CardTitle>
                <CardDescription>
                  Your friendly reading assistant that helps you become a confident reader
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* General Error Display */}
              {errors.general && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`pl-10 ${errors.username ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* User Type Selection - Only show when signing up */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <Label className="text-sm font-medium">I am a:</Label>
                    <RadioGroup
                      value={formData.userType}
                      onValueChange={(value) => handleInputChange("userType", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="flex items-center gap-2 cursor-pointer">
                          <GraduationCap className="w-4 h-4" />
                          Student
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher" className="flex items-center gap-2 cursor-pointer">
                          <UserCheck className="w-4 h-4" />
                          Teacher
                        </Label>
                      </div>
                    </RadioGroup>
                  </motion.div>
                )}

                {/* Age Field - Only show when signing up and user is a student */}
                {!isLogin && formData.userType === "student" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="age" className="text-sm font-medium">
                      Age
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="age"
                        type="number"
                        min="5"
                        max="10"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 7)}
                        className={`pl-10 ${errors.age ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.age && (
                      <p className="text-sm text-red-500">{errors.age}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Students must be between 5-10 years old
                    </p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
                </Button>
              </form>

              {/* Toggle Login/Signup */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-primary hover:underline font-medium"
                  >
                    {isLogin ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
