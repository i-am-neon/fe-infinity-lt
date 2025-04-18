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
  // chapter battle
  chooseMusic("Rumors spread swiftly that supporters of the executed commander are plotting revenge. As the group moves through the lively Jester's Fields—now shadowed with suspicion—they are ambushed by masked agitators from the Order of the Glorious Blade, seeking to avenge their fallen and discredit the heroes. In the chaos, Marin attempts to mediate, using her sharp wit to stall the attackers, while Evelyn and Silas protect festival-goers. Cassandra, disturbed by the consequences of their decision, fights with renewed determination, while Alden works to disarm magical traps set by the vengeful agitators. Midway through the battle, the party discovers a Vulnerary dropped by a fleeing combatant.")
    .then((res) => {
      console.log("Chosen music track name:", res);
    })
    .catch((err) => {
      console.error("Error choosing music:", err);
    });
}

