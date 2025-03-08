import generateAndStoreVector from "@/vector-db-js/generate-and-store-vector.ts";

interface SongMetadata {
  songName: string;
  feel: string;
  instrumentsUsed: string;
  situationUsedInGame: string;
  youTubeLink?: string;
  [key: string]: unknown;
}

export type SongListWithLinks = SongMetadata[];

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
      text,
      metadata: restOfMetadata,
      vectorType: "music",
    });
  }
}

if (import.meta.main) {
  const sampleSongs: SongListWithLinks = [
    {
      songName: "Battle Theme",
      feel: "intense, exciting, dramatic",
      instrumentsUsed: "orchestra, drums, brass",
      situationUsedInGame: "regular combat",
    },
    {
      songName: "Peaceful Village",
      feel: "calm, serene, gentle",
      instrumentsUsed: "strings, flute, harp",
      situationUsedInGame: "town exploration",
    }
  ];
  
  saveVectorsForSongs(sampleSongs)
    .then(() => console.log("Saved vectors for songs"))
    .catch(console.error);
}