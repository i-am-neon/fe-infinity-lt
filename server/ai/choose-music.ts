import createEmbedding from "@/vector-db/create-embedding.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";
import { sluggify } from "@/lib/sluggify.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

export default async function chooseMusic(scenario: string): Promise<string> {
  const logger = getCurrentLogger();
  const embedding = await createEmbedding({ text: scenario });
  const topResults = await similaritySearch(embedding, 20, "music");
  if (!topResults.length) {
    throw new Error("No music results found for this scenario.");
  }

  const randomIndex = Math.floor(Math.random() * topResults.length);
  const chosen = topResults[randomIndex];
  const songName = chosen.metadata?.songName as string | undefined;
  if (!songName) {
    throw new Error("No songName found in metadata for chosen music track.");
  }

  const sluggifiedName = sluggify(songName);
  logger.debug("Chose music track:", { scenario, songName, sluggifiedName });
  return sluggifiedName;
}

if (import.meta.main) {
  chooseMusic("A calm and serene village in the mountains.")
    .then((res) => {
      console.log("Chosen music track name:", res);
    })
    .catch((err) => {
      console.error("Error choosing music:", err);
    });
}
