import { SubGrid } from "@/types/maps/sub-grid.ts";
import { MapSetting } from "@/types/maps/map-setting.ts";

export default function getMapSetting(mapQuadrants: SubGrid[]): MapSetting {
  const indoorTerrains = new Set<string>(["Floor", "Stairs", "Pillar"]);
  const outdoorTerrains = new Set<string>([
    "Plain",
    "Road",
    "Forest",
    "Mountain",
  ]);
  let indoorCount = 0;
  let outdoorCount = 0;
  for (const quadrant of mapQuadrants) {
    for (const terrain of Object.values(quadrant.data)) {
      if (indoorTerrains.has(terrain)) {
        indoorCount++;
      } else if (outdoorTerrains.has(terrain)) {
        outdoorCount++;
      }
    }
  }
  const total = indoorCount + outdoorCount;
  if (total === 0) {
    return "outdoor";
  }
  const ratio = indoorCount / total;
  if (ratio > 0.6) {
    return "indoor";
  } else if (ratio < 0.4) {
    return "outdoor";
  } else {
    return "mixed indoor and outdoor";
  }
}

