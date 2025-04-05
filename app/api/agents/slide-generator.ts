import OpenAI from "openai";
import { SlideContent } from "@/app/lib/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSlideContent(
  courseTitle: string,
  slideTitle: string,
  keyPoints: string[]
): Promise<SlideContent> {
  const systemPrompt = `You are an expert slide content creator. Given a slide title and key points, create engaging and informative slide content.
The content should be clear, concise, and educational.
You MUST respond with a valid JSON object with the following structure:
{
  "title": "Slide title",
  "content": "Detailed slide content in markdown format",
  "quiz": {
    "question": "A question about the slide content",
    "options": ["option 1", "option 2", "option 3", "option 4"],
    "correct_answer": "The correct option",
    "explanation": "Explanation of why this is the correct answer"
  }
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create slide content for the course "${courseTitle}" with slide title "${slideTitle}" covering these key points: ${keyPoints.join(
            ", "
          )}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content received from OpenAI");
    }

    try {
      const slideContent = JSON.parse(
        response.choices[0].message.content
      ) as SlideContent;

      // Validate the response structure
      if (!slideContent.title || !slideContent.content || !slideContent.quiz) {
        throw new Error("Invalid slide content structure");
      }

      if (
        !slideContent.quiz.question ||
        !Array.isArray(slideContent.quiz.options) ||
        !slideContent.quiz.correct_answer ||
        !slideContent.quiz.explanation
      ) {
        throw new Error("Invalid quiz structure");
      }

      return slideContent;
    } catch (parseError) {
      console.error(
        "Failed to parse OpenAI response:",
        response.choices[0].message.content
      );
      throw new Error("Failed to parse slide content");
    }
  } catch (error) {
    console.error("Error generating slide content:", error);
    throw error;
  }
}
