import { getCurrentLogger } from "@/lib/current-logger.ts";
import { sluggify } from "@/lib/sluggify.ts";
import { SongMetadata } from "@/music-processing/types/song-list-with-links.ts";
import similaritySearch from "@/vector-db/similarity-search.ts";

export default async function chooseMusic(scenario: string): Promise<string> {
  const logger = getCurrentLogger();
  const topResults = await similaritySearch<SongMetadata>({
    query: scenario,
    limit: 3,
    vectorType: "music",
  });
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
  chooseMusic("Exciting upbeat adventurous happy Whispers in the Frost")
    .then((res) => {
      console.log("Chosen music track name:", res);
    })
    .catch((err) => {
      console.error("Error choosing music:", err);
    });
}

