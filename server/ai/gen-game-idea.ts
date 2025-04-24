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

  // Use different temperature values for new ideas vs tweaking
  const temperature = previousIdea && feedback ? 0.4 : 1.0;

  let systemMessage = `You are a Fire Emblem Fangame Game Idea Generator.
Generate a creative and original game idea for a Fire Emblem fangame.

IMPORTANT CONSTRAINTS:
- All ideas MUST be set in a medieval fantasy world like Fire Emblem 8 (Sacred Stones)
- Include only medieval weapons (swords, lances, axes, bows) and magic
- Follow the traditional Fire Emblem structure: each chapter will have battles and progress through the storyline with the party
- No modern, sci-fi, or completely unrelated settings/themes
- Be creative and unique WITHIN these constraints
- Game title should not include "Fire Emblem" or "Fire Emblem: "

Return ONLY valid JSON matching the schema with the following fields:
- title: A short, descriptive title for the game (3-5 words)
- description: A concise summary (one or two sentences) of the game's setting and plot.
- tone: A few words describing the tone or style, separated by commas (e.g., 'dark fantasy', 'lighthearted adventure').`;

  // Add special instructions for tweaking existing ideas
  if (previousIdea && feedback) {
    systemMessage = `You are a Fire Emblem Fangame Game Idea Refiner.
You will be given a previous game idea and feedback for tweaks.

CRITICAL INSTRUCTION: You MUST preserve the main story, characters, and themes of the original idea EXACTLY.

STRICTLY FOLLOW THESE RULES:
1. NEVER change the core concept of the story
2. NEVER invent completely new characters, factions, or kingdoms unless specifically requested
3. NEVER change the basic premise of what the story is actually about
4. ONLY make the SMALLEST changes necessary to incorporate the feedback
5. When in doubt, KEEP ELEMENTS from the original idea

SPECIFIC INSTRUCTIONS FOR TWEAKING:
- If asked to change the setting (e.g., "make it in a desert"), simply move the EXACT SAME STORY to that setting
- If asked to change the tone (e.g., "make it darker"), keep the EXACT SAME PLOT but adjust only the mood/atmosphere
- Keep all unique references, inside jokes, or special themes from the original

IMPORTANT CONSTRAINTS:
- All ideas MUST remain in a medieval fantasy world like Fire Emblem 8 (Sacred Stones)
- Include only medieval weapons (swords, lances, axes, bows) and magic
- Follow the traditional Fire Emblem structure: each chapter will have battles and progress through the storyline with the party
- No modern, sci-fi, or completely unrelated settings/themes
- Be creative and unique WITHIN these constraints

EXAMPLES OF GOOD TWEAKING:
Original: "Knights of Memevale, where eccentric heroes band together to save their bug-ridden world from the Hacker Sorcerer"
Feedback: "Make it set in the desert"
BAD response: "Sands of Sablune, where heroes defend their oasis from rival clans" (completely different story)
GOOD response: "Desert Knights of Memevale, where eccentric heroes trek across the sandy wastes of Memevale to save their bug-ridden desert kingdom from the Hacker Sorcerer"

Your task is to MINIMALLY ADJUST the original idea based on feedback. The core story MUST remain intact.

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
    temperature,
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