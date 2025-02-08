import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import getAllPortraitFileNames from "@/portrait-processing/get-all-portrait-paths.ts";

export default async function replaceColorInPortraits(): Promise<void> {
  const portraitsDir = getPathWithinServer("assets/portraits");
  const fileNames = getAllPortraitFileNames();
  for (const fileName of fileNames) {
    const filePath = `${portraitsDir}/${fileName}`;
    const imageData = await Deno.readFile(filePath);
    const img = await Image.decode(imageData);
    for (let x = 1; x <= img.width; x++) {
      for (let y = 1; y <= img.height; y++) {
        const pixel = img.getPixelAt(x, y);
        const r = (pixel >> 24) & 0xFF;
        const g = (pixel >> 16) & 0xFF;
        const b = (pixel >> 8) & 0xFF;
        const a = pixel & 0xFF;
        if (r === 160 && g === 200 && b === 152 && a === 255) {
          const newPixel = (128 << 24) | (160 << 16) | (128 << 8) | 255;
          img.setPixelAt(x, y, newPixel);
        }
      }
    }
    const encoded = await img.encode();
    await Deno.writeFile(filePath, encoded);
    console.log(`Processed: ${fileName}`);
  }
}

if (import.meta.main) {
  replaceColorInPortraits().then(() => {
    console.log("Completed processing all portrait images.");
  });
}