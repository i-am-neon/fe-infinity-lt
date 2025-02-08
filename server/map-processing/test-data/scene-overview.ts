import { FE8Class } from "@/types/fe8-class";
import { SceneOverview } from "@/types/scene-overview";

export const ch1SceneOverview: SceneOverview = {
  chapterName: "Escape!",
  preBattleStory:
    "Grado soldiers led by Breguet seize control of a fort at Border Mulan. Princess Tana of Frelia, awaiting news of Eirika's escape from Renais, sends a messenger to King Hayden but remains at the fort. When Breguet captures the fort, she is taken prisoner. Meanwhile, Eirika and Seth arrive at the border and find the fort under Grado's control. Seth suggests bypassing it, but Eirika refuses, unwilling to let Frelia's people suffer as hers did. She decides to liberate the fort.",
  battleSetup:
    "As the battle begins, Breguet recognizes Eirika and orders his men to capture her. Meanwhile, Franz and Gilliam arrive from the north, intending to reinforce the fort, only to find it occupied by Grado forces. Franz hurries to inform Eirika of Tana's presence, while Seth reminds him that their priority is to keep Eirika safe.",
  objective: "Defeat the boss (Breguet).",
  bossName: "Breguet",
  playerUnits: ["Eirika", "Seth", "Franz", "Gilliam"],
};

export const ch2SceneOverview: SceneOverview = {
  chapterName: "The Protected",
  preBattleStory:
    "Following Seth's planned route, Eirika's group travels south. Vanessa scouts ahead and discovers bandits planning to raid a village left vulnerable by Grado's invasion. Ross, a young villager, warns his father Garcia of the attack, and they flee. However, Ross is injured during the escape. Vanessa, witnessing the assault, rushes back to inform Eirika. Determined to aid the villagers, Eirika devises a plan: Vanessa will transport the injured boy across the mountains while Moulder heals him with his staff.",
  battleSetup:
    "As the battle unfolds, Ross approaches Eirika, requesting help but insisting on fighting to save his father. He can also reunite with Garcia, who urges him to flee, though Ross refuses and continues to fight. Meanwhile, Vanessa and Moulder provide crucial support as the group fends off the bandits and protects the village.",
  objective: "Defeat the boss (Bone).",
  bossName: "Bone",
  playerUnits: [
    "Eirika",
    "Seth",
    "Franz",
    "Gilliam",
    "Vanessa",
    "Moulder",
    "Ross",
    "Garcia",
  ],
};

export const ch3SceneOverview: SceneOverview = {
  chapterName: "The Bandits of Borgo",
  preBattleStory:
    "Eirika and Seth pursue a thief who has stolen Eirika's bracelet, tracking him to the hideout of Bazba's Bandits. Seeing the growing lawlessness in Renais due to Grado's invasion, Eirika laments her homeland's descent into chaos. Along the way, they encounter a girl named Neimi, who pleads for help. Her friend Colm has gone alone to the bandits' hideout to retrieve a stolen item. Sharing a common destination and unwilling to turn away from those in need, Eirika agrees to assist Neimi.",
  battleSetup:
    "As the group infiltrates the bandits' fortress, Neimi offers her archery skills to aid in the fight. Meanwhile, Colm sneaks inside and begins stealing from the bandits. If Neimi speaks to Colm, she urges him to leave, but he refuses. However, upon seeing Neimi cry, he relents and tells her to stay close to him as he continues his mission.",
  objective: "Defeat the boss (Bazba).",
  bossName: "Bazba",
  playerUnits: [
    "Eirika",
    "Seth",
    "Franz",
    "Gilliam",
    "Vanessa",
    "Moulder",
    "Ross",
    "Garcia",
    "Neimi",
    "Colm",
  ],
};

