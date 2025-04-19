import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import { gameIdeaSchema, GameIdea } from "@/ai/types/game-idea.ts";

/**
 * Generate a new game idea for a Fire Emblem fangame.
 * Returns a JSON object with title, description, and tone.
 */
interface GenGameIdeaOptions {
  tags?: string[];
  blurb?: string;
  feedback?: string;
  previousIdea?: GameIdea;
}

export default function genGameIdea(
  options: GenGameIdeaOptions = {}
): Promise<GameIdea> {
  const { tags, blurb, feedback, previousIdea } = options;
  const systemMessage = `You are a Fire Emblem Fangame Game Idea Generator.
Generate a creative and original game idea for a Fire Emblem fangame.
Return ONLY valid JSON matching the schema with the following fields:
- title: A short, descriptive title for the game (3-5 words)
- description: A concise summary (one or two sentences) of the game's setting and plot.
- tone: A few words describing the tone or style, separated by commas (e.g., 'dark fantasy', 'lighthearted adventure').`;

  let userPrompt = "";
  if (tags && tags.length) {
    userPrompt += `Tags: ${tags.join(", ")}\n`;
  }
  if (blurb) {
    userPrompt += `Blurb: ${blurb}\n`;
  }
  if (previousIdea) {
    userPrompt += `Previous Idea: ${JSON.stringify(previousIdea, null, 2)}\n`;
  }
  if (feedback) {
    userPrompt += `Feedback: ${feedback}\n`;
  }
  if (!userPrompt) {
    userPrompt = "Generate a new game idea.";
  }

  return generateStructuredData<GameIdea>({
    fnName: "genGameIdea",
    systemMessage,
    prompt: userPrompt,
    schema: gameIdeaSchema,
    temperature: 1,
    model: "strong",
  });
}

// Run the function if this file is executed directly
if (import.meta.main) {
  // Initial generation
  console.log("--- Generating initial game idea ---");
  const initialIdea = await genGameIdea({
    tags: ["dark fantasy", "political intrigue"],
    blurb: "A kingdom torn by civil war"
  });
  console.log(JSON.stringify(initialIdea, null, 2));

  // Refining with feedback
  console.log("\n--- Refining with feedback ---");
  const refinedIdea = await genGameIdea({
    tags: ["dark fantasy", "political intrigue"],
    blurb: "A kingdom torn by civil war",
    previousIdea: initialIdea,
    feedback: "Make it more focused on family betrayal and add some magical elements"
  });
  console.log(JSON.stringify(refinedIdea, null, 2));
}