import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { MapMetadata } from "@/types/maps/map-metadata.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { z } from "zod";
import generateStructuredData from "./lib/generate-structured-data.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

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
  { chapterIdea, usedMapNames = [], forceSmallMap = false }: { chapterIdea: ChapterIdea; usedMapNames?: string[]; forceSmallMap?: boolean; }): Promise<string> {
  // For chest map testing
  // return "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf";
  // For Avenir map testing
  // return "Aegris";
  // For door key map testing
  return "Alusq_FE8_0A009B0C_in_the_dark__by_FEU";

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
    model: "nano",
  });

  // 2) Run similarity search
  const limit = forceSmallMap ? 15 : 5;
  const topResults = await similaritySearch<MapMetadata>({
    query: searchQuery,
    limit,
    vectorType: "maps",
  });
  if (!topResults.length) {
    throw new Error("No map results found for this query.");
  }

  let filteredResults = topResults.filter((res) => {
    const originalName = (res.metadata?.originalName as string) || "";
    return !usedMapNames.includes(originalName);
  });

  if (!filteredResults.length) {
    throw new Error("No new map results found (all are used).");
  }

  // 2a) If forcing small map, filter out maps larger than 20x20
  if (forceSmallMap) {
    const smallResults: typeof filteredResults = [];
    for (const res of filteredResults) {
      const originalName = (res.metadata?.originalName as string) || "";
      const jsonPath = getPathWithinServer(`assets/maps/${originalName}.json`);
      let mapData: unknown;
      try {
        const jsonText = await Deno.readTextFile(jsonPath);
        mapData = JSON.parse(jsonText);
      } catch (e) {
        throw new Error(`Error reading or parsing map JSON for ${originalName}: ${e}`);
      }
      const size = (mapData as { size?: unknown }).size;
      if (
        Array.isArray(size) &&
        typeof size[0] === "number" &&
        typeof size[1] === "number" &&
        size[0] <= 17 &&
        size[1] <= 17
      ) {
        smallResults.push(res);
      }
    }
    if (smallResults.length === 0) {
      throw new Error("No small maps found in top 15 results.");
    }
    filteredResults = smallResults;
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

  const logger = getCurrentLogger();
  logger.info("Chose Map", { originalName: chosen.originalName });

  return chosen.originalName || chosen.id;
}

if (import.meta.main) {
  chooseMap({ chapterIdea: testPrologueChapter.idea, forceSmallMap: true })
    .then((chosenMap) => {
      console.log("Chosen map:", chosenMap);
    })
    .catch((err) => {
      console.error("Error choosing map:", err);
    });
}

