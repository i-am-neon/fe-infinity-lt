"use client";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { Game } from "@/types/game";
import { openGame, generateNextChapter, deleteGame } from "@/app/actions";
import apiCall from "@/lib/api-call";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export default function GameDetailPage() {
  const { nid } = useParams() as { nid: string };
  const router = useRouter();

  const [data, setData] = useState<{
    success: boolean;
    game?: Game;
    error?: string;
    creationError?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [creationError, setCreationError] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<
    "play" | "generate" | "delete" | null
  >(null);
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const isNew = searchParams.get("new") === "true";
  const [newGameModalOpen, setNewGameModalOpen] = useState(isNew);
  useEffect(() => {
    setNewGameModalOpen(searchParams.get("new") === "true");
  }, [searchParams]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Poll for newly created game if "new" query param is present
  useEffect(() => {
    if (!loading && newGameModalOpen) {
      let pollAttempts = 0;
      const maxPollAttempts = 200; // About 10 minutes of polling (200 * 3s)

      const intervalId = setInterval(async () => {
        try {
          pollAttempts++;
          const res = await apiCall<{
            success: boolean;
            game?: Game;
            error?: string;
            creationError?: string;
          }>(`games/${nid}`);

          // If we received a creation error from the server
          if (res.creationError) {
            setCreationError(res.creationError);
            clearInterval(intervalId);
            return;
          }

          if (res.success && res.game && res.game.chapters.length > 0) {
            // Game created successfully
            setData(res);
            setNewGameModalOpen(false);
            clearInterval(intervalId);
            // remove ?new=true from URL
            window.history.replaceState(null, "", `/games/${nid}`);
          } else if (res.error) {
            // API returned an error
            setCreationError(res.error);
            clearInterval(intervalId);
          } else if (pollAttempts >= maxPollAttempts) {
            // Timeout - too many attempts
            setCreationError(
              "Game creation timed out. Please try again later."
            );
            clearInterval(intervalId);
          } else {
            setData(res);
          }
        } catch (err) {
          console.error("Polling error:", err);
          if (pollAttempts >= 3) {
            // After a few connection failures, give up and show error
            setCreationError(
              "Connection to server failed. Please check if the server is running."
            );
            clearInterval(intervalId);
          }
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [newGameModalOpen, loading, nid]);

  useEffect(() => {
    let canceled = false;
    (async () => {
      const res = await apiCall<{
        success: boolean;
        game?: Game;
        error?: string;
      }>(`games/${nid}`);
      if (!canceled) {
        setData(res);
        setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [nid]);

  const handlePlay = useCallback(() => {
    setLoadingAction("play");
    startTransition(async () => {
      await openGame(data?.game?.directory ?? "");
      setLoadingAction(null);
    });
  }, [data]);

  const [oldChapterCount, setOldChapterCount] = useState<number | null>(null);

  const handleGenerateNextChapter = useCallback(() => {
    if (!data?.game) return;
    setOldChapterCount(data.game.chapters.length);
    setLoadingAction("generate");
    startTransition(async () => {
      await generateNextChapter(data.game!.directory, data.game!.nid);
    });
  }, [data]);

  // Poll for generate next chapter completion
  useEffect(() => {
    if (loadingAction === "generate" && oldChapterCount !== null) {
      const pollId = setInterval(async () => {
        try {
          const res = await apiCall<{
            success: boolean;
            game?: Game;
            error?: string;
          }>(`games/${nid}`);
          if (res.success && res.game) {
            setData(res);
            // Compare new chapters count to old
            if (res.game.chapters.length > oldChapterCount) {
              setLoadingAction(null);
              setOldChapterCount(null);
              clearInterval(pollId);
            }
          }
        } catch (err) {
          console.error("Error polling after generate next chapter:", err);
        }
      }, 3000);

      return () => clearInterval(pollId);
    }
  }, [loadingAction, oldChapterCount, nid]);

  const handleConfirmDelete = useCallback(() => {
    setDialogOpen(false);
    setLoadingAction("delete");
    startTransition(async () => {
      if (data?.game) {
        await deleteGame(data.game.nid, data.game.directory);
        window.location.href = "/";
      }
    });
  }, [data]);

  const disabled = loadingAction !== null || isPending;

  return (
    <>
      {newGameModalOpen && (
        <Dialog
          open={newGameModalOpen}
          onOpenChange={(open) => {
            // Only allow closing if there's an error
            if (creationError || !open) {
              setNewGameModalOpen(open);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {creationError
                  ? "Game Creation Failed"
                  : "Game is being created"}
              </DialogTitle>
              {creationError && (
                <DialogDescription className="text-destructive">
                  An error occurred while creating your game
                </DialogDescription>
              )}
            </DialogHeader>

            {creationError ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-destructive border border-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{creationError}</p>
                </div>
                <DialogFooter>
                  <Button onClick={() => router.push("/")} variant="secondary">
                    Return to Home
                  </Button>
                  <Button
                    onClick={() => {
                      setCreationError(null);
                      setNewGameModalOpen(false);
                    }}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p>
                  Your game is being created and will open automatically when
                  finished.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
      <div className="p-6 space-y-4">
        {loading ? (
          <div>Loading...</div>
        ) : !data?.success || !data.game ? (
          <div>
            <h1 className="text-xl font-bold mb-4">Error</h1>
            <p>Could not find the game: {data?.error}</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Game: {data.game.title}</h1>
            <p>Description: {data.game.description}</p>
            <p className="italic text-sm text-muted-foreground">
              Tone: {data.game.tone}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <Button onClick={handlePlay} disabled={disabled}>
                {loadingAction === "play" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Play Game
              </Button>

              <Button
                variant="secondary"
                onClick={handleGenerateNextChapter}
                disabled={disabled}
              >
                {loadingAction === "generate" && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Next Chapter
              </Button>

              <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={disabled}>
                    {loadingAction === "delete" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete Game
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the game’s data and files.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button
                      variant="secondary"
                      onClick={() => setDialogOpen(false)}
                      disabled={loadingAction === "delete"}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleConfirmDelete}
                      disabled={loadingAction === "delete"}
                    >
                      {loadingAction === "delete" && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>
    </>
  );
}

