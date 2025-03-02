import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getAllPortraitFileNames from "@/portrait-processing/get-all-portrait-paths.ts";

export default async function replaceBackgroundColorInPortraits(): Promise<void> {
  const portraitsDir = getPathWithinServer("assets/portraits");
  const fileNames = getAllPortraitFileNames();

  for (const fileName of fileNames) {
    const filePath = `${portraitsDir}/${fileName}`;
    const imageData = await Deno.readFile(filePath);
    const img = await Image.decode(imageData);

    if (img.width === 0 || img.height === 0) {
      console.warn(`Skipping empty image: ${fileName}`);
      continue;
    }

    // Get the color of the top-left pixel at (1,1) due to 1-based indexing in imagescript
    const referencePixel = img.getPixelAt(1, 1);

    // New color to replace the background
    const newPixel = (128 << 24) | (160 << 16) | (128 << 8) | 255;

    // Iterate over every pixel and replace matching colors
    for (let x = 1; x <= img.width; x++) {
      for (let y = 1; y <= img.height; y++) {
        if (img.getPixelAt(x, y) === referencePixel) {
          img.setPixelAt(x, y, newPixel);
        }
      }
    }

    const encoded = await img.encode();
    await Deno.writeFile(filePath, encoded);
  }
}

if (import.meta.main) {
  replaceBackgroundColorInPortraits().then(() => {
    console.log("Completed processing all portrait images.");
  });
}

