import { assertEquals } from "https://deno.land/std/assert/mod.ts";
import { validateAiEventPortraits } from "./validate-ai-event.ts";
import test from "node:test";

// deno test server/ai/events/validate-ai-event.test.ts

test("validateAiEventPortraits - handles null or invalid input", () => {
    assertEquals(validateAiEventPortraits(null), { isValid: true, errors: [] });
    assertEquals(validateAiEventPortraits({}), { isValid: true, errors: [] });
    assertEquals(validateAiEventPortraits({ sourceObjects: "not an array" }), { isValid: true, errors: [] });
});

test("validateAiEventPortraits - validates speaking without portrait", () => {
    const event = {
        sourceObjects: [
            { command: "speak", args: ["John", "Hello world!"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, false);
    assertEquals(result.errors.length, 1);
    assertEquals(result.errors[0], "Speaker 'John' does not have a prior add_portrait command.");
});

test("validateAiEventPortraits - validates speaking with portrait", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["John"] },
            { command: "speak", args: ["John", "Hello world!"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, true);
    assertEquals(result.errors.length, 0);
});

test("validateAiEventPortraits - handles speaker names with parentheses", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["John"] },
            { command: "speak", args: ["John(Happy)", "Hello world!"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, true);
    assertEquals(result.errors.length, 0);
});

test("validateAiEventPortraits - handles portrait removal", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["John"] },
            { command: "add_portrait", args: ["Jane"] },
            { command: "speak", args: ["John", "Hello!"] },
            { command: "remove_portrait", args: ["John"] },
            { command: "speak", args: ["Jane", "Hi there!"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, true);
    assertEquals(result.errors.length, 0);
});

test("validateAiEventPortraits - validates too many portraits", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["Character1"] },
            { command: "add_portrait", args: ["Character2"] },
            { command: "add_portrait", args: ["Character3"] },
            { command: "add_portrait", args: ["Character4"] },
            { command: "add_portrait", args: ["Character5"] },
            { command: "add_portrait", args: ["Character6"] },
            { command: "add_portrait", args: ["Character7"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, false);
    assertEquals(result.errors.length, 1);
    assertEquals(
        result.errors[0],
        "Too many visible portraits (7) at command index 6. Use remove_portrait before adding new portraits."
    );
});

test("validateAiEventPortraits - handles multiple errors", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["Character1"] },
            { command: "add_portrait", args: ["Character2"] },
            { command: "add_portrait", args: ["Character3"] },
            { command: "add_portrait", args: ["Character4"] },
            { command: "add_portrait", args: ["Character5"] },
            { command: "add_portrait", args: ["Character6"] },
            { command: "add_portrait", args: ["Character7"] },
            { command: "speak", args: ["Character8", "Hello!"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, false);
    assertEquals(result.errors.length, 2);
    assertEquals(
        result.errors[0],
        "Too many visible portraits (7) at command index 6. Use remove_portrait before adding new portraits."
    );
    assertEquals(result.errors[1], "Speaker 'Character8' does not have a prior add_portrait command.");
});

test("validateAiEventPortraits - complex scenario with adds and removes", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["Character1"] },
            { command: "add_portrait", args: ["Character2"] },
            { command: "speak", args: ["Character1", "Hello!"] },
            { command: "speak", args: ["Character2", "Hi there!"] },
            { command: "remove_portrait", args: ["Character1"] },
            { command: "add_portrait", args: ["Character3"] },
            { command: "speak", args: ["Character3", "Nice to meet you!"] },
            { command: "add_portrait", args: ["Character4"] },
            { command: "add_portrait", args: ["Character5"] },
            { command: "add_portrait", args: ["Character6"] },
            { command: "add_portrait", args: ["Character1"] },
            { command: "speak", args: ["Character1", "I'm back!"] },
        ],
    };

    const result = validateAiEventPortraits(event);
    assertEquals(result.isValid, true);
    assertEquals(result.errors.length, 0);
});

