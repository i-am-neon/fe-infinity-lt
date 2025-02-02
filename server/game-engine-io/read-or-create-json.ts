"use server";

export default async function readOrCreateJSON<T>(
  filePath: string,
  fallbackData: T,
  fallbackWritePath?: string
): Promise<[T, boolean]> {
  try {
    const content = await Deno.readTextFile(filePath);
    const parsed = JSON.parse(content) as T;
    return [parsed, false];
  } catch (error) {
    if (error instanceof Deno.errors.NotFound && fallbackWritePath) {
      await Deno.writeTextFile(
        fallbackWritePath,
        JSON.stringify(fallbackData, null, 2)
      );
      return [fallbackData, true];
    }
    throw error;
  }
}

if (import.meta.main) {
  // Example usage
  readOrCreateJSON<{ foo: string }>("nonexistent-file.json", { foo: "bar" }, "fallback.json").then(
    ([data, wasFallback]) => {
      console.log("Read or created JSON:", data, "Fallback used?", wasFallback);
    }
  );
}