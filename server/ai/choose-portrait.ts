import { testCharIdeaAislin } from "@/ai/test-data/character-ideas.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { PortraitMetadata } from "@/types/portraits/portrait-metadata.ts";
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
  const query = characterIdea.physicalDescription;

  // Try with initial limit
  let limit = 5;
  let chosenPortraitName: string | null = null;

  while (!chosenPortraitName) {
    const results = await similaritySearch<PortraitMetadata>({
      query,
      limit,
      vectorType,
    });

    if (!results.length) {
      logger.warn("No portrait results found for search query", {
        query,
      });
      throw new Error("No portrait matches found.");
    }

    // Try each result in order of similarity until finding an unused one
    for (const result of results) {
      const md = result.metadata;
      if (md.originalName && !usedPortraits.includes(md.originalName)) {
        chosenPortraitName = md.originalName;
        break;
      }
    }

    // If all portraits in current results are used, increase limit and try again
    if (!chosenPortraitName) {
      limit *= 2; // Double the search space
      if (limit > 50) {
        // Safety limit to prevent excessive searches
        logger.warn("Exhausted portrait search after reaching limit=50", {
          query,
        });
        throw new Error(
          "No unused portrait matches found after extensive search."
        );
      }
      logger.info(
        `All portraits in top ${
          limit / 2
        } are used, increasing to top ${limit}...`
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

