"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronRight } from "lucide-react"
import { LoadingState } from "@/components/custom/LoadingState"
import { motion } from "framer-motion"
import { CourseTile } from "@/components/custom/CourseTile"
import type { DifficultyType, CategoryType, CourseType } from "@/components/custom/CourseTile"

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

interface Course {
  title: string
  difficulty: DifficultyType
  completion: number
  icon: string
  tags: string[]
  category?: CategoryType
  slides?: Slide[]
  creator?: string
  type?: CourseType
}

// Sample course data
const popularCourses: Course[] = [
  {
    title: "Introduction to JavaScript",
    difficulty: "Beginner",
    completion: 82,
    icon: "💻",
    tags: ["Programming", "Web"],
    category: "Technology",
    type: "slides",
  },
  {
    title: "Climate Change Basics",
    difficulty: "Beginner",
    completion: 76,
    icon: "🌍",
    tags: ["Science", "Environment"],
    category: "Science",
    type: "video",
  },
  {
    title: "Digital Marketing 101",
    difficulty: "Beginner",
    completion: 84,
    icon: "📱",
    tags: ["Marketing", "Business"],
    category: "Business",
    type: "slides",
  },
  {
    title: "Introduction to Psychology",
    difficulty: "Beginner",
    completion: 79,
    icon: "🧠",
    tags: ["Psychology", "Science"],
    category: "Science",
    type: "video",
  },
  {
    title: "Web Design Fundamentals",
    difficulty: "Intermediate",
    completion: 68,
    icon: "🎨",
    tags: ["Design", "Web"],
    category: "Arts",
    type: "slides",
  },
  {
    title: "Data Science Essentials",
    difficulty: "Intermediate",
    completion: 72,
    icon: "📊",
    tags: ["Data", "Programming"],
    category: "Technology",
    type: "video",
  },
]

// Mock course data for the "Try" button
const mockCourseData = {
  slides: [
    {
      slide_number: 1,
      title: "Introduction",
      content:
        "## Welcome to this course!\n\nThis is the first slide of your selected course. In a real implementation, this would contain actual course content specific to the topic you selected.",
      quiz: {
        question: "What is the purpose of this course?",
        options: [
          "To teach programming",
          "To provide an overview of the selected topic",
          "To test the platform",
          "None of the above",
        ],
        correct_answer: "To provide an overview of the selected topic",
        explanation: "This course is designed to give you a comprehensive overview of the topic you selected.",
      },
    },
    {
      slide_number: 2,
      title: "Key Concepts",
      content:
        "## Key Concepts\n\nThis slide would normally contain the key concepts related to your selected topic. For demonstration purposes, we're showing placeholder content.",
      quiz: {
        question: "Why are key concepts important?",
        options: [
          "They're not important",
          "They form the foundation of understanding",
          "They're only for beginners",
          "They're optional",
        ],
        correct_answer: "They form the foundation of understanding",
        explanation:
          "Key concepts provide the essential foundation needed to understand more complex ideas in any subject.",
      },
    },
    {
      slide_number: 3,
      title: "Practical Applications",
      content:
        "## Practical Applications\n\nHere we would discuss how the concepts from this course apply in real-world scenarios.",
      quiz: {
        question: "What is the value of practical applications?",
        options: [
          "They help connect theory to real-world usage",
          "They are purely theoretical",
          "They have no educational value",
          "They are only for advanced students",
        ],
        correct_answer: "They help connect theory to real-world usage",
        explanation:
          "Practical applications help bridge the gap between theoretical knowledge and real-world implementation, making learning more relevant and useful.",
      },
    },
    {
      slide_number: 4,
      title: "Common Challenges",
      content:
        "## Common Challenges\n\nThis slide would address typical challenges and misconceptions related to the topic.",
      quiz: {
        question: "Why is it important to understand common challenges?",
        options: ["It's not important", "To avoid making the same mistakes", "Only for beginners", "Only for experts"],
        correct_answer: "To avoid making the same mistakes",
        explanation:
          "Understanding common challenges helps you anticipate and overcome obstacles more efficiently, saving time and effort in your learning journey.",
      },
    },
    {
      slide_number: 5,
      title: "Next Steps",
      content:
        "## Next Steps\n\nThis final slide would typically provide guidance on how to continue learning about the topic after completing this course.",
      quiz: {
        question: "What is the best approach after completing this course?",
        options: [
          "Stop learning about the topic",
          "Continue with more advanced resources",
          "Forget everything you learned",
          "None of the above",
        ],
        correct_answer: "Continue with more advanced resources",
        explanation:
          "Continuous learning is key to mastery. After completing this introductory course, exploring more advanced resources will deepen your understanding and skills.",
      },
    },
  ],
}

