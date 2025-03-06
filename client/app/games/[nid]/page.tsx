"use client";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, ChevronLeft, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  NonClosableDialog,
  NonClosableDialogContent,
  NonClosableDialogHeader,
  NonClosableDialogTitle,
  NonClosableDialogFooter,
  NonClosableDialogDescription,
} from "@/components/ui/non-closable-dialog";

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
  const [confirmNextChapterOpen, setConfirmNextChapterOpen] = useState(false);
  const [generatingChapterModalOpen, setGeneratingChapterModalOpen] =
    useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [oldChapterCount, setOldChapterCount] = useState<number | null>(null);

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

  const handleConfirmNextChapter = useCallback(() => {
    setConfirmNextChapterOpen(false);
    if (!data?.game) return;

    setOldChapterCount(data.game.chapters.length);
    setGeneratingChapterModalOpen(true);
    setLoadingAction("generate");

    startTransition(async () => {
      try {
        await generateNextChapter(data.game!.directory, data.game!.nid);
        // We'll rely on the polling to detect completion
      } catch (err) {
        setGenerationError(err instanceof Error ? err.message : String(err));
        setLoadingAction(null);
      }
    });
  }, [data]);

  const handleGenerateNextChapter = useCallback(() => {
    if (!data?.game) return;
    setConfirmNextChapterOpen(true);
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
              setGeneratingChapterModalOpen(false);
              clearInterval(pollId);

              // Auto-run the game on success
              openGame(res.game.directory);
            }
          }
        } catch (err) {
          console.error("Error polling after generate next chapter:", err);
          setGenerationError(
            "An error occurred while checking chapter generation status."
          );
          setLoadingAction(null);
          setGeneratingChapterModalOpen(false);
          clearInterval(pollId);
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
        <NonClosableDialog
          open={newGameModalOpen}
          onOpenChange={(open) => {
            // Only allow closing if there's an error
            if (creationError || !open) {
              setNewGameModalOpen(open);
            }
          }}
        >
          <NonClosableDialogContent allowClosing={!!creationError}>
            <NonClosableDialogHeader>
              <NonClosableDialogTitle>
                {creationError
                  ? "Game Creation Failed"
                  : "Game is being created"}
              </NonClosableDialogTitle>
              {creationError && (
                <NonClosableDialogDescription className="text-destructive">
                  An error occurred while creating your game
                </NonClosableDialogDescription>
              )}
            </NonClosableDialogHeader>

            {creationError ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-destructive border border-destructive">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p>{creationError}</p>
                </div>
                <NonClosableDialogFooter>
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
                </NonClosableDialogFooter>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <p>
                  Your game is being created and will open automatically when
                  finished. This will take about five minutes.
                </p>
              </div>
            )}
          </NonClosableDialogContent>
        </NonClosableDialog>
      )}

      {/* Next Chapter Confirmation Dialog */}
      <AlertDialog
        open={confirmNextChapterOpen}
        onOpenChange={setConfirmNextChapterOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Next Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              Make sure you have completed the current chapter before generating
              the next one. Your choices and actions in the current chapter will
              affect the story and characters in the next chapter.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmNextChapter}>
              Generate Next Chapter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Next Chapter Generation Loading/Error Dialog */}
      <NonClosableDialog
        open={generatingChapterModalOpen}
        onOpenChange={(open) => {
          // Only allow closing if there's an error
          if (generationError || !open) {
            setGeneratingChapterModalOpen(open);
          }
        }}
      >
        <NonClosableDialogContent allowClosing={!!generationError}>
          <NonClosableDialogHeader>
            <NonClosableDialogTitle>
              {generationError
                ? "Chapter Generation Failed"
                : "Generating Next Chapter"}
            </NonClosableDialogTitle>
            {generationError && (
              <NonClosableDialogDescription className="text-destructive">
                An error occurred while generating the next chapter
              </NonClosableDialogDescription>
            )}
          </NonClosableDialogHeader>

          {generationError ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-destructive border border-destructive">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p>{generationError}</p>
              </div>
              <NonClosableDialogFooter>
                <Button
                  onClick={() => {
                    setGenerationError(null);
                    setGeneratingChapterModalOpen(false);
                  }}
                >
                  Close
                </Button>
              </NonClosableDialogFooter>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <p>
                The next chapter is being generated based on your gameplay
                choices. This will take about five minutes, and the game will
                launch automatically when ready.
              </p>
            </div>
          )}
        </NonClosableDialogContent>
      </NonClosableDialog>

      <div className="p-6 space-y-4">
        <Link href="/" className="inline-flex items-center mb-4 text-sm font-medium hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
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
                      This will permanently delete the game&apos;s data and
                      files. This action cannot be undone.
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
