import OpenAI from "openai";
import { CourseOutline } from "@/app/lib/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateCourseOutline(
  prompt: string
): Promise<CourseOutline> {
  const systemPrompt = `You are an expert course planner. Given a topic, create a structured micro-course outline.
The course should be concise yet comprehensive, with 3-5 slides.
Each slide should focus on a key aspect of the topic.
You MUST respond with a valid JSON object with the following structure:
{
  "title": "Course title",
  "description": "Brief course description",
  "total_slides": number,
  "slides": [
    {
      "title": "Slide title",
      "key_points": ["point 1", "point 2", ...]
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Create a micro-course outline about: ${prompt}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content received from OpenAI");
    }

    try {
      const outline = JSON.parse(
        response.choices[0].message.content
      ) as CourseOutline;

      // Validate the response structure
      if (
        !outline.title ||
        !outline.description ||
        !outline.total_slides ||
        !Array.isArray(outline.slides)
      ) {
        throw new Error("Invalid course outline structure");
      }

      if (outline.slides.length === 0 || outline.slides.length > 5) {
        throw new Error("Invalid number of slides");
      }

      for (const slide of outline.slides) {
        if (
          !slide.title ||
          !Array.isArray(slide.key_points) ||
          slide.key_points.length === 0
        ) {
          throw new Error("Invalid slide structure in course outline");
        }
      }

      return outline;
    } catch (parseError) {
      console.error(
        "Failed to parse OpenAI response:",
        response.choices[0].message.content
      );
      throw new Error("Failed to parse course outline");
    }
  } catch (error) {
    console.error("Error generating course outline:", error);
    throw error;
  }
}
