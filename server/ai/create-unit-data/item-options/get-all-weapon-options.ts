import { WeaponRank, WeaponType } from "@/types/character/weapon-type.ts";
import { weaponRankExpMap } from "@/ai/create-unit-data/get-weapon-exp.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

interface RawItemData {
  nid: string;
  name: string;
  components: [string, any][];
}

interface WeaponOption {
  nid: string;
  name: string;
  levelRequired: WeaponRank;
  type: WeaponType;
}

export default function getAllWeaponOptions(
  data: RawItemData[]
): WeaponOption[] {
  return data.reduce<WeaponOption[]>((acc, entry) => {
    const weaponType = entry.components.find(
      ([key]) => key === "weapon_type"
    )?.[1] as WeaponType;
    const weaponRank = entry.components.find(
      ([key]) => key === "weapon_rank"
    )?.[1] as keyof typeof weaponRankExpMap;
    if (!weaponType || !weaponRank) return acc;
    acc.push({
      nid: entry.nid,
      name: entry.name,
      levelRequired: weaponRank,
      type: weaponType,
    });
    return acc;
  }, []);
}

if (import.meta.main) {
  const data: RawItemData[] = JSON.parse(
    Deno.readTextFileSync(getPathWithinServer("assets/items/items.json"))
  );
  console.log(getAllWeaponOptions(data));
}

