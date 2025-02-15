import generateStructuredData from "@/lib/generate-structured-data.ts";
import createEmbedding from "@/vector-db/create-embedding.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { z } from "zod";

interface EphemeralMusicOption {
  ephemeralId: "A" | "B" | "C";
  similarityScore: number;
  metadata: Record<string, unknown>;
}

const searchQuerySchema = z.object({
  searchQuery: z
    .string()
    .describe("A short single-line music description for the search."),
});

const decideSchema = z.object({
  chosenId: z.enum(["A", "B", "C"]),
});

export default async function chooseMusic(
  scenario: string
): Promise<string> {
  // 1) Generate search query
  const systemMessageForQuery = `You are a music query generator for a Fire Emblem fangame scenario.
Given the scenario string, return a short single-line text (max 70 chars) describing the vibe/instruments/feel to find a matching track. Do not wrap the string in quotes.`;

  const { searchQuery } = await generateStructuredData({
    fnName: "genMusicSearchQuery",
    schema: searchQuerySchema,
    systemMessage: systemMessageForQuery,
    prompt: scenario,
    temperature: 0.3,
    model: "gpt-4o-mini",
  });

  // 2) Embed and run similarity search
  const embedding = await createEmbedding({ text: searchQuery });
  const topResults = await similaritySearch(embedding, 20, "music");
  if (!topResults.length) {
    throw new Error("No music results found for this query.");
  }

  // Keep top 3
  const ephemeralOptions: EphemeralMusicOption[] = topResults.slice(0, 3).map((res, idx) => {
    const ephemeralId: "A" | "B" | "C" = idx === 0 ? "A" : idx === 1 ? "B" : "C";
    return {
      ephemeralId,
      similarityScore: res.score,
      metadata: res.metadata || {},
    };
  });

  // 3) Decide among top results with a second LLM call
  const systemMessageForDecision = `You are a music decider for a Fire Emblem fangame scenario. We have:
- The scenario description
- Up to 3 music options, each with ephemeralId and some metadata

Return a JSON object { "chosenId": "A" } or "B" or "C" with no extra commentary.`;

  const secondCallPrompt = JSON.stringify({
    scenario,
    options: ephemeralOptions,
  });

  const decision = await generateStructuredData({
    fnName: "chooseMusicDecision",
    schema: decideSchema,
    systemMessage: systemMessageForDecision,
    prompt: secondCallPrompt,
    temperature: 0.3,
    model: "gpt-4o-mini",
  });

  const chosen = ephemeralOptions.find(
    (opt) => opt.ephemeralId === decision.chosenId
  );
  if (!chosen) {
    throw new Error("LLM returned an invalid ephemeral ID for music selection.");
  }

  const songName = chosen.metadata?.songName as string | undefined;
  if (!songName) {
    throw new Error("No songName found in metadata for chosen music track.");
  }

  // Return the track’s name
  return songName;
}

if (import.meta.main) {
  // Quick test
  chooseMusic("Intense scenario with a sense of urgency, trumpets, war drums")
    .then((res) => {
      console.log("Chosen music track name:", res);
    })
    .catch((err) => {
      console.error("Error choosing music:", err);
    });
}