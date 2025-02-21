import { WorldSummary } from "@/ai/types/world-summary.ts";
import {
  initialGameIdeaSchema,
  InitialGameIdea,
} from "@/ai/types/initial-game-idea.ts";
import { Chapter } from "@/types/chapter.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { z } from "zod";
import { testTone, testWorldSummary } from "@/ai/test-data/initial.ts";

/**
 * Generates an InitialGameIdea for the prologue chapter using a generator-checker approach.
 */
export default async function genInitialGameIdea({
  worldSummary,
  tone,
  existingChapters = [],
  allDeadCharacters = [],
}: {
  worldSummary: WorldSummary;
  tone: string;
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
}): Promise<InitialGameIdea> {
  /**
   * Subfunction: generateCandidate
   * Tries to produce an initial game idea from scratch or from partial fixes.
   */
  async function generateCandidate(
    systemMessage: string,
    userPrompt: string,
    partialFix?: Partial<InitialGameIdea>
  ): Promise<InitialGameIdea> {
    let finalPrompt = userPrompt;
    if (partialFix && Object.keys(partialFix).length > 0) {
      finalPrompt += `\n\nPotential fix for previous attempt:\n${JSON.stringify(
        partialFix,
        null,
        2
      )}`;
    }

    // We'll call generateStructuredData with the standard approach
    const candidate = await generateStructuredData<InitialGameIdea>({
      fnName: "genInitialGameIdea: generator",
      schema: initialGameIdeaSchema,
      systemMessage,
      prompt: finalPrompt,
      temperature: 1, // more creative
      model: "gpt-4o",
    });
    return candidate;
  }

  /**
   * Subfunction: checkCandidate
   * Verifies that the newly generated idea meets constraints:
   * - Must have at least 3 character ideas
   * - Must not resurrect or mention any dead characters from allDeadCharacters
   * - If any new characters are introduced, ensure the text doesn't conflict with the rules
   * If valid, return { ok: true }, else return fix instructions.
   */
  async function checkCandidate(
    candidate: InitialGameIdea,
    checkerSystemMsg: string
  ): Promise<{
    ok: boolean;
    fixText?: string;
    fixObject?: Partial<InitialGameIdea>;
  }> {
    const checkPrompt = `
Here is the candidate initialGameIdea:
${JSON.stringify(candidate, null, 2)}

We must check the following constraints:

1) Must have at least 3 character ideas in "characterIdeas".
2) Must not mention or resurrect any from this dead array: ${JSON.stringify(
      allDeadCharacters
    )}
3) If new characters are introduced, ensure they are consistent with a prologue and are "human" with no resurrected old bosses or anything from existingChapters.
4) If everything is valid, return { "fixText": "None", "fixObject": {} } with no commentary. Otherwise, supply how to fix in fixText and partial fix in fixObject. Return only JSON.
`;
    const res = await generateStructuredData<{
      fixText: string;
      fixObject: Partial<InitialGameIdea>;
    }>({
      fnName: "genInitialGameIdea: checker",
      schema: z.object({
        fixText: z.string(),
        fixObject: initialGameIdeaSchema.partial(),
      }),
      systemMessage: checkerSystemMsg,
      prompt: checkPrompt,
      temperature: 0, // we want a straightforward check
    });

    if (res.fixText === "None") {
      return { ok: true };
    }
    return {
      ok: false,
      fixText: res.fixText,
      fixObject: res.fixObject,
    };
  }

  // Main generator-checker logic
  // The system message for generating the candidate
  const generatorSystemMessage = `You are a Fire Emblem Fangame Prologue Story Generator (generator).

The user provides:
- A World Summary
- A tone
- Possibly some existing chapters and a list of previously dead characters. (Though it's a prologue, we keep the structure consistent.)
We want to create the initial game idea for the prologue, which includes:
- A narrative backstory
- A set of 3+ character ideas for the prologue (no fewer than 3).
- Potential plot directions or twists
- Additional notes or details

Constraints:
- Must not resurrect or mention any previously dead characters from the array of dead characters.
- Must produce valid JSON strictly matching the initialGameIdeaSchema, with at least 3 character ideas.
No commentary, only output JSON.`;

  const userPrompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}
Tone: ${tone}
existingChapters: ${JSON.stringify(existingChapters, null, 2)}
allDeadCharacters: ${JSON.stringify(allDeadCharacters, null, 2)}`;

  // The system message for checking the candidate
  const checkerSystemMessage = `You are a Fire Emblem Fangame Prologue Story Checker (checker).
Your job is to verify constraints are met. Return { "fixText": "None", "fixObject": {} } if all good, else provide fix instructions. Return only strict JSON.`;

  let candidate: InitialGameIdea | null = null;
  let fixObject: Partial<InitialGameIdea> | undefined = undefined;

  for (let attempt = 1; attempt <= 3; attempt++) {
    // 1) generate candidate
    candidate = await generateCandidate(
      generatorSystemMessage,
      userPrompt,
      fixObject
    );

    // 2) check candidate
    const checkRes = await checkCandidate(candidate, checkerSystemMessage);

    if (checkRes.ok) {
      return candidate;
    } else {
      if (attempt === 3) {
        throw new Error(
          `Failed to produce a valid InitialGameIdea after 3 attempts. Last fixText: ${checkRes.fixText}`
        );
      }
      fixObject = checkRes.fixObject;
    }
  }

  // fallback (should never reach here)
  throw new Error(
    "Unable to produce valid initial game idea after multiple attempts."
  );
}

if (import.meta.main) {
  genInitialGameIdea({
    worldSummary: testWorldSummary,
    tone: testTone,
    existingChapters: [],
  })
    .then((idea) =>
      console.log("Generated Initial Game Idea:", JSON.stringify(idea, null, 2))
    )
    .catch(console.error);
}

