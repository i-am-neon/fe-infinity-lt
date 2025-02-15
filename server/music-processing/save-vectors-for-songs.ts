import { SongListWithLinks } from "@/music-processing/types/song-list-with-links.ts";
import generateAndStoreVector from "@/vector-db/generate-and-store-vector.ts";
import shortUuid from "@/lib/short-uuid.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function saveVectorsForSongs(
  songs: SongListWithLinks
): Promise<void> {
  for (const song of songs) {
    const { youTubeLink, ...restOfMetadata } = song;
    const text = `Song:
Name: ${song.songName}
Feel: ${song.feel}
Instruments: ${song.instrumentsUsed}
Situation: ${song.situationUsedInGame}`;

    await generateAndStoreVector({
      id: shortUuid(),
      text,
      metadata: restOfMetadata,
      vectorType: "music",
    });
  }
}

if (import.meta.main) {
  const songs: SongListWithLinks = JSON.parse(
    Deno.readTextFileSync(
      getPathWithinServer("assets/music/lists-with-links/oblivion.json")
    )
  );
  saveVectorsForSongs(songs).then(() => console.log("Music vectors stored."));
}

