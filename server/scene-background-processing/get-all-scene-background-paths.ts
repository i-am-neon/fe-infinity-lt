import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default function getAllSceneBackgroundFileNames(): string[] {
  const scenePaths: string[] = [];
  for (const entry of Deno.readDirSync(
    getPathWithinServer("assets/scene-backgrounds")
  )) {
    if (entry.isFile) {
      scenePaths.push(entry.name);
    }
  }
  return scenePaths;
}

if (import.meta.main) {
  console.log(getAllSceneBackgroundFileNames());
}