"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Users,
  Award,
  Calendar,
  Download,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface DashboardScreenProps {
  onBack: () => void
}

// Mock data for teacher dashboard
const classStats = {
  totalStudents: 24,
  activeToday: 18,
  averageProgress: 76,
  totalBooksRead: 342,
  weeklyGrowth: 12,
}

const students = [
  {
    id: 1,
    name: "Emma Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 7,
    booksRead: 23,
    currentLevel: 3,
    accuracy: 94,
    lastActive: "2 hours ago",
    trend: "up",
    strugglingWords: ["through", "beautiful"],
  },
  {
    id: 2,
    name: "Liam Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 6,
    booksRead: 15,
    currentLevel: 2,
    accuracy: 88,
    lastActive: "1 day ago",
    trend: "up",
    strugglingWords: ["together", "special"],
  },
  {
    id: 3,
    name: "Sophia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 8,
    booksRead: 31,
    currentLevel: 4,
    accuracy: 96,
    lastActive: "3 hours ago",
    trend: "stable",
    strugglingWords: ["magnificent"],
  },
  {
    id: 4,
    name: "Noah Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 7,
    booksRead: 18,
    currentLevel: 2,
    accuracy: 82,
    lastActive: "5 hours ago",
    trend: "down",
    strugglingWords: ["breakfast", "favorite", "waiting"],
  },
  {
    id: 5,
    name: "Olivia Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    age: 6,
    booksRead: 12,
    currentLevel: 2,
    accuracy: 90,
    lastActive: "4 hours ago",
    trend: "up",
    strugglingWords: ["outside", "morning"],
  },
]

const weeklyProgressData = [
  { day: "Mon", wordsRead: 450, accuracy: 88, students: 20 },
  { day: "Tue", wordsRead: 520, accuracy: 90, students: 22 },
  { day: "Wed", wordsRead: 480, accuracy: 87, students: 19 },
  { day: "Thu", wordsRead: 610, accuracy: 92, students: 24 },
  { day: "Fri", wordsRead: 580, accuracy: 91, students: 21 },
  { day: "Sat", wordsRead: 320, accuracy: 89, students: 15 },
  { day: "Sun", wordsRead: 280, accuracy: 90, students: 12 },
]

const recentSessions = [
  {
    id: 1,
    student: "Emma Johnson",
    story: "The Magic Garden",
    duration: "12 mins",
    wordsRead: 127,
    accuracy: 94,
    timestamp: "Today, 2:30 PM",
  },
  {
    id: 2,
    student: "Liam Chen",
    story: "Sam's Big Day",
    duration: "8 mins",
    wordsRead: 85,
    accuracy: 88,
    timestamp: "Today, 1:15 PM",
  },
  {
    id: 3,
    student: "Sophia Martinez",
    story: "The Red Cat",
    duration: "6 mins",
    wordsRead: 50,
    accuracy: 98,
    timestamp: "Today, 11:45 AM",
  },
]

export default function DashboardScreen({ onBack }: DashboardScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = filterLevel === "all" || student.currentLevel.toString() === filterLevel
    return matchesSearch && matchesLevel
  })

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
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Teacher Dashboard</h1>
                <p className="text-sm text-muted-foreground">Ms. Anderson's Class - Grade 2</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{classStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success font-medium">{classStats.activeToday} active</span> today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Books Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{classStats.totalBooksRead}</div>
              <p className="text-xs text-muted-foreground mt-1">This semester</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Avg Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{classStats.averageProgress}%</div>
              <Progress value={classStats.averageProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Weekly Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">+{classStats.weeklyGrowth}%</div>
              <p className="text-xs text-muted-foreground mt-1">vs last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4" />
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">Sophia M.</div>
              <p className="text-xs text-muted-foreground mt-1">31 books, 96% accuracy</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="sessions">Recent Sessions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Activity</CardTitle>
                  <CardDescription>Words read and student participation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="wordsRead" fill="hsl(var(--primary))" name="Words Read" />
                      <Bar dataKey="students" fill="hsl(var(--accent))" name="Active Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Accuracy Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Class Accuracy Trend</CardTitle>
                  <CardDescription>Average reading accuracy over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        name="Accuracy %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Student Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Snapshot</CardTitle>
                <CardDescription>Quick view of all students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.slice(0, 5).map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Level {student.currentLevel} • {student.booksRead} books
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">{student.accuracy}%</p>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                        </div>
                        <Badge
                          variant={
                            student.trend === "up" ? "default" : student.trend === "down" ? "destructive" : "secondary"
                          }
                        >
                          {student.trend === "up" ? "↑" : student.trend === "down" ? "↓" : "→"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle>Student Directory</CardTitle>
                    <CardDescription>Manage and monitor individual student progress</CardDescription>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger className="w-32">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="1">Level 1</SelectItem>
                        <SelectItem value="2">Level 2</SelectItem>
                        <SelectItem value="3">Level 3</SelectItem>
                        <SelectItem value="4">Level 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Books Read</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Struggling Words</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                              <p className="text-xs text-muted-foreground">Age {student.age}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Level {student.currentLevel}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{student.booksRead}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{student.accuracy}%</span>
                            <Progress value={student.accuracy} className="w-16" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {student.strugglingWords.slice(0, 2).map((word, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {word}
                              </Badge>
                            ))}
                            {student.strugglingWords.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{student.strugglingWords.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{student.lastActive}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.trend === "up"
                                ? "default"
                                : student.trend === "down"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {student.trend === "up"
                              ? "↑ Improving"
                              : student.trend === "down"
                                ? "↓ Needs Help"
                                : "→ Stable"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Sessions Tab */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reading Sessions</CardTitle>
                <CardDescription>Latest activity from your students</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Story</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Words Read</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.student}</TableCell>
                        <TableCell>{session.story}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {session.duration}
                          </div>
                        </TableCell>
                        <TableCell>{session.wordsRead}</TableCell>
                        <TableCell>
                          <Badge variant={session.accuracy >= 90 ? "default" : "secondary"}>{session.accuracy}%</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{session.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Common Struggling Words</CardTitle>
                  <CardDescription>Words that need more practice across the class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["through", "together", "beautiful", "favorite", "magnificent"].map((word, idx) => (
                      <div key={word} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {idx + 1}
                          </div>
                          <span className="font-medium text-foreground">{word}</span>
                        </div>
                        <Badge variant="secondary">{Math.floor(Math.random() * 8) + 3} students</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>AI-powered insights for your class</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border-l-4 border-primary bg-primary/5">
                      <h4 className="font-semibold text-foreground mb-1">Focus on Phonics</h4>
                      <p className="text-sm text-muted-foreground">
                        4 students are struggling with "th" sounds. Consider a group phonics session.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border-l-4 border-success bg-success/5">
                      <h4 className="font-semibold text-foreground mb-1">Great Progress!</h4>
                      <p className="text-sm text-muted-foreground">
                        Class accuracy improved by 5% this week. Keep up the excellent work!
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border-l-4 border-secondary bg-secondary/5">
                      <h4 className="font-semibold text-foreground mb-1">Check In Needed</h4>
                      <p className="text-sm text-muted-foreground">
                        Noah Williams hasn't been active in 2 days. Consider reaching out.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
