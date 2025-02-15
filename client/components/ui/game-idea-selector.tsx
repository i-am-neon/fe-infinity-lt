"use client";
import { FC, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface GameIdeaSelectorProps {
  onChange: (idea: string) => void;
  selected?: string;
}

const gameIdeas = [
  {
    title: "Revenant Oath",
    description:
      "A once-feared warlord reawakens, determined to reclaim a lost empire. As the undead legions grow, questions of redemption or damnation loom over every choice.",
    tone: "dark, vengeful",
  },
  {
    title: "Echoes of the Forsaken",
    description:
      "Two ancient factions awaken from centuries of slumber, and the protagonist stands at the crossroads of war and forgotten prophecies. Each chapter unearths buried secrets with dire consequences.",
    tone: "tragic, mystical",
  },
  {
    title: "Fractured Bonds",
    description:
      "A kingdom splinters under the weight of rival claimants to the throne. Political schemes ensnare the player, forcing alliances that may shatter trust in unexpected ways.",
    tone: "political intrigue",
  },
  {
    title: "Celestial Ruin",
    description:
      "Sacred relics once upheld an empire’s glory, but now their power fades. Embark on a pilgrimage across a mystical land to either restore the divine or break the cycle forever.",
    tone: "grand, epic",
  },
  {
    title: "Wings of Virtue",
    description:
      "Legend speaks of a realm protected by skybound knights and griffon riders. When a malevolent force encroaches, the player’s valor could unite the knights—or bring the clouds crashing down.",
    tone: "heroic, high fantasy",
  },
  {
    title: "Blossoms of Dawn",
    description:
      "A peaceful continent flourishes under the guidance of enchanted forests and gentle magic. As tensions rise between nature’s guardians and ambitious nobles, alliances and loyalties bloom or wither.",
    tone: "hopeful, high fantasy",
  },
  {
    title: "Arcane Rebellion",
    description:
      "Spellcasters are hunted by a tyrannical empire intent on controlling all magic. The rebellion’s fate hinges on whether the protagonist can unify warring mage factions—or watch them tear each other apart.",
    tone: "rebellious, tense",
  },
  {
    title: "Moonlit Masquerade",
    description:
      "Every year, nobles and commoners gather for a festival under moonlit skies to broker alliances and host covert duels. Danger lurks behind every mask, and the player’s every dance step could spark a feud—or a romance.",
    tone: "whimsical, courtly intrigue",
  },
  {
    title: "Twin Fates",
    description:
      "Long-separated royal siblings believe each other lost to war. With each passing battle, they inch closer to a heart-wrenching reunion and the resolution of a kingdom’s fate.",
    tone: "bittersweet, emotional",
  },
  {
    title: "Goblin Guffaws",
    description:
      "A troop of mischievous goblins gatecrashes the royal tournament, turning serious quests into comedic misadventures. Whether you join their antics or thwart them could reshape the kingdom’s destiny—in the silliest way possible.",
    tone: "lighthearted, playful",
  },
];

const GameIdeaSelector: FC<GameIdeaSelectorProps> = ({
  onChange,
  selected,
}) => {
  const [startIndex, setStartIndex] = useState(0);

  const handleShuffle = useCallback(() => {
    setStartIndex((prev) => (prev + 3) % gameIdeas.length);
    onChange("");
  }, [onChange]);

  const currentIdeas =
    gameIdeas.slice(startIndex, startIndex + 3).length === 3
      ? gameIdeas.slice(startIndex, startIndex + 3)
      : [
          ...gameIdeas.slice(startIndex),
          ...gameIdeas.slice(0, (startIndex + 3) % gameIdeas.length),
        ];

  return (
    <div className="flex flex-col gap-4">
      {currentIdeas.map((idea, index) => {
        const ideaValue = `${idea.title} - ${idea.description} - ${idea.tone}`;
        return (
          <div
            key={`${idea.title}-${index}`}
            className={cn(
              "p-4 border rounded cursor-pointer",
              selected === ideaValue
                ? "border-2 border-blue-500 dark:border-blue-300"
                : ""
            )}
            onClick={() => onChange(ideaValue)}
          >
            <h3 className="font-bold">{idea.title}</h3>
            <p className="text-sm">{idea.description}</p>
            <p className="mt-1 text-xs text-muted-foreground italic">
              Tone: {idea.tone}
            </p>
          </div>
        );
      })}
      <Button variant="outline" onClick={handleShuffle}>
        Shuffle
      </Button>
    </div>
  );
};

export default GameIdeaSelector;
