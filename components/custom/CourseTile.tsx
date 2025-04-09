"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Star, ArrowRight } from "lucide-react"

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
export type Category = 'Technology' | 'Science' | 'Business' | 'Arts' | 'Health' | 'Language' | 'Mathematics' | 'History' | 'Lifestyle' | 'Other'

// Difficulty levels with emojis
const difficultyEmojis: Record<DifficultyLevel, string> = {
  Beginner: "🌱",
  Intermediate: "🌿",
  Advanced: "🌳",
  "All Levels": "🌎",
}

// Categories with emojis
const categoryEmojis: Record<Category, string> = {
  Technology: "💻",
  Science: "🔬",
  Business: "📊",
  Arts: "🎨",
  Health: "🧘",
  Language: "🗣️",
  Mathematics: "🔢",
  History: "📜",
  Lifestyle: "🏡",
  Other: "✨",
}

interface CourseTileProps {
  title: string
  difficulty: DifficultyLevel
  completion: number
  icon: string
  creator?: string
  category?: Category
  tags?: string[]
  slides?: any[] // Using any for simplicity, but should match your slide structure
}

export function CourseTile({
  title,
  difficulty,
  completion,
  icon,
  creator = "Miss Nova",
  category,
  tags = [],
  slides = [],
}: CourseTileProps) {
  const router = useRouter()

  const handleCourseSelect = () => {
    if (slides.length > 0) {
      // Store the selected course in localStorage
      const selectedCourse = {
        title,
        description: `A comprehensive guide to ${title}`,
        total_slides: slides.length,
        slides,
      }
      localStorage.setItem("currentCourse", JSON.stringify(selectedCourse))
      router.push("/course")
    }
  }

  // Get the emoji for the difficulty level
  const difficultyEmoji = difficultyEmojis[difficulty] || ""

  // Get the emoji for the category if available
  const categoryEmoji = category && categoryEmojis[category] ? categoryEmojis[category] : ""

  return (
    <Card
      className="border border-primary/10 rounded-xl overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
      onClick={handleCourseSelect}
    >
      <div className="p-5 flex flex-col h-[180px]">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary font-heading">{title}</h3>
          <span className="text-2xl">{categoryEmoji || icon}</span>
        </div>

        {category && (
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs bg-primary/5 border border-primary/20 text-primary px-2 py-0.5 rounded-full">
              {category}
            </span>
          </div>
        )}

        <div className="flex items-center text-muted-foreground text-xs mt-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {creator}
        </div>

        <div className="flex-grow"></div>

        <div className="flex items-center justify-between pt-3 border-t border-primary/10 mt-auto">
          <div className="flex items-center text-muted-foreground text-xs">
            <span>
              {difficultyEmoji} {difficulty}
            </span>
          </div>
          <div className="flex items-center text-secondary text-xs">
            <Star className="h-3 w-3 mr-1" fill="currentColor" />
            <span>{completion}%</span>
          </div>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-95">
        <div className="text-white font-medium flex flex-col items-center gap-2">
          <span className="text-lg font-bold">Try Course</span>
          <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </Card>
  )
}
