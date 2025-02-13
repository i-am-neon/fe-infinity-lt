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
      "A cursed warlord rises from the dead to reclaim their stolen throne, but each battle reveals more of the sinister magic keeping them alive.",
    tone: "dark, vengeful",
  },
  {
    title: "Echoes of the Forsaken",
    description:
      "A war between two ancient factions rages, and the protagonist is caught in the middle, forced to pick a side while uncovering forgotten histories.",
    tone: "tragic, mystical",
  },
  {
    title: "Fractured Bonds",
    description:
      "A shattered kingdom sees multiple claimants to the throne, and the player must decide which noble house to support—or betray.",
    tone: "political intrigue",
  },
  {
    title: "Veil of Twilight",
    description:
      "Prophecies dictate the fate of nations, but only the player knows they are false—leading to a battle of deception and manipulation.",
    tone: "mysterious, ominous",
  },
  {
    title: "Blood and Blight",
    description:
      "A kingdom ravaged by a mysterious plague fights for survival, but the cure is as dangerous as the disease.",
    tone: "grim, desperate",
  },
  {
    title: "Arcane Rebellion",
    description:
      "A magical empire hunts down rogue spellcasters, but the resistance is fractured—some mages seek peace, others want vengeance.",
    tone: "rebellious, tense",
  },
  {
    title: "Shattered Lineage",
    description:
      "The protagonist is the heir to a fallen dynasty but has no memory of their past, and each chapter reveals a new, conflicting truth.",
    tone: "conflicted, personal",
  },
  {
    title: "Celestial Ruin",
    description:
      "An empire blessed by divine weapons now finds them failing, and only by journeying across the land can the power be restored—or broken forever.",
    tone: "grand, epic",
  },
  {
    title: "Twin Fates",
    description:
      "Two royal siblings are separated by war, both believing the other is dead, but each chapter brings them closer to a painful reunion.",
    tone: "bittersweet, emotional",
  },
  {
    title: "The Ashen Pact",
    description:
      "A war between zealots and revolutionaries burns the land, and the player is caught between two extremes.",
    tone: "harsh, unyielding",
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
            <p className="mt-1 text-xs text-muted-foreground italic">Tone: {idea.tone}</p>
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