import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { sluggify } from "@/lib/sluggify.ts";
import concatAllMusicOptions from "@/music-processing/concat-all-music-options.ts";
import { z } from "zod";
import type { SongMetadata } from "@/music-processing/types/song-list-with-links.ts";

export default async function chooseMusic(scenario: string): Promise<string> {
  const logger = getCurrentLogger();
  const optionsJson = concatAllMusicOptions();
  const options: SongMetadata[] = JSON.parse(optionsJson);
  const schema = z.object({ songName: z.string() });
  const systemMessage = `You are given a description of a scenario and a list of song metadata options in JSON format.
Choose the most appropriate songName from the options based on the scenario.
Return an object with a single property songName set to the chosen name.`;

  let songName: string | undefined;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const result = await generateStructuredData({
      fnName: "allSongsInContext",
      schema,
      systemMessage,
      prompt: `scenario: ${scenario}\noptions: ${optionsJson}`,
      model: "fast",
    });
    songName = result.songName;
    if (!songName) {
      throw new Error("No songName returned from LLM.");
    }
    if (options.some((opt) => opt.songName === songName)) {
      break;
    }
    logger.warn(`Chosen songName "${songName}" not in options, retrying (${attempt}/3).`);
    songName = undefined;
  }

  if (!songName) {
    throw new Error("LLM did not choose a valid songName after 3 attempts.");
  }

  const sluggified = sluggify(songName!);
  logger.debug("LLM chose music track:", { scenario, songName, sluggified });
  return sluggified;
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

