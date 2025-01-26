import { getPathWithinLtMaker } from "./get-path-within-lt-maker.ts";

export default async function removeWithinLtMaker({
  relativePath,
  preserveDirectory = false,
}: {
  relativePath: string;
  preserveDirectory?: boolean;
}): Promise<void> {
  const path = getPathWithinLtMaker(relativePath);

  if (preserveDirectory) {
    const entries = Deno.readDir(path);
    for await (const entry of entries) {
      await Deno.remove(`${path}/${entry.name}`, { recursive: true });
    }
  } else {
    await Deno.remove(path, { recursive: true });
  }
}

if (import.meta.main) {
  removeWithinLtMaker({ relativePath: "new.ltproj" }).then(() => {
    console.log("Removed test directory");
  });
}

