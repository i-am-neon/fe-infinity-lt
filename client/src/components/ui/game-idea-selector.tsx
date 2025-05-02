"use client";
import { FC, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GAME_IDEAS } from "@/lib/game-ideas";

interface GameIdeaSelectorProps {
  onChange: (idea: string) => void;
  selected?: string;
}

const GameIdeaSelector: FC<GameIdeaSelectorProps> = ({
  onChange,
  selected,
}) => {
  const [startIndex, setStartIndex] = useState(0);

  const handleShuffle = useCallback(() => {
    setStartIndex((prev) => (prev + 3) % GAME_IDEAS.length);
    onChange("");
  }, [onChange]);

  const currentIdeas =
    GAME_IDEAS.slice(startIndex, startIndex + 3).length === 3
      ? GAME_IDEAS.slice(startIndex, startIndex + 3)
      : [
        ...GAME_IDEAS.slice(startIndex),
        ...GAME_IDEAS.slice(0, (startIndex + 3) % GAME_IDEAS.length),
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
