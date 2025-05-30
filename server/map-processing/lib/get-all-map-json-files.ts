import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { ignoredMapNames } from "../lookup-tables/ignored-map-names.ts";

export default function getAllMapNames() {
  const mapNames: string[] = [];
  for (const entry of Deno.readDirSync(getPathWithinServer("assets/maps"))) {
    if (entry.isFile && entry.name.endsWith(".json")) {
      const mapName = entry.name.slice(0, -5);
      if (ignoredMapNames.includes(mapName)) {
        continue;
      }
      mapNames.push(mapName);
    }
  }
  return mapNames;
}

if (import.meta.main) {
  console.log(getAllMapNames());
}

