import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { ValidationResult } from "@/ai/lib/generator-checker.ts";

/**
 * Validates that characters in newPlayableUnits and newNonBattleCharacters
 * haven't already been introduced in previous chapters.
 */
export function validateNoReintroducedCharacters(
    chapterIdea: ChapterIdea,
    previousChapterIdeas?: ChapterIdea[]
): ValidationResult {
    // If there are no previous chapters, everything is valid
    if (!previousChapterIdeas || previousChapterIdeas.length === 0) {
        return { isValid: true, errors: [] };
    }

    const errors: string[] = [];

    // Get all characters from previous chapters
    const previousCharacters = previousChapterIdeas.flatMap(chapter => [
        ...(chapter.newPlayableUnits || []),
        ...(chapter.newNonBattleCharacters || []),
        chapter.boss, // Include bosses too
    ]);

    // Get previous character first names for easier comparison
    const previousCharacterNames = previousCharacters.map(char => char.firstName);

    // Check newPlayableUnits
    const newPlayableUnits = chapterIdea.newPlayableUnits || [];
    for (const character of newPlayableUnits) {
        if (previousCharacterNames.includes(character.firstName)) {
            errors.push(
                `Character "${character.firstName}" in newPlayableUnits has already been introduced in a previous chapter.`
            );
        }
    }

    // Check newNonBattleCharacters
    const newNonBattleCharacters = chapterIdea.newNonBattleCharacters || [];
    for (const character of newNonBattleCharacters) {
        if (previousCharacterNames.includes(character.firstName)) {
            errors.push(
                `Character "${character.firstName}" in newNonBattleCharacters has already been introduced in a previous chapter.`
            );
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

if (import.meta.main) {
    // Test the validator with sample data
    const previousChapter: ChapterIdea = {
        title: "Previous Chapter",
        intro: "Marcus and Elena prepare for battle.",
        battle: "They fight together.",
        outro: "Victory is achieved.",
        boss: {
            firstName: "Villain",
            fullName: "Villain Full",
            gender: "male",
            personality: "Evil",
            affinity: "Dark",
            classDirection: "Dark Mage",
            age: "mature adult",
            backstory: "Was always evil.",
            firstSeenAs: "boss",
            physicalDescription: "Scary looking",
            inGameDescription: "An evil boss",
            deathQuote: "I will return!"
        },
        enemyFaction: {
            nid: "evil",
            name: "Evil",
            desc: "They're evil",
            icon_nid: "EvilEmblem"
        },
        newPlayableUnits: [
            {
                firstName: "Marcus",
                fullName: "Marcus Full",
                gender: "male",
                personality: "Brave",
                affinity: "Light",
                classDirection: "Knight",
                age: "young adult",
                backstory: "Born brave.",
                firstSeenAs: "ally",
                physicalDescription: "Looks brave",
                inGameDescription: "A brave ally",
                deathQuote: "Farewell!"
            }
        ],
        newNonBattleCharacters: [
            {
                firstName: "Elena",
                fullName: "Elena Full",
                gender: "female",
                personality: "Kind",
                affinity: "Light",
                classDirection: "Cleric",
                age: "young adult",
                backstory: "Grew up in a temple.",
                firstSeenAs: "ally",
                physicalDescription: "Serene",
                inGameDescription: "A kind ally",
                deathQuote: "Go on without me..."
            }
        ],
        endOfChapterChoice: {
            displayText: "What next?",
            options: ["Option 1", "Option 2"]
        }
    };

    const currentChapter: ChapterIdea = {
        title: "Current Chapter",
        intro: "Marcus and Sophia talk about their next move.",
        battle: "They fight new enemies.",
        outro: "Elena rejoins the group.",
        boss: {
            firstName: "NewBoss",
            fullName: "New Boss",
            gender: "male",
            personality: "Angry",
            affinity: "Fire",
            classDirection: "Berserker",
            age: "mature adult",
            backstory: "Angry past.",
            firstSeenAs: "boss",
            physicalDescription: "Muscular",
            inGameDescription: "An angry boss",
            deathQuote: "No!"
        },
        enemyFaction: {
            nid: "angry",
            name: "Angry",
            desc: "They're angry",
            icon_nid: "AngryEmblem"
        },
        newPlayableUnits: [
            {
                firstName: "Sophia",
                fullName: "Sophia Full",
                gender: "female",
                personality: "Smart",
                affinity: "Wind",
                classDirection: "Mage",
                age: "young adult",
                backstory: "Studied magic.",
                firstSeenAs: "ally",
                physicalDescription: "Scholarly",
                inGameDescription: "A smart ally",
                deathQuote: "My research..."
            },
            {
                firstName: "Marcus", // Reintroduced character - should fail validation
                fullName: "Marcus Again",
                gender: "male",
                personality: "Different",
                affinity: "Dark",
                classDirection: "Fighter",
                age: "young adult",
                backstory: "Different backstory.",
                firstSeenAs: "enemy non-boss",
                physicalDescription: "Different look",
                inGameDescription: "A different ally",
                deathQuote: "Different quote"
            }
        ],
        newNonBattleCharacters: [
            {
                firstName: "Elena", // Reintroduced character - should fail validation
                fullName: "Elena Again",
                gender: "female",
                personality: "Different",
                affinity: "Dark",
                classDirection: "Villager",
                age: "young adult",
                backstory: "Different backstory.",
                firstSeenAs: "allied NPC",
                physicalDescription: "Different look",
                inGameDescription: "A different character",
                deathQuote: "Different quote"
            }
        ],
        endOfChapterChoice: {
            displayText: "What next?",
            options: ["Option 1", "Option 2"]
        }
    };

    const result = validateNoReintroducedCharacters(currentChapter, [previousChapter]);
    console.log("Validation result:", result);
} 