import getAllMapNames from "@/map-processing/lib/get-all-map-json-files.ts";
import processMap from "./lib/process-map.ts";
import writeAllMapOptions from "@/map-processing/lib/write-all-map-options.ts";

export default async function processAllMaps(): Promise<void> {
  const mapNames = getAllMapNames();

  const mapMetadatas = await Promise.all(
    mapNames.map((mapName) => processMap(mapName))
  );
  console.log(
    `✅🤖 Completed getting map metadata for ${mapMetadatas.length} maps`
  );

  writeAllMapOptions(mapMetadatas);
  console.log(
    `✅📝 Completed writing map metadata for ${mapMetadatas.length} maps to "server/map-processing/all-map-options.ts"`
  );
}

if (import.meta.main) {
  await processAllMaps();
}

