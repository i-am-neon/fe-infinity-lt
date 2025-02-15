import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { downloadYouTubeAsMP3 } from "@/music-processing/download-mp3-from-youtube.ts";
import { SongListWithLinks } from "@/music-processing/types/song-list-with-links.ts";

export default async function downloadSongsInList({
  listJsonPath,
  outputDir,
}: {
  listJsonPath: string;
  outputDir: string;
}): Promise<void> {
  const listJson = await Deno.readTextFile(listJsonPath);
  const list: SongListWithLinks = JSON.parse(listJson);

  await Deno.mkdir(outputDir, { recursive: true });

  await Promise.all(
    list.map(async (song) => {
      const { youTubeLink, songName } = song;
      const baseName = songName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      const mp3Path = `${outputDir}/${baseName}.mp3`;

      try {
        // Check if MP3 file already exists
        const stat = await Deno.stat(mp3Path).catch(() => null);
        if (stat && stat.isFile) {
          console.log(`Skipping "${songName}", MP3 already downloaded.`);
          return;
        }
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

