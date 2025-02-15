import { AIEvent } from "@/ai/types/ai-event.ts";

export const testAIEventPrologueIntro: AIEvent = {
  name: "Prologue Opening",
  trigger: "level_start",
  condition: "True",
  sourceObjects: [
    {
      command: "narrate",
      args: [
        "In the heart of the Pendragor Kingdom, the once-flourishing fields now lay barren, swallowed by an insidious Blight that creeps ever closer to sealing the kingdom's fate. The air is thick with despair, yet hope flickers in the shadows, as a band of courageous souls prepares to embark on a perilous journey to seek salvation from Frostvein Mountains.",
      ],
    },
    {
      command: "add_portrait",
      args: ["Aric", "Left"],
    },
    {
      command: "add_portrait",
      args: ["Elara", "MidLeft"],
    },
    {
      command: "add_portrait",
      args: ["Gael", "MidRight"],
    },
    {
      command: "speak",
      args: [
        "Aric",
        "The kingdom edges closer to ruin with each passing day. We cannot delay any longer. Eldengrove has summoned us, and we must heed its call.",
      ],
    },
    {
      command: "speak",
      args: [
        "Elara",
        "Our people are counting on us, Aric. If the Hermitage of Frostvein holds the answers we seek, we cannot fail them. We must bring hope back to the Pendragor.",
      ],
    },
    {
      command: "speak",
      args: [
        "Gael",
        "The path ahead is fraught with danger, but within the tomes of Frostvein may lie the knowledge to end this blight once and for all. We must tread carefully.",
      ],
    },
    {
      command: "speak",
      args: [
        "Aric",
        "We are the kingdom's last line of defense. Let's ensure that our journey is not in vain, for the sake of all we hold dear.",
      ],
    },
    {
      command: "narrate",
      args: [
        "With determination burning in their hearts, the group prepares to journey into the unknown. Guided by duty and the weight of their destinies, they step forward into the storm, their resolve unyielding against the darkness threatening to consume their world.",
      ],
    },
  ],
};

