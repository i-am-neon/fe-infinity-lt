import {
  testInitialGameIdea,
  testTone,
  testWorldSummary,
} from "./test-data/prologue.ts";
import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import { Chapter } from "@/types/chapter.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { z } from "zod";

export default async function genChapterIdea({
  worldSummary,
  chapterNumber,
  tone,
  initialGameIdea,
  existingChapters = [],
  allDeadCharacters = [],
  newlyDeadThisChapter = [],
}: {
  worldSummary: WorldSummary;
  chapterNumber: number;
  tone: string;
  initialGameIdea?: InitialGameIdea;
  existingChapters?: Chapter[];
  allDeadCharacters?: DeadCharacterRecord[];
  newlyDeadThisChapter?: DeadCharacterRecord[];
}): Promise<ChapterIdea> {
  /**
   * The subfunction that calls our standard generateStructuredData with a "generator" approach.
   */
  async function generateCandidate(
    systemMessage: string,
    prompt: string,
    skipSchema?: boolean,
    partial?: Partial<ChapterIdea>
  ): Promise<ChapterIdea> {
    let finalPrompt = prompt;
    if (partial) {
      finalPrompt += `\n\nPotential fix for previous attempt: ${JSON.stringify(
        partial,
        null,
        2
      )}`;
    }

    const schemaToUse = skipSchema
      ? (ChapterIdeaSchema.partial() as z.ZodSchema<ChapterIdea>)
      : ChapterIdeaSchema;

    const { ...candidate } = await generateStructuredData<ChapterIdea>({
      fnName: "genChapterIdea: generator",
      systemMessage,
      prompt: finalPrompt,
      schema: schemaToUse,
      temperature: 1, // generator approach
      model: "gpt-4o",
    });
    return candidate as ChapterIdea;
  }

  /**
   * The subfunction that calls generateStructuredData with a "checker" approach, returning either an "ok" or fix instructions.
   */
  async function checkCandidate(
    candidate: ChapterIdea,
    systemMessage: string
  ): Promise<{
    ok: boolean;
    fixText?: string;
    fixObject?: Partial<ChapterIdea>;
  }> {
    // We'll incorporate checks for references to dead or old bosses, plus ensure that any newPlayableUnits or newNonBattleCharacters are each mentioned in intro/battle/outro if present.
    const prompt = `Here is the candidate chapter idea:\n${JSON.stringify(
      candidate,
      null,
      2
    )}\n
We have these constraints to check:
1) The chapter must not reuse or resurrect any dead character from the array ${JSON.stringify(
      allDeadCharacters
    )}.
2) Must not reuse a previous boss from earlier chapters, i.e. the boss from any existingChapters.
3) If newPlayableUnits or newNonBattleCharacters is non-empty, each newly introduced character's firstName must appear in at least one of "intro", "battle", or "outro".
   For example, if newPlayableUnits has someone with firstName = "Elara", then the substring "Elara" must appear in the "intro" or "battle" or "outro".
If any violation is found, provide a fix with { "fixText": "...", "fixObject": { ... } }. Otherwise return { "fixText": "None", "fixObject": {} } with no commentary.`;

    const res = await generateStructuredData<{
      fixText: string;
      fixObject: Partial<ChapterIdea>;
    }>({
      fnName: "genChapterIdea: checker",
      systemMessage,
      prompt,
      schema: z.object({
        fixText: z.string(),
        fixObject: ChapterIdeaSchema.partial(),
      }),
      temperature: 0, // checker approach
    });

    if (res.fixText === "None") {
      return { ok: true };
    } else {
      return { ok: false, fixText: res.fixText, fixObject: res.fixObject };
    }
  }

  // Build the base systemMessage and basePrompt
  let baseSystemMessage: string;
  let basePrompt: string;

  // For prologue
  if (chapterNumber === 0 && initialGameIdea) {
    baseSystemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

The user provides:
1) A World Summary
2) An Initial Game Idea
3) A tone
4) A list of all previously dead characters: ${JSON.stringify(
      allDeadCharacters
    )}
5) Characters who died specifically in the last chapter: ${JSON.stringify(
      newlyDeadThisChapter
    )}
We want to generate a single new chapter that logically follows them for the Prologue (chapterNumber=0).

## Requirements:
- Must not reuse or resurrect any dead characters from the arrays given
- Must not reuse a previous boss from earlier chapters
- If you add newPlayableUnits (70% chance is typical, but optional) or newNonBattleCharacters, you MUST mention them by name in the "intro", "battle", or "outro".
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema.
- If new characters appear, they must be human.

Focus on the prologue storyline. Make sure not to break continuity with the initial game idea or resurrect any dead characters. Return only JSON matching ChapterIdea. No commentary.`;

    basePrompt = `World Summary: ${JSON.stringify(
      worldSummary,
      null,
      2
    )}\nInitial Game Idea: ${JSON.stringify(
      initialGameIdea,
      null,
      2
    )}\nTone: ${tone}`;
  } else {
    // For subsequent chapters
    baseSystemMessage = `You are a Fire Emblem Fangame Chapter Idea Generator (generator).

We already have:
- A World Summary
- A list of existing chapters
- A list of all previously dead characters: ${JSON.stringify(allDeadCharacters)}
- Characters who died specifically last chapter: ${JSON.stringify(
      newlyDeadThisChapter
    )}
We want you to create chapter ${chapterNumber} continuing from previous chapters.

## Requirements:
- Must not reuse or resurrect any dead characters from the arrays given
- Must not reuse a previous boss from earlier chapters
- If you add newPlayableUnits (70% chance is typical, but optional) or newNonBattleCharacters, you MUST mention them by name in the "intro", "battle", or "outro".
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema.
- If new characters appear, they must be human.

Return only valid JSON. No commentary.`;

    basePrompt = JSON.stringify({
      worldSummary,
      existingChapters,
      chapterNumber,
      tone,
    });
  }

  let candidate: ChapterIdea | null = null;

  // Up to 3 attempts: generate -> check -> possibly fix
  for (let attempt = 1; attempt <= 3; attempt++) {
    candidate = await generateCandidate(
      baseSystemMessage,
      basePrompt,
      false,
      candidate || undefined
    );

    // Now check it
    const checkerMessage = `You are a Fire Emblem Fangame Chapter Idea Checker (checker).
Your job is to verify no dead or old boss references appear, and also if newPlayableUnits or newNonBattleCharacters exist, each is named in intro/battle/outro. If valid, output { "fixText": "None", "fixObject": {} }. Otherwise supply fixes. Return only strict JSON.`;

    const checkRes = await checkCandidate(candidate, checkerMessage);
    if (checkRes.ok) {
      return candidate;
    } else {
      if (attempt === 3) {
        throw new Error(
          `Failed to produce a valid ChapterIdea after 3 tries. Last fix request: ${checkRes.fixText}`
        );
      }
      // incorporate fix instructions if any
      const fixPrompt = `The checker requests changes: ${checkRes.fixText}.
Apply them to the partial chapter idea. The partial fix object is: ${JSON.stringify(
        checkRes.fixObject
      )}.
Generate a new or updated version of the ChapterIdea that is valid and meets all requirements.
Only output JSON. Do not mention the reason or commentary.`;

      candidate = await generateCandidate(
        baseSystemMessage,
        fixPrompt,
        false,
        checkRes.fixObject
      );
    }
  }

  // fallback
  if (!candidate) {
    throw new Error(
      "No candidate produced. Unexpected error in genChapterIdea."
    );
  }
  return candidate;
}

if (import.meta.main) {
  // Prologue example
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 0,
    tone: testTone,
    initialGameIdea: testInitialGameIdea,
  }).then((res) => {
    console.log("Prologue Chapter Idea:", JSON.stringify(res, null, 2));
  });

  // Example for subsequent
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 1,
    tone: testTone,
    existingChapters: [],
  }).then((res) => {
    console.log("Subsequent Chapter Idea:", JSON.stringify(res, null, 2));
  });
}

