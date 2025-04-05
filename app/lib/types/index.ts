export interface Course {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  prompt: string;
  title: string;
  description: string;
  total_slides: number;
  status: "generating" | "completed" | "failed";
}

export interface Slide {
  id: string;
  created_at: string;
  updated_at: string;
  course_id: string;
  slide_number: number;
  title: string;
  content: string;
}

export interface Quiz {
  id: string;
  created_at: string;
  updated_at: string;
  slide_id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface CourseOutline {
  title: string;
  description: string;
  total_slides: number;
  slides: {
    title: string;
    key_points: string[];
  }[];
}

export interface SlideContent {
  title: string;
  content: string;
  quiz: {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
  };
}
