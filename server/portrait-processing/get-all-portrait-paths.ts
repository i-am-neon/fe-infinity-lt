import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default function getAllPortraitFileNames(): string[] {
  const portraitPaths = [];
  for (const entry of Deno.readDirSync(
    getPathWithinServer("assets/portraits")
  )) {
    if (entry.isFile) {
      portraitPaths.push(entry.name);
    }
  }
  return portraitPaths;
}

if (import.meta.main) {
  console.log(getAllPortraitFileNames());
}

