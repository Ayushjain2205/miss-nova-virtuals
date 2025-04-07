"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { CheckCircle, XCircle, HelpCircle, Award, BookOpen, Star } from "lucide-react"

interface Quiz {
  question: string
  options: string[]
  correct_answer: string
  explanation: string
}

interface Slide {
  slide_number: number
  title: string
  content: string
  quiz: Quiz
}

export interface Course {
  title: string
  description: string
  total_slides: number
  slides: Slide[]
}

interface CourseViewerProps {
  course: Course
}

export function CourseViewer({ course }: CourseViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [completedSlides, setCompletedSlides] = useState<number[]>([])

  const currentSlide = course.slides[currentSlideIndex]
  const progress = ((currentSlideIndex + 1) / course.total_slides) * 100
  const isCurrentSlideCompleted = completedSlides.includes(currentSlideIndex)

  const handleNextSlide = () => {
    if (currentSlideIndex < course.slides.length - 1) {
      // Mark current slide as completed if quiz was answered correctly
      if (selectedAnswer === currentSlide.quiz.correct_answer && !isCurrentSlideCompleted) {
        setCompletedSlides([...completedSlides, currentSlideIndex])
      }

      setCurrentSlideIndex(currentSlideIndex + 1)
      setActiveTab("content")
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1)
      setActiveTab("content")
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      setShowExplanation(true)

      // Mark slide as completed if answer is correct
      if (selectedAnswer === currentSlide.quiz.correct_answer && !isCurrentSlideCompleted) {
        setCompletedSlides([...completedSlides, currentSlideIndex])
      }
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl md:text-3xl">{course.title}</CardTitle>
              <CardDescription className="text-base mt-2">{course.description}</CardDescription>
            </div>
            <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-300" fill="currentColor" />
              {completedSlides.length} / {course.total_slides} completed
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 md:p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1 h-3" />
              <span className="text-sm font-medium">
                {currentSlideIndex + 1} of {course.total_slides}
              </span>
            </div>

            <Card className="border border-muted rounded-xl overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-muted">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{currentSlide.title}</CardTitle>
                  {isCurrentSlideCompleted && (
                    <div className="flex items-center text-secondary">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                    <TabsTrigger
                      value="content"
                      className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="quiz"
                      className="data-[state=active]:bg-background rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Quiz
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="p-6">
                    <div className="prose max-w-none dark:prose-invert">
                      <ReactMarkdown>{currentSlide.content}</ReactMarkdown>
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz" className="p-6 space-y-6">
                    <div className="text-xl font-bold">{currentSlide.quiz.question}</div>
                    <div className="space-y-3">
                      {currentSlide.quiz.options.map((option) => {
                        const isSelected = selectedAnswer === option
                        const isCorrect = option === currentSlide.quiz.correct_answer

                        let buttonVariant = "outline"
                        let icon = null

                        if (showExplanation) {
                          if (isCorrect) {
                            buttonVariant = "default"
                            icon = <CheckCircle className="h-5 w-5 text-white" />
                          } else if (isSelected) {
                            buttonVariant = "destructive"
                            icon = <XCircle className="h-5 w-5" />
                          }
                        } else if (isSelected) {
                          buttonVariant = "secondary"
                        }

                        return (
                          <Button
                            key={option}
                            variant={buttonVariant as any}
                            className="w-full justify-between text-left px-4 py-6 h-auto"
                            onClick={() => !showExplanation && setSelectedAnswer(option)}
                          >
                            <span>{option}</span>
                            {icon}
                          </Button>
                        )
                      })}
                    </div>

                    {!showExplanation && (
                      <Button
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                        className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-6 btn-playful"
                      >
                        Check Answer
                      </Button>
                    )}

                    {showExplanation && (
                      <Card className="border-2 border-primary/20 bg-primary/5 rounded-xl">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2 text-secondary" />
                            Explanation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{currentSlide.quiz.explanation}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="px-6 btn-playful"
              >
                Previous
              </Button>
              <Button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === course.slides.length - 1}
                className="px-6 bg-primary btn-playful"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <HoverCard>
          <HoverCardTrigger>
            <Button variant="ghost" className="text-muted-foreground">
              <HelpCircle className="h-4 w-4 mr-2" />
              Need help?
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">How to use this course</h4>
              <p className="text-sm">
                Read through each slide's content, then test your knowledge with the quiz. Use the navigation buttons to
                move between slides. Your progress is saved automatically.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )
}

