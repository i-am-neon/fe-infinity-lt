import { WorldSummary } from "@/ai/types/world-summary.ts";
import {
  initialGameIdeaSchema,
  InitialGameIdea,
} from "@/ai/types/initial-game-idea.ts";
import generateStructuredData from "@/lib/generate-structured-data.ts";

export default function genInitialGameIdea({
  worldSummary,
}: {
  worldSummary: WorldSummary;
}): Promise<InitialGameIdea> {
  const systemMessage = `You are a Fire Emblem Fangame Prologue Story Generator!

Your task is to craft a detailed story idea for the prologue chapter of a Fire Emblem fangame based on the provided world summary.
Take into account the world setting, geography, history, and factions to create a compelling narrative start.
In your response, include:
- A narrative backstory that sets the stage for the game.
- A list of character ideas for the characters that will appear in the prologue. Use the format specified in the CharacterIdea schema.
- Potential plot directions or twists that could define the prologue.
- Any additional notes or details that would be important for establishing the tone and setup of the game.

Return the response as a JSON object matching the following schema:
- backstory: string
- characterIdeas: array of CharacterIdea objects
- plotDirections: array of strings
- additionalNotes: string (optional)`;

  const prompt = `World Summary: ${JSON.stringify(worldSummary, null, 2)}`;

  return generateStructuredData<InitialGameIdea>({
    schema: initialGameIdeaSchema,
    systemMessage,
    prompt,
    temperature: 0.8,
  });
}

if (import.meta.main) {
  const dummyWorldSummary: WorldSummary = {
    worldName: "Aldrion",
    description:
      "A world on the brink of collapse due to an enigmatic plague that sows chaos and despair. Kingdoms struggle for power under the shadow of a mysterious disease, with each ruler grappling between the potential cure and its ominous consequences.",
    geography: {
      regions: [
        {
          name: "Verenthia",
          description:
            "A once-thriving kingdom now plagued by the mysterious Blight. Ruled by Queen Merith, it was known for its sprawling farmlands and bustling towns, now abandoned or overrun with sickness.",
          relativeLocationInWorld: "Central Aldrion",
          notableLocations: [
            {
              name: "City of Vernell",
              description:
                "The capital city where the royal palace stands, surrounded by quarantined districts filled with the plagued.",
            },
            {
              name: "The Daelmoor Woods",
              description:
                "An ancient forest rumored to hold secrets of the Blight's origin.",
            },
          ],
        },
        {
          name: "Nerris",
          description:
            "A fortified nation priding itself on its military prowess. With tensions running high, they seek to control the cure to assert dominance over Aldrion.",
          relativeLocationInWorld: "North of Verenthia",
          notableLocations: [
            {
              name: "Fortress Bastile",
              description:
                "The stronghold of Nerris, known for its impregnable walls and elite warriors.",
            },
            {
              name: "The Icy Tundra",
              description:
                "A desolate landscape home to mysterious ruins and whispers of ancient knowledge.",
            },
          ],
        },
        {
          name: "Lunorthine",
          description:
            "An isolated island shrouded in mist, said to be the birthplace of a unique form of magic tied to the Blight.",
          relativeLocationInWorld: "East of the mainland",
          notableLocations: [
            {
              name: "The Misty Sanctum",
              description:
                "A secluded temple that is a focal point for those seeking mystical insight into the cause of the Blight.",
            },
            {
              name: "The Coral Archipelago",
              description:
                "A series of small islands rich in natural resources, contested over by various factions.",
            },
          ],
        },
      ],
    },
    history:
      "In the world of Aldrion, peace was once maintained by the Five Petal Accord—a treaty signed by the major kingdoms of Verenthia, Nerris, Kaeldan, Lunorthine, and Estoria, which ensured trade, safety, and prosperity. However, this unity was shattered when the Blight emerged without warning, spreading rapidly through Verenthia. The affliction brought madness, sickness, and a relentless hunger for the land.\n\nLegends speak of a time when a powerful mage, seeking immortality, unleashed the Blight in a careless experiment gone wrong. The mage's records indicate a potential cure hidden deep within the Daelmoor Woods, but at a devastating cost.\n\nWith the rising chaos, Verenthia's neighbors wrestle for control over the cure, each aiming to manipulate it for their own ends, threatening to plunge Aldrion into an era of darkness and endless war.",
    factions: [
      {
        name: "Kingdom of Verenthia",
        description:
          "Under the reign of Queen Merith, Verenthia struggles to combat the Blight while maintaining order among its terrified populace.",
      },
      {
        name: "Nerris Legion",
        description:
          "Led by General Thorne, Nerris aims to seize the cure to extend their influence and sovereignty over the weakened nations.",
      },
      {
        name: "Mystics of Lunorthine",
        description:
          "A secretive group dedicated to understanding the mystical elements of the Blight, rumored to know the hidden arts of controlling its effects.",
      },
      {
        name: "Wanderers of the Daelmoor",
        description:
          "Rogues and adventurers drawn to the Daelmoor Woods in search of fame or fortune amid the chaos.",
      },
    ],
  };

  genInitialGameIdea({ worldSummary: dummyWorldSummary }).then((idea) => {
    console.log(JSON.stringify(idea, null, 2));
  });
}

