"use client";
import { useState, useEffect, useCallback } from "react";
import { Play, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Game } from "@/types/game";
import { openGame, generateNextChapter, listGames } from "@/app/actions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGameId, setLoadingGameId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<
    "opening" | "creatingNextChapter" | null
  >(null);

  useEffect(() => {
    listGames().then((fetchedGames) => {
      setGames(fetchedGames);
    });
    const interval = setInterval(() => {
      listGames().then((fetchedGames) => setGames(fetchedGames));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenGame = useCallback(
    async (directory: string, gameNid: string) => {
      setLoadingGameId(gameNid);
      setLoadingAction("opening");
      try {
        await openGame(directory);
      } finally {
        setLoadingGameId(null);
        setLoadingAction(null);
      }
    },
    []
  );

  const handleGenerateNextChapter = useCallback(
    async (directory: string, gameNid: string) => {
      setLoadingGameId(gameNid);
      setLoadingAction("creatingNextChapter");
      try {
        await generateNextChapter(directory, gameNid);
      } finally {
        setLoadingGameId(null);
        setLoadingAction(null);
      }
    },
    []
  );

  return (
    <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
      {games.map((game) => (
        <div key={game.nid} className="relative">
          <Card>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </Card>
          <TooltipProvider>
            <div className="flex gap-2 absolute top-2 right-2">
              {loadingGameId === game.nid ? (
                <div className="flex gap-1 items-center pr-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">
                    {loadingAction === "opening" ? "opening" : "generating"}
                  </span>
                </div>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenGame(game.directory, game.nid)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Run Game</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleGenerateNextChapter(game.directory, game.nid)
                        }
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate Next Chapter</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
}

