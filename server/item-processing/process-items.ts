import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import generateAndStoreVector from "@/vector-db/generate-and-store-vector.ts";
import { ensureDir } from "https://deno.land/std/fs/mod.ts";

// shape of objects in assets/items/items.json
interface Item {
  nid: string;
  name: string;
  desc: string;
  components: [string, unknown][];
}

interface ItemVectorData {
  id: string;
  text: string;
  metadata: Record<string, unknown>;
}

export async function processAllItems(): Promise<ItemVectorData[]> {
  console.log("Processing items for vector DB");

  // Read the items.json file
  const itemsPath = getPathWithinServer("assets/items/items.json");
  const itemsContent = await Deno.readTextFile(itemsPath);
  const items = JSON.parse(itemsContent) as Item[];

  console.log(`Found ${items.length} items to process`);

  const itemVectors: ItemVectorData[] = [];

  // Process each item and store its vector
  for (const item of items) {
    try {
      // Create the text for embedding
      const text = `${item.name}: ${item.desc}`;

      // Create metadata for the item
      const metadata: Record<string, unknown> = {
        nid: item.nid,
        name: item.name,
        description: item.desc,
      };

      // Extract only weapon_type and weapon_rank if they exist
      if (item.components) {
        const weaponTypeComponent = item.components.find(
          (component) => component[0] === "weapon_type"
        );
        const weaponRankComponent = item.components.find(
          (component) => component[0] === "weapon_rank"
        );

        if (weaponTypeComponent && weaponTypeComponent[1]) {
          metadata.weapon_type = weaponTypeComponent[1];
        }

        if (weaponRankComponent && weaponRankComponent[1]) {
          metadata.weapon_rank = weaponRankComponent[1];
        }
      }

      // Generate and store the vector
      await generateAndStoreVector({
        id: item.nid,
        text,
        metadata,
        vectorType: "items",
      });

      // Also add to our array for saving to disk
      itemVectors.push({
        id: item.nid,
        text,
        metadata,
      });

      console.log(`Processed item ${item.nid}`);
    } catch (error) {
      console.error(`Error processing item ${item.nid}`, { error });
    }
  }

  console.log("✅ Completed processing all items");
  return itemVectors;
}

export async function saveItemVectorsToFile(itemVectors: ItemVectorData[]): Promise<void> {
  // Ensure the directories exist
  await ensureDir(getPathWithinServer("vector-db/seed-data"));
  await ensureDir(getPathWithinServer("vector-db/data"));

  // Save to seed data directory
  const seedPath = getPathWithinServer("vector-db/seed-data/items.json");
  await Deno.writeTextFile(seedPath, JSON.stringify(itemVectors, null, 2));

  // Save to data directory
  const dataPath = getPathWithinServer("vector-db/data/items.json");
  await Deno.writeTextFile(dataPath, JSON.stringify(itemVectors, null, 2));

  console.log(`Saved ${itemVectors.length} item vectors to disk`);
}

export async function saveVectorsForItems(): Promise<void> {
  const itemVectors = await processAllItems();
  await saveItemVectorsToFile(itemVectors);
}

if (import.meta.main) {
  saveVectorsForItems().then(() => {
    console.log("Finished processing all items");
  });
}

