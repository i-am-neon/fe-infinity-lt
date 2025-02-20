import { Chapter } from "@/types/chapter.ts";

export function determineRoleForDeadUnit({
  deadName,
  lastChapter,
}: {
  deadName: string;
  lastChapter: Chapter | null;
}): "boss" | "player" | "green" | null {
  if (!lastChapter) return null;
  const foundCharacter = lastChapter.newCharacters.find(
    (ch) => ch.characterIdea.firstName === deadName
  );
  if (foundCharacter) {
    if (foundCharacter.characterIdea.firstSeenAs === "boss") {
      return "boss";
    } else if (foundCharacter.characterIdea.firstSeenAs === "allied NPC") {
      return "green";
    } else if (foundCharacter.characterIdea.firstSeenAs === "ally") {
      return "player";
    }
  }
  const foundUnit = lastChapter.level.units.find((u) => u.nid === deadName);
  if (foundUnit) {
    if (foundUnit.team === "player") return "player";
    if (foundUnit.team === "other") return "green";
    // if it's enemy, see if it matches the boss's name
    const bossName = lastChapter?.newCharacters.find(
      (c) => c.characterIdea.firstSeenAs === "boss"
    )?.characterIdea.firstName;
    if (foundUnit.nid === bossName) {
      return "boss";
    }
  }
  return null;
}
