"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, BookOpen, ArrowRight, CheckCircle, Lock, Sparkles, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Comprehensive degree programs data with detailed course information
const degreePrograms = [
  {
    id: "web-dev",
    title: "Web Development",
    description:
      "Master the art of creating modern, responsive websites and web applications with Miss Nova's AI-tailored curriculum.",
    icon: "💻",
    courses: [
      {
        id: "html-css",
        title: "HTML & CSS Fundamentals",
        description: "Learn the building blocks of web pages with AI-guided lessons and exercises.",
        duration: "4 weeks",
        difficulty: "Beginner",
        status: "completed",
        order: 1,
      },
      {
        id: "javascript",
        title: "JavaScript Programming",
        description: "Add interactivity to websites with personalized AI feedback on your code.",
        duration: "6 weeks",
        difficulty: "Intermediate",
        status: "in-progress",
        order: 2,
      },
      {
        id: "responsive",
        title: "Responsive Web Design",
        description: "Create websites for any device with adaptive AI lessons that match your learning pace.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 3,
      },
      {
        id: "frameworks",
        title: "Frontend Frameworks",
        description: "Master React with AI-generated projects and real-time guidance.",
        duration: "8 weeks",
        difficulty: "Advanced",
        status: "locked",
        order: 4,
      },
    ],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Learn to analyze and interpret complex data with Miss Nova's AI-powered adaptive learning path.",
    icon: "📊",
    courses: [
      {
        id: "statistics",
        title: "Statistics Fundamentals",
        description: "Master statistical concepts with AI-generated examples tailored to your interests.",
        duration: "5 weeks",
        difficulty: "Intermediate",
        status: "not-started",
        order: 1,
      },
      {
        id: "python",
        title: "Python for Data Analysis",
        description: "Learn Python with AI-guided coding exercises and personalized feedback.",
        duration: "6 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 2,
      },
      {
        id: "machine-learning",
        title: "Machine Learning Basics",
        description: "Understand ML algorithms with interactive AI demonstrations and practice.",
        duration: "8 weeks",
        difficulty: "Advanced",
        status: "locked",
        order: 3,
      },
      {
        id: "data-viz",
        title: "Data Visualization",
        description: "Create compelling visualizations with AI-enhanced techniques and feedback.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 4,
      },
      {
        id: "big-data",
        title: "Big Data Processing",
        description: "Work with large-scale data using AI-optimized learning materials.",
        duration: "6 weeks",
        difficulty: "Advanced",
        status: "locked",
        order: 5,
      },
    ],
  },
  {
    id: "ux-design",
    title: "UX Design",
    description: "Create user-centered designs with Miss Nova's AI-powered design principles and feedback.",
    icon: "🎨",
    courses: [
      {
        id: "design-thinking",
        title: "Design Thinking",
        description: "Learn design methodology with AI-generated case studies and exercises.",
        duration: "4 weeks",
        difficulty: "Beginner",
        status: "not-started",
        order: 1,
      },
      {
        id: "user-research",
        title: "User Research Methods",
        description: "Gather user insights with AI-simulated research scenarios and analysis.",
        duration: "5 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 2,
      },
      {
        id: "wireframing",
        title: "Wireframing & Prototyping",
        description: "Create prototypes with AI feedback on usability and design principles.",
        duration: "6 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 3,
      },
      {
        id: "usability",
        title: "Usability Testing",
        description: "Evaluate designs with AI-simulated user testing and detailed analysis.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 4,
      },
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description: "Master digital marketing strategies with Miss Nova's AI-generated campaigns and analytics.",
    icon: "📱",
    courses: [
      {
        id: "marketing-fundamentals",
        title: "Marketing Fundamentals",
        description: "Learn core principles with AI-generated market scenarios and case studies.",
        duration: "4 weeks",
        difficulty: "Beginner",
        status: "not-started",
        order: 1,
      },
      {
        id: "social-media",
        title: "Social Media Strategy",
        description: "Create effective campaigns with AI-powered audience insights and content ideas.",
        duration: "5 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 2,
      },
      {
        id: "seo-content",
        title: "SEO & Content Marketing",
        description: "Optimize content with AI analysis of search trends and audience engagement.",
        duration: "6 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 3,
      },
      {
        id: "digital-ads",
        title: "Digital Advertising",
        description: "Master ad campaigns with AI-simulated market responses and optimization tips.",
        duration: "4 weeks",
        difficulty: "Intermediate",
        status: "locked",
        order: 4,
      },
    ],
  },
]

export default function DegreesPage() {
  const [selectedDegree, setSelectedDegree] = useState(degreePrograms[0])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading">Degree Programs</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-body">
            Complete specialized learning paths created by Miss Nova that adapt to your progress and learning style.
          </p>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Side panel with degree list */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-xl border border-primary/10 shadow-sm overflow-hidden sticky top-20">
              <div className="p-4 border-b border-primary/10 bg-primary/5">
                <h2 className="font-bold text-lg font-heading flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  Specializations
                </h2>
                <p className="text-sm text-muted-foreground">Select a path to view courses</p>
              </div>
              <div className="divide-y divide-primary/10">
                {degreePrograms.map((degree) => (
                  <button
                    key={degree.id}
                    className={cn(
                      "w-full text-left p-4 flex items-center gap-3 transition-colors",
                      selectedDegree.id === degree.id ? "bg-primary/10 text-primary" : "hover:bg-primary/5",
                    )}
                    onClick={() => setSelectedDegree(degree)}
                  >
                    <span className="text-2xl">{degree.icon}</span>
                    <div>
                      <h3 className="font-medium">{degree.title}</h3>
                      <p className="text-xs text-muted-foreground">{degree.courses.length} personalized courses</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area with journey map */}
          <div className="md:w-2/3 lg:w-3/4">
            <Card className="border border-primary/10">
              <CardContent className="p-6">
                {/* Degree header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{selectedDegree.icon}</span>
                    <h2 className="text-2xl font-bold font-heading">{selectedDegree.title}</h2>
                  </div>
                  <p className="text-muted-foreground">{selectedDegree.description}</p>
                  <div className="mt-3 flex items-center text-primary text-sm">
                    <Brain className="h-4 w-4 mr-1" />
                    <span>Miss Nova adapts this curriculum based on your progress and learning style</span>
                  </div>
                </div>

                {/* Journey map */}
                <div className="mb-6 pl-4 border-l-4 border-primary/20">
                  <h3 className="text-xl font-bold mb-2 font-heading flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-primary" />
                    Learning Journey
                  </h3>
                  <p className="text-muted-foreground">
                    Complete all courses in sequence to earn your {selectedDegree.title} certification.
                  </p>
                </div>

                {/* Course journey visualization */}
                <div className="relative py-8">
                  {/* Journey Path Line - Centered on the timeline */}
                  <div className="absolute left-6 top-0 bottom-0 w-1 bg-primary/20 z-0"></div>

                  {/* Course Nodes */}
                  <div className="relative z-10">
                    {selectedDegree.courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={cn(
                          "flex mb-12 last:mb-0 relative pl-16",
                          course.status === "locked" ? "opacity-60" : "",
                        )}
                      >
                        {/* Status Node - Positioned absolutely relative to the container */}
                        <div className="absolute left-6 top-6">
                          <CourseStatusNode status={course.status} order={course.order} />
                        </div>

                        {/* Course Card */}
                        <div className="flex-1">
                          <Card
                            className={cn(
                              "border overflow-hidden transition-colors",
                              course.status === "completed"
                                ? "border-green-300 bg-green-50"
                                : course.status === "in-progress"
                                  ? "border-primary/30 bg-primary/5"
                                  : course.status === "not-started"
                                    ? "border-gray-300"
                                    : "border-gray-200 bg-gray-50",
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        course.status === "completed"
                                          ? "bg-green-100 text-green-800 border-green-200"
                                          : course.status === "in-progress"
                                            ? "bg-primary/10 text-primary border-primary/20"
                                            : course.status === "not-started"
                                              ? "bg-gray-100 text-gray-800 border-gray-200"
                                              : "bg-gray-100 text-gray-500 border-gray-200",
                                      )}
                                    >
                                      {course.status === "completed"
                                        ? "Completed"
                                        : course.status === "in-progress"
                                          ? "In Progress"
                                          : course.status === "not-started"
                                            ? "Not Started"
                                            : "Locked"}
                                    </Badge>
                                    <Badge variant="outline">{course.difficulty}</Badge>
                                    <Badge variant="outline">{course.duration}</Badge>
                                  </div>
                                  <h4 className="text-lg font-bold mb-1">{course.title}</h4>
                                  <p className="text-sm text-muted-foreground">{course.description}</p>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <Button
                                  variant={course.status === "locked" ? "outline" : "default"}
                                  size="sm"
                                  disabled={course.status === "locked"}
                                  className={course.status === "completed" ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                  {course.status === "completed"
                                    ? "Review Course"
                                    : course.status === "in-progress"
                                      ? "Continue Course"
                                      : course.status === "not-started"
                                        ? "Start Course"
                                        : "Locked"}
                                  <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>

                                {course.status !== "locked" && (
                                  <div className="flex items-center text-xs text-primary">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    <span>AI-tailored content</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enroll button */}
                <div className="mt-8 flex flex-col items-center">
                  <Button className="bg-primary hover:bg-primary/90 btn-playful font-body mb-2">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Learning Path
                  </Button>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Miss Nova creates personalized lessons based on your learning style and adapts as you progress.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

function CourseStatusNode({ status, order }) {
  // Determine status styling
  let bgColor = "bg-gray-200"
  let borderColor = "border-gray-300"
  let icon = <Lock className="h-5 w-5 text-gray-500" />

  if (status === "completed") {
    bgColor = "bg-green-500"
    borderColor = "border-green-600"
    icon = <CheckCircle className="h-5 w-5 text-white" />
  } else if (status === "in-progress") {
    bgColor = "bg-primary"
    borderColor = "border-primary"
    icon = <BookOpen className="h-5 w-5 text-white" />
  } else if (status === "not-started") {
    bgColor = "bg-gray-400"
    borderColor = "border-gray-500"
    icon = null
  }

  return (
    <div
      className={`w-10 h-10 rounded-full border-2 ${borderColor} ${bgColor} flex items-center justify-center z-10 absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}
    >
      {icon || <span className="font-bold text-white">{order}</span>}
    </div>
  )
}

