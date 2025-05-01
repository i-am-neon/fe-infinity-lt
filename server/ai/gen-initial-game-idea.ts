import { genAndCheck } from "@/ai/lib/generator-checker.ts";
import {
  InitialGameIdea,
  initialGameIdeaSchema,
} from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { testTone, testWorldSummary } from "./test-data/prologueTestData.ts";

export default function genInitialGameIdea({
  worldSummary,
  tone,
}: {
  worldSummary: WorldSummary;
  tone: string;
}): Promise<InitialGameIdea> {
  const generatorSystemMessage = `You are a Fire Emblem Fangame Prologue Story Generator (generator).
We want an initialGameIdea with:
- between 4-7 new playable characters (inclusive)
- short backstory
- 1+ potential plot directions

For each character's "firstSeenAs" field, you MUST use ONLY one of these exact values:
- "ally" - starts as a blue unit (playable character in player's party)
- "allied NPC" - starts as a green unit (non-playable but fighting alongside player)
- "enemy non-boss" - starts as a red unit (enemy but not boss)
- "boss" - the chapter's enemy boss
- "non-playable character" - for characters not involved in battle

Do NOT use class names like "Brigand" or "Sword User" for the firstSeenAs field.

Return only JSON.`;

  const userPrompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Tone: ${tone}
`;

  const checkerSystemMessage = `You are a Fire Emblem Fangame Prologue Checker (checker).
Check constraints:
1) Between 4-7 character ideas (inclusive)
2) firstSeenAs field must be one of: "ally", "allied NPC", "enemy non-boss", "boss", "non-playable character"
If valid => fixText=None. Otherwise => fix instructions as fixObject.`;

  return genAndCheck<InitialGameIdea>({
    fnBaseName: "genInitialGameIdea",
    generatorModel: "strong",
    generatorSystemMessage,
    generatorPrompt: userPrompt,
    generatorSchema: initialGameIdeaSchema,
    checkerSystemMessage,
    checkerPrompt: (candidate) => {
      return `Candidate:\n${JSON.stringify(candidate, null, 2)}
Constraints:
- Must have between 4-7 character ideas (inclusive)
- firstSeenAs field must be one of: "ally", "allied NPC", "enemy non-boss", "boss", "non-playable character"
If good => fixText=None. Else => fix instructions.`;
    },
  });
}

if (import.meta.main) {
  genInitialGameIdea({
    worldSummary: testWorldSummary,
    tone: testTone,
  })
    .then((idea) =>
      console.log("Initial Game Idea:", JSON.stringify(idea, null, 2))
    )
    .catch(console.error);
}

