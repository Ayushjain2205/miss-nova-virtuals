"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, BookOpen, Brain } from "lucide-react"
import { useState, useEffect } from "react"
import { Mascot } from "@/components/custom/Mascot"
import { motion } from "framer-motion"

export function LoadingState() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Gathering knowledge...")

  // Simulate progress and change messages
  useEffect(() => {
    const messages = [
      "Gathering knowledge...",
      "Creating fun exercises...",
      "Preparing your personalized course...",
      "Almost ready for learning magic!",
      "Polishing final details...",
    ]

    const interval = setInterval(() => {
      setProgress((prev) => {
        // Increase progress by random amount between 5-15%
        const newProgress = Math.min(prev + Math.random() * 10 + 5, 95)

        // Change message based on progress
        const messageIndex = Math.floor((newProgress / 100) * messages.length)
        setMessage(messages[Math.min(messageIndex, messages.length - 1)])

        return newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full border-2 border-primary/20 bg-white shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
          <div className="w-full max-w-xl space-y-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary rounded-full p-3 mr-3">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-primary">Miss Nova is working</h3>
            </div>

            <Progress
              value={progress}
              className="w-full h-4 bg-gray-100 rounded-full overflow-hidden"
              indicatorClassName="bg-gradient-to-r from-primary via-secondary to-green-400"
            />

            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-secondary">{message}</p>
              <p className="text-sm text-muted-foreground">
                Miss Nova is crafting a personalized learning experience just for you
              </p>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                  }}
                  className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              ))}
            </div>

            <div className="flex justify-center items-center mt-4 space-x-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <BookOpen className="h-8 w-8 text-primary" />
              </motion.div>
              <Mascot width={80} height={80} />
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Brain className="h-8 w-8 text-secondary" />
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

