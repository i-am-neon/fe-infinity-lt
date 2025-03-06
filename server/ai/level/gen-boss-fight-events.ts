import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import cleanGameText from "@/lib/formatting/clean-game-text.ts";
import { Event } from "@/types/events/event.ts";
import { z } from "zod";

/*
  This file exports a function that, given:
  - Boss CharacterIdea
  - List of player units as CharacterIdeas
  - Current chapter number
  - Chapter idea for context
  ... returns an array of Events for boss fight conversations
*/

const conversationLinesSchema = z.object({
  conversationLines: z.array(
    z.object({
      name: z.string().describe("the first name of the speaker"),
      text: z.string().describe("the text that speaker says"),
    })
  ),
});
type ConversationLines = z.infer<typeof conversationLinesSchema>;

export default async function genBossFightEvents({
  boss,
  playerUnits,
  chapterNumber,
  chapterIdea,
  recruitedThisChapter = [],
}: {
  boss: CharacterIdea;
  playerUnits: CharacterIdea[];
  chapterNumber: number;
  chapterIdea: ChapterIdea;
  recruitedThisChapter?: CharacterIdea[];
}): Promise<Event[]> {
  const logger = getCurrentLogger();
  const bossFightEvents: Event[] = [];

  for (const playerUnit of playerUnits) {
    // Skip if the unit is the boss (shouldn't happen but just in case)
    if (playerUnit.firstName === boss.firstName) continue;

    // Check if the unit was recruited this chapter
    const wasRecruitedThisChapter = recruitedThisChapter.some(
      (unit) => unit.firstName === playerUnit.firstName
    );

    // Get the unit's original allegiance if recruited this chapter
    const previousAllegiance = wasRecruitedThisChapter
      ? playerUnit.firstSeenAs
      : undefined;

    const systemMessage = `
You are writing a short Fire Emblem conversation script for a boss fight event where a character named ${
      playerUnit.firstName
    } confronts the boss named ${boss.firstName}.
They exchange brief dialogue right before their battle, showcasing their personalities and relationship.
Return only JSON in the shape: { "conversationLines": [ { "name": "speakerName", "text": "some text" } ] }, and no more than 4 lines total.
Here is the chapter idea context: ${JSON.stringify(chapterIdea)}

${
  wasRecruitedThisChapter
    ? `IMPORTANT: ${
        playerUnit.firstName
      } was just recruited this chapter and was previously a ${
        previousAllegiance === "enemy non-boss"
          ? "member of the enemy forces"
          : "neutral/allied NPC not under player control"
      }. The boss should acknowledge this change of allegiance in their dialogue.`
    : ""
}

Use a dramatic, confrontational tone suitable for a boss fight.
`;

    let conv: ConversationLines = { conversationLines: [] };
    try {
      conv = await generateStructuredData<ConversationLines>({
        fnName: "genBossFightConversation",
        schema: conversationLinesSchema,
        systemMessage,
        prompt: JSON.stringify({
          boss: boss.firstName,
          player: playerUnit.firstName,
          bossPersonality: boss.personality,
          playerPersonality: playerUnit.personality,
          wasRecruitedThisChapter,
          previousAllegiance,
        }),
        temperature: 0.7,
        model: "fast",
      });
    } catch {
      // fallback
      logger.error(
        `Failed to generate boss fight conversation between ${boss.firstName} and ${playerUnit.firstName}`
      );
      conv.conversationLines = [
        {
          name: boss.firstName,
          text:
            wasRecruitedThisChapter && previousAllegiance === "enemy non-boss"
              ? "You dare betray me? You'll pay for this treachery!"
              : "So you think you can defeat me? Foolish!",
        },
        {
          name: playerUnit.firstName,
          text:
            wasRecruitedThisChapter && previousAllegiance === "enemy non-boss"
              ? "I've chosen a different path. Today, I stand against you!"
              : "I will stop you here and now!",
        },
      ];
    }

    const eventName = `BossFight_${boss.firstName}_${playerUnit.firstName}`;
    const bossFightEvent: Event = {
      name: eventName,
      trigger: "combat_start",
      level_nid: chapterNumber.toString(),
      condition: `check_pair('${boss.firstName}','${playerUnit.firstName}')`,
      commands: [],
      only_once: true,
      priority: 20,
      _source: [],
    };

    // Start conversation
    bossFightEvent._source.push(`add_portrait;${boss.firstName};Left`);
    bossFightEvent._source.push(`add_portrait;${playerUnit.firstName};Right`);

    // Add each line of conversation
    for (const lineObj of conv.conversationLines) {
      const spName = lineObj.name;
      const spText = cleanGameText(lineObj.text);
      bossFightEvent._source.push(`speak;${spName};${spText}`);
    }

    // End of conversation
    bossFightEvent._source.push(`remove_portrait;${boss.firstName};no_block`);
    bossFightEvent._source.push(`remove_portrait;${playerUnit.firstName}`);

    bossFightEvents.push(bossFightEvent);
  }

  return bossFightEvents;
}

if (import.meta.main) {
  // Example usage
  const testBoss: CharacterIdea = {
    firstName: "Malice",
    fullName: "Lord Malice",
    gender: "male",
    personality: "Cruel and calculating",
    affinity: "Dark",
    classDirection: "Warrior",
    age: "mature adult",
    backstory: "A ruthless warlord seeking power at any cost.",
    firstSeenAs: "boss",
    physicalDescription: "Imposing with dark armor",
    inGameDescription: "A ruthless warlord",
    deathQuote: "How... could I... fail...",
  };

  const testPlayer: CharacterIdea = {
    firstName: "Erika",
    fullName: "Princess Erika",
    gender: "female",
    personality: "Noble and determined",
    affinity: "Light",
    classDirection: "Sword user",
    age: "young adult",
    backstory: "A princess fighting to reclaim her kingdom.",
    firstSeenAs: "ally",
    physicalDescription: "Elegant with blue hair",
    inGameDescription: "A noble princess",
    deathQuote: "I'm sorry... everyone...",
  };

  const testChapterIdea: ChapterIdea = {
    title: "Test Chapter",
    intro: "The team prepares for the final confrontation.",
    battle: "Malice's forces stand in the way.",
    outro: "Malice is defeated but escapes.",
    boss: testBoss,
    enemyFaction: {
      nid: "evil",
      name: "Evil",
      desc: "They're evil",
      icon_nid: "MonsterEmblem",
    },
    endOfChapterChoice: {
      displayText: "What next?",
      options: ["Pursue Malice", "Heal the wounded"],
    },
  };

  genBossFightEvents({
    boss: testBoss,
    playerUnits: [testPlayer],
    chapterNumber: 1,
    chapterIdea: testChapterIdea,
    recruitedThisChapter: [],
  }).then((events) => {
    console.log(JSON.stringify(events, null, 2));
  });
}

