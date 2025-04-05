"use client";

import { useState } from "react";
import { CourseViewer } from "./components/CourseViewer";
import { LoadingState } from "./components/LoadingState";
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
      const response = await fetch("/api/test-course");
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
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Miss Nova</h1>
          <p className="text-xl text-gray-600">Your Personal AI Teacher</p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a topic you want to learn about..."
              className="flex-1 p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={generateCourse}
              disabled={isLoading}
              className="px-6 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Generating..." : "Generate Course"}
            </button>
          </div>

          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">{error}</div>
          )}
        </div>

        {isLoading ? (
          <LoadingState />
        ) : course ? (
          <CourseViewer course={course} />
        ) : null}
      </div>
    </main>
  );
}
