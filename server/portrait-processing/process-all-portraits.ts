import getAllPortraitFileNames from "@/portrait-processing/get-all-portrait-paths.ts";
import genPortraitMetadata from "@/portrait-processing/gen-portrait-metadata.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import writeAllPortraitOptions from "@/portrait-processing/write-all-portrait-options.ts";
import replaceBackgroundColorInPortraits from "./replace-background-color-in-portraits.ts";

export default async function processAllPortraits(): Promise<void> {
  await replaceBackgroundColorInPortraits();
  console.log(
    "✅🎨 Completed replacing background color in all portrait images"
  );
  const portraitFileNames = getAllPortraitFileNames();

  const portraitMetadatas = await Promise.all(
    portraitFileNames.map((portraitFileName) =>
      genPortraitMetadata(
        getPathWithinServer(`assets/portraits/${portraitFileName}`)
      )
    )
  );
  console.log(
    `✅🤖 Completed getting portrait metadata for ${portraitMetadatas.length} portraits`
  );

  writeAllPortraitOptions(portraitMetadatas);
  console.log(
    `✅📝 Completed writing portrait metadata for ${portraitMetadatas.length} portraits to "server/portrait-processing/all-portrait-options.ts"`
  );
}

if (import.meta.main) {
  processAllPortraits();
}

