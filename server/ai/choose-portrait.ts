import { CharacterIdea } from "@/ai/types/character-idea.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { z } from "zod";
import createEmbedding from "@/vector-db/create-embedding.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";

interface EphemeralPortraitOption {
  ephemeralId: "A" | "B" | "C";
  originalName: string;
  gender: string;
  age: string;
  hairColor: string;
  eyeColor: string;
  vibe: string;
  clothing: string;
  headgear?: string | null;
  facialHair?: string | null;
  accessories?: string | null;
  similarityScore: number;
}

const searchQuerySchema = z.object({
  searchQuery: z.string().max(70),
});

const decideSchema = z.object({
  chosenId: z.enum(["A", "B", "C"]),
});

export default async function choosePortrait({
  characterIdea,
  usedPortraits,
}: {
  characterIdea: CharacterIdea;
  usedPortraits: string[];
}): Promise<string> {
  const start = Date.now();
  const logger = getCurrentLogger();

  // 1) Generate search query
  const systemMessageForQuery = `You are a query generator for an advanced portrait search system.
Given the user's Fire Emblem character idea, provide a brief single-line string (no more than 70 characters) that captures the essential attributes (gender, age, hair color, vibe, etc.) to help find a matching portrait. Do not wrap the string in quotes. Avoid words that are not relevant.`;

  const { searchQuery } = await generateStructuredData({
    fnName: "genPortraitSearchQuery",
    schema: searchQuerySchema,
    systemMessage: systemMessageForQuery,
    prompt: JSON.stringify(characterIdea),
    temperature: 0.3,
    model: "gpt-4o",
  });

  // 2) Embed and run similarity search
  const embedding = await createEmbedding({ text: searchQuery });
  const topResults = await similaritySearch(embedding, 20, "portraits");
  if (!topResults.length) {
    logger.warn("No portrait results found for search query", { searchQuery });
    throw new Error("No portrait matches found.");
  }

  let filteredResults = topResults.filter((res) => {
    const md = res.metadata as { originalName?: string };
    return md.originalName && !usedPortraits.includes(md.originalName);
  });
  if (!filteredResults.length) {
    logger.warn("No unused portraits remain", { searchQuery });
    throw new Error("No unused portrait matches found.");
  }

  // 3) Decide among top results with second LLM call
  // Create ephemeral IDs A, B, C
  const ephemeralOptions: EphemeralPortraitOption[] = filteredResults.map(
    (res, idx) => {
      const ephemeralId = idx === 0 ? "A" : idx === 1 ? "B" : "C";
      const md = res.metadata as Record<string, unknown>;
      return {
        ephemeralId,
        originalName: md.originalName,
        gender: md.gender,
        age: md.age,
        hairColor: md.hairColor,
        eyeColor: md.eyeColor,
        vibe: md.vibe,
        clothing: md.clothing,
        headgear: md.headgear || null,
        facialHair: md.facialHair || null,
        accessories: md.accessories || null,
        similarityScore: res.score,
      } as EphemeralPortraitOption;
    }
  );

  const systemMessageForDecision = `You are a portrait decider for a Fire Emblem fangame. We have:
- The character idea describing the unit to be matched.
- An array of up to 3 portrait options, each with ephemeralId and some attributes.

Return a JSON object { "chosenId": "A" } or "B" or "C" with no quotes around the ephemeralId in your text, but do place it inside the JSON object’s string. Do not output anything else.`;

  const secondCallPrompt = JSON.stringify({
    characterIdea,
    options: ephemeralOptions,
  });

  const decision: { chosenId: "A" | "B" | "C" } = await generateStructuredData({
    fnName: "choosePortraitDecision",
    schema: decideSchema,
    systemMessage: systemMessageForDecision,
    prompt: secondCallPrompt,
    temperature: 0.3,
    model: "gpt-4o",
  });

  // 4) Return the originalName
  const chosen = ephemeralOptions.find(
    (opt) => opt.ephemeralId === decision.chosenId
  );
  if (!chosen) {
    throw new Error("LLM returned an invalid ephemeral ID");
  }

  logger.info("Chose portrait for character", {
    characterIdea,
    chosenPortrait: chosen,
    elapsedTimeMs: Date.now() - start,
  });
  const chosenPortraitName = chosen.originalName;

  return chosenPortraitName;
}

if (import.meta.main) {
  // Quick test
  choosePortrait({ characterIdea: testCharIdeaThorne, usedPortraits: [] })
    .then((res) => {
      console.log("Chosen portrait:", res);
    })
    .catch((err) => {
      console.error("Error choosing portrait:", err);
    });
}

