"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Player, type PlayerRef } from "@remotion/player"
import { ContinuousCourseComposition } from "@/components/custom/remotion/ContinuousCourseComposition"
import { CheckCircle, XCircle, HelpCircle, Award, ChevronRight, BookOpen, Star } from "lucide-react"
import { QuizSection } from "@/components/custom/QuizSection"
import { AnimatedMascot } from "@/components/custom/AnimatedMascot"
import { PointsDisplay } from "@/components/custom/PointsDisplay"
import { LeaderboardButton } from "@/components/custom/LeaderboardButton"
import { cn } from "@/lib/utils"

interface Quiz {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

interface CourseSection {
  title: string
  content: string
  key_points: string[]
  quiz: Quiz
  userAnswer?: string
  isCorrect?: boolean
}

interface CourseContent {
  title: string
  description: string
  sections: CourseSection[]
}

// Mock leaderboard data
const mockLeaderboardData = [
  { id: "1", name: "Alex Johnson", points: 1250, rank: 1 },
  { id: "2", name: "Taylor Swift", points: 980, rank: 2 },
  { id: "3", name: "Morgan Freeman", points: 875, rank: 3 },
  { id: "4", name: "Jamie Oliver", points: 720, rank: 4 },
  { id: "5", name: "Emma Watson", points: 690, rank: 5 },
  { id: "6", name: "Chris Evans", points: 645, rank: 6 },
  { id: "7", name: "Zoe Saldana", points: 590, rank: 7 },
  { id: "8", name: "Tom Holland", points: 540, rank: 8 },
  { id: "9", name: "Keanu Reeves", points: 510, rank: 9 },
  { id: "10", name: "Scarlett Johansson", points: 480, rank: 10 },
]

interface LeaderboardEntry {
  id: string
  name: string
  points: number
  rank: number
  isCurrentUser?: boolean
}

export default function VideoCoursePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedSections, setCompletedSections] = useState<number[]>([])
  const [points, setPoints] = useState(0)
  const [recentPoints, setRecentPoints] = useState(0)
  const [userRank, setUserRank] = useState(11)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    [...mockLeaderboardData, { id: "user", name: "You", points: 0, rank: 11, isCurrentUser: true }]
  )
  const [mascotBubble, setMascotBubble] = useState({
    visible: false,
    isCorrect: false,
    message: "",
  })
  const [courseContent, setCourseContent] = useState<CourseContent>({
    title: "Introduction to React Hooks",
    description: "Learn the fundamentals of React Hooks with this animated video course",
    sections: [
      {
        title: "What are React Hooks?",
        content:
          "React Hooks are functions that let you use state and other React features without writing a class component. They were introduced in React 16.8.",
        key_points: [
          "Introduced in React 16.8",
          "Allow using state in functional components",
          "Simplify complex component logic",
        ],
        quiz: {
          question: "What is the main benefit of React Hooks?",
          options: [
            "They make components render faster",
            "They allow using state in functional components",
            "They replace the need for React entirely",
            "They only work in class components",
          ],
          correct_answer: "They allow using state in functional components",
          explanation:
            "React Hooks allow functional components to use state and other React features that were previously only available in class components, making your code more concise and easier to understand.",
        },
      },
      {
        title: "useState Hook",
        content:
          "The useState hook lets you add state to functional components. It returns a stateful value and a function to update it.",
        key_points: ["Manages component state", "Returns [state, setState]", "Can be called multiple times"],
        quiz: {
          question: "What does the useState hook return?",
          options: [
            "A single state value",
            "A state value and a function to update it",
            "A function to update state",
            "A React component",
          ],
          correct_answer: "A state value and a function to update it",
          explanation:
            "The useState hook returns an array with exactly two elements: the current state value and a function that lets you update it. This is why we use array destructuring when calling useState.",
        },
      },
      {
        title: "useEffect Hook",
        content:
          "The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes.",
        key_points: ["Handles side effects", "Runs after render", "Can clean up with return function"],
        quiz: {
          question: "When does the useEffect hook run?",
          options: [
            "Before the component renders",
            "Only once when the component mounts",
            "After every render by default",
            "Only when state changes",
          ],
          correct_answer: "After every render by default",
          explanation:
            "By default, useEffect runs after the first render and after every update. You can control this behavior by passing a dependency array as the second argument.",
        },
      },
      {
        title: "useContext Hook",
        content:
          "The useContext hook accepts a context object and returns the current context value. It's a cleaner way to consume context in functional components.",
        key_points: ["Consumes React context", "Simplifies context API usage", "Updates when context changes"],
        quiz: {
          question: "What does the useContext hook do?",
          options: [
            "Creates a new context",
            "Provides context to child components",
            "Consumes and accesses context values",
            "Replaces the Context API",
          ],
          correct_answer: "Consumes and accesses context values",
          explanation:
            "The useContext hook is used to consume and access values from a React context. It provides a more concise way to access context compared to the Context.Consumer component.",
        },
      },
      {
        title: "Custom Hooks",
        content:
          "Custom hooks let you extract component logic into reusable functions. They're just JavaScript functions whose name starts with 'use' and may call other hooks.",
        key_points: ["Reuse stateful logic", "Share logic between components", "Simplify complex components"],
        quiz: {
          question: "What naming convention must custom hooks follow?",
          options: [
            "They must start with 'hook'",
            "They must start with 'use'",
            "They must end with 'Hook'",
            "There is no specific naming convention",
          ],
          correct_answer: "They must start with 'use'",
          explanation:
            "Custom hooks must start with 'use' (e.g., useFormInput, useFetch). This convention is important because it allows React to check for violations of Hooks rules and it signals that a function is a Hook.",
        },
      },
    ],
  })
  const playerRef = useRef<PlayerRef>(null)

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.addEventListener('timeupdate', (e: any) => {
        setCurrentFrame(e.detail.frame)
      })
    }
  }, [])

  const awardPoints = (amount: number) => {
    setPoints((prev) => prev + amount)
    setRecentPoints(amount)

    // Update leaderboard
    setLeaderboardData((prev) => {
      const updatedData = prev
        .map((entry) => {
          if (entry.isCurrentUser) {
            return { ...entry, points: entry.points + amount }
          }
          return entry
        })
        .sort((a, b) => b.points - a.points)

      // Recalculate ranks and update user rank
      const newData = updatedData.map((entry, i) => ({ ...entry, rank: i + 1 }))
      const newUserRank = newData.findIndex((entry) => entry.isCurrentUser) + 1
      setUserRank(newUserRank)

      return newData
    })
  }

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !courseContent) return

    const currentSection = courseContent.sections[currentSectionIndex]
    const isCorrect = selectedAnswer === currentSection.quiz.correct_answer

    // Store the answer in the course data
    const updatedContent = { ...courseContent }
    updatedContent.sections[currentSectionIndex].userAnswer = selectedAnswer
    updatedContent.sections[currentSectionIndex].isCorrect = isCorrect
    setCourseContent(updatedContent)

    if (isCorrect) {
      // Award points for correct answer
      awardPoints(25)

      if (!completedSections.includes(currentSectionIndex)) {
        setCompletedSections([...completedSections, currentSectionIndex])
        // Award additional points for completing new section
        awardPoints(10)
      }
    }

    setShowExplanation(true)

    // Update mascot bubble
    setMascotBubble({
      visible: true,
      isCorrect,
      message: isCorrect
        ? "Great job! That's correct! 🎉"
        : "Don't worry! Learning from mistakes makes us stronger! 💪",
    })

    // Hide mascot bubble after 3 seconds
    setTimeout(() => {
      setMascotBubble((prev) => ({ ...prev, visible: false }))
    }, 3000)
  }

  const jumpToSection = (sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < courseContent.sections.length) {
      setCurrentSectionIndex(sectionIndex)
      setCurrentFrame(sectionIndex * 450)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleNextSection = () => {
    if (currentSectionIndex < courseContent.sections.length - 1) {
      jumpToSection(currentSectionIndex + 1)
    }
  }

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      jumpToSection(currentSectionIndex - 1)
    }
  }

  // Calculate section markers for navigation
  const sectionDuration = 450 // 15 seconds per section at 30fps
  const fps = 30
  const totalDuration = sectionDuration * courseContent.sections.length
  const currentSection = courseContent.sections[currentSectionIndex]
  const progress = ((currentFrame % sectionDuration) / sectionDuration) * 100

  // Calculate progress percentage
  const progressPercentage = ((currentSectionIndex + 1) / courseContent.sections.length) * 100

  // Check if current section is completed
  const isCurrentSectionCompleted = completedSections.includes(currentSectionIndex)

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">

      <div className="space-y-6">
        <Card className="border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-heading">{courseContent.title}</CardTitle>
                <CardDescription className="text-base mt-2 font-body">{courseContent.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-body">
                  {completedSections.length} / {courseContent.sections.length} completed
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Star className="h-4 w-4 mr-1 text-primary" />
                  <span>{points} points</span>
                </Button>
                <LeaderboardButton entries={leaderboardData} courseTitle={courseContent.title} userRank={userRank} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 md:p-6 space-y-6">


              <Card className="border border-muted rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-muted">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-heading">{currentSection.title}</CardTitle>
                    {isCurrentSectionCompleted && (
                      <div className="flex items-center text-secondary">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Video Player */}
                  <div className="aspect-video bg-black">
                    <Player
                      ref={playerRef}
                      component={ContinuousCourseComposition}
                      inputProps={{
                        courseContent,
                      }}
                      durationInFrames={totalDuration}
                      fps={fps}
                      compositionWidth={1920}
                      compositionHeight={1080}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      loop={false}
                      controls
                      acknowledgeRemotionLicense
                    />
                  </div>

                  {/* Quiz Section */}
                  <div className="p-6 space-y-6 border-t border-primary/10">
                    <div className="flex items-center mb-4">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold font-heading">Knowledge Check</h3>
                    </div>

                    <div className="space-y-6">
                      <div className="text-lg font-bold font-heading">{currentSection.quiz.question}</div>
                      <QuizSection
                        question={currentSection.quiz.question}
                        options={currentSection.quiz.options}
                        correctAnswer={currentSection.quiz.correct_answer}
                        explanation={currentSection.quiz.explanation}
                        userAnswer={currentSection.userAnswer}
                        selectedAnswer={selectedAnswer}
                        showExplanation={showExplanation}
                        onAnswerSelect={setSelectedAnswer}
                        onAnswerSubmit={handleAnswerSubmit}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AnimatedMascot visible={mascotBubble.visible} />

              <div className="flex justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSectionIndex === 0}
                  className="px-6 btn-playful font-body"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNextSection}
                  disabled={currentSectionIndex === courseContent.sections.length - 1 ||
                    (!courseContent.sections[currentSectionIndex]?.userAnswer && currentSectionIndex !== 0)}
                  className="px-6 bg-primary btn-playful font-body"
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="ghost" className="text-muted-foreground font-body">
            <BookOpen className="h-4 w-4 mr-2" />
            View Course Overview
          </Button>
        </div>
      </div>
    </div>
  )
}
