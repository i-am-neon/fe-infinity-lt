import { FE8Class } from "@/types/fe8-class.ts";
import { StatBoon, statBoonSchema } from "@/ai/types/stat-boons.ts";
import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";

export default function genCharacterStatBoons({
    character,
    fe8Class,
}: {
    character: CharacterIdea;
    fe8Class: FE8Class;
}): Promise<StatBoon> {
    const systemMessage = `You are a Fire Emblem character designer specializing in stat allocation.

Your task is to analyze a character concept and class, then determine which stats should be emphasized for this character.
You'll select 1-3 stats to boost for base stats and 1-3 stats to boost for growth rates, along with specific values for each boost.

Fire Emblem stats are:
- HP: Hit Points, character's health
- STR: Strength, affects physical attack power
- MAG: Magic, affects magical attack power
- SKL: Skill, affects hit rate and critical chance
- SPD: Speed, affects ability to double attack and avoid attacks
- LCK: Luck, affects various combat calculations
- DEF: Defense, reduces physical damage
- RES: Resistance, reduces magical damage
- CON: Constitution, affects ability to wield heavy weapons
- MOV: Movement, affects how far a unit can move

Choose stats that would make sense for the character concept and their class. Consider:
1. What stats would best represent the character's personality and background?
2. What stats would complement their class's natural strengths?
3. What stats would help address their class's weaknesses?

For base stat boosts, use these guidelines:
- HP: +1 to +4 points
- STR/MAG/SKL/SPD: +1 to +3 points
- LCK: +1 to +5 points
- DEF/RES: +1 to +3 points
- CON: +1 to +2 points
- MOV: +1 point (very rarely boosted)

For growth rate boosts, use these guidelines (values represent percentage points):
- HP: +5% to +20%
- STR/MAG/SKL/SPD: +5% to +15%
- LCK: +5% to +20%
- DEF/RES: +5% to +15%
- CON/MOV: These don't typically have growth rates in FE8

Higher values should be reserved for stats that are extremely important to the character concept or class.
Lower values should be used for modest boosts that help round out the character.

Provide 1-3 stats for base stat boosts and 1-3 stats for growth rate boosts with specific values and a brief explanation.`;

    return generateStructuredData<StatBoon>({
        fnName: "genCharacterStatBoons",
        systemMessage,
        prompt: `Character Name: ${character.firstName}
Full Name: ${character.fullName}
Gender: ${character.gender}
Age: ${character.age}
Personality: ${character.personality}
Backstory: ${character.backstory}
Physical Description: ${character.physicalDescription}
Class: ${fe8Class}`,
        schema: statBoonSchema,
        model: "nano",
    });
}

if (import.meta.main) {
    // Example character idea object
    const exampleCharacter: CharacterIdea = {
        firstName: "Marcus",
        fullName: "Sir Marcus von Holsten",
        gender: "male",
        personality: "Disciplined and honorable knight who values duty above all else.",
        affinity: "Anima",
        classDirection: "Horse Mounted",
        age: "mature adult",
        backstory: "Born to a noble family with a long tradition of knighthood. Trained rigorously since childhood and served the royal family for decades. Survived multiple wars and earned his reputation through unwavering loyalty and battlefield prowess.",
        firstSeenAs: "ally",
        physicalDescription: "Tall with broad shoulders, short gray hair, and a well-groomed mustache. His posture is impeccable, and he bears several scars from past battles.",
        inGameDescription: "Loyal knight with unwavering dedication to his duties",
        deathQuote: "I have served with honor... and shall die the same.",
    };

    genCharacterStatBoons({
        character: exampleCharacter,
        fe8Class: "Cavalier",
    }).then((boons) => console.log(JSON.stringify(boons, null, 2)));
}