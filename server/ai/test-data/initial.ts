import { WorldSummary } from "@/ai/types/world-summary.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";

export const testGameName = "Blood and Blight";
export const testGameDescription =
  "A kingdom ravaged by a mysterious plague fights for survival, but the cure is as dangerous as the disease.";
export const testTone = "dark, serious";

export const testWorldSummary: WorldSummary = {
  worldName: "Ezerith",
  description:
    "In the realms of Ezerith, a shadow lurks—a mysterious blight that eats through the life's fabric, leaving nothing but desolation in its wake. This tale chronicles the kingdom’s perilous struggle for survival against an unseen foe, where every step towards its salvation poses new fears and doubt. Through whispered myths and untold truths, the path to salvation may lead them to the same darkness from which they flee.",
  geography: {
    regions: [
      {
        name: "Pendragor Kingdom",
        description:
          "Once thriving, this central kingdom is the heart of the plague. Verdant fields have turned barren, and its cities lie under a ghostly shroud.",
        relativeLocationInWorld: "Central",
        notableLocations: [
          {
            name: "Eldengrove Castle",
            description:
              "The regal seat of the Pendragor royalty, now a foreboding place of command struggling to protect its people while staving off the creeping despair.",
          },
          {
            name: "Hollow Blights",
            description:
              "An infected area considered ground zero for the blight; barely habitable and shunned by surrounding lands.",
          },
        ],
      },
      {
        name: "Frostvein Mountains",
        description:
          "Snow-covered peaks that house reclusive scholars and hermits rumored to hold secrets to both cure and cause alike.",
        relativeLocationInWorld: "North",
        notableLocations: [
          {
            name: "Summit Reach",
            description:
              "A temple where sacred rites once took place, now a focal point for pilgrims seeking answers.",
          },
          {
            name: "Veil's Nest",
            description:
              "Home to wizened druids who are perhaps the last hope for unraveling the mystery of the blight.",
          },
        ],
      },
      {
        name: "Crimson Shores",
        description:
          "These jagged coastlines are dotted with fishing villages that rely on sea trade; the sea is both a friend and enemy in these dangerous times.",
        relativeLocationInWorld: "East",
        notableLocations: [
          {
            name: "Port of Whispering Tides",
            description:
              "A vital link for resources and information from distant lands.",
          },
          {
            name: "Cove of Ghostly Lanterns",
            description:
              "Said to be haunted by spirits, yet revered by seafarers who interpret the lights as navigational guides.",
          },
        ],
      },
      {
        name: "Tanglebark Forest",
        description:
          "A labyrinthine woodland, a natural defense to the south, deeply revered but seldom traversed due to its mystifying nature.",
        relativeLocationInWorld: "South",
        notableLocations: [
          {
            name: "Glimmering Glade",
            description:
              "A sacred space thought to host magical potency, considered neutral ground by all factions.",
          },
          {
            name: "Oldwood Sentinel",
            description:
              "A gargantuan tree rumored to be the last bastion of ancient world knowledge.",
          },
        ],
      },
    ],
  },
  history:
    "The world of Ezerith wasn't always cloaked in shadow. Ages past, the lands flourished under the worship of nature and balance, guided by the Cycle, a doctrine that all life is transitory and must bow to the unyielding march of time. The people of Ezerith thrived under this prevailing belief, building empires that sang the praises of life and death alike.\n\nHowever, the arrival of a cataclysm—a plague unlike any other known as the Blight—forced humanity to scramble for answers rooted in their legends and lore. It is said that long ago, a shard of chaos fell from the heavens and rooted itself within the core of Ezerith, a price to pay for the kingdom's boundless growth. As tales go, only a chosen vassal from the once-great Pendragor bloodline could unlock the forbidden rites necessary to unchain the world's salvation or doom.\n\nThe history weaves tales of an enigmatic order known as The Keepers, who vanished into whispers before the rise of the Blight, and of mystical artifacts scattered across the world whose true purposes are carefully hidden, waiting to be unearthed by those with courage daring enough to change the kingdom's destiny.",
  factions: [
    {
      name: "Pendragor Remnants",
      description:
        "The fighting elite loyal to the kingdom, desperately holding the line against the encroaching Blight while harboring a secret—some may believe the cure demands a great sacrifice from their own.",
    },
    {
      name: "The Hermitage of Frostvein",
      description:
        "An enigmatic group of scholars and mystics ensconced in the Frostvein Mountains, dedicated to deciphering ancient tomes and lending their arcane knowledge to combat the Blight. They remain an aloof but vital asset.",
    },
    {
      name: "The Sea Tribunal",
      description:
        "Rulers of Crimson Shores, who use their naval prowess to maintain trade and seek alliances. They stand at the brink of moral decision between salvaging humanity or succumbing to isolation.",
    },
    {
      name: "The Silent Order",
      description:
        "A secretive guild operating within the shadows of Tanglebark Forest, believed to possess ancient secrets and druidic powers that once sustained the world’s balance.",
    },
  ],
};

export const testInitialGameIdea: InitialGameIdea = {
  backstory:
    "The Kingdom of Pendragor once stood as a beacon of prosperity and hope in the world of Ezerith. Its fertile lands and vibrant cities flourished under the careful guidance of the royal family, who held a deep-seated connection to the ancient traditions and lore of the land. However, this prosperity came to an abrupt halt with the arrival of the Blight, a mysterious plague that began to consume the kingdom from its heart, leaving nothing but despair and ruin in its wake. This shadowy affliction has turned the lush fields into barren wastelands and cast a pall over the once-bustling cities, now reduced to ghostly echoes of their former selves.\n\nEldengrove Castle, the seat of the Pendragor royalty, stands firm amidst this chaos, struggling to maintain order and protect the kingdom's remnants. Whispers of ancient myths suggest that the key to unraveling the Blight lies within these royal bloodlines, but with the monarchy weakened, the hope of salvation fades with each passing day.\n\nThe prologue begins on a tempestuous night as the protagonist, a young knight of the Pendragor Remnants, stands watch over the Hollow Blights—a dangerous region considered the origin of the plague. Tasked with guarding the border against encroaching darkness, the protagonist receives an urgent summons from Eldengrove Castle. The kingdom’s rulers, in a last bid for survival, have decided to send a small party to seek aid from the Hermitage of Frostvein, rumored to hold knowledge of ancient rites that may cure or destroy the Blight altogether.",
  characterIdeas: [
    {
      firstName: "Aric",
      fullName: "Sir Aric Valemont",
      gender: "male",
      personality:
        "Brave and duty-bound, yet haunted by doubts of his own lineage and destiny.",
      age: "young adult",
      backstory:
        "Born into a line of knights sworn to protect the Pendragor royal family, Sir Aric Valemont has grown up with tales of valor and sacrifice. He is deeply committed to his duty to safeguard the kingdom but is secretly troubled by his own family's ties to the cursed bloodline, fearing what destiny has in store for him.",
      firstSeenAs: "ally",
      physicalDescription:
        "Tall and sturdy, with piercing gray eyes and dark, tousled hair; wears battered armor marked by the emblem of Pendragor.",
      inGameDescription: "A young knight burdened by legacy and duty.",
      deathQuote: "I have failed... the kingdom... forgive me.",
    },
    {
      firstName: "Elara",
      fullName: "Lady Elara Windmere",
      gender: "female",
      personality:
        "Determined and resourceful, with a strong sense of justice and compassion for the suffering.",
      age: "young adult",
      backstory:
        "Lady Elara hails from a noble family that fell into destitution following the Blight's spread. Driven by a desire to restore her family's honor and save the kingdom, she joins the mission to seek help from the Hermitage of Frostvein, believing she can be a beacon of hope in these dark times.",
      firstSeenAs: "ally",
      physicalDescription:
        "Slender and agile, with long auburn hair and eyes as sharp as her wit; dressed in travel-worn but dignified attire.",
      inGameDescription: "A noblewoman seeking redemption and answers.",
      deathQuote: "I couldn't... be the light... for our people...",
    },
    {
      firstName: "Gael",
      fullName: "Gael Thorne",
      gender: "male",
      personality:
        "Reserved and analytical, often keeping to himself but fiercely loyal to his companions.",
      age: "young adult",
      backstory:
        "Once an apprentice to the scholars of Frostvein, Gael Thorne is a mage with a thirst for knowledge. Believing that the answers to defeat the Blight lie within the ancient texts, he joins the expedition, driven by both duty and curiosity.",
      firstSeenAs: "ally",
      physicalDescription:
        "Lean and sharp-featured, with striking green eyes and unruly brown hair; commonly seen wearing a cloak adorned with arcane symbols.",
      inGameDescription: "A contemplative mage in search of truth.",
      deathQuote: "Knowledge... escaped... me... too soon.",
    },
  ],
  plotDirections: [
    "The party discovers that someone within their ranks might be a spy, casting doubt and tension among the group.",
    "A mysterious artifact is found, hinting at a power that could either save or doom the kingdom, its true nature unknown.",
    "An encounter with a wandering druid from the Silent Order provides cryptic guidance and foreshadowing of greater trials to come.",
  ],
  additionalNotes:
    "The prologue should establish the gravity of the situation, infusing a sense of urgency and importance to the mission. The tone should reflect the desperate struggle of the characters against the encroaching darkness, with an emphasis on their personal stakes and resolve to save their home from destruction.",
};
