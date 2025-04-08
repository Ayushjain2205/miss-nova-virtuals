"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BookOpen, Star, ArrowRight } from "lucide-react"

interface CourseTileProps {
  title: string
  difficulty: string
  completion: number
  icon: string
  creator?: string
  tags?: string[]
  slides?: any[] // Using any for simplicity, but should match your slide structure
}

export function CourseTile({
  title,
  difficulty,
  completion,
  icon,
  creator = "Miss Nova",
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

  return (
    <Card
      className="border border-primary/10 rounded-xl overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative"
      onClick={handleCourseSelect}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary font-heading">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-3 mb-3">
          <div className="flex items-center text-muted-foreground text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            {creator}
          </div>
          <div className="flex items-center text-secondary text-xs">
            <Star className="h-3 w-3 mr-1" fill="currentColor" />
            <span>{completion}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-primary/10 pt-3 mt-3">
          <div className="flex items-center text-muted-foreground text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{difficulty}</span>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-white font-medium flex items-center">
            Try Course
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Card>
  )
}
