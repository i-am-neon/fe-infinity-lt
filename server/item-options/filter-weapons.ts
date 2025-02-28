import getAllWeaponOptions, {
  RawItemData,
  WeaponOption,
} from "./get-all-weapon-options.ts";
import { WeaponType } from "@/types/character/weapon-type.ts";
import { weaponRankExpMap } from "@/ai/create-unit-data/get-weapon-exp.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default function filterWeapons({
  desiredType,
  minRank,
  maxRank,
}: {
  desiredType: WeaponType;
  minRank?: keyof typeof weaponRankExpMap;
  maxRank?: keyof typeof weaponRankExpMap;
}): WeaponOption[] {
  const data: RawItemData[] = JSON.parse(
    Deno.readTextFileSync(getPathWithinServer("assets/items/items.json"))
  );
  const allOptions = getAllWeaponOptions(data);

  const minVal = minRank ? weaponRankExpMap[minRank] : 1;
  const maxVal = maxRank ? weaponRankExpMap[maxRank] : 251;

  return allOptions.filter((weapon) => {
    const wVal = weaponRankExpMap[weapon.levelRequired];
    return weapon.type === desiredType && wVal >= minVal && wVal <= maxVal;
  });
}

if (import.meta.main) {
  console.log(
    "Matching Weapons (Sword, minRank=D):",
    filterWeapons({ desiredType: "Sword", minRank: "D" })
  );
  console.log(
    "Matching Weapons (Bow, maxRank=C):",
    filterWeapons({ desiredType: "Bow", maxRank: "C" })
  );
  console.log(
    "Matching Weapons (Dark, minRank=C, maxRank=B):",
    filterWeapons({ desiredType: "Dark", minRank: "C", maxRank: "B" })
  );
}

