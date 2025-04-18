import { Event } from "@/types/events/event.ts";
import { getArmoriesAndVendorsForMap } from "@/map-region-processing/get-armories-and-vendors-for-map.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { LevelRegion } from "@/types/level.ts";
import decideArmoryItems from "@/item-options/decide-armory-items.ts";
import decideVendorItems from "@/item-options/decide-vendor-items.ts";

interface ShopResult {
  region: LevelRegion;
  event: Event;
}

export default function getArmoryAndVendorEventsAndRegions({
  mapName,
  chapterNumber,
}: {
  mapName: string;
  chapterNumber: number;
}): ShopResult[] {
  const shops = getArmoriesAndVendorsForMap(
    getPathWithinServer(`assets/maps/${mapName}.json`)
  );

  return shops.map((shop, i) => {
    const shopType = shop.type;
    const regionNid = `${shopType}${i + 1}`;

    // Decide items based on shop type
    let itemsAndStock: [string, number][] = [];
    if (shopType === "Armory") {
      itemsAndStock = decideArmoryItems(chapterNumber);
    } else {
      // Vendor
      itemsAndStock = decideVendorItems(chapterNumber);
    }

    // Convert items and stock to proper format for shop command
    const itemList = itemsAndStock.map(([item]) => item).join(",");
    const stockList = itemsAndStock.map(([_, stock]) => stock).join(",");

    const region: LevelRegion = {
      nid: regionNid,
      region_type: "event",
      position: [shop.position.x, shop.position.y],
      size: [1, 1],
      sub_nid: shopType,
      condition: "True",
      time_left: null,
      only_once: false,
      interrupt_move: false,
    };

    const event: Event = {
      name: regionNid,
      trigger: shopType,
      level_nid: chapterNumber.toString(),
      condition: `region.nid == '${regionNid}'`,
      commands: [],
      only_once: false,
      priority: 20,
      _source: [
        "transition;Close",
        `shop;{unit};${itemList};${shopType};${stockList};${shopType}${chapterNumber}`,
        "transition;Open",
      ],
    };

    return { region, event };
  });
}

if (import.meta.main) {
  console.log(
    getArmoryAndVendorEventsAndRegions({
      mapName: "Knights_Villagers_Bandits_3_(0E_00_72_10)__by_Aura_Wolf",
      chapterNumber: 5,
    })
  );
}

