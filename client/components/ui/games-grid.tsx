"use client";
import { useState, useEffect, useCallback } from "react";
import { Play, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface Game {
  nid: string;
  title: string;
  directory: string;
  description: string;
}

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGameId, setLoadingGameId] = useState<string | null>(null);

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
      try {
        await openGame(directory);
      } finally {
        setLoadingGameId(null);
      }
    },
    []
  );

  const handleGenerateNextChapter = useCallback(
    async (directory: string, gameNid: string) => {
      setLoadingGameId(gameNid);
      try {
        await generateNextChapter(directory, gameNid);
      } finally {
        setLoadingGameId(null);
      }
    },
    []
  );

  return (
    <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
      {games.map((game) => (
        <div key={game.nid} className="relative group">
          <Card>
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </Card>
          <TooltipProvider>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 absolute top-2 right-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenGame(game.directory, game.nid)}
                    disabled={loadingGameId === game.nid}
                  >
                    {loadingGameId === game.nid ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run Game</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleGenerateNextChapter(game.directory, game.nid)}
                    disabled={loadingGameId === game.nid}
                  >
                    {loadingGameId === game.nid ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate Next Chapter</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      ))}
    </div>
  );
}