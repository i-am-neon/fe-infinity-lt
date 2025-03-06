import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export default async function removeWithinLtMaker({
  relativePath,
  preserveDirectory = false,
}: {
  relativePath: string;
  preserveDirectory?: boolean;
}): Promise<void> {
  const path = getPathWithinLtMaker(relativePath);

  if (preserveDirectory) {
    try {
      // Ensure directory exists
      await Deno.mkdir(path, { recursive: true });

      // Then clear its contents
      const entries = Deno.readDir(path);
      for await (const entry of entries) {
        await Deno.remove(`${path}/${entry.name}`, { recursive: true });
      }
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }
      // If directory doesn't exist, create it
      await Deno.mkdir(path, { recursive: true });
    }
  } else {
    try {
      await Deno.remove(path, { recursive: true });
      // deno-lint-ignore no-explicit-any
    } catch (err: any) {
      if (err instanceof Deno.errors.NotFound) {
        return;
      }
      if (
        err.message.includes("os error 66") ||
        err.message.includes("Directory not empty")
      ) {
        const entries = Deno.readDir(path);
        for await (const entry of entries) {
          await Deno.remove(`${path}/${entry.name}`, { recursive: true });
        }
        await Deno.remove(path);
      } else {
        throw err;
      }
    }
  }
}

if (import.meta.main) {
  removeWithinLtMaker({ relativePath: "new.ltproj" }).then(() => {
    console.log("Removed test directory");
  });
}

