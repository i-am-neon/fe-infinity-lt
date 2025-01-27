"use client";
import { useState, useEffect, useCallback } from "react";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { openGame } from "@/app/actions";
import apiCall from "@/lib/api-call";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Game {
  nid: string;
  title: string;
  directory: string;
  description: string;
}

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGameId, setLoadingGameId] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    const res = await apiCall("games");
    if (res?.games) {
      setGames(res.games);
    }
  }, []);

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, [fetchGames]);

  const handleOpenGame = useCallback(async (directory: string, gameNid: string) => {
    setLoadingGameId(gameNid);
    try {
      await openGame(directory);
    } finally {
      setLoadingGameId(null);
    }
  }, []);

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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenGame(game.directory, game.nid)}
            disabled={loadingGameId === game.nid}
            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2"
          >
            {loadingGameId === game.nid ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}