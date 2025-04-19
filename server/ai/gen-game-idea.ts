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

  let systemMessage = `You are a Fire Emblem Fangame Game Idea Generator.
Generate a creative and original game idea for a Fire Emblem fangame.
Return ONLY valid JSON matching the schema with the following fields:
- title: A short, descriptive title for the game (3-5 words)
- description: A concise summary (one or two sentences) of the game's setting and plot.
- tone: A few words describing the tone or style, separated by commas (e.g., 'dark fantasy', 'lighthearted adventure').`;

  // Add special instructions for tweaking existing ideas
  if (previousIdea && feedback) {
    systemMessage = `You are a Fire Emblem Fangame Game Idea Refiner.
You will be given a previous game idea and feedback for tweaks.

CRITICAL INSTRUCTION: You MUST maintain the fundamental essence of the original idea.
The following elements MUST be preserved unless EXPLICITLY asked to change them:
1. Main characters/factions (e.g., if about a warlord, keep the warlord as protagonist)
2. Core setting (e.g., if set in an empire, keep the empire setting)
3. Central conflict (e.g., if about reclaiming power, keep that motivation)
4. Key themes (e.g., if about redemption vs. damnation, maintain that theme)

EXAMPLE - If original is about "an undead warlord reclaiming an empire" and feedback is "make it funnier":
- BAD: Completely changing to "villagers defending against chickens"
- GOOD: "An undead warlord with a sardonic sense of humor attempts to reclaim his empire while dealing with comically incompetent minions"

Your task is to ADJUST the original idea based on feedback, not REPLACE it.
Small modifications are appropriate - complete rewrites are NOT.

Return ONLY valid JSON matching the schema with the following fields:
- title: A short, descriptive title for the game (3-5 words)
- description: A concise summary (one or two sentences) of the game's setting and plot.
- tone: A few words describing the tone or style, separated by commas (e.g., 'dark fantasy, comedic').`;
  }

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