"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Game } from "@/types/game";
import { listGames } from "@/app/actions";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  console.log("games :>> ", games);
  useEffect(() => {
    listGames().then((fetchedGames) => {
      setGames(fetchedGames);
    });
    const interval = setInterval(() => {
      listGames().then((fetchedGames) => setGames(fetchedGames));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
      {games.map((game) => (
        <Link
          key={game.nid}
          href={`/games/${game.nid}`}
          className="relative block"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

