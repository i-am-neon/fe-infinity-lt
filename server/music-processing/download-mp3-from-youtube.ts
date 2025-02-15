import { sluggify } from "@/lib/sluggify.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export async function downloadYouTubeAsMP3({
  url,
  outputDir,
  songName,
}: {
  url: string;
  outputDir: string;
  songName: string;
}) {
  await Deno.mkdir(outputDir, { recursive: true });
  const slugifiedName = sluggify(songName);
  const outputFile = `${outputDir}/${slugifiedName}.mp3`;

  const downloadCommand = new Deno.Command("yt-dlp", {
    args: [
      "-x",
      "--audio-format",
      "mp3",
      "-o",
      `${outputDir}/${slugifiedName}.%(ext)s`,
      url,
    ],
    stdout: "inherit",
    stderr: "inherit",
  });

  const downloadProcess = downloadCommand.spawn();
  const downloadStatus = await downloadProcess.status;

  if (!downloadStatus.success) {
    throw new Error(`Failed to download video: ${url}`);
  }

  console.log(`MP3 downloaded successfully: ${outputFile}`);
  return outputFile;
}

if (import.meta.main) {
  const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  await downloadYouTubeAsMP3({
    url: youtubeUrl,
    outputDir: getPathWithinServer("assets/test"),
    songName: "my-example-song",
  });
}

