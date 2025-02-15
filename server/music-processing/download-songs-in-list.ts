import { sluggify } from "@/lib/sluggify.ts";
import { downloadYouTubeAsMP3 } from "@/music-processing/download-mp3-from-youtube.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { SongListWithLinks } from "@/music-processing/types/song-list-with-links.ts";

export default async function downloadSongsInList({
  listJsonPath,
  outputDir,
}: {
  listJsonPath: string;
  outputDir: string;
}): Promise<void> {
  // Read the JSON file containing the list of songs
  const listJson = await Deno.readTextFile(listJsonPath);
  const list: SongListWithLinks = JSON.parse(listJson);

  // Download all songs in parallel
  await Promise.all(
    list.map(async (song) => {
      const { youTubeLink, songName } = song;

      try {
        await downloadYouTubeAsMP3({ url: youTubeLink, outputDir, songName });
      } catch (error) {
        console.error(`Failed to download song: ${songName}`);
        console.error(error);
      }
    })
  );
}

if (import.meta.main) {
  downloadSongsInList({
    listJsonPath: getPathWithinServer(
      "assets/music/lists-with-links/fe3h.json"
    ),
    outputDir: getPathWithinServer("assets/music/mp3/fe3h"),
  });
}

