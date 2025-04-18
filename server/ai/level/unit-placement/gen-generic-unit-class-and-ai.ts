import { FE8Class, FE8ClassSchema } from "@/types/fe8-class.ts";
import { EnemyAIGroup, EnemyAIGroupSchema } from "@/ai/types/enemy-ai-group.ts";
import generateStructuredData from "../../lib/generate-structured-data.ts";
import { z } from "zod";

export default async function genGenericUnitClassAndAi(description: string): Promise<{ class: FE8Class, aiGroup: EnemyAIGroup }> {
    const systemMessage = `
    You are an advanced Fire Emblem Tactician. Your task is to determine the most appropriate unit class and AI behavior group based on the provided unit description.

    Choose the most fitting Fire Emblem class from the established FE8 class system, and assign an appropriate AI behavior pattern from the available options.

    Only the following classes may be assigned the "PursueVillage" AI group to raid villages: Brigand, Pirate, Berserker, and Warrior. Do not assign "PursueVillage" to any other class.
  `.trim();

    // Define the schema for the structured data
    const schema = z.object({
        class: FE8ClassSchema,
        aiGroup: EnemyAIGroupSchema
    });

    // Generate the appropriate class and AI group based on the description
    const result = await generateStructuredData({
        fnName: "genUnitClassAndAi",
        systemMessage,
        prompt: `Generate the appropriate unit class and AI group based on this description: ${description}`,
        schema,
        temperature: 0,
        model: "nano",
        logResults: false,
    });

    // Apply specific rules for certain class types
    let aiGroup = result.aiGroup;

    // If the unit is one of the village raider types, assign PursueVillage AI
    if (["Brigand", "Pirate", "Berserker", "Warrior"].includes(result.class)) {
        aiGroup = "PursueVillage";
    }

    // If the unit is a thief-type unit, assign Thief or SimpleThief AI
    if (["Thief", "Rogue", "Assassin"].includes(result.class)) {
        aiGroup = Math.random() < 0.5 ? "Thief" : "SimpleThief";
    }

    // If the unit is a staff-using unit, assign Heal AI
    if (["Cleric", "Bishop", "Troubadour", "Valkyrie", "Sage", "Mage Knight"].includes(result.class)) {
        aiGroup = "Heal";
    }

    return {
        class: result.class,
        aiGroup
    };
}

// Test the function if it's being run directly
if (import.meta.main) {
    const examples = [
        "A swift swordsman who aggressively pursues enemies",
        "A heavily armored knight guarding the entrance to the castle",
        "A crafty thief looking for valuables in villages",
        "A cleric supporting allied troops in battle",
        "A powerful berserker who raids nearby settlements"
    ];

    for (const example of examples) {
        console.log(`Testing description: "${example}"`);
        genGenericUnitClassAndAi(example).then(result => {
            console.log(`Result: Class = ${result.class}, AI Group = ${result.aiGroup}`);
            console.log("---");
        });
    }
}