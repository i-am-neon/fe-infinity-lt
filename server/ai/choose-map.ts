import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { z } from "zod";
import generateStructuredData from "./lib/generate-structured-data.ts";

interface EphemeralMapOption {
  ephemeralId: "A" | "B" | "C";
  id: string;
  originalName?: string;
  similarityScore: number;
  metadata: Record<string, unknown>;
}

const searchQuerySchema = z.object({
  searchQuery: z
    .string()
    .describe("A short single-line map description for the search."),
});

const decideSchema = z.object({
  chosenId: z.enum(["A", "B", "C"]),
});

export default async function chooseMap(
  chapterIdea: ChapterIdea,
  usedMapNames: string[] = []
): Promise<string> {
  // For chest map testing
  // return "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf";
  // For Avenir map testing
  return "Aegris";

  // 1) Generate search query
  const systemMessageForQuery = `You are a query generator for an advanced map search system.
Given the user's Fire Emblem chapter idea, provide a brief single-line string (no more than 70 characters) that captures the essential attributes of a suitable map (e.g. size, terrain style, vibe). Do not wrap the string in quotes.`;

  const promptForQuery = JSON.stringify(chapterIdea);

  const { searchQuery } = await generateStructuredData({
    fnName: "genMapSearchQuery",
    schema: searchQuerySchema,
    systemMessage: systemMessageForQuery,
    prompt: promptForQuery,
    temperature: 0.3,
    model: "fast",
  });

  // 2) Run similarity search
  const topResults = await similaritySearch<MapMetadata>({
    query: searchQuery,
    limit: 5,
    vectorType: "maps",
  });
  if (!topResults.length) {
    throw new Error("No map results found for this query.");
  }

  const filteredResults = topResults.filter((res) => {
    const originalName = (res.metadata?.originalName as string) || "";
    return !usedMapNames.includes(originalName);
  });

  if (!filteredResults.length) {
    throw new Error("No new map results found (all are used).");
  }

  // Keep top 3
  const ephemeralOptions: EphemeralMapOption[] = filteredResults
    .slice(0, 3)
    .map((res, idx) => {
      const ephemeralId = idx === 0 ? "A" : idx === 1 ? "B" : "C";
      return {
        ephemeralId,
        id: res.id,
        originalName: (res.metadata?.originalName as string) || "",
        similarityScore: res.score,
        metadata: res.metadata || {},
      };
    });

  // 3) Decide among top results with a second LLM call
  const systemMessageForDecision = `You are a map decider for a Fire Emblem fangame. We have:
- The ChapterIdea describing this chapter.
- An array of up to 3 map options, each with ephemeralId and some metadata.

Return a JSON object { "chosenId": "A" } or "B" or "C" with no extra commentary.`;

  const secondCallPrompt = JSON.stringify({
    chapterIdea,
    options: ephemeralOptions,
  });

  const decision = await generateStructuredData({
    fnName: "chooseMapDecision",
    schema: decideSchema,
    systemMessage: systemMessageForDecision,
    prompt: secondCallPrompt,
    temperature: 0.3,
    model: "fast",
  });

  const chosen = ephemeralOptions.find(
    (opt) => opt.ephemeralId === decision.chosenId
  );
  if (!chosen) {
    throw new Error("LLM returned an invalid ephemeral ID for map selection.");
  }

  return chosen.originalName || chosen.id;
}

if (import.meta.main) {
  chooseMap(testPrologueChapter.idea)
    .then((chosenMap) => {
      console.log("Chosen map:", chosenMap);
    })
    .catch((err) => {
      console.error("Error choosing map:", err);
    });
}

