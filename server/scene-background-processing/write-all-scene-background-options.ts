import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default function writeAllSceneBackgroundOptions(
  options: { fileName: string; description: string }[]
): void {
  const outputPath = getPathWithinServer(
    "scene-background-processing/all-scene-background-options.ts"
  );
  const outputContent = `export const allSceneBackgroundOptions = ${JSON.stringify(
    options,
    null,
    2
  )};\n`;
  Deno.writeTextFileSync(outputPath, outputContent);
}

if (import.meta.main) {
  writeAllSceneBackgroundOptions([
    { fileName: "Boat", description: "A small wooden boat floating on calm water with a distant shoreline." },
  ]);
}