import { MapSize } from "@/ai/types/map-size.ts";

export type EnemyCountRange = {
  min: number;
  max: number;
};

export default function getGenericEnemyCountNumberRange({
  mapSize,
  chapter,
}: {
  mapSize: MapSize;
  chapter: number;
}): EnemyCountRange {
  const { width, height } = mapSize;
  const mapArea = width * height;
  const base = Math.floor(mapArea / 30); // Doubled the divisor to halve the base
  let min = Math.floor(base * 0.9) + 1; // Reduced the addition from 2 to 1
  let max = Math.floor(base * 1.2) + 3; // Reduced the addition from 5 to 3
  if (min < 1) min = 1; // Lowered the minimum from 2 to 1
  if (max < min) max = min;

  if (chapter <= 3) {
    min -= 1; // Reduced the subtraction from 2 to 1
    max -= 2; // Reduced the subtraction from 3 to 2
    if (min < 1) min = 1;
    if (max < min) max = min;
  }

  return { min, max };
}

if (import.meta.main) {
  const smallMapRange = getGenericEnemyCountNumberRange({
    mapSize: {
      width: 14,
      height: 9,
    },
    chapter: 1,
  });
  console.log("Chapter 1, small map range:", smallMapRange);

  const mediumMapRange = getGenericEnemyCountNumberRange({
    mapSize: {
      width: 14,
      height: 14,
    },
    chapter: 2,
  });
  console.log("Chapter 2, medium map range:", mediumMapRange);

  const largeMapRange = getGenericEnemyCountNumberRange({
    mapSize: {
      width: 14,
      height: 20,
    },
    chapter: 5,
  });
  console.log("Chapter 5, large map range:", largeMapRange);
}
