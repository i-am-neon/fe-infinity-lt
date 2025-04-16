import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import genPortraitMetadata from "@/portrait-processing/gen-portrait-metadata.ts";
import getAllPortraitFileNames from "@/portrait-processing/get-all-portrait-paths.ts";
import replaceBackgroundColorInPortraits from "@/portrait-processing/replace-background-color-in-portraits.ts";
import saveVectorsForAllPortraits from "@/portrait-processing/save-vectors-for-all-portraits.ts";
import writeAllPortraitOptions from "@/portrait-processing/write-all-portrait-options.ts";

export default async function processAllPortraits(forceRefresh = false): Promise<void> {
  await replaceBackgroundColorInPortraits();
  console.log(
    "✅🎨 Completed replacing background color in all portrait images"
  );
  const portraitFileNames = getAllPortraitFileNames();

  const portraitMetadatas = await Promise.all(
    portraitFileNames.map((portraitFileName) =>
      genPortraitMetadata(
        getPathWithinServer(`assets/portraits/${portraitFileName}`),
        forceRefresh
      )
    )
  );
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

  processAllPortraits(forceRefresh);
}

