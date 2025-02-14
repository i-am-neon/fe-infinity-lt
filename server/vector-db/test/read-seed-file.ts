import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function readSeedFile(filePath: string): Promise<void> {
  let data: Array<{
    id: string;
    embedding: number[];
    metadata: Record<string, unknown>;
  }> = [];
  try {
    const content = await Deno.readTextFile(filePath);
    data = JSON.parse(content);
  } catch (err) {
    console.error("Error reading or parsing file:", filePath, err);
    return;
  }

  console.log(`Found ${data.length} entries in ${filePath}.`);
  data.forEach((entry, index) => {
    console.log(`\nEntry #${index + 1} ID: ${entry.id}`);
    console.log("Metadata:", JSON.stringify(entry.metadata));
  });
}

if (import.meta.main) {
  await readSeedFile(
    getPathWithinServer("vector-db/seed-vectors/portraits.json")
  );
}

