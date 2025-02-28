import { RawItemData } from "@/ai/create-unit-data/item-options/get-all-weapon-options.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

/**
 * This interface represents non-weapon items, such as consumables, stat boosters,
 * keys, or any other items that do not have a weapon_type or weapon_rank.
 */
export interface NonWeaponItem {
  nid: string;
  name: string;
}

/**
 * Returns a list of all non-weapon items from the provided raw item data.
 * These are items that do NOT have a "weapon_type" or "weapon_rank" component.
 */
export default function getAllNonWeaponItems(data: RawItemData[]): NonWeaponItem[] {
  return data.reduce<NonWeaponItem[]>((acc, entry) => {
    const isWeapon = entry.components.some(([key]) => key === "weapon_type" || key === "weapon_rank");
    if (!isWeapon) {
      acc.push({
        nid: entry.nid,
        name: entry.name,
      });
    }
    return acc;
  }, []);
}

if (import.meta.main) {
  const dataPath = getPathWithinServer("assets/items/items.json");
  const content = Deno.readTextFileSync(dataPath);
  const rawData: RawItemData[] = JSON.parse(content);
  const nonWeaponItems = getAllNonWeaponItems(rawData);
  console.log(nonWeaponItems);
}