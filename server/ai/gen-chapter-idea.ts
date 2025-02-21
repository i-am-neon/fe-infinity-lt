import { ChapterIdea, ChapterIdeaSchema } from "@/ai/types/chapter-idea.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { Chapter } from "@/types/chapter.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";
import {
  testWorldSummary,
  testTone,
  testInitialGameIdea,
} from "@/ai/test-data/initial.ts";
import { DeadCharacterRecord } from "@/types/dead-character-record.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
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
  const logger = getCurrentLogger();

  // A subfunction that calls generateStructuredData with the "generator" approach, temperature=1.
  async function generateCandidate(
    systemMessage: string,
    prompt: string,
    skipSchema?: boolean,
    partial?: Partial<ChapterIdea>
  ): Promise<ChapterIdea> {
    // If partial is provided, we incorporate it into the prompt as a "fix request" scenario
    let finalPrompt = prompt;
    if (partial) {
      finalPrompt += `\n\nPotential fix for previous attempt: ${JSON.stringify(
        partial,
        null,
        2
      )}`;
    }

    const { ...candidate } = await generateStructuredData<ChapterIdea>({
      fnName: "genChapterIdea: generator",
      systemMessage,
      prompt: finalPrompt,
      schema: skipSchema
        ? (ChapterIdeaSchema.partial() as z.ZodSchema<ChapterIdea>)
        : ChapterIdeaSchema,
      temperature: 1, // generator has temperature=1
    });
    return candidate as ChapterIdea;
  }

  // A subfunction that calls generateStructuredData with the "checker" approach, temperature=0,
  // returning either "ok" or instructions for a fix.
  async function checkCandidate(
    candidate: ChapterIdea,
    systemMessage: string
  ): Promise<{
    ok: boolean;
    fixText?: string;
    fixObject?: Partial<ChapterIdea>;
  }> {
    // We'll transform the candidate into a string to feed as the 'prompt'
    const prompt = `Here is the candidate chapter idea:\n${JSON.stringify(
      candidate,
      null,
      2
    )}\n\nPlease check if it violates the key rules:\n
1) No reused dead characters (dead: ${JSON.stringify(
      allDeadCharacters
    )})\n2) Cannot reuse old boss characters from previous chapters.\nAny issues must be fixed. If there is an issue, provide a JSON object { "fixText": "...", "fixObject": <partial chapter idea> } with instructions to fix. If everything is fine, just output { "fixText": "None", "fixObject": {} }. Return no extra commentary.`;

    const res = await generateStructuredData<{
      fixText: string;
      fixObject: Partial<ChapterIdea>;
    }>({
      fnName: "genChapterIdea: checker",
      systemMessage,
      prompt,
      schema: ChapterIdeaCheckerSchema,
      temperature: 0,
    });

    // If fixText === "None", it's ok
    if (res.fixText === "None") {
      return { ok: true };
    } else {
      return { ok: false, fixText: res.fixText, fixObject: res.fixObject };
    }
  }

  // We'll define a schema for the checker’s output
  const ChapterIdeaCheckerSchema = z.object({
    fixText: z.string(),
    fixObject: ChapterIdeaSchema.partial(),
  });

  // The main logic that decides if we do prologue or subsequent:
  // We'll build the base systemMessage for the generator and the base prompt, then do the 3 attempts loop.
  let baseSystemMessage: string;
  let basePrompt: string;

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
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema.

Your response must not contain commentary, only the JSON object that fits the ChapterIdea schema.
If you mention a new character, they must be human.

Focus on the prologue storyline. Make sure not to break continuity with the initial game idea. If a character is mentioned in the story who died, that is an error. If you mention a boss from a prior chapter, that is an error. Make a new boss if needed.
`;

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
- Must produce a new Chapter Idea that strictly matches the ChapterIdea schema.
- If new characters appear, they must be human.

If you mention a previously dead character or a boss from prior chapters, that is an error. Return only the valid JSON that matches ChapterIdea with no commentary.
`;

    basePrompt = JSON.stringify({
      worldSummary,
      existingChapters,
      chapterNumber,
      tone,
    });
  }

  let candidate: ChapterIdea | null = null;

  for (let attempt = 1; attempt <= 3; attempt++) {
    // 1) generate a candidate
    candidate = await generateCandidate(
      baseSystemMessage,
      basePrompt,
      false,
      candidate || undefined
    );

    // 2) run the checker
    const checkerMessage = `You are a Fire Emblem Fangame Chapter Idea Checker (checker).
Your job is to verify no dead or old boss references appear in the candidate. You must not add commentary, only output JSON describing fix requests or no fix needed. If the candidate is valid, output: { "fixText": "None", "fixObject": {} }. If not, specify fix instructions with { "fixText": "...", "fixObject": { ... } }.
Remember not to resurrect or mention dead or previously used bosses.
Return only strict JSON.`;

    const checkRes = await checkCandidate(candidate, checkerMessage);
    if (checkRes.ok) {
      // success
      return candidate;
    } else {
      if (attempt === 3) {
        // throw
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
Only output JSON. No commentary.
Remember not to resurrect or mention dead or previously used bosses.`;

      // We'll generate a new candidate from fixPrompt
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
    throw new Error("No candidate produced. Unexpected error.");
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

  // Subsequent chapter example
  genChapterIdea({
    worldSummary: testWorldSummary,
    chapterNumber: 2,
    tone: testTone,
    existingChapters: [],
  }).then((res) => {
    console.log("Subsequent Chapter Idea:", JSON.stringify(res, null, 2));
  });
}
