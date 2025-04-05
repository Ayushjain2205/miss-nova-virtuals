import { NextResponse } from "next/server";
import { generateCourseOutline } from "../agents/course-planner";
import { generateSlideContent } from "../agents/slide-generator";

export async function GET(request: Request) {
  try {
    // Test prompt
    const prompt = "Introduction to JavaScript Programming";
    console.log("Starting course generation for prompt:", prompt);

    // Step 1: Generate course outline
    console.log("Generating course outline...");
    const outline = await generateCourseOutline(prompt);
    console.log("Course outline generated:", outline);

    // Step 2: Generate slides and quizzes
    console.log("Generating slides and quizzes...");
    const slides = await Promise.all(
      outline.slides.map(async (slideOutline, index) => {
        console.log(`Generating slide ${index + 1}...`);
        const slideContent = await generateSlideContent(
          outline.title,
          slideOutline.title,
          slideOutline.key_points
        );
        console.log(`Slide ${index + 1} generated:`, slideContent);
        return {
          slide_number: index + 1,
          ...slideContent,
        };
      })
    );

    // Prepare the complete course object
    const completeCourse = {
      title: outline.title,
      description: outline.description,
      total_slides: outline.total_slides,
      slides: slides,
    };

    console.log("Course generation completed!");
    return NextResponse.json(completeCourse);
  } catch (error) {
    console.error("Error in test course generation:", error);
    return NextResponse.json(
      { error: "Failed to generate test course", details: error },
      { status: 500 }
    );
  }
}