test("validateAiEventPortraits - characters speak after portrait is removed (should fail)", () => {
    const event = {
        sourceObjects: [
            { command: "add_portrait", args: ["Tirren", "Left"] },
            { command: "add_portrait", args: ["Milka", "MidLeft"] },
            { command: "add_portrait", args: ["Seren", "Right"] },
            { command: "speak", args: ["Tirren", "Hello everyone!"] },
            { command: "remove_portrait", args: ["Milka"] },
            { command: "remove_portrait", args: ["Seren"] },
            { command: "speak", args: ["Tirren", "Is anyone still here?"] },
            // These should be invalid - speaking after portrait removed
            { command: "speak", args: ["Milka", "I'm still here somehow!"] },
            { command: "speak", args: ["Seren", "Me too, even though our portraits were removed!"] }
        ],
    };

    const result = validateAiEventPortraits(event);
    // Test the expected behavior, not the current behavior
    assertEquals(result.isValid, false);
    assertEquals(result.errors.length, 2);
});

test("validateAiEventPortraits - real world example with missing portraits", () => {
    const event = {
        sourceObjects: [
            { command: "narrate", args: ["Dawn breaks on the battered Howling Steppes, at the edge of the Fallen Spire. Four strangers—Tirren, Milka, Vorik, and Seren—converge upon the ruins, each drawn by rumors of a powerful artifact lost to time. As winds howl through the ancient stones, their uneasy alliance is tested by the dangers lurking in the wilds."] },
            { command: "add_portrait", args: ["Tirren", "Left"] },
            { command: "add_portrait", args: ["Milka", "MidLeft"] },
            { command: "add_portrait", args: ["Vorik", "MidRight"] },
            { command: "add_portrait", args: ["Seren", "Right"] },
            { command: "speak", args: ["Tirren", "Keep your eyes up. The ruins draw more than just relic hunters. I saw dust on the horizon—riders, maybe worse."] },
            { command: "speak", args: ["Milka", "Let them come! With luck, they're just traders. Or... what if they're from the Seekers? Look at these glyphs! The script is older than anything I've seen—this could be our only chance to study them up close."] },
            { command: "speak", args: ["Vorik", "Traders don't ride that hard, girl. And Seekers don't wave axes."] },
            { command: "speak", args: ["Seren", "The wind is restless today. Old powers are waking beneath our feet. We must tread carefully—greed and bloodshed have scarred this land before."] },
            { command: "speak", args: ["Tirren", "Then we stand together. Whatever comes, none of us walks away if we face it alone."] },
            { command: "remove_portrait", args: ["Seren"] },
            { command: "remove_portrait", args: ["Milka"] },
            { command: "add_portrait", args: ["Pell", "Right"] },
            { command: "speak", args: ["Vorik", "Hnh. Quiet—someone's moving behind those rocks."] },
            { command: "speak", args: ["Pell", "Wait! Don't hit me! I'm not with them—I swear. Name's Pell. Listen, if you want to survive, follow me. I know a way through the ruins. But... you have to help me, too."] },
            { command: "bop_portrait", args: ["Tirren"] },
            { command: "speak", args: ["Tirren", "More the merrier, if you can keep your head down. But stick close."] },
            { command: "speak", args: ["Milka", "Pell, was it? Did you see anyone else near the Spire? People with strange armor, carrying banners?"] },
            { command: "speak", args: ["Pell", "Banners? Maybe... but the ones coming now—they're bandits. Iron Claw. Bad ones."] },
            { command: "speak", args: ["Vorik", "Great. Just what we needed."] },
            { command: "speak", args: ["Seren", "Then fate has set our path. Let us face this trial together, or be swept aside like so many before us."] },
            { command: "remove_portrait", args: ["Pell"] },
            { command: "remove_portrait", args: ["Vorik"] },
            { command: "add_portrait", args: ["Milka", "MidRight"] },
            { command: "add_portrait", args: ["Seren", "Right"] },
            { command: "speak", args: ["Milka", "If we survive... imagine what we could find in there. Wonders—or warnings."] },
            { command: "speak", args: ["Tirren", "Survive first. Wonder later. The storm's upon us."] },
            { command: "narrate", args: ["As the Iron Claw raiders encircle the ruins, the unlikely band steels themselves for battle. The winds of awakening howl over Zhurai—the fate of old secrets and new alliances hangs by a thread."] }
        ]
    };

    const result = validateAiEventPortraits(event);
    // console.log("Real-world validation errors:", result.errors);
    assertEquals(result.isValid, false);
    // There should be errors for Milka and Seren speaking after portrait removal
    assertEquals(result.errors.length, 2);
}); 