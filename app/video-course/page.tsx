"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Player, type PlayerRef } from "@remotion/player"
import { ContinuousCourseComposition } from "@/components/custom/remotion/ContinuousCourseComposition"
import { CheckCircle, XCircle, HelpCircle, Award, ChevronRight, BookOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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

export default function VideoCoursePage() {
  const [currentFrame, setCurrentFrame] = useState(0)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completedSections, setCompletedSections] = useState<number[]>([])
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

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || !courseContent) return

    const currentSection = courseContent.sections[currentSectionIndex]
    const isCorrect = selectedAnswer === currentSection.quiz.correct_answer

    // Store the answer in the course data
    const updatedContent = { ...courseContent }
    updatedContent.sections[currentSectionIndex].userAnswer = selectedAnswer
    updatedContent.sections[currentSectionIndex].isCorrect = isCorrect
    setCourseContent(updatedContent)

    if (isCorrect && !completedSections.includes(currentSectionIndex)) {
      setCompletedSections([...completedSections, currentSectionIndex])
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
      setCurrentFrame(sectionIndex * sectionDuration)
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-heading">{courseContent.title}</CardTitle>
                <CardDescription className="text-base mt-2 font-body">{courseContent.description}</CardDescription>
              </div>
              <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-yellow-300" />
                {completedSections.length} / {courseContent.sections.length} completed
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 md:p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Progress value={progress} className="flex-1 h-3" />
                <span className="text-sm font-medium">
                  {currentSectionIndex + 1} of {courseContent.sections.length}
                </span>
              </div>

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
                <CardContent className="p-0">
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
                      <div className="space-y-3">
                        {currentSection.quiz.options.map((option) => {
                          const isAnswered = currentSection.userAnswer !== undefined
                          const isCorrect = option === currentSection.quiz.correct_answer
                          const wasSelected = currentSection.userAnswer === option

                          // Determine styling based on state
                          let buttonStyle = {}
                          let icon = null

                          if (isAnswered) {
                            if (isCorrect) {
                              // Correct answer is always green
                              buttonStyle = {
                                backgroundColor: "hsl(142.1 76.2% 36.3%)",
                                color: "white",
                                borderColor: "hsl(142.1 76.2% 36.3%)",
                              }
                              icon = <CheckCircle className="h-5 w-5 text-white" />
                            } else if (wasSelected) {
                              // Wrong selected answer is red
                              buttonStyle = {
                                backgroundColor: "hsl(0 84.2% 60.2%)",
                                color: "white",
                                borderColor: "hsl(0 84.2% 60.2%)",
                              }
                              icon = <XCircle className="h-5 w-5 text-white" />
                            } else {
                              // Unselected wrong answers are neutral
                              buttonStyle = {
                                backgroundColor: "transparent",
                                color: "hsl(var(--muted-foreground))",
                                borderColor: "hsl(var(--border))",
                              }
                            }
                          } else {
                            // Before answering
                            if (selectedAnswer === option) {
                              // Currently selected answer
                              buttonStyle = {
                                backgroundColor: "hsl(var(--primary) / 0.1)",
                                borderColor: "hsl(var(--primary))",
                                borderWidth: "2px",
                                color: "hsl(var(--primary))",
                              }
                            } else {
                              // Unselected answers
                              buttonStyle = {
                                backgroundColor: "transparent",
                                color: "hsl(var(--foreground))",
                                borderColor: "hsl(var(--border))",
                              }
                            }
                          }

                          return (
                            <button
                              key={option}
                              className="w-full flex justify-between items-center text-left px-4 py-6 rounded-md border-2 transition-all duration-200 font-body"
                              style={buttonStyle}
                              onClick={() => !isAnswered && setSelectedAnswer(option)}
                              disabled={isAnswered}
                            >
                              <span>{option}</span>
                              {icon}
                            </button>
                          )
                        })}
                      </div>

                      {!currentSection.userAnswer && (
                        <Button
                          onClick={handleAnswerSubmit}
                          disabled={!selectedAnswer}
                          className="w-full bg-secondary hover:bg-secondary/90 text-white py-6 font-body"
                        >
                          Check Answer
                        </Button>
                      )}

                      {showExplanation && (
                        <Card className="border-2 border-primary/20 bg-primary/5 rounded-xl">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center font-heading">
                              <Award className="h-5 w-5 mr-2 text-secondary" />
                              Explanation
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="font-body">{currentSection.quiz.explanation}</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mascot Video */}
              <AnimatePresence>
                {mascotBubble.visible && (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-0 right-8 z-50"
                  >
                    <div className="w-48 h-48 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 shadow-lg">
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-contain"
                        style={{ transform: 'scale(1)' }}
                      >
                        <source src="/videos/mascot.mp4" type="video/mp4" />
                      </video>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
