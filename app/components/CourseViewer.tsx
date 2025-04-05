import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface Quiz {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface Slide {
  slide_number: number;
  title: string;
  content: string;
  quiz: Quiz;
}

export interface Course {
  title: string;
  description: string;
  total_slides: number;
  slides: Slide[];
}

interface CourseViewerProps {
  course: Course;
}

export function CourseViewer({ course }: CourseViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentSlide = course.slides[currentSlideIndex];

  const handleNextSlide = () => {
    if (currentSlideIndex < course.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setShowQuiz(false);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      setShowExplanation(true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">{course.title}</h2>
        <p className="text-gray-600">{course.description}</p>
      </div>

      {/* Navigation Progress */}
      <div className="flex justify-center gap-2">
        {course.slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded-full ${
              index === currentSlideIndex
                ? "bg-blue-500"
                : index < currentSlideIndex
                ? "bg-blue-200"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Slide Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {!showQuiz ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{currentSlide.title}</h3>
            <div className="prose max-w-none">
              <ReactMarkdown>{currentSlide.content}</ReactMarkdown>
            </div>
            <button
              onClick={() => setShowQuiz(true)}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Take Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">{currentSlide.quiz.question}</h3>
            <div className="space-y-3">
              {currentSlide.quiz.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    selectedAnswer === option
                      ? option === currentSlide.quiz.correct_answer
                        ? "bg-green-100 border-green-500"
                        : "bg-red-100 border-red-500"
                      : "hover:bg-gray-50 border-gray-200"
                  } ${showExplanation ? "cursor-default" : "cursor-pointer"}`}
                  disabled={showExplanation}
                >
                  {option}
                </button>
              ))}
            </div>
            {!showExplanation && (
              <button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            )}
            {showExplanation && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">Explanation:</p>
                <p>{currentSlide.quiz.explanation}</p>
              </div>
            )}
            <button
              onClick={() => setShowQuiz(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back to Slide
            </button>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevSlide}
          disabled={currentSlideIndex === 0}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNextSlide}
          disabled={currentSlideIndex === course.slides.length - 1}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
