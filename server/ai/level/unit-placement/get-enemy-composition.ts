import { EnemyComposition } from "@/ai/types/enemy-composition.ts";

export default function getEnemyComposition(chapter: number): EnemyComposition {
  if (chapter < 1 || chapter > 30) {
    throw new Error("Chapter number must be between 1 and 30.");
  }

  let promotedPercentage = 0;

  if (chapter <= 8) {
    // Early game: Mostly unpromoted enemies
    promotedPercentage = 0;
  } else if (chapter <= 10) {
    // Introduction of promoted enemies (10%)
    promotedPercentage = 10;
  } else if (chapter <= 13) {
    // Mid-game scaling (20-30%)
    promotedPercentage = 20 + (chapter - 11) * 5; // 20%, 25%, 30%
  } else if (chapter <= 16) {
    // Stronger enemies appearing (35-50%)
    promotedPercentage = 35 + (chapter - 14) * 7.5; // 35%, 42.5%, 50%
  } else if (chapter <= 20) {
    // Late-game composition (50-70%)
    promotedPercentage = 50 + (chapter - 17) * 10; // 50%, 60%, 70%
  } else if (chapter <= 25) {
    // Very strong enemies (70-85%)
    promotedPercentage = 70 + (chapter - 21) * 5; // 70%, 75%, 80%, 85%
  } else {
    // Final chapters: Mostly promoted (85-100%)
    promotedPercentage = 85 + (chapter - 26) * 5; // 85%, 90%, 95%, 100%
  }

  return {
    unpromoted: 100 - promotedPercentage,
    promoted: promotedPercentage,
  };
}

if (import.meta.main) {
  const result = getEnemyComposition(1);
  console.log(result);
}

