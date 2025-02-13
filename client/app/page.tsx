"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createGame, ping } from "./actions";
import GamesGrid from "@/components/ui/games-grid";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGame = useCallback(async () => {
    setIsCreating(true);
    try {
      const res = await createGame();
      if (res.success && res.gameNid) {
        router.push(`/games/${res.gameNid}`);
      }
    } finally {
      setIsCreating(false);
    }
  }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ThemeToggle />
        <Button onClick={ping}>Ping</Button>
        <Button onClick={handleCreateGame} disabled={isCreating}>
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Game
        </Button>
        <GamesGrid />
      </main>
    </div>
  );
}

