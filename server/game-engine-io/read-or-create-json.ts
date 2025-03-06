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
      console.log(`[JSON] File not found: ${filePath}, creating with fallback data at: ${fallbackWritePath}`);
      
      try {
        // Ensure the directory exists
        const dirPath = fallbackWritePath.substring(0, fallbackWritePath.lastIndexOf('/'));
        await Deno.mkdir(dirPath, { recursive: true });
        
        // Write the file
        await Deno.writeTextFile(
          fallbackWritePath,
          JSON.stringify(fallbackData, null, 2)
        );
        console.log(`[JSON] Successfully created fallback file: ${fallbackWritePath}`);
        return [fallbackData, true];
      } catch (writeError) {
        console.error(`[JSON] Failed to create fallback file:`, writeError);
        throw writeError;
      }
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