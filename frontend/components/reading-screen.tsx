"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, ThumbsUp, Sparkles, ArrowRight, ArrowLeft, Volume2, X, BookOpen, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Mascot from "@/components/mascot"
import GazeOverlay from "@/components/gaze-overlay"
import CameraFeed from "@/components/camera-feed"
import { useGazeTracking } from "@/lib/useGazeTracking"

interface ReadingSessionData {
  wordsRead: number
  struggledWords: string[]
  readingTime: string
  topGazedWords: Array<{ word: string; time: number }>
}

interface ReadingScreenProps {
  story: any
  onComplete: (sessionData: ReadingSessionData) => void
  onBack: () => void
  isDemoMode?: boolean
}

export default function ReadingScreen({ story, onComplete, onBack, isDemoMode = false }: ReadingScreenProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0)
  const [showIntervention, setShowIntervention] = useState(false)
  const [interventionType, setInterventionType] = useState<"stuck" | "encouragement" | "hint">("stuck")
  const [completedSentences, setCompletedSentences] = useState<Set<number>>(new Set())
  const [struggledWords, setStruggledWords] = useState<string[]>([])
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [wordPosition, setWordPosition] = useState<{ x: number; y: number } | null>(null)
  const [showSentenceHelp, setShowSentenceHelp] = useState(false)
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [showCameraFeed, setShowCameraFeed] = useState(false)
  const [wordPositions, setWordPositions] = useState<Array<{ word: string; x: number; y: number; width: number; height: number }>>([])
  const [wordGazeTime, setWordGazeTime] = useState<Map<string, number>>(new Map())
  const [currentGazedWord, setCurrentGazedWord] = useState<string | null>(null)
  const [lastGazeUpdate, setLastGazeUpdate] = useState<number>(Date.now())
  
  // Gaze tracking
  const { isTracking, gazeData, error, startTracking, stopTracking } = useGazeTracking()

  const currentSentence = story.content[currentSentenceIndex]
  const progress = ((currentSentenceIndex + 1) / story.content.length) * 100
  
  // Get top 5 most gazed words
  const getTopGazedWords = useCallback(() => {
    const wordArray = Array.from(wordGazeTime.entries())
      .map(([word, time]) => ({ word, time }))
      .sort((a, b) => b.time - a.time)
      .slice(0, 5)
    
    return wordArray
  }, [wordGazeTime])
  
  // Calculate total words read based on completed sentences
  const wordsRead = Array.from(completedSentences).reduce((total, sentenceIndex) => {
    return total + story.content[sentenceIndex].split(" ").length
  }, 0)

  const handlePreviousSentence = useCallback(() => {
    if (currentSentenceIndex > 0) {
      setShowIntervention(false)
      setCurrentSentenceIndex((prev) => prev - 1)
    }
  }, [currentSentenceIndex])

  const handleNextSentence = useCallback(async () => {
    setShowIntervention(false)
    // Mark current sentence as completed
    const newCompletedSentences = new Set([...completedSentences, currentSentenceIndex])
    setCompletedSentences(newCompletedSentences)

    // Start gaze tracking when beginning to read
    if (currentSentenceIndex === 0 && !isTracking) {
      try {
        await startTracking()
        setShowCameraFeed(true)
      } catch (err) {
        console.warn('Failed to start gaze tracking:', err)
      }
    }

    if (currentSentenceIndex < story.content.length - 1) {
      setCurrentSentenceIndex((prev) => prev + 1)
    } else {
      // Stop gaze tracking when finishing
      if (isTracking) {
        try {
          await stopTracking()
          setShowCameraFeed(false)
        } catch (err) {
          console.warn('Failed to stop gaze tracking:', err)
        }
      }
      
      // Calculate final session data
      const finalWordsRead = Array.from(newCompletedSentences).reduce((total, sentenceIndex) => {
        return total + story.content[sentenceIndex].split(" ").length
      }, 0)
      
      const endTime = new Date()
      const readingDurationMs = endTime.getTime() - startTime.getTime()
      const readingMinutes = Math.round(readingDurationMs / (1000 * 60))
      const readingTime = readingMinutes > 0 ? `${readingMinutes} min${readingMinutes === 1 ? '' : 's'}` : "< 1 min"

      const sessionData: ReadingSessionData = {
        wordsRead: finalWordsRead,
        struggledWords: struggledWords,
        readingTime: readingTime,
        topGazedWords: getTopGazedWords()
      }

      onComplete(sessionData)
    }
  }, [currentSentenceIndex, story.content.length, story.content, completedSentences, struggledWords, startTime, onComplete, isTracking, stopTracking, getTopGazedWords])

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

  // Handle keyboard navigation (left/right arrow keys)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't handle keyboard events when modals are open
      if (selectedWord || showSentenceHelp) {
        return
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault()
        handlePreviousSentence()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        handleNextSentence()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handlePreviousSentence, handleNextSentence, selectedWord, showSentenceHelp])

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

  // Find the closest word to gaze position
  const findClosestWord = useCallback((gazeX: number, gazeY: number): string | null => {
    if (wordPositions.length === 0) return null
    
    let closestWord = null
    let minDistance = Infinity
    
    wordPositions.forEach((wordPos) => {
      // Calculate distance from gaze to word center
      const distance = Math.sqrt(
        Math.pow(gazeX - wordPos.x, 2) + Math.pow(gazeY - wordPos.y, 2)
      )
      
      // Check if gaze is within word bounds (with some tolerance)
      const withinBounds = 
        Math.abs(gazeX - wordPos.x) <= wordPos.width / 2 + 0.05 && // 0.05 tolerance
        Math.abs(gazeY - wordPos.y) <= wordPos.height / 2 + 0.05
      
      if (withinBounds && distance < minDistance) {
        minDistance = distance
        closestWord = wordPos.word
      }
    })
    
    return closestWord
  }, [wordPositions])

  // Track gaze time on words
  const trackGazeTime = useCallback((gazedWord: string | null) => {
    const now = Date.now()
    const timeDelta = now - lastGazeUpdate
    
    if (currentGazedWord && timeDelta > 0) {
      setWordGazeTime(prev => {
        const newMap = new Map(prev)
        const currentTime = newMap.get(currentGazedWord) || 0
        newMap.set(currentGazedWord, currentTime + timeDelta)
        return newMap
      })
    }
    
    setCurrentGazedWord(gazedWord)
    setLastGazeUpdate(now)
  }, [currentGazedWord, lastGazeUpdate])

  // Calculate word positions in gaze coordinate system (0,0 is center, -0.5,-0.5 is top-left)
  const calculateWordPositions = useCallback(() => {
    const textElement = document.querySelector('.reading-text')
    if (!textElement) return []

    const words = currentSentence.split(" ")
    const positions: Array<{ word: string; x: number; y: number; width: number; height: number }> = []
    
    // Get the text container's bounds
    const containerRect = textElement.getBoundingClientRect()
    const containerCenterX = containerRect.left + containerRect.width / 2
    const containerCenterY = containerRect.top + containerRect.height / 2
    
    // Get font metrics (estimated)
    const computedStyle = window.getComputedStyle(textElement)
    const fontSize = parseFloat(String(computedStyle.fontSize || '24'))
    const lineHeight = parseFloat(String(computedStyle.lineHeight || fontSize * 1.5))
    
    // Screen dimensions for normalization
    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
    let currentX = 0
    let currentY = 0
    const wordsPerLineEstimate = Math.floor(containerRect.width / (fontSize * 5)) // Rough estimate
    
    words.forEach((word: string, index: number) => {
      // Estimate word width (rough approximation)
      const estimatedWordWidth = word.length * fontSize * 0.7
      
      // Check if we need to wrap to next line
      if (currentX > 0 && currentX + estimatedWordWidth > containerRect.width) {
        currentX = 0
        currentY += lineHeight
      }
      
      // Calculate pixel position - center of each word
      const pixelX = containerRect.left + currentX + estimatedWordWidth / 2
      const pixelY = containerRect.top + currentY + fontSize / 2
      
      // Convert to gaze coordinate system (0,0 is center, normalized to -0.5 to 0.5)
      const gazeX = (pixelX - screenWidth / 2) / screenWidth
      const gazeY = (pixelY - screenHeight / 2) / screenHeight
      
      positions.push({
        word,
        x: gazeX,
        y: gazeY,
        width: estimatedWordWidth / screenWidth,
        height: fontSize / screenHeight
      })
      
      // Move to next word position
      currentX += estimatedWordWidth + fontSize * 0.6 // Add space
    })
    
    return positions
  }, [currentSentence])

  // Update word positions when sentence changes
  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      const positions = calculateWordPositions()
      setWordPositions(positions)
      
      // Print word positions in a readable format
      console.log('=== WORD POSITIONS FOR CURRENT PAGE ===')
      console.log(`Sentence: "${currentSentence}"`)
      console.log('Word positions (x, y coordinates where 0,0 is center, -0.5,-0.5 is top-left):')
      positions.forEach((pos, index) => {
        console.log(`${index + 1}. "${pos.word}" - x: ${pos.x.toFixed(3)}, y: ${pos.y.toFixed(3)}, width: ${pos.width.toFixed(3)}, height: ${pos.height.toFixed(3)}`)
      })
      console.log('========================================')
    }, 100)
    
    return () => clearTimeout(timer)
  }, [currentSentenceIndex, calculateWordPositions, currentSentence])

  // Track gaze data and update word gaze time
  useEffect(() => {
    if (gazeData && isTracking && wordPositions.length > 0) {
      const closestWord = findClosestWord(gazeData.x, gazeData.y)
      trackGazeTime(closestWord)
    }
  }, [gazeData, isTracking, wordPositions, findClosestWord, trackGazeTime])

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

    // Comprehensive definitions for all words in our stories
    const definitions: { [key: string]: string } = {
      // Common words - Story 1: The Red Cat
      cat: "A furry animal that says 'meow'",
      red: "A bright color like a strawberry or an apple",
      sat: "To sit down",
      mat: "A small rug or floor covering",
      big: "Large in size",
      ran: "To move quickly on your feet",
      pet: "To gently touch with your hand",
      nap: "A short sleep during the day",
      tom: "A boy's name",
      
      // Story 2: Sam's Big Day
      sam: "A boy's name",
      woke: "To stop sleeping",
      smile: "A happy expression on your face",
      today: "This day, right now",
      special: "Something important or extra nice",
      jumped: "To move upward with both feet",
      bed: "Where you sleep",
      fast: "Moving quickly",
      brushed: "To clean with a brush",
      teeth: "The white bones in your mouth for chewing",
      dressed: "To put on clothes",
      mom: "A mother, a woman who takes care of children",
      pancakes: "Flat round breakfast food",
      favorite: "Something you like best",
      outside: "Out of the house or building",
      best: "The very best or most liked",
      friend: "Someone who likes you and you like them",
      waiting: "Staying until something happens",
      played: "To have fun or do activities",
      games: "Activities for fun",
      morning: "Early part of the day before noon",
      ever: "At any time",
      
      // Story 3: The Magic Garden
      emma: "A girl's name",
      found: "Discovered or came across something",
      secret: "Something hidden or not known",
      door: "An opening to go in or out",
      backyard: "The area behind a house",
      pushed: "To move something by pressing",
      open: "Not closed",
      stepped: "Took a step with your foot",
      through: "Going from one side to the other",
      inside: "In or within something",
      beautiful: "Very pretty or nice to look at",
      garden: "A place where plants and flowers grow",
      seen: "Looked at or viewed",
      flowers: "Colorful growing plants",
      every: "All of them",
      color: "The appearance of things like red, blue, green",
      bloomed: "Opened up and showed flowers",
      everywhere: "In all places",
      butterflies: "Colorful insects with wings",
      danced: "Moved to music in a rhythmic way",
      warm: "Slightly hot, comfortable temperature",
      sunshine: "Light from the sun",
      path: "A trail or way to walk",
      led: "Showed the way",
      deeper: "Farther in or down",
      wonder: "A feeling of amazement",
      eyes: "Parts of the body that let you see",
      stood: "Was standing upright",
      magnificent: "Very grand and beautiful",
      tree: "A tall plant with trunk and branches",
      leaves: "Green parts that grow on trees",
      sparkled: "Shone brightly like stars",
      stars: "Bright lights in the night sky",
      knew: "Was aware of or understood",
      place: "A location or spot",
      truly: "Really or actually",
      magical: "Having special powers or being very special",
      
      // Story 4: The Brave Little Explorer
      maya: "A girl's name",
      dreamed: "Had thoughts while sleeping or wished",
      becoming: "Growing up to be",
      discover: "To find something new",
      amazing: "Wonderful and surprising",
      places: "Locations or areas",
      nobody: "No person",
      packed: "Filled up a bag with things",
      backpack: "A bag you wear on your back",
      compass: "A tool that shows direction",
      notebook: "A book to write in",
      snacks: "Small amounts of food",
      bottle: "A container with liquid",
      water: "Clear liquid you drink",
      walked: "Moved slowly on foot",
      forest: "A large area with many trees",
      carefully: "In a cautious or attentive way",
      observing: "Watching and noticing",
      tall: "High in height",
      trees: "Large plants with trunks and branches",
      colorful: "Having many colors",
      birds: "Animals with wings that can fly",
      interesting: "Catching your attention",
      insects: "Small animals like bugs",
      along: "Following the side of something",
      way: "A path or direction",
      walking: "Moving on foot",
      felt: "Seemed like",
      hours: "Units of time (60 minutes each)",
      sparkling: "Shining and glittering",
      stream: "A small river or moving water",
      wound: "Twisted or curved",
      mossy: "Covered with soft green plant",
      rocks: "Hard stones",
      ferns: "Green leafy plants",
      followed: "Went after someone or something",
      upstream: "In the direction water comes from",
      wondering: "Thinking about or curious",
      came: "Arrived from",
      might: "Could possibly",
      reveal: "To show or make known",
      suddenly: "All at once, unexpectedly",
      heard: "Perceived sound with ears",
      strange: "Unusual or unfamiliar",
      coming: "Approaching or moving toward",
      large: "Big in size",
      boulder: "A very large rock",
      covered: "Having something on top",
      soft: "Easy to press, not hard",
      green: "Color of grass or leaves",
      moss: "Soft green plant that grows on rocks",
      climbed: "Moved upward using hands and feet",
      over: "Above or on top of",
      cave: "A hollow space in rock or ground",
      entrance: "The way to go in",
      seemed: "Appeared to be",
      glow: "To give off light",
      mysterious: "Hard to understand or explain",
      golden: "Color of gold, bright yellow",
      taking: "Getting or grabbing",
      deep: "Far down or in",
      breath: "Air you breathe in and out",
      calm: "Peaceful and relaxed",
      nerves: "Feelings of worry or anxiety",
      gasped: "Drew in breath quickly in surprise",
      walls: "Sides of buildings or caves",
      crystals: "Beautiful clear minerals",
      diamonds: "Very valuable clear stones",
      sunlight: "Light from the sun",
      streaming: "Flowing or shining continuously",
      cracks: "Small openings or breaks",
      ceiling: "The top inside of a room or cave",
      wrote: "Made marks with a pen or pencil",
      everything: "All things",
      down: "Toward a lower position",
      knowing: "Being aware or understanding",
      incredible: "Amazing and unbelievable",
      remember: "To keep in your mind",
      forever: "For all time, always",
      
      // Story 5: The Fun Friendship Festival
      year: "A period of 365 days",
      small: "Little in size",
      town: "A small community",
      willowbrook: "The name of a town",
      gathered: "Came together",
      together: "With each other",
      celebrate: "To have a party or special event",
      festival: "A celebration with activities and fun",
      event: "A happening or occasion",
      brought: "Carried or caused to come",
      closer: "Nearer to each other",
      twins: "Two children born at the same time",
      alex: "A person's name",
      jordan: "A person's name",
      chosen: "Selected or picked",
      organize: "To plan and arrange",
      meant: "Intended to say or do",
      important: "Having great meaning or value",
      responsibilities: "Things you must take care of",
      handle: "To manage or deal with",
      started: "Began or commenced",
      creating: "Making something new",
      posters: "Large papers with pictures or words",
      hanging: "Putting up on walls",
      around: "In all directions from a point",
      take: "To occur or happen",
      suggested: "Offered an idea",
      different: "Not the same",
      activity: "Something you do",
      stations: "Places where things happen",
      including: "Having as part of",
      painting: "Putting color on something",
      balloon: "Rubber toy filled with air",
      animals: "Creatures like dogs, cats, etc",
      baking: "Cooking in an oven",
      contest: "A competition",
      musical: "Related to music",
      performances: "Shows or acts done for others",
      throughout: "All through or during",
      thought: "Considered or believed",
      wonderful: "Very nice or amazing",
      invite: "To ask someone to come",
      share: "To tell about or give to others",
      stories: "Tales or accounts of events",
      personally: "In your own way",
      transformed: "Changed completely",
      square: "A public area in the center of town",
      decorations: "Things that make something pretty",
      food: "Things to eat",
      stands: "Places that sell things",
      game: "An activity for fun",
      booths: "Small stalls or tables",
      looked: "Appeared or seemed to be",
      children: "Young people, kids",
      excitedly: "With enthusiasm and energy",
      laughter: "The sound of laughing",
      filling: "Making something full",
      air: "The invisible gas around us",
      pure: "Completely, only",
      joy: "Happiness and delight",
      happiness: "Feeling of pleasure",
      mayor: "The leader of a town or city",
      gave: "Delivered or presented",
      heartwarming: "Making you feel good inside",
      speech: "Talk given to many people",
      makes: "Causes to be",
      stronger: "More powerful or tough",
      helps: "Assists or gives aid",
      support: "To help or encourage",
      each: "Every one",
      during: "While something is happening",
      difficult: "Hard or challenging",
      times: "Periods or moments",
      began: "Started",
      set: "Went down (like the sun)",
      circle: "Round shape",
      held: "Kept in your hands",
      hands: "Body parts at the end of arms",
      sang: "Made music with your voice",
      under: "Beneath or below",
      twinkling: "Shining intermittently",
      looked2: "Gazed or stared",
      other: "Different from this one",
      smiled: "Made a happy face",
      helped: "Assisted or aided",
      memories: "Things remembered from the past",
      last: "Continue for a time",
      lifetime: "All the years you live",
      
      // Story 6: The Mystery of the Missing Telescope
      professor: "A teacher at a college",
      chen: "A last name",
      brilliant: "Very intelligent",
      astronomer: "A scientist who studies stars",
      spent: "Used time doing something",
      clear: "Not cloudy",
      night: "Dark time of day",
      studying: "Learning about",
      planets: "Large objects that orbit the sun",
      galaxies: "Huge groups of stars",
      powerful: "Very strong",
      university: "A school for higher learning",
      arrived: "Got to a place",
      prepare: "To get ready",
      evening: "Later part of the day",
      observations: "Watching and studying",
      discovered: "Found out",
      precious: "Very valuable",
      telescope: "Tool for seeing far away things",
      mysteriously: "In an unexplained way",
      without: "Not having",
      trace: "A sign or mark",
      immediately: "Right away",
      called: "Spoke to on the phone",
      assistant: "Someone who helps",
      marcus: "A person's name",
      rushed: "Went quickly",
      investigate: "To look into and try to understand",
      figure: "To understand or work out",
      possibly: "Maybe, perhaps",
      happened: "Occurred or took place",
      examined: "Looked at carefully",
      anything: "Any thing at all",
      unusual: "Not normal",
      footprints: "Marks left by feet",
      fingerprints: "Marks left by fingers",
      signs: "Indications or clues",
      broken: "Damaged and not whole",
      security: "Protection or safety",
      camera: "Device for taking pictures",
      turned: "Switched or rotated",
      exactly: "Precisely",
      midnight: "12 o'clock at night",
      suggested2: "Indicated or implied",
      planned: "Organized beforehand",
      remembered: "Thought about the past",
      working: "Doing a job or task",
      comet: "A bright object that travels through space",
      wondered2: "Was curious about",
      steal: "To take without permission",
      research: "Study and investigation",
      decided: "Made a choice",
      interview: "To ask questions",
      access: "Ability to enter or use",
      including2: "As part of the group",
      graduate: "Someone who finished school",
      students: "People who are learning",
      patrolled: "Walked around to watch",
      building: "A structure with walls",
      during2: "While something is happening",
      visiting: "Coming to see",
      scientist: "Someone who studies the world",
      another: "Different from this one",
      asking: "Requesting information",
      questions: "Inquiries or things to know",
      research2: "Studies and investigations",
      days: "Periods of 24 hours",
      before: "Earlier than",
      tracked: "Followed or traced",
      down2: "To find and catch",
      hotel: "A place to stay while traveling",
      nervously: "With worry or anxiety",
      admitted: "Said something was true",
      borrowed: "Took with permission",
      permission: "Consent or allowance",
      his: "Belonging to him",
      own: "Belonging to you",
      explanation: "A reason or clarification",
      return: "To give back",
      before2: "Earlier than",
      noticed: "Saw or became aware",
      realized: "Understood or became aware",
      wrong: "Not correct or right",
      simply: "Just or only",
      instead: "As an alternative",
      forgave: "Stopped being angry with",
      explained: "Told the meaning of",
      honesty: "Telling the truth",
      communication: "Talking and sharing information",
      scientific: "Related to science",
      worked: "Labored or collaborated",
      ensure: "To make sure",
      nothing: "Not anything",
      ever2: "At any time",
      again: "One more time",
      
      // Additional common words
      and: "In addition to",
      the: "A specific thing",
      is: "Exists or equals",
      a: "One thing",
      was: "Past tense of is",
      on: "Positioned above",
      to: "Toward or in the direction of",
      of: "Belonging to",
      with: "Accompanied by",
      for: "Intended for",
      from: "Originating at",
      he: "A male person",
      she: "A female person",
      her: "Belonging to her",
      in: "Inside of",
      at: "Located at",
      by: "Near or with",
      an: "One thing (before vowel)",
      as: "In the role of",
      had: "Past tense of have",
      have: "To own or possess",
      been: "Past participle of be",
      are: "Present tense of be (plural)",
      where: "In what location",
      what: "Which thing",
      who: "Which person",
      when: "At what time",
      why: "For what reason",
      how: "In what way"
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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col relative">
      {/* Gaze tracking overlay */}
      {gazeData && (
        <GazeOverlay 
          x={gazeData.x} 
          y={gazeData.y} 
          isVisible={isTracking} 
        />
      )}
      
      {/* Camera feed */}
      <CameraFeed
        imageData={gazeData?.image || null}
        isVisible={showCameraFeed}
        onToggle={() => setShowCameraFeed(!showCameraFeed)}
      />
      
      {/* Gaze tracking error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Gaze Tracking Error: {error}</span>
            </div>
          </div>
        </motion.div>
      )}
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
                {/* Gaze tracking status */}
                {isTracking && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-md border border-green-500/20">
                    <Eye className="w-3 h-3" />
                    <span className="text-xs font-medium">Eye Tracking</span>
                  </div>
                )}
                
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
      <div className={`flex-1 flex items-center justify-center ${story.id === 1 || story.id === 3 ? 'px-12 py-2' : 'p-4'}`}>
        <div className={`w-full space-y-8 ${story.id === 1 || story.id === 3 ? 'max-w-none' : 'max-w-4xl'}`}>
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
            {/* Picture Book Layout for The Red Cat and Magic Garden */}
            {story.id === 1 || story.id === 3 ? (
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 items-stretch w-full min-h-[400px]">
                {/* Image Section - Takes 2/7 of space on desktop for better visibility */}
                <motion.div 
                  className="order-2 lg:order-1 lg:col-span-2"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-2 border-primary/20 shadow-lg overflow-hidden h-full">
                    <CardContent className="p-0 h-full flex items-center">
                      <div className={`w-full flex items-center justify-center min-h-[300px] lg:min-h-full ${
                        story.id === 1 
                          ? 'bg-gradient-to-br from-orange-50 to-red-50' 
                          : 'bg-gradient-to-br from-green-50 to-emerald-50'
                      }`}>
                        <img
                          src={story.id === 1 
                            ? `/cat-image/cat${Math.min(currentSentenceIndex + 1, 8)}.png`
                            : `/image-garden/garden${Math.min(currentSentenceIndex + 1, 10)}.png`
                          }
                          alt={story.id === 1 
                            ? `Cat story illustration ${currentSentenceIndex + 1}`
                            : `Garden story illustration ${currentSentenceIndex + 1}`
                          }
                          className="max-w-full max-h-full object-contain p-0.5"
                          onError={(e) => {
                            // Fallback to first image if specific image doesn't exist
                            (e.target as HTMLImageElement).src = story.id === 1 
                              ? `/cat-image/cat1.png`
                              : `/image-garden/garden1.png`
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Text Section - Takes 5/7 of space on desktop for maximum width */}
                <motion.div 
                  className="order-1 lg:order-2 lg:col-span-5"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-2 border-primary/20 shadow-lg h-full">
                    <CardContent className="p-2 md:p-3 lg:p-4 h-full flex items-center min-h-[400px]">
                      <p className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-foreground reading-text leading-tight tracking-normal w-full">
                        {currentSentence.split(" ").map((word: string, index: number) => (
                          <span key={index}>
                            <span
                              className="cursor-pointer hover:text-primary hover:underline decoration-4 decoration-primary/50 transition-colors inline-block py-1 px-0.5"
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
              </div>
            ) : (
              /* Regular Layout for Other Stories */
              <Card className="border-2 border-primary/20 shadow-lg min-h-[300px]">
                <CardContent className="p-8 md:p-12 min-h-[300px] flex items-center">
                  <p className="text-2xl md:text-4xl font-medium text-foreground reading-text leading-relaxed w-full">
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
            )}
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

                    {/* Word Definition */}
                    <div className="mb-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                      <p className="text-sm font-medium text-muted-foreground mb-2">What does it mean?</p>
                      <p className="text-base text-foreground leading-relaxed">
                        {getWordDefinition(selectedWord)}
                      </p>
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
