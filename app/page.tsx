"use client";

import { useState } from "react";
import { CourseViewer } from "./components/CourseViewer";
import { LoadingState } from "./components/LoadingState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Course } from "./components/CourseViewer";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState("");

  const generateCourse = async () => {
    if (!prompt.trim()) {
      setError("Please enter a topic");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/mock-course");
      const data = await response.json();

      if ("error" in data) {
        throw new Error(data.error);
      }

      setCourse(data);
    } catch (err) {
      console.error("Error generating course:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate course"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="border-none shadow-none">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-4xl">Miss Nova</CardTitle>
            <CardDescription className="text-xl">
              Your Personal AI Teacher
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a topic you want to learn about..."
                className="flex-1"
              />
              <Button onClick={generateCourse} disabled={isLoading} size="lg">
                {isLoading ? "Generating..." : "Generate Course"}
              </Button>
            </div>

            {error && (
              <div className="mt-4 p-4 text-red-500 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {isLoading ? (
          <LoadingState />
        ) : course ? (
          <CourseViewer course={course} />
        ) : null}
      </div>
    </main>
  );
}
