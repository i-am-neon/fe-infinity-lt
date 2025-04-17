import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { ValidationResult } from "@/ai/lib/generator-checker.ts";

/**
 * Validates that no character appears in both newPlayableUnits and newNonBattleCharacters.
 */
export function validateDistinctNewCharacters(
  chapterIdea: ChapterIdea
): ValidationResult {
  const errors: string[] = [];
  const playables = chapterIdea.newPlayableUnits ?? [];
  const nonBattles = chapterIdea.newNonBattleCharacters ?? [];
  const playableNames = playables.map((c) => c.firstName);
  const nonBattleNames = nonBattles.map((c) => c.firstName);
  const duplicates = playableNames.filter((name) =>
    nonBattleNames.includes(name)
  );
  if (duplicates.length > 0) {
    errors.push(
      `Characters ${duplicates.join(
        ", "
      )} appear in both newPlayableUnits and newNonBattleCharacters.`
    );
  }
  return { isValid: errors.length === 0, errors };
}