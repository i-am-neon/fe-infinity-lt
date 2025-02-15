import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export async function convertMp3ToOgg({
  inputFile,
  outputFile,
}: {
  inputFile: string;
  outputFile: string;
}) {
  const command = new Deno.Command("ffmpeg", {
    args: ["-i", inputFile, "-c:a", "libvorbis", outputFile],
    stdout: "inherit",
    stderr: "inherit",
  });
  const process = command.spawn();
  const status = await process.status;
  if (!status.success) {
    throw new Error(`Failed to convert MP3 to OGG: ${inputFile}`);
  }
  console.log(`Converted to OGG: ${outputFile}`);
}

export default async function convertAllMp3InDirToOgg({
  inputDir,
  outputDir,
}: {
  inputDir: string;
  outputDir: string;
}) {
  await Deno.mkdir(outputDir, { recursive: true });
  const tasks: Promise<void>[] = [];
  for await (const entry of Deno.readDir(inputDir)) {
    if (entry.isFile && entry.name.toLowerCase().endsWith(".mp3")) {
      const baseName = entry.name.replace(/\.mp3$/i, "");
      const mp3Path = `${inputDir}/${entry.name}`;
      const oggPath = `${outputDir}/${baseName}.ogg`;
      tasks.push(
        convertMp3ToOgg({
          inputFile: mp3Path,
          outputFile: oggPath,
        })
      );
    }
  }
  await Promise.all(tasks);
}

if (import.meta.main) {
  const inputDir = getPathWithinServer("assets/music/mp3/fe3h");
  const outputDir = getPathWithinServer("assets/music/ogg");
  await convertAllMp3InDirToOgg({ inputDir, outputDir });
}

