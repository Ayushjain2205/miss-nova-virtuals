"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { BookOpen, Star, ArrowRight } from "lucide-react"

interface CourseTileProps {
  title: string
  difficulty: string
  completion: number
  icon: string
  tags?: string[]
  slides?: any[] // Using any for simplicity, but should match your slide structure
}

export function CourseTile({ title, difficulty, completion, icon, tags = [], slides = [] }: CourseTileProps) {
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
      className="border border-primary/10 rounded-xl overflow-hidden h-full cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={handleCourseSelect}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary font-heading">{title}</h3>
          <span className="text-2xl">{icon}</span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-1" />
            <span className="text-sm font-body">{difficulty}</span>
          </div>
          <div className="flex items-center text-secondary">
            <Star className="h-4 w-4 mr-1" fill="currentColor" />
            <span className="text-sm font-body">{completion}%</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-primary/10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center text-primary font-medium">
            Try Course{" "}
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Card>
  )
}

