import { testCharIdeaAislin } from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import generateStructuredData from "./lib/generate-structured-data.ts";
import createEmbedding from "@/vector-db/create-embedding.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { z } from "zod";

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
  searchQuery: z.string().describe("A short sentence to search for a portrait"),
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
    model: "gpt-4o-mini",
  });

  // 2) Embed and run similarity search
  const embedding = await createEmbedding({ text: searchQuery });
  const topResults = await similaritySearch(embedding, 3, "portraits");
  if (!topResults.length) {
    logger.warn("No portrait results found for search query", { searchQuery });
    throw new Error("No portrait matches found.");
  }

  const filteredResults = topResults.filter((res) => {
    const md = res.metadata as { originalName?: string; gender?: string };
    return (
      md.originalName &&
      md.gender === characterIdea.gender &&
      !usedPortraits.includes(md.originalName)
    );
  });
  if (!filteredResults.length) {
    logger.warn(
      "No unused portraits remain for top 5, re-searching with topK=10 ...",
      { searchQuery }
    );
    const biggerResults = await similaritySearch(embedding, 10, "portraits");
    const biggerFiltered = biggerResults.filter((res) => {
      const md = res.metadata as { originalName?: string; gender?: string };
      return (
        md.originalName &&
        md.gender === characterIdea.gender &&
        !usedPortraits.includes(md.originalName)
      );
    });
    if (!biggerFiltered.length) {
      logger.warn("No unused portraits remain at topK=10", { searchQuery });
      throw new Error("No unused portrait matches found after second attempt.");
    }
    const randomIndex = Math.floor(Math.random() * biggerFiltered.length);
    const chosen = biggerFiltered[randomIndex];
    const chosenPortraitName = chosen.metadata!.originalName as string;

    logger.info("Chose portrait for character after second attempt", {
      characterIdea,
      chosenPortrait: chosen,
      elapsedTimeMs: Date.now() - start,
    });
    return chosenPortraitName;
  }

  // 3) Pick a random portrait from the filtered results
  const randomIndex = Math.floor(Math.random() * filteredResults.length);
  const chosen = filteredResults[randomIndex];
  const chosenPortraitName = chosen.metadata!.originalName as string;

  logger.info("Chose portrait for character", {
    characterIdea,
    chosenPortrait: chosen,
    elapsedTimeMs: Date.now() - start,
  });
  return chosenPortraitName;
}

if (import.meta.main) {
  // Quick test
  choosePortrait({ characterIdea: testCharIdeaAislin, usedPortraits: [] })
    .then((res) => {
      console.log("Chosen portrait:", res);
    })
    .catch((err) => {
      console.error("Error choosing portrait:", err);
    });
}

