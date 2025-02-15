import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import convertAllMp3InDirToOgg from "@/music-processing/convert-mp3-to-ogg.ts";
import downloadSongsInList from "@/music-processing/download-songs-in-list.ts";

/**
 * Enumerates all JSON files in assets/music/lists-with-links,
 * downloads their songs as MP3 if not already present, then converts them to OGG.
 */
export async function downloadAllOgg(): Promise<void> {
  const listsDir = getPathWithinServer("assets/music/lists-with-links");
  const mp3Dir = getPathWithinServer("assets/music/mp3");

  // gather all json files
  const files: string[] = [];
  for await (const entry of Deno.readDir(listsDir)) {
    if (entry.isFile && entry.name.endsWith(".json")) {
      files.push(entry.name);
    }
  }

  // download each list in parallel
  await Promise.all(
    files.map(async (fileName) => {
      const baseName = fileName.replace(/\.json$/, "");
      const listPath = `${listsDir}/${fileName}`;
      const outputDir = `${mp3Dir}/${baseName}`;
      console.log(`Downloading from list: ${fileName}`);
      await downloadSongsInList({
        listJsonPath: listPath,
        outputDir,
      });
    })
  );

  // after download, convert all mp3 to ogg for each subfolder
  const subdirs: string[] = [];
  for await (const entry of Deno.readDir(mp3Dir)) {
    if (entry.isDirectory) {
      subdirs.push(entry.name);
    }
  }

  await Promise.all(
    subdirs.map(async (subdir) => {
      const fullSubdir = `${mp3Dir}/${subdir}`;
      console.log(`Converting MP3 to OGG in: ${fullSubdir}`);
      await convertAllMp3InDirToOgg({
        inputDir: fullSubdir,
        outputDir: getPathWithinServer("assets/music/ogg"),
      });
    })
  );
}

if (import.meta.main) {
  downloadAllOgg()
    .then(() => console.log("All OGG downloads and conversions complete."))
    .catch((err) => console.error("Error in downloadAllOgg:", err));
}

