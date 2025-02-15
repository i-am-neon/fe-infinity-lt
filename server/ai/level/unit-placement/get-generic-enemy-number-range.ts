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
  const base = Math.floor(mapArea / 15);
  let min = Math.floor(base * 0.9) + 2;
  let max = Math.floor(base * 1.2) + 5;
  if (min < 2) min = 2;
  if (max < min) max = min;

  if (chapter <= 3) {
    min -= 2;
    max -= 3;
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