// Update all courses with the mock slides data
popularCourses.forEach((course) => {
  course.slides = mockCourseData.slides
})

export default function Home() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [motivationalMessage, setMotivationalMessage] = useState<string>("Let's learn something new!")

  const generateCourse = async () => {
    if (!prompt.trim()) {
      setError("Please enter a topic")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // Add cache-busting query parameter and proper error handling
      const response = await fetch(`/api/mock-course?topic=${encodeURIComponent(prompt)}&t=${Date.now()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if ("error" in data) {
        throw new Error(data.error)
      }

      // Store the course data in localStorage
      localStorage.setItem("currentCourse", JSON.stringify(data))

      // Redirect to the course page
      setTimeout(() => {
        router.push("/course")
      }, 1000)
    } catch (err) {
      console.error("Error generating course:", err)
      setError(err instanceof Error ? err.message : "Failed to generate course")
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      {isLoading && <LoadingState />}

      <div className="max-w-6xl mx-auto">
        {/* Hero section with mascot and speech bubble */}
        <div className="flex flex-col md:flex-row items-center justify-between py-8 md:py-12">
          <motion.div
            className="w-full md:w-1/2 flex justify-center md:justify-start relative"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative">
              <video className="rounded-full " width={320} height={320} autoPlay loop muted playsInline>
                <source src="/videos/mascot.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <motion.div
                className="absolute -top-4 right-0 transform rotate-12"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
              >
                <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm -medium animate-bounce shadow-lg">
                  {motivationalMessage}
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 mt-8 md:mt-0"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-3xl p-6 shadow-lg relative border-2 border-primary/20">
              {/* Speech bubble pointer */}
              <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2">
                <div className="w-4 h-4 bg-white transform rotate-45 border-l-2 border-b-2 border-primary/20"></div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 font-heading">Hi! I'm Miss Nova.</h1>
              <p className="text-xl md:text-2xl text-foreground mb-6 font-body">
                Your AI teacher ready to create a course on any topic.
              </p>

              <div className="space-y-4">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g. Black Holes, World War 2, How to focus"
                  className="text-lg rounded-xl border-2 border-muted p-6 font-body"
                />

                <Button
                  onClick={generateCourse}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl py-6 btn-playful font-heading"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating your course...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Search className="mr-2 h-5 w-5" /> Create My Course
                    </span>
                  )}
                </Button>

                {error && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 animate-bounce">
                    <p className="font-medium">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Loading state */}
        {isLoading && <LoadingState />}

        {/* Popular courses section - Marquee Effect */}
        <motion.div
          className="py-12"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          id="explore"
        >
          <h2 className="text-3xl font-bold text-center mb-8 font-heading">Explore Courses by Miss Nova</h2>

          {/* Marquee container */}
          <div className="relative overflow-hidden py-4">
            {/* Single marquee row */}
            <motion.div
              className="flex gap-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              }}
            >
              {/* Double the courses to create seamless loop */}
              {[...popularCourses, ...popularCourses].map((course, index) => (
                <div key={`course-${index}`} className="w-[300px] h-full flex-shrink-0">
                  <CourseTile
                    title={course.title}
                    difficulty={course.difficulty}
                    completion={course.completion}
                    icon={course.icon}
                    creator={course.creator}
                    tags={course.tags}
                    category={course.category}
                    slides={course.slides}
                    type={course.type}
                  />
                </div>
              ))}
            </motion.div>

            {/* Gradient overlays for fade effect on edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10"></div>
          </div>

          {/* View all courses button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => router.push("/explore")}
              className="bg-primary hover:bg-primary/90 btn-playful font-body"
            >
              View All Courses <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
