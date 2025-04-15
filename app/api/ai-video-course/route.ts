import {
  GameAgent,
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

// Video Course Generation Functions
const videoCourseGenerationFunctions = [
  new GameFunction({
    name: "generate_video_course_structure",
    description:
      "Generates a complete video course structure with sections and quizzes",
    args: [
      {
        name: "topic",
        type: "string",
        description: "The topic to create a video course about",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.topic) {
          throw new Error("Topic is required");
        }

        const courseStructure = {
          title: `Introduction to ${args.topic}`,
          description: `Learn the fundamentals of ${args.topic} with this animated video course`,
          sections: [
            {
              title: `What is ${args.topic}?`,
              content: `An introduction to the core concepts and fundamentals of ${args.topic}.`,
              key_points: [
                "Understanding the basics",
                "Core principles",
                "Getting started guide",
              ],
              quiz: {
                question: `What is the main purpose of ${args.topic}?`,
                options: [
                  "To solve complex problems",
                  "To improve efficiency",
                  "To enhance productivity",
                  "All of the above",
                ],
                correct_answer: "All of the above",
                explanation: `${args.topic} is designed to address multiple aspects of development and improvement.`,
              },
            },
          ],
        };

        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify(courseStructure)
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate video course structure"
        );
      }
    },
  }),
  new GameFunction({
    name: "generate_section_content",
    description: "Generates detailed content for a course section",
    args: [
      {
        name: "topic",
        type: "string",
        description: "The main course topic",
      },
      {
        name: "sectionNumber",
        type: "string",
        description: "The section number to generate content for",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.topic || !args.sectionNumber) {
          throw new Error("Topic and section number are required");
        }

        const sectionNumber = parseInt(args.sectionNumber);
        let sectionContent;

        switch (sectionNumber) {
          case 2:
            sectionContent = {
              title: `Core Features of ${args.topic}`,
              content: `Explore the essential features and capabilities that make ${args.topic} powerful and effective.`,
              key_points: [
                "Feature exploration",
                "Practical applications",
                "Best practices",
              ],
              quiz: {
                question: `Which feature is most important in ${args.topic}?`,
                options: [
                  "Scalability",
                  "Flexibility",
                  "Performance",
                  "All are equally important",
                ],
                correct_answer: "All are equally important",
                explanation: `${args.topic} combines multiple important features that work together to provide a comprehensive solution.`,
              },
            };
            break;
          case 3:
            sectionContent = {
              title: `Advanced ${args.topic} Concepts`,
              content: `Deep dive into advanced concepts and techniques in ${args.topic}.`,
              key_points: [
                "Advanced techniques",
                "Real-world scenarios",
                "Performance optimization",
              ],
              quiz: {
                question: `What is a key consideration when working with advanced ${args.topic} concepts?`,
                options: [
                  "Performance impact",
                  "Implementation complexity",
                  "Maintenance requirements",
                  "All of the above",
                ],
                correct_answer: "All of the above",
                explanation: `Advanced ${args.topic} concepts require careful consideration of multiple factors for successful implementation.`,
              },
            };
            break;
          default:
            throw new Error("Invalid section number");
        }

        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify(sectionContent)
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate section content"
        );
      }
    },
  }),
];

// Create video course generation worker
const videoCourseGeneratorWorker = new GameWorker({
  id: "video_course_generator_worker",
  name: "Video Course Generator",
  description:
    "A worker dedicated to generating comprehensive video course content",
  functions: videoCourseGenerationFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "video_course_generator",
  }),
});

// Initialize video course generator agent
const initializeVideoCourseGenerator = (apiKey: string) => {
  return new GameAgent(apiKey, {
    name: "VideoCourseGenerator",
    goal: "To generate comprehensive and engaging video course content",
    description:
      "An AI agent specialized in creating structured video courses with sections and quizzes",
    getAgentState: async () => ({
      status: "active",
      capabilities: [
        "video course structure generation",
        "section content generation",
        "quiz generation",
      ],
    }),
    workers: [videoCourseGeneratorWorker],
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

    const videoCourseGenerator = initializeVideoCourseGenerator(apiKey);
    await videoCourseGenerator.init();

    // Generate initial course structure
    const logMessage = (msg: string) => console.log(msg);
    const courseStructure = await videoCourseGeneratorWorker.functions
      .find((f) => f.name === "generate_video_course_structure")
      ?.executable({ topic }, logMessage);

    if (!courseStructure) {
      throw new Error("Failed to generate video course structure");
    }

    // Parse the initial structure
    const course = JSON.parse(courseStructure.feedback);

    // Generate content for additional sections
    const sections = await Promise.all(
      Array.from({ length: 2 }, async (_, i) => {
        const sectionNumber = (i + 2).toString(); // Start from section 2
        const sectionContent = await videoCourseGeneratorWorker.functions
          .find((f) => f.name === "generate_section_content")
          ?.executable({ topic, sectionNumber }, logMessage);

        if (!sectionContent) {
          throw new Error(
            `Failed to generate content for section ${sectionNumber}`
          );
        }

        return JSON.parse(sectionContent.feedback);
      })
    );

    // Combine all sections
    course.sections = [...course.sections, ...sections];

    return new Response(JSON.stringify(course), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating video course:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate video course" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
