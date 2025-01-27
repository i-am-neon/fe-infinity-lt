import { Button } from "@/components/ui/button";
import { createGame, ping } from "./actions";
import GamesGrid from "@/components/ui/games-grid";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ThemeToggle />
        <Button onClick={ping}>Ping</Button>
        <Button onClick={createGame}>Create Game</Button>
        <GamesGrid />
      </main>
    </div>
  );
}