export const ch4SceneOverview: SceneOverview = {
  chapterName: "Ancient Horrors",
  preBattleStory:
    "Having defeated Bazba and his bandit gang, Eirika continues her journey south to Grado in search of Ephraim. Their path takes them through Za'ha Woods, an ancient forest in Renais. As they travel deeper, Eirika notices strange figures moving in the shadows and asks Seth about them.\n\n" +
    "Meanwhile, Artur and Lute, residents of the area, also notice the creatures. Artur is deeply concerned, questioning how such monsters could exist while the Sacred Stones still remain. Lute, ever analytical, recognizes them as revenants—walking corpses from legend. Artur instructs Lute to stay behind and protect the village while he goes north to warn the travelers. She agrees, confident in her abilities.\n\n" +
    "Artur reaches Eirika and warns her that they must move quickly before they are surrounded. When Eirika questions if these are the same monsters that once served the Demon King, Artur hesitates but acknowledges that the legends describe similar creatures. Suddenly, a mogall attacks, but Artur swiftly dispatches it. Resolute, Eirika insists on staying to fight alongside him, and the battle begins.",
  battleSetup:
    "Once Eirika talks to Artur, Artur joins forces with Eirika to repel the undead creatures. Lute is hanging around the village and can be recruited if talked to, intrigued by the opportunity to study these monsters firsthand. Midway through the battle, L'Arachel and her retainers appear on the cliffs to the northeast. Declaring her divine mission to eradicate the creatures of darkness, she considers jumping down to join the fray but is persuaded by Rennac to find a safer route.",
  objective: "Rout the enemy.",
  bossName: "None",
  playerUnits: [
    "Eirika",
    "Seth",
    "Franz",
    "Gilliam",
    "Vanessa",
    "Moulder",
    "Ross",
    "Garcia",
    "Neimi",
    "Colm",
  ],
  greenUnits: [
    {
      name: "Artur",
      description: "A devout monk skilled in light magic.",
      class: FE8Class.Monk,
    },
    {
      name: "Lute",
      description: "A prodigious mage with a thirst for knowledge.",
      class: FE8Class.Mage,
    },
  ],
};

export const ch5SceneOverview: SceneOverview = {
  chapterName: "The Empire's Reach",
  preBattleStory:
    "After escaping the horrors of Za'ha Woods, Eirika and her group continue their journey to Serafew, a border town between Renais and Grado. Upon arrival, they find the town under full occupation by Grado forces, much to the dismay of the locals.\n\n" +
    "Meanwhile, Joshua, a wandering swordsman, muses about the local arena and his latest gambling streak. His thoughts are interrupted by a passing cleric who bumps into him before hurrying away. Intrigued but undeterred, Joshua decides to return to the arena, unaware of the storm brewing in Serafew.\n\n" +
    "Eirika and her allies, slipping past the town’s low security, are approached by a hooded stranger asking about an indigo-haired girl. Eirika, puzzled by the inquiry, denies having seen such a person, and the man moves on. Moments later, a commotion erupts as soldiers pursue Natasha, a fugitive cleric accused of treason. Natasha, seizing her chance, dashes toward Eirika and pleads for protection, stating that she bears crucial information about Grado’s invasion. Before she can explain further, the enemy closes in, and the battle begins.",
  battleSetup:
    "As the skirmish unfolds, Joshua leaves the arena, frustrated by his recent losses. A nearby soldier threatens to report him to the captain, but Joshua dismisses the warning. If Natasha manages to speak to him, she challenges him to a coin toss, wagering her safety. Amused by her boldness, Joshua flips the coin—and upon losing, he laughs and agrees to fight alongside Eirika's group.",
  objective: "Defeat the boss (Saar).",
  bossName: "Saar",
  playerUnits: [
    "Eirika",
    "Seth",
    "Franz",
    "Gilliam",
    "Vanessa",
    "Moulder",
    "Ross",
    "Garcia",
    "Neimi",
    "Colm",
    "Artur",
    "Lute",
    "Natasha",
    "Joshua",
  ],
};

