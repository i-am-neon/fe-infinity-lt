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
// import {
//   NonClosableDialog,
//   NonClosableDialogContent,
//   NonClosableDialogHeader,
//   NonClosableDialogTitle,
// } from "@/components/ui/non-closable-dialog";
import apiCall from "@/lib/api-call";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creatingGameModalOpen, setCreatingGameModalOpen] = useState(false);
  const [gameIdea, setGameIdea] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateGame = useCallback(async () => {
    if (!gameIdea) {
      setError("No game idea selected.");
      return;
    }

    const parts = gameIdea.split(" - ");
    const title = parts[0] ? parts[0].trim() : "";
    const description = parts[1] ? parts[1].trim() : "";
    const tone = parts[2] ? parts[2].trim() : "";

    if (!title || !description || !tone) {
      setError(
        "Invalid game idea format. Expected 'Title - Description - Tone'."
      );
      return;
    }

    setDialogOpen(false);
    setCreatingGameModalOpen(true);
    setIsCreating(true);
    setError(null);

    try {
      const res = await apiCall<{
        success: boolean;
        gameNid?: string;
        error?: string;
      }>("create-game", {
        method: "POST",
        body: { title, description, tone },
      });

      if (res.success && res.gameNid) {
        navigate(`/games/${res.gameNid}?new=true`);
      } else if (res.error) {
        setError(res.error);
        setCreatingGameModalOpen(false);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setCreatingGameModalOpen(false);
    } finally {
      setIsCreating(false);
    }
  }, [navigate, gameIdea]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-between w-full">
          {/* <ModeToggle /> */}
        </div>

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
            {error && (
              <div className="p-3 mb-3 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}
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

        {/* <NonClosableDialog
          open={creatingGameModalOpen}
          onOpenChange={setCreatingGameModalOpen}
        >
          <NonClosableDialogContent allowClosing={false}>
            <NonClosableDialogHeader>
              <NonClosableDialogTitle>
                Game is being generated
              </NonClosableDialogTitle>
            </NonClosableDialogHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <p>The game is being created. Please wait...</p>
            </div>
          </NonClosableDialogContent>
        </NonClosableDialog> */}

        <GamesGrid />
      </main>
    </div>
  );
}

