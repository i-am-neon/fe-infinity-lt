import { MapSize } from "@/ai/types/map-size.ts";

export type EnemyCountRange = {
  min: number;
  max: number;
};

export default function getGenericEnemyCountNumberRange(
  mapSize: MapSize
): EnemyCountRange {
  const { width, height } = mapSize;
  const mapArea = width * height;
  const base = Math.floor(mapArea / 15);
  let min = Math.floor(base * 0.9) + 2;
  let max = Math.floor(base * 1.2) + 5;
  if (min < 2) min = 2;
  if (max < min) max = min;
  return { min, max };
}

if (import.meta.main) {
  const smallMapRange = getGenericEnemyCountNumberRange({
    width: 14,
    height: 9,
  });
  console.log("Chapter 1, small map range:", smallMapRange);

  const mediumMapRange = getGenericEnemyCountNumberRange({
    width: 14,
    height: 14,
  });
  console.log("Chapter 2, medium map range:", mediumMapRange);

  const largeMapRange = getGenericEnemyCountNumberRange({
    width: 14,
    height: 20,
  });
  console.log("Chapter 5, large map range:", largeMapRange);
}

