import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export default function cleanSaves(): void {
  const savesDir = getPathWithinLtMaker("saves");
  for (const entry of Deno.readDirSync(savesDir)) {
    if (entry.isFile) {
      if (entry.name !== "save_storage.txt" && entry.name !== "config.ini") {
        Deno.removeSync(`${savesDir}/${entry.name}`);
      }
    } else if (entry.isDirectory) {
      Deno.removeSync(`${savesDir}/${entry.name}`, { recursive: true });
    }
  }
}

if (import.meta.main) {
  cleanSaves();
}