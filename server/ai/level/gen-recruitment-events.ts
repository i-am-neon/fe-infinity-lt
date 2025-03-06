import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import {
  testCharIdeaAislin,
  testCharIdeaThorne,
} from "@/ai/test-data/character-ideas.ts";
import { testPrologueChapter } from "@/ai/test-data/prologueTestData.ts";
import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { CharacterIdea } from "@/ai/types/character-idea.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import cleanGameText from "@/lib/formatting/clean-game-text.ts";
import { Event } from "@/types/events/event.ts";
import { z } from "zod";

/*
  This file exports a function that, given:
  - A list of recruitable CharacterIdeas
  - A list of potential recruiters (CharacterIdea[])
  - The current chapterNumber
  - The chapterIdea for context
  ... returns:
    - talkSetupCommands: string[] of add_talk;RecruiterFirstName;RecruiteeFirstName
    - recruitmentEvents: Event[] array to handle the conversation and recruitment

  The conversation text is generated via LLM calls:
    - The model returns an object: { conversationLines: [ { name: string, text: string } ] }
    - We then build the final _source array for the event
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

export interface RecruitmentResult {
  talkSetupCommands: string[];
  recruitmentEvents: Event[];
}

export default async function genRecruitmentEvents({
  recruitables,
  recruiters,
  chapterNumber,
  chapterIdea,
}: {
  recruitables: CharacterIdea[];
  recruiters: CharacterIdea[];
  chapterNumber: number;
  chapterIdea: ChapterIdea;
}): Promise<RecruitmentResult> {
  const logger = getCurrentLogger();
  
  // Create a flat array of all valid recruitable/recruiter pairs to process in parallel
  const recruitmentPairs: Array<{
    recruitable: CharacterIdea;
    recruiterName: string;
    allRecruiterNames: string[];
  }> = [];
  
  // Gather all valid recruitment pairs
  for (const recruitable of recruitables) {
    const recruiterNames = recruiters
      .map((r) => r.firstName)
      .filter((rName) => rName !== recruitable.firstName);
      
    if (recruiterNames.length === 0) continue;
    
    for (const rName of recruiterNames) {
      recruitmentPairs.push({
        recruitable,
        recruiterName: rName,
        allRecruiterNames: recruiterNames
      });
    }
  }
  
  // Process all pairs in parallel
  const pairResults = await Promise.all(
    recruitmentPairs.map(async ({ recruitable, recruiterName, allRecruiterNames }) => {
      const talkSetupCommand = `add_talk;${recruiterName};${recruitable.firstName}`;
      
      const systemMessage = `
You are writing a short Fire Emblem conversation script for a talk event where a character named ${recruiterName} recruits an ${
        recruitable.firstSeenAs
      } named ${recruitable.firstName}.
They discuss reasons for joining, referencing the chapter idea context.
Return only JSON in the shape: { "conversationLines": [ { "name": "speakerName", "text": "some text" } ] }, and no more than 5 lines total.
Here is the chapter idea context: ${JSON.stringify(chapterIdea)}

Use a friendly, concise tone.
`;

      let conv: ConversationLines = { conversationLines: [] };
      try {
        conv = await generateStructuredData<ConversationLines>({
          fnName: "genRecruitmentConversation",
          schema: conversationLinesSchema,
          systemMessage,
          prompt: JSON.stringify({
            recruiter: recruiterName,
            recruitee: recruitable.firstName,
            classDirection: recruitable.classDirection,
            personality: recruitable.personality,
          }),
          temperature: 0.6,
          model: "fast",
        });
      } catch {
        // fallback
        logger.error(
          `Failed to generate recruitment conversation for ${recruiterName} recruiting ${recruitable.firstName}`
        );
        conv.conversationLines = [
          {
            name: recruiterName,
            text: "Listen, we share a common cause. Fight with us!",
          },
          {
            name: recruitable.firstName,
            text: "Alright...I'll trust you this time.",
          },
        ];
      }

      const talkEventName = `Recruit_${recruitable.firstName}_By_${recruiterName}`;
      const talkEvent: Event = {
        name: talkEventName,
        trigger: "on_talk",
        level_nid: chapterNumber.toString(),
        condition: `unit.nid == '${recruiterName}' and unit2.nid == '${recruitable.firstName}'`,
        commands: [],
        only_once: true,
        priority: 20,
        _source: [],
      };

      // Start conversation
      talkEvent._source.push(`add_portrait;${recruiterName};Left`);
      talkEvent._source.push(`add_portrait;${recruitable.firstName};Right`);

      // Add each line of conversation
      for (const lineObj of conv.conversationLines) {
        const spName = lineObj.name;
        const spText = cleanGameText(lineObj.text);
        talkEvent._source.push(`speak;${spName};${spText}`);
      }

      // Conclusion of conversation
      talkEvent._source.push(
        `speak;${recruitable.firstName};I'm in! Let's fight together.`
      );
      talkEvent._source.push(`change_team;${recruitable.firstName};player`);
      talkEvent._source.push(`remove_portrait;${recruiterName};no_block`);
      talkEvent._source.push(`remove_portrait;${recruitable.firstName}`);

      // remove_talk for all recruiters
      for (const otherRec of allRecruiterNames) {
        talkEvent._source.push(
          `remove_talk;${otherRec};${recruitable.firstName}`
        );
      }

      return {
        talkSetupCommand,
        talkEvent
      };
    })
  );
  
  // Combine all results
  const talkSetupCommands: string[] = pairResults.map(result => result.talkSetupCommand);
  const recruitmentEvents: Event[] = pairResults.map(result => result.talkEvent);

  return { talkSetupCommands, recruitmentEvents };
}

if (import.meta.main) {
  (async () => {
    const testRecruitables: CharacterIdea[] = [
      {
        firstName: "Lune",
        fullName: "Lune the Fighter",
        gender: "female",
        personality: "Brash but kind",
        affinity: "Fire",
        classDirection: "Axe user",
        age: "young adult",
        backstory: "A wandering mercenary found among bandits.",
        firstSeenAs: "enemy non-boss",
        physicalDescription: "Scuffed armor, determined gaze",
        inGameDescription: "A brash fighter who decided to join you.",
        deathQuote: "I'll fight... no longer...",
      },
    ];
    const mockRecruiters: CharacterIdea[] = [
      testCharIdeaAislin,
      testCharIdeaThorne,
    ];
    const res = await genRecruitmentEvents({
      recruitables: testRecruitables,
      recruiters: mockRecruiters,
      chapterIdea: testPrologueChapter.idea,
      chapterNumber: 1,
    });
    console.log("Talk Setup Commands:", res.talkSetupCommands);
    console.log(
      "Recruitment Events:",
      JSON.stringify(res.recruitmentEvents, null, 2)
    );
  })();
}
