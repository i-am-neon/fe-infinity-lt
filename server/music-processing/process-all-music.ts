import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { SongListWithLinks } from "@/music-processing/types/song-list-with-links.ts";
import downloadSongsInList from "@/music-processing/download-songs-in-list.ts";
import convertAllMp3InDirToOgg from "@/music-processing/convert-mp3-to-ogg.ts";
import saveVectorsForAllSongs from "@/music-processing/save-vectors-for-songs.ts";

export default async function processAllMusic(): Promise<void> {
  const listsDir = getPathWithinServer("assets/music/lists-with-links");

  const tasks: Promise<void>[] = [];
  for await (const entry of Deno.readDir(listsDir)) {
    if (!entry.isFile || !entry.name.endsWith(".json")) {
      continue;
    }

    // For each JSON file, push a concurrent task
    tasks.push((async () => {
      const listJsonPath = `${listsDir}/${entry.name}`;
      const baseName = entry.name.replace(/\.json$/, "");
      console.log(`Processing music list: ${entry.name}`);

      try {
        const fileData = await Deno.readTextFile(listJsonPath);
        const songs = JSON.parse(fileData) as SongListWithLinks;
        const mp3Dir = getPathWithinServer(`assets/music/mp3/${baseName}`);
        const oggDir = getPathWithinServer("assets/music/ogg");

        await downloadSongsInList({
          listJsonPath,
          outputDir: mp3Dir,
        });

        console.log(`Converting MP3 to OGG in: ${mp3Dir}`);
        await convertAllMp3InDirToOgg({
          inputDir: mp3Dir,
          outputDir: oggDir,
        });

        await saveVectorsForAllSongs(songs);
        console.log(`Done processing list: ${entry.name}`);
      } catch (error) {
        console.error(`Failed to process ${entry.name}:`, error);
      }
    })());
  }

  await Promise.all(tasks);
}

if (import.meta.main) {
  processAllMusic()
    .then(() => console.log("All music data processed."))
    .catch(console.error);
}