import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateCourseOutline } from "../agents/course-planner";
import { generateSlideContent } from "../agents/slide-generator";
import { Course, Slide, Quiz } from "@/app/lib/types";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { prompt, userId } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Step 1: Generate course outline
    const outline = await generateCourseOutline(prompt);

    // Step 2: Create course record
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .insert({
        user_id: userId,
        prompt,
        title: outline.title,
        description: outline.description,
        total_slides: outline.total_slides,
        status: "generating",
      })
      .select()
      .single();

    if (courseError) throw courseError;

    // Step 3: Generate slides and quizzes in parallel
    const slidePromises = outline.slides.map(async (slideOutline, index) => {
      const slideContent = await generateSlideContent(
        outline.title,
        slideOutline.title,
        slideOutline.key_points
      );

      // Create slide record
      const { data: slide, error: slideError } = await supabase
        .from("slides")
        .insert({
          course_id: course.id,
          slide_number: index + 1,
          title: slideContent.title,
          content: slideContent.content,
        })
        .select()
        .single();

      if (slideError) throw slideError;

      // Create quiz record
      const { error: quizError } = await supabase.from("quizzes").insert({
        slide_id: slide.id,
        question: slideContent.quiz.question,
        options: slideContent.quiz.options,
        correct_answer: slideContent.quiz.correct_answer,
        explanation: slideContent.quiz.explanation,
      });

      if (quizError) throw quizError;

      return slide;
    });

    // Wait for all slides and quizzes to be generated
    await Promise.all(slidePromises);

    // Update course status to completed
    const { error: updateError } = await supabase
      .from("courses")
      .update({ status: "completed" })
      .eq("id", course.id);

    if (updateError) throw updateError;

    return NextResponse.json({ courseId: course.id });
  } catch (error) {
    console.error("Error generating course:", error);
    return NextResponse.json(
      { error: "Failed to generate course" },
      { status: 500 }
    );
  }
}
