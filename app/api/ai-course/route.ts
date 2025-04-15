import {
  GameAgent,
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

// Course Generation Functions
const courseGenerationFunctions = [
  new GameFunction({
    name: "generate_course_structure",
    description:
      "Generates a complete course structure with slides and quizzes",
    args: [
      {
        name: "topic",
        type: "string",
        description: "The topic to create a course about",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.topic) {
          throw new Error("Topic is required");
        }

        // Example course structure
        const courseStructure = {
          title: `Complete Guide to ${args.topic}`,
          description: `A comprehensive course covering all aspects of ${args.topic}`,
          total_slides: 5,
          slides: [
            {
              slide_number: 1,
              title: `Introduction to ${args.topic}`,
              content: `# Introduction\n\n* Overview of ${args.topic}\n* Key concepts\n* Learning objectives`,
              quiz: {
                question: `What is the main purpose of studying ${args.topic}?`,
                options: [
                  "To understand basic concepts",
                  "To become an expert",
                  "To teach others",
                  "All of the above",
                ],
                correct_answer: "All of the above",
                explanation:
                  "Learning encompasses understanding, mastery, and sharing knowledge.",
              },
            },
            // Additional slides would be generated dynamically based on the topic
          ],
        };

        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify(courseStructure)
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate course structure"
        );
      }
    },
  }),
  new GameFunction({
    name: "generate_slide_content",
    description: "Generates detailed content for a specific slide",
    args: [
      {
        name: "topic",
        type: "string",
        description: "The main course topic",
      },
      {
        name: "slideNumber",
        type: "string",
        description: "The slide number to generate content for",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.topic || !args.slideNumber) {
          throw new Error("Topic and slide number are required");
        }

        const slideContent = {
          slide_number: parseInt(args.slideNumber),
          title: `Advanced Concepts in ${args.topic} - Part ${args.slideNumber}`,
          content: `# Advanced ${args.topic}\n\n* Detailed explanation\n* Real-world examples\n* Best practices`,
          quiz: {
            question: `Which of the following best describes an advanced concept in ${args.topic}?`,
            options: [
              "Basic implementation",
              "Advanced techniques",
              "Simple examples",
              "Introductory concepts",
            ],
            correct_answer: "Advanced techniques",
            explanation:
              "Advanced techniques represent the more complex aspects of the topic.",
          },
        };

        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify(slideContent)
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate slide content"
        );
      }
    },
  }),
];

// Create course generation worker
const courseGeneratorWorker = new GameWorker({
  id: "course_generator_worker",
  name: "Course Generator",
  description: "A worker dedicated to generating comprehensive course content",
  functions: courseGenerationFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "course_generator",
  }),
});

// Initialize course generator agent
const initializeCourseGenerator = (apiKey: string) => {
  return new GameAgent(apiKey, {
    name: "CourseGenerator",
    goal: "To generate comprehensive and engaging course content",
    description:
      "An AI agent specialized in creating structured courses with slides and quizzes",
    getAgentState: async () => ({
      status: "active",
      capabilities: [
        "course structure generation",
        "slide content generation",
        "quiz generation",
      ],
    }),
    workers: [courseGeneratorWorker],
  });
};

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const apiKey = process.env.GAME_API_KEY as string;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key is not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!topic || typeof topic !== "string") {
      return new Response(
        JSON.stringify({ error: "Valid topic is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const courseGenerator = initializeCourseGenerator(apiKey);
    await courseGenerator.init();

    // Generate initial course structure
    const logMessage = (msg: string) => console.log(msg);
    const courseStructure = await courseGeneratorWorker.functions
      .find((f) => f.name === "generate_course_structure")
      ?.executable({ topic }, logMessage);

    if (!courseStructure) {
      throw new Error("Failed to generate course structure");
    }

    // Parse the initial structure
    const course = JSON.parse(courseStructure.feedback);

    // Generate content for remaining slides
    const slides = await Promise.all(
      Array.from({ length: 4 }, async (_, i) => {
        const slideNumber = (i + 2).toString(); // Start from slide 2
        const slideContent = await courseGeneratorWorker.functions
          .find((f) => f.name === "generate_slide_content")
          ?.executable({ topic, slideNumber }, logMessage);

        if (!slideContent) {
          throw new Error(
            `Failed to generate content for slide ${slideNumber}`
          );
        }

        return JSON.parse(slideContent.feedback);
      })
    );

    // Combine all slides
    course.slides = [...course.slides, ...slides];

    return new Response(JSON.stringify(course), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating course:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate course" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
