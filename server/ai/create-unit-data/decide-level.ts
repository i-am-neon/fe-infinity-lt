export default function decideLevel(chapter: number): {
  isPromoted: boolean;
  level: number;
} {
  function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const chunkIndex = Math.floor((chapter - 1) / 3);
  const clampedIndex = Math.max(0, Math.min(chunkIndex, 9));

  // Each chunk increases chance of promotion by 10%. If chunkIndex is 9 or above, it's 90% or higher.
  const promotionChance = clampedIndex * 10;
  const isPromoted = Math.random() * 100 < promotionChance;

  // Base level calculation for unpromoted (more striation):
  const baseUnpromoted = clampedIndex * 2 + 1; // chunk 0 => 1..2, chunk 1 => 3..4, etc.
  let minLevel = baseUnpromoted;
  let maxLevel = baseUnpromoted + 1;

  // If promoted, shift the base range upward
  if (isPromoted) {
    minLevel += 10;
    maxLevel += 12;
  }

  const level = randomInRange(minLevel, maxLevel);
  return { isPromoted, level };
}

if (import.meta.main) {
  // Example usage
  const testChapters = [1, 3, 5, 7, 10, 12, 15, 18, 20, 25, 30];
  for (const ch of testChapters) {
    const { isPromoted, level } = decideLevel(ch);
    console.log(`Chapter ${ch} => promoted=${isPromoted}, level=${level}`);
  }
}