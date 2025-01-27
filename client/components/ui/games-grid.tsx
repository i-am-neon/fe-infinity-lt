"use client";
import { useState, useEffect, useCallback } from "react";
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

  return (
    <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
      {games.map((game) => (
        <Card key={game.nid}>
          <CardHeader>
            <CardTitle>{game.title}</CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}