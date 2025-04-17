import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";

export interface ModifyItemOptions {
  projectNameEndingInDotLtProj: string;
  nid: string;
  componentKey: string;
  newValue: unknown;
}

export default async function modifyItem({
  projectNameEndingInDotLtProj,
  nid,
  componentKey,
  newValue,
}: ModifyItemOptions): Promise<void> {
  const filePath = getPathWithinLtMaker(
    `${projectNameEndingInDotLtProj}/game_data/items.json`
  );

  const [itemsData, wasFallback] = await readOrCreateJSON<
    Array<{ nid: string; components?: [string, unknown][] }>
  >(filePath, [], filePath);

  // Find the item with the given nid
  const item = itemsData.find((entry) => entry.nid === nid);
  if (!item) {
    throw new Error(`Item with nid '${nid}' not found in ${filePath}`);
  }

  // Ensure components array exists
  if (!Array.isArray(item.components)) {
    item.components = [];
  }

  // Find the component within the item's components
  let found = false;
  for (const comp of item.components) {
    if (comp[0] === componentKey) {
      comp[1] = newValue;
      found = true;
      break;
    }
  }

  // If the component key was not found, append it
  if (!found) {
    item.components.push([componentKey, newValue]);
  }

  // Write back unless this was a fallback empty file
  if (!wasFallback) {
    await Deno.writeTextFile(filePath, JSON.stringify(itemsData, null, 2));
  }
}

// Example usage when run directly
if (import.meta.main) {
  modifyItem({
    projectNameEndingInDotLtProj: "_the-grand-tourney.ltproj",
    nid: "Mend",
    componentKey: "equation_heal",
    newValue: "MEND",
  }).then(() => {
    console.log("Item component updated successfully.");
  }).catch((err) => {
    console.error(err);
  });
}