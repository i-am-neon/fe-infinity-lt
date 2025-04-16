import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import genPortraitMetadata from "@/portrait-processing/gen-portrait-metadata.ts";
import getAllPortraitFileNames from "@/portrait-processing/get-all-portrait-paths.ts";
import replaceBackgroundColorInPortraits from "@/portrait-processing/replace-background-color-in-portraits.ts";
import saveVectorsForAllPortraits from "@/portrait-processing/save-vectors-for-all-portraits.ts";
import writeAllPortraitOptions from "@/portrait-processing/write-all-portrait-options.ts";

// Default batch size for processing portraits
const DEFAULT_BATCH_SIZE = 20;

/**
 * Process portraits in batches to avoid rate limits
 */
async function processPortraitBatches(
  portraitFileNames: string[],
  forceRefresh: boolean,
  batchSize: number
): Promise<any[]> {
  const results = [];

  for (let i = 0; i < portraitFileNames.length; i += batchSize) {
    const batch = portraitFileNames.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(portraitFileNames.length / batchSize)} (${batch.length} portraits)`);

    // Process this batch
    const batchResults = await Promise.all(
      batch.map((portraitFileName) =>
        genPortraitMetadata(
          getPathWithinServer(`assets/portraits/${portraitFileName}`),
          forceRefresh
        )
      )
    );

    results.push(...batchResults);
  }

  return results;
}

export default async function processAllPortraits(
  forceRefresh = false,
  batchSize = DEFAULT_BATCH_SIZE
): Promise<void> {
  await replaceBackgroundColorInPortraits();
  console.log(
    "✅🎨 Completed replacing background color in all portrait images"
  );
  const portraitFileNames = getAllPortraitFileNames();

  console.log(`Starting to process ${portraitFileNames.length} portraits in batches of ${batchSize}`);
  const portraitMetadatas = await processPortraitBatches(portraitFileNames, forceRefresh, batchSize);
  console.log(
    `✅🤖 Completed getting portrait metadata for ${portraitMetadatas.length} portraits`
  );

  await saveVectorsForAllPortraits(portraitMetadatas);
  console.log(
    `✅💾 Completed saving vectors for ${portraitMetadatas.length} portraits`
  );

  writeAllPortraitOptions(portraitMetadatas);
  console.log(
    `✅📝 Completed writing portrait metadata for ${portraitMetadatas.length} portraits to "server/portrait-processing/all-portrait-options.ts"`
  );
}

if (import.meta.main) {
  // Check if --force-refresh flag is provided
  const forceRefresh = Deno.args.includes("--force-refresh");
  if (forceRefresh) {
    console.log("Force refresh flag detected, will regenerate all portrait metadata");
  }

  // Check if a custom batch size is provided (format: --batch=30)
  let batchSize = DEFAULT_BATCH_SIZE;
  const batchArg = Deno.args.find(arg => arg.startsWith("--batch="));

  if (batchArg) {
    const customBatchSize = parseInt(batchArg.split("=")[1], 10);
    if (!isNaN(customBatchSize) && customBatchSize > 0) {
      batchSize = customBatchSize;
    } else {
      console.error(`Invalid batch size: ${batchArg}. Using default: ${DEFAULT_BATCH_SIZE}`);
    }
  }

  console.log(`Using batch size: ${batchSize}`);
  processAllPortraits(forceRefresh, batchSize);
}

