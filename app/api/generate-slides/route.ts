import {
  GameAgent,
  GameWorker,
  GameFunction,
  ExecutableGameFunctionResponse,
  ExecutableGameFunctionStatus,
} from "@virtuals-protocol/game";

// Slide Generation Functions
const slideGenerationFunctions = [
  new GameFunction({
    name: "generate_title_slide",
    description: "Generates a title slide for the presentation",
    args: [
      {
        name: "title",
        type: "string",
        description: "Title of the presentation",
      },
      {
        name: "subtitle",
        type: "string",
        description: "Subtitle or additional context",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.title) {
          throw new Error("Title is required");
        }
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify({
            type: "title",
            content: {
              title: args.title,
              subtitle: args.subtitle || "",
            },
          })
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate title slide"
        );
      }
    },
  }),
  new GameFunction({
    name: "generate_content_slide",
    description: "Generates a content slide with bullet points or text",
    args: [
      {
        name: "heading",
        type: "string",
        description: "Heading of the slide",
      },
      {
        name: "content",
        type: "string",
        description: "Content to be included in the slide",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.heading || !args.content) {
          throw new Error("Heading and content are required");
        }
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify({
            type: "content",
            content: {
              heading: args.heading,
              points: args.content.split("\n"),
            },
          })
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate content slide"
        );
      }
    },
  }),
  new GameFunction({
    name: "generate_image_slide",
    description: "Generates a slide with an image and caption",
    args: [
      {
        name: "imageUrl",
        type: "string",
        description: "URL of the image to include",
      },
      {
        name: "caption",
        type: "string",
        description: "Caption for the image",
      },
    ] as const,
    executable: async (args) => {
      try {
        if (!args.imageUrl) {
          throw new Error("Image URL is required");
        }
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Done,
          JSON.stringify({
            type: "image",
            content: {
              imageUrl: args.imageUrl,
              caption: args.caption || "",
            },
          })
        );
      } catch (e) {
        return new ExecutableGameFunctionResponse(
          ExecutableGameFunctionStatus.Failed,
          "Failed to generate image slide"
        );
      }
    },
  }),
];

// Create slide generation worker
const slideGeneratorWorker = new GameWorker({
  id: "slide_generator_worker",
  name: "Slide Generator",
  description: "A worker dedicated to generating presentation slides",
  functions: slideGenerationFunctions,
  getEnvironment: async () => ({
    currentTime: new Date().toISOString(),
    platform: "web",
    mode: "slide_generator",
  }),
});

// Initialize slide generator agent
const initializeSlideGenerator = (apiKey: string) => {
  return new GameAgent(apiKey, {
    name: "SlideGenerator",
    goal: "To generate professional and engaging presentation slides",
    description:
      "An AI agent specialized in creating various types of presentation slides",
    getAgentState: async () => ({
      status: "active",
      capabilities: ["title slides", "content slides", "image slides"],
    }),
    workers: [slideGeneratorWorker],
  });
};

export async function POST(req: Request) {
  try {
    const { action, slideType, params } = await req.json();
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

    const slideGenerator = initializeSlideGenerator(apiKey);
    await slideGenerator.init();

    // Handle different slide generation actions
    switch (action) {
      case "generate":
        let response;
        const logMessage = (msg: string) => console.log(msg);

        switch (slideType) {
          case "title":
            response = await slideGeneratorWorker.functions
              .find((f) => f.name === "generate_title_slide")
              ?.executable(
                {
                  title: params.title,
                  subtitle: params.subtitle,
                },
                logMessage
              );
            break;
          case "content":
            response = await slideGeneratorWorker.functions
              .find((f) => f.name === "generate_content_slide")
              ?.executable(
                {
                  heading: params.heading,
                  content: params.content,
                },
                logMessage
              );
            break;
          case "image":
            response = await slideGeneratorWorker.functions
              .find((f) => f.name === "generate_image_slide")
              ?.executable(
                {
                  imageUrl: params.imageUrl,
                  caption: params.caption,
                },
                logMessage
              );
            break;
          default:
            throw new Error("Invalid slide type");
        }

        if (!response) {
          throw new Error("Function not found for the specified slide type");
        }

        return new Response(JSON.stringify({ slide: response.feedback }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        });

      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        });
    }
  } catch (error) {
    console.error("Error generating slides:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
