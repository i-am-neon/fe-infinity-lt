import {
  getPathWithinLtMaker,
  ensureParentDirsExist,
} from "@/file-io/get-path-within-lt-maker.ts";

export default async function writeFileWithinLtMaker({
  relativePath,
  text,
  append = false,
}: {
  relativePath: string;
  text: string;
  append?: boolean;
}): Promise<void> {
  const path = getPathWithinLtMaker(relativePath);

  // Ensure parent directories exist
  ensureParentDirsExist(path);

  console.log(`[FileIO] Writing to file: ${path} (append: ${append})`);

  try {
    await Deno.writeTextFile(path, text, { append });
    console.log(`[FileIO] Successfully wrote to: ${path}`);
  } catch (e) {
    console.error(`[FileIO] Failed to write to file: ${path}`, e);
    throw e;
  }
}

