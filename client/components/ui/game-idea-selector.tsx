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
      "A once-feared warlord reawakens, determined to reclaim a lost empire. As the undead legions grow, every choice teeters between redemption and eternal damnation.",
    tone: "dark fantasy, vengeful",
  },
  {
    title: "The Grand Tourney",
    description:
      "Once a year, the kingdom hosts a grand festival where duels, wits, and whispers decide the fates of nobles and commoners alike. Every move in the arena or the court can forge alliances or fuel rivalries.",
    tone: "whimsical, courtly intrigue",
  },
  {
    title: "Fractured Bonds",
    description:
      "A crumbling kingdom is torn by rival factions vying for the throne. Trust is a fragile currency in this world of spies, shifting loyalties, and high-stakes diplomacy.",
    tone: "political intrigue, strategic",
  },
  {
    title: "Celestial Ruin",
    description:
      "The sacred relics that upheld an empire’s power are fading. A desperate pilgrimage begins to either restore the divine or shatter the cycle forever.",
    tone: "grand adventure, epic",
  },
  {
    title: "Arcane Rebellion",
    description:
      "A tyrannical empire has outlawed magic, forcing spellcasters into hiding. Can the player unite the warring mage factions before they destroy each other?",
    tone: "rebellion, tense",
  },
  {
    title: "Twin Fates",
    description:
      "Two royal siblings, separated by war, believe each other dead. As their armies march closer, a reunion seems inevitable—but will it be as family, or as enemies?",
    tone: "bittersweet, emotional",
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