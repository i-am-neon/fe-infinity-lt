import { testCharIdeaAislin } from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { VectorType } from "@/vector-db/types/vector-type.ts";

export default async function choosePortrait({
  characterIdea,
  usedPortraits,
}: {
  characterIdea: CharacterIdea;
  usedPortraits: string[];
}): Promise<string> {
  const start = Date.now();
  const logger = getCurrentLogger();

  // Determine which vector type to use based on gender
  const vectorType: VectorType =
    characterIdea.gender === "male" ? "portraits-male" : "portraits-female";

  // Use physicalDescription directly for the search
  const searchQuery = characterIdea.physicalDescription;

  // Try with initial topK
  let topK = 5;
  let chosenPortraitName: string | null = null;

  while (!chosenPortraitName) {
    const results = await similaritySearch({
      searchQuery,
      topK,
      vectorType,
    });

    if (!results.length) {
      logger.warn("No portrait results found for search query", {
        searchQuery,
      });
      throw new Error("No portrait matches found.");
    }

    // Try each result in order of similarity until finding an unused one
    for (const result of results) {
      const md = result.metadata as { originalName?: string };
      if (md.originalName && !usedPortraits.includes(md.originalName)) {
        chosenPortraitName = md.originalName;
        break;
      }
    }

    // If all portraits in current results are used, increase topK and try again
    if (!chosenPortraitName) {
      topK *= 2; // Double the search space
      if (topK > 50) {
        // Safety limit to prevent excessive searches
        logger.warn("Exhausted portrait search after reaching topK=50", {
          searchQuery,
        });
        throw new Error(
          "No unused portrait matches found after extensive search."
        );
      }
      logger.info(
        `All portraits in top ${
          topK / 2
        } are used, increasing to top ${topK}...`
      );
    }
  }

  logger.info("Chose portrait for character", {
    characterIdea,
    chosenPortraitName,
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
