import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

  const currentSlide = course.slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / course.total_slides) * 100;

  const handleNextSlide = () => {
    if (currentSlideIndex < course.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setActiveTab("content");
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setActiveTab("content");
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Progress value={progress} className="flex-1" />
              <span className="text-sm text-muted-foreground">
                {currentSlideIndex + 1} of {course.total_slides}
              </span>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{currentSlide.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-4">
                    <div className="prose max-w-none dark:prose-invert">
                      <ReactMarkdown>{currentSlide.content}</ReactMarkdown>
                    </div>
                  </TabsContent>

                  <TabsContent value="quiz" className="mt-4 space-y-4">
                    <div className="text-lg font-medium">
                      {currentSlide.quiz.question}
                    </div>
                    <div className="space-y-2">
                      {currentSlide.quiz.options.map((option) => (
                        <Button
                          key={option}
                          variant={
                            selectedAnswer === option
                              ? option === currentSlide.quiz.correct_answer
                                ? "default"
                                : "destructive"
                              : "outline"
                          }
                          className="w-full justify-start"
                          onClick={() =>
                            !showExplanation && setSelectedAnswer(option)
                          }
                        >
                          {option}
                        </Button>
                      ))}
                    </div>

                    {!showExplanation && (
                      <Button
                        onClick={handleAnswerSubmit}
                        disabled={!selectedAnswer}
                        className="w-full"
                      >
                        Submit Answer
                      </Button>
                    )}

                    {showExplanation && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Explanation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{currentSlide.quiz.explanation}</p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === course.slides.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <HoverCard>
          <HoverCardTrigger>
            <Button variant="ghost" className="text-muted-foreground">
              Need help?
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">How to use this course</h4>
              <p className="text-sm">
                Read through each slide's content, then test your knowledge with
                the quiz. Use the navigation buttons to move between slides.
                Your progress is saved automatically.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  );
}
