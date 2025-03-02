import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import generateStructuredData from "./lib/generate-structured-data.ts";
import { z } from "zod";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";

const villagerDialogueSchema = z.object({
  dialogue: z
    .string()
    .describe("The villager's dialogue that will be spoken to the player"),
});

export default async function genVillagerDialogue({
  chapterIdea,
  item,
}: {
  chapterIdea: ChapterIdea;
  item: string;
}): Promise<string> {
  const systemMessage = `You are a Fire Emblem villager dialogue writer.
  
Create a brief, context-appropriate dialogue for a villager in a Fire Emblem game to say when the player visits their house.

The dialogue should:
1. Be relevant to the current chapter's events or themes
2. Provide a small hint or bit of lore about the current situation
3. Feel authentic to the Fire Emblem series
4. Be brief (1-3 lines maximum)
5. End with mentioning they're giving the player an item
6. Be written in a natural, conversational tone

Consider the context of the villager's location, the events happening around them, and what would make sense for them to know or care about.`;

  const { dialogue } = await generateStructuredData({
    fnName: "genVillagerDialogue",
    schema: villagerDialogueSchema,
    systemMessage,
    prompt: `Chapter information: ${JSON.stringify(chapterIdea)}
Item to be given: ${item}`,
    temperature: 1,
    model: "fast",
  });

  return dialogue;
}

if (import.meta.main) {
  genVillagerDialogue({
    chapterIdea: testPrologueChapter.idea,
    item: "Iron Sword",
  }).then((dialogue) => {
    console.log("Generated villager dialogue:", dialogue);
  });
}

