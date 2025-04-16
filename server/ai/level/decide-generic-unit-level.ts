import { FE8Class, PromotedFE8Classes } from "@/types/fe8-class.ts";

export default function decideGenericUnitLevel({
  chapter,
  fe8Class,
}: {
  chapter: number;
  fe8Class: FE8Class;
}): number {
  if (chapter === 0) {
    return 1;
  }
  function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const isPromoted = (PromotedFE8Classes as readonly FE8Class[]).includes(
    fe8Class
  );

  const chunkIndex = Math.floor((chapter - 1) / 3);
  const clampedIndex = Math.max(0, Math.min(chunkIndex, 9));

  // Make base a bit lower than player's.
  let baseUnpromoted = Math.max(1, clampedIndex * 2 - 1);
  let minLevel = baseUnpromoted;
  let maxLevel = baseUnpromoted + 1;

  if (isPromoted) {
    // Use a smaller offset for promoted enemies so they're not too high.
    minLevel += 8;
    maxLevel += 9;
  }

  return randomInRange(minLevel, maxLevel);
}

if (import.meta.main) {
  // Example usage
  const testChapters = [0, 1, 3, 5, 7, 10, 12, 15, 18, 20, 25, 30];
  for (const ch of testChapters) {
    const lvl = decideGenericUnitLevel({ chapter: ch, fe8Class: "Fighter" });
    console.log(`Chapter ${ch} => generic Fighter level=${lvl}`);
  }
}