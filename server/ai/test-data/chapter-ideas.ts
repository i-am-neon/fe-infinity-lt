import { ChapterIdea } from "@/ai/types/chapter-idea.ts";
import { testCharIdeaThorne } from "@/ai/test-data/character-ideas.ts";

export const testChapterIdea: ChapterIdea = {
  title: "Whispers in the Frost",
  intro:
    "As the dawn breaks over the frost-laden peaks, Sir Aric and his companions arrive at the outskirts of the Frostvein Mountains, their breath crystallizing in the biting air. The journey has been arduous, fraught with skirmishes against the creeping Blight's minions. The party pauses to gather their strength, each member acutely aware of the weight of their mission. A sense of unease lingers, a feeling that they are not alone in these mountains, as shadows flit between the snow-laden trees.",
  battle:
    "The party finds themselves in an ambush, surrounded by a group of masked figures brandishing weapons and demanding their surrender. These foes, seemingly aligned with the Hermitage of Frostvein, accuse the party of bringing the Blight to their doorstep. With little choice, Sir Aric and his companions prepare to fight, hoping to prove their cause is just and gain a chance to speak with the scholars.",
  outro:
    "After a tense battle, Sir Aric and his group manage to overpower the masked figures, though not without suffering some injuries. As the last enemy falls, a voice calls out from the shadows, revealing a member of the Hermitage. A truce is called, and the party is led to the hidden sanctuary within the mountains, where they hope to find the answers they desperately seek.",
  boss: {
    firstName: "Kurzan",
    fullName: "Kurzan the Veiled",
    gender: "male",
    personality:
      "Ruthless and fanatical, devoted to protecting the secrets of the Hermitage at all costs.",
    affinity: "Dark",
    classDirection: "Sword Fighter",
    age: "mature adult",
    backstory:
      "Once a scholar of the Hermitage, Kurzan took a fanatical turn during the rise of the Blight, believing that outsiders were responsible for the plague. He now commands a sect within the Hermitage, intent on guarding its secrets from those he deems unworthy.",
    firstSeenAs: "boss",
    physicalDescription:
      "Tall and imposing, with a stern visage partially hidden by a hood; his attire is a mix of scholarly robes and battle-worn armor.",
    inGameDescription: "A fanatical guardian of the Hermitage's secrets.",
    deathQuote: "The secrets... will not die... with me...",
  },
  newNonBattleCharacters: [testCharIdeaThorne],
};

