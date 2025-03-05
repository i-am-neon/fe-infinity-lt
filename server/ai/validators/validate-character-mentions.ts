import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { ValidationResult } from "@/ai/lib/generator-checker.ts";

/**
 * Validates that all new characters in the chapter idea are mentioned by name in the intro, battle, or outro text.
 */
export function validateCharacterMentions(chapterIdea: ChapterIdea): ValidationResult {
  const errors: string[] = [];
  
  // Collect all new characters
  const newCharacters = [
    ...(chapterIdea.newPlayableUnits || []),
    ...(chapterIdea.newNonBattleCharacters || []),
  ];
  
  // Check if each character's firstName is mentioned in any of the text sections
  for (const character of newCharacters) {
    const isNameMentioned =
      chapterIdea.intro.includes(character.firstName) ||
      chapterIdea.battle.includes(character.firstName) ||
      chapterIdea.outro.includes(character.firstName);
    
    if (!isNameMentioned) {
      errors.push(`Character "${character.firstName}" is not mentioned in the intro, battle, or outro text.`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

if (import.meta.main) {
  // Test the validator with a sample chapter idea
  const sampleChapterIdea: ChapterIdea = {
    title: "Test Chapter",
    intro: "Silas and Evelyn walk together.",
    battle: "They fight enemies.",
    outro: "Victory is achieved.",
    boss: {
      firstName: "Boss",
      fullName: "Boss Full",
      gender: "male",
      personality: "Evil",
      affinity: "Dark",
      classDirection: "Warrior",
      age: "mature adult",
      backstory: "Was always evil.",
      firstSeenAs: "boss",
      physicalDescription: "Scary looking",
      inGameDescription: "An evil boss",
      deathQuote: "I am defeated!"
    },
    enemyFaction: {
      nid: "evil",
      name: "Evil",
      desc: "They're evil",
      icon_nid: "EvilEmblem"
    },
    newPlayableUnits: [
      {
        firstName: "Evelyn",
        fullName: "Evelyn Full",
        gender: "female",
        personality: "Brave",
        affinity: "Light",
        classDirection: "Pegasus Knight",
        age: "young adult",
        backstory: "Born brave.",
        firstSeenAs: "ally",
        physicalDescription: "Looks brave",
        inGameDescription: "A brave ally",
        deathQuote: "Farewell!"
      },
      {
        firstName: "Missing",
        fullName: "Missing Person",
        gender: "male",
        personality: "Quiet",
        affinity: "Wind",
        classDirection: "Archer",
        age: "young adult",
        backstory: "Very quiet person.",
        firstSeenAs: "ally",
        physicalDescription: "Unremarkable",
        inGameDescription: "A quiet ally",
        deathQuote: "..."
      }
    ],
    endOfChapterChoice: {
      displayText: "What next?",
      options: ["Option 1", "Option 2"]
    }
  };
  
  const result = validateCharacterMentions(sampleChapterIdea);
  console.log("Validation result:", result);
}