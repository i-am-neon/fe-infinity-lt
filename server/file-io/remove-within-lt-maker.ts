import { getPathWithinLtMaker } from "./get-path-within-lt-maker.ts";

export default async function removeWithinLtMaker(
  relativePath: string
): Promise<void> {
  const path = getPathWithinLtMaker(relativePath);
  await Deno.remove(path, { recursive: true });
}

if (import.meta.main) {
  removeWithinLtMaker("new.ltproj").then(() => {
    console.log("Removed test directory");
  });
}
