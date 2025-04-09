"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Paperclip, FileText, X, Search, Sparkles } from "lucide-react"
import { LoadingState } from "@/components/custom/LoadingState"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

// Categories with emojis
const categories = [
  { value: "technology", label: "Technology", emoji: "💻" },
  { value: "science", label: "Science", emoji: "🔬" },
  { value: "business", label: "Business", emoji: "📊" },
  { value: "arts", label: "Arts & Humanities", emoji: "🎨" },
  { value: "health", label: "Health & Wellness", emoji: "🧘" },
  { value: "language", label: "Language Learning", emoji: "🗣️" },
  { value: "math", label: "Mathematics", emoji: "🔢" },
  { value: "history", label: "History", emoji: "📜" },
  { value: "lifestyle", label: "Lifestyle", emoji: "🏡" },
  { value: "other", label: "Other", emoji: "✨" },
]

// Difficulty levels with emojis
const difficultyLevels = [
  { value: "beginner", label: "Beginner", emoji: "🌱" },
  { value: "intermediate", label: "Intermediate", emoji: "🌿" },
  { value: "advanced", label: "Advanced", emoji: "🌳" },
  { value: "all-levels", label: "All Levels", emoji: "🌎" },
]

// Add a new courseTypes constant after the difficultyLevels
const courseTypes = [
  { value: "slides", label: "Slides", emoji: "📑" },
  { value: "video", label: "Video", emoji: "🎬" },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get prompt from URL if coming from home page
  const promptFromUrl = searchParams.get("prompt") || ""

  // State for form fields
  const [prompt, setPrompt] = useState<string>(promptFromUrl)
  const [category, setCategory] = useState<string>("")
  const [difficulty, setDifficulty] = useState<string>("beginner")
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [motivationalMessage, setMotivationalMessage] = useState<string>("Let's create your course!")

  // Update the state section to include courseType with "slides" as default
  const [courseType, setCourseType] = useState<string>("slides")

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  // Remove a file from the list
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Update the generateCourse function to check for required fields
  const generateCourse = async () => {
    if (!prompt.trim()) {
      setError("Please enter a topic or description")
      return
    }

    if (!category) {
      setError("Please select a category")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      // Create FormData for file upload
      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("category", category)
      formData.append("difficulty", difficulty)
      formData.append("courseType", courseType)

      // Add files to FormData
      files.forEach((file) => {
        formData.append("files", file)
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // For demo purposes, use the mock course data
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

      // Add category, difficulty and courseType to the course data
      data.category = category
      data.difficulty = difficulty
      data.courseType = courseType

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
        {/* Hero section with mascot and speech bubble - similar to home page */}
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
                <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-medium animate-bounce shadow-lg">
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

              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 font-heading">Create Your Course</h1>
              <p className="text-xl md:text-2xl text-foreground mb-6 font-body">
                Tell Miss Nova what you want to learn about
              </p>

              <div className="space-y-4">
                {/* Prompt input with integrated file upload */}
                <div className="relative">
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g. Black Holes, World War 2, How to focus"
                    className="text-lg rounded-xl border-2 border-muted p-6 pl-10 pr-12 font-body"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/60 h-5 w-5" />

                  {/* File upload icon */}
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary/60 hover:text-primary transition-colors p-1 rounded-full hover:bg-primary/10"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>

                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                </div>

                {/* File list - only show if files are selected */}
                {files.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/30 rounded-lg p-2 text-sm">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          <span className="truncate max-w-[200px] md:max-w-[400px]">{file.name}</span>
                          <span className="ml-2 text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)} className="h-6 w-6 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add the course type select in the grid section with category and difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Enhanced category select with emojis */}
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="rounded-xl border-2 border-muted">
                      <SelectValue placeholder="Select a category *" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value} className="flex items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{cat.emoji}</span>
                            <span>{cat.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Enhanced difficulty select with emojis */}
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="rounded-xl border-2 border-muted">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value} className="flex items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{level.emoji}</span>
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Course type select with emojis */}
                  <Select value={courseType} onValueChange={setCourseType}>
                    <SelectTrigger className="rounded-xl border-2 border-muted">
                      <SelectValue placeholder="Select course type" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="flex items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{type.emoji}</span>
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Update the badges section to include course type */}
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                      {categories.find((c) => c.value === category)?.emoji}{" "}
                      {categories.find((c) => c.value === category)?.label}
                    </Badge>
                  )}
                  {difficulty && (
                    <Badge variant="outline" className="bg-secondary/5 border-secondary/20 text-secondary">
                      {difficultyLevels.find((d) => d.value === difficulty)?.emoji}{" "}
                      {difficultyLevels.find((d) => d.value === difficulty)?.label}
                    </Badge>
                  )}
                  {courseType && (
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">
                      {courseTypes.find((t) => t.value === courseType)?.emoji}{" "}
                      {courseTypes.find((t) => t.value === courseType)?.label}
                    </Badge>
                  )}
                  {files.length > 0 && (
                    <Badge variant="outline" className="bg-muted">
                      <Paperclip className="h-3 w-3 mr-1" /> {files.length} file{files.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

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
                      <Sparkles className="mr-2 h-5 w-5" /> Generate My Course
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
      </div>
    </main>
  )
}
