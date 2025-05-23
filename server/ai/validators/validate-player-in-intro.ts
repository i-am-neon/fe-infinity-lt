import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { ValidationResult } from "@/ai/lib/generator-checker.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";

/**
 * Validates that all new characters with firstSeenAs = "ally" are mentioned in the intro text.
 * For the prologue chapter, this excludes characters defined in the initialGameIdea.
 */
export function validatePlayerInIntro(
    chapterIdea: ChapterIdea,
    chapterNumber?: number,
    initialGameIdea?: InitialGameIdea
): ValidationResult {
    const errors: string[] = [];

    // Get all new playable units with firstSeenAs = "ally"
    const newPlayerUnits = (chapterIdea.newPlayableUnits || [])
        .filter(unit => unit.firstSeenAs === "ally");

    // If this is the prologue (chapter 0) and we have initialGameIdea
    const isPrologue = chapterNumber === 0 && initialGameIdea;

    // For prologue, exclude characters that are defined in the initialGameIdea
    let unitsToCheck = newPlayerUnits;
    if (isPrologue && initialGameIdea) {
        // Get list of character first names from initialGameIdea
        const initialGameCharacterNames = initialGameIdea.characterIdeas.map(
            char => char.firstName
        );

        // Filter out units that are already defined in initialGameIdea
        unitsToCheck = newPlayerUnits.filter(
            unit => !initialGameCharacterNames.includes(unit.firstName)
        );
    }

    // Check if each player character's firstName is mentioned in the intro section
    for (const character of unitsToCheck) {
        const isNameMentionedInIntro = chapterIdea.intro.includes(character.firstName);

        if (!isNameMentionedInIntro) {
            errors.push(`Character "${character.firstName}" has firstSeenAs = "ally" but is not mentioned in the intro text.`);
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
        intro: "Silas walks alone.",
        battle: "Marcus and Silas fight enemies.",
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
                firstName: "Silas",
                fullName: "Silas Greywood",
                gender: "male",
                personality: "Brave",
                affinity: "Light",
                classDirection: "Knight",
                age: "young adult",
                backstory: "Born brave.",
                firstSeenAs: "ally",
                physicalDescription: "Strong and armored",
                inGameDescription: "A brave knight",
                deathQuote: "Farewell!"
            },
            {
                firstName: "Marcus",
                fullName: "Marcus Veil",
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

    const result = validatePlayerInIntro(sampleChapterIdea);
    console.log("Validation result:", result);
} 