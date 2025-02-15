import { sluggify } from "@/lib/sluggify.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

async function downloadYouTubeAsMP3({
  url,
  outputDir,
}: {
  url: string;
  outputDir: string;
}) {
  // Ensure the output directory exists
  await Deno.mkdir(outputDir, { recursive: true });

  // Fetch the video title using yt-dlp
  const titleCommand = new Deno.Command("yt-dlp", {
    args: ["--get-title", url],
    stdout: "piped",
    stderr: "piped",
  });

  const titleProcess = titleCommand.spawn();
  const { success, stdout } = await titleProcess.output();

  if (!success) {
    throw new Error(`Failed to fetch video title for: ${url}`);
  }

  // Convert Uint8Array output to a string and sluggify it
  const title = new TextDecoder().decode(stdout).trim();
  const slugifiedTitle = sluggify(title);

  // Construct the final output file path
  const outputFile = `${outputDir}/${slugifiedTitle}.mp3`;

  // Download the MP3 using yt-dlp
  const downloadCommand = new Deno.Command("yt-dlp", {
    args: [
      "-x", // Extract audio
      "--audio-format",
      "mp3", // Convert to MP3
      "-o",
      `${outputDir}/${slugifiedTitle}.%(ext)s`, // Use slugified title
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

// Example Usage:
if (import.meta.main) {
  const youtubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with any video
  await downloadYouTubeAsMP3({
    url: youtubeUrl,
    outputDir: getPathWithinServer("assets/test"),
  });
}

