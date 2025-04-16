import getAllMapNames from "@/map-processing/lib/get-all-map-json-files.ts";
import processMap from "@/map-processing/lib/process-map.ts";
import writeAllMapOptions from "@/map-processing/lib/write-all-map-options.ts";
import saveVectorsForAllMaps from "@/map-processing/lib/save-vectors-for-all-maps.ts";

// Default batch size for processing maps
const DEFAULT_BATCH_SIZE = 20;

/**
 * Process maps in batches to avoid rate limits
 */
async function processMapBatches(mapNames: string[], batchSize: number): Promise<any[]> {
  const results = [];

  for (let i = 0; i < mapNames.length; i += batchSize) {
    const batch = mapNames.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(mapNames.length / batchSize)} (${batch.length} maps)`);

    // Process this batch
    const batchResults = await Promise.all(
      batch.map((mapName) => processMap(mapName))
    );

    results.push(...batchResults);
  }

  return results;
}

export default async function processAllMaps(batchSize = DEFAULT_BATCH_SIZE): Promise<void> {
  const mapNames = getAllMapNames();

  console.log(`Starting to process ${mapNames.length} maps in batches of ${batchSize}`);
  const mapMetadatas = await processMapBatches(mapNames, batchSize);
  console.log(
    `✅🤖 Completed getting map metadata for ${mapMetadatas.length} maps`
  );

  await saveVectorsForAllMaps(mapMetadatas);
  console.log(`✅💾 Completed saving vectors for ${mapMetadatas.length} maps`);

  writeAllMapOptions(mapMetadatas);
  console.log(
    `✅📝 Completed writing map metadata for ${mapMetadatas.length} maps to "server/map-processing/all-map-options.ts"`
  );
}

if (import.meta.main) {
  // Check if a custom batch size is provided as a CLI argument
  const customBatchSize = Deno.args.length > 0 ? parseInt(Deno.args[0], 10) : DEFAULT_BATCH_SIZE;

  if (isNaN(customBatchSize) || customBatchSize < 1) {
    console.error(`Invalid batch size: ${Deno.args[0]}. Using default: ${DEFAULT_BATCH_SIZE}`);
    await processAllMaps();
  } else {
    await processAllMaps(customBatchSize);
  }
}

