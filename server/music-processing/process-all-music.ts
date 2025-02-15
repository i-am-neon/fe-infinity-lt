import { SongListWithLinks } from "@/music-processing/types/song-list-with-links.ts";
import saveVectorsForAllSongs from "@/music-processing/save-vectors-for-songs.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function processAllMusic(paths: string[]): Promise<void> {
  for (const relPath of paths) {
    const absolutePath = getPathWithinServer(relPath);
    let songs: SongListWithLinks;
    try {
      const fileData = await Deno.readTextFile(absolutePath);
      songs = JSON.parse(fileData) as SongListWithLinks;
    } catch (error) {
      console.error(`Failed to read or parse file: ${relPath}`, error);
      continue;
    }
    console.log(`Loaded ${songs.length} songs from ${relPath}`);

    try {
      await saveVectorsForAllSongs(songs);
      console.log(`Saved vectors for songs in ${relPath}`);
    } catch (error) {
      console.error(`Error saving vectors for songs in ${relPath}`, error);
    }
  }
}

// Before you call this make sure you download the mp3s from youtube and convert to ogg! This just processes the metadata.
if (import.meta.main) {
  const samplePaths = [
    "assets/music/lists-with-links/oblivion.json",
    "assets/music/lists-with-links/botw.json",
    "assets/music/lists-with-links/skyrim.json",
    "assets/music/lists-with-links/twilight-princess.json",
  ];

  processAllMusic(samplePaths)
    .then(() => console.log("All music data processed."))
    .catch(console.error);
}

