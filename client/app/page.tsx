"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GameIdeaSelector from "@/components/ui/game-idea-selector";
import GamesGrid from "@/components/ui/games-grid";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { createGame } from "./actions";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creatingGameModalOpen, setCreatingGameModalOpen] = useState(false);
  const [gameIdea, setGameIdea] = useState("");

  const handleCreateGame = useCallback(async () => {
    if (!gameIdea) {
      console.error("No game idea selected.");
      return;
    }
    const parts = gameIdea.split(" - ");
    const title = parts[0] ? parts[0].trim() : "";
    const description = parts[1] ? parts[1].trim() : "";
    const tone = parts[2] ? parts[2].trim() : "";
    if (!title || !description || !tone) {
      console.error(
        "Invalid game idea format. Expected 'Title - Description - Tone'."
      );
      return;
    }
    setDialogOpen(false);
    setCreatingGameModalOpen(true);
    setIsCreating(true);

    try {
      const res = await createGame({ title, description, tone });
      if (res.success && res.gameNid) {
        router.push(`/games/${res.gameNid}?new=true`);
      }
    } finally {
      // We do not close creatingGameModalOpen, because we redirect
      setIsCreating(false);
    }
  }, [router, gameIdea]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ThemeToggle />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create New Game
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a Game Idea</DialogTitle>
            </DialogHeader>
            <div>
              <GameIdeaSelector
                onChange={(val) => setGameIdea(val)}
                selected={gameIdea}
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGame}
                disabled={isCreating || !gameIdea}
              >
                {isCreating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={creatingGameModalOpen}
          onOpenChange={setCreatingGameModalOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game is being generated</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <p>The game is being created. Please wait...</p>
            </div>
          </DialogContent>
        </Dialog>

        <GamesGrid />
      </main>
    </div>
  );
}
