import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default function getAllMapNames() {
  const mapNames: string[] = [];
  for (const entry of Deno.readDirSync(getPathWithinServer("assets/maps"))) {
    if (entry.isFile && entry.name.endsWith(".json")) {
      mapNames.push(entry.name.slice(0, -5));
    }
  }
  return mapNames;
}

if (import.meta.main) {
  console.log(getAllMapNames());
}

