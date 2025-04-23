import { z } from "zod";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { sluggify } from "@/lib/sluggify.ts";
import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import type { SongMetadata } from "@/music-processing/types/song-list-with-links.ts";

export default async function chooseSongWithSimilarity(scenario: string): Promise<string> {
    const logger = getCurrentLogger();

    // Step 1: Generate similarity search query
    const schemaQuery = z.object({ query: z.string() });
    const systemMessageQuery = `You are given a description of a scenario. Generate a concise search query to find a suitable song based on this scenario. Return an object with a single property "query".`;
    const { query } = await generateStructuredData({
        fnName: "chooseSongWithSimilarity_generateQuery",
        schema: schemaQuery,
        systemMessage: systemMessageQuery,
        prompt: `scenario: ${scenario}`,
        model: "nano",
    });

    if (!query) {
        throw new Error("No query generated from LLM.");
    }
    logger.debug("Generated search query:", { scenario, query });

    // Step 2: Run similarity search
    const topResults = await similaritySearch<SongMetadata>({
        query,
        limit: 5,
        vectorType: "music",
    });
    if (!topResults.length) {
        throw new Error("No songs found for similarity query.");
    }

    // Prepare options for selection
    const options = topResults.map((res, idx) => ({
        index: idx,
        songName: res.metadata.songName,
        feel: res.metadata.feel,
        instrumentsUsed: res.metadata.instrumentsUsed,
        situationUsedInGame: res.metadata.situationUsedInGame,
    }));
    const optionsJson = JSON.stringify(options);

    // Step 3: Let LLM choose the best option
    const schemaSelect = z.object({ chosenIndex: z.number() });
    const systemMessageSelect = `You are given a scenario and a list of song options with metadata. Choose the best song by returning its index in the list as "chosenIndex".`;
    const { chosenIndex } = await generateStructuredData({
        fnName: "chooseSongWithSimilarity_selectBest",
        schema: schemaSelect,
        systemMessage: systemMessageSelect,
        prompt: `scenario: ${scenario}\noptions: ${optionsJson}`,
        model: "nano",
    });

    if (chosenIndex === undefined || chosenIndex < 0 || chosenIndex >= options.length) {
        throw new Error(`Invalid chosenIndex: ${chosenIndex}`);
    }

    const chosen = topResults[chosenIndex];
    const songName = chosen.metadata.songName;
    const sluggified = sluggify(songName);
    logger.debug("Final chosen song:", { scenario, songName, chosenIndex, sluggified });
    return sluggified;
}

if (import.meta.main) {
    const scenario = "Your scenario here";
    chooseSongWithSimilarity(scenario)
        .then((res) => console.log(res))
        .catch(console.error);
} 