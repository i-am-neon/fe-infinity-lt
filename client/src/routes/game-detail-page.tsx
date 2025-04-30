import apiCall from "@/lib/api-call";
import { AlertCircle, ChevronLeft, Loader2, Pencil, X, Wrench, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Game } from "../types/game";
import { ChapterGeneratorLoader } from "@/components/ui/chapter-generator-loader";
import useGenerationProgress, { useGameCreationProgress } from "@/lib/use-generation-progress";
import { AnimatePresence, motion } from "framer-motion";
import { getTitleImagePath } from "@/lib/asset-path";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "@/components/ui/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const showDebugButtons = false;

export default function GameDetailPage() {
  const { nid } = useParams<{ nid: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<{
    success: boolean;
    game?: Game;
    error?: string;
    creationError?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [creationError, setCreationError] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<
    "play" | "generate" | "delete" | "test" | "regenerate" | "editor" | null
  >(null);

  const isNew = searchParams.get("new") === "true";
  const [newGameModalOpen, setNewGameModalOpen] = useState(isNew);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmNextChapterOpen, setConfirmNextChapterOpen] = useState(false);
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false);
  const [generatingChapterModalOpen, setGeneratingChapterModalOpen] =
    useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [oldChapterCount, setOldChapterCount] = useState<number | null>(null);
  const [deletingFailedGame, setDeletingFailedGame] = useState(false);
  const [fixGameBugsModalOpen, setFixGameBugsModalOpen] = useState(false);

  const generationProgress = useGenerationProgress(
    nid,
    loadingAction === "generate" || loadingAction === "test" || loadingAction === "regenerate"
  );

  const gameCreationProgress = useGameCreationProgress(
    nid,
    isNew && newGameModalOpen
  );

  // Watch for generation errors
  useEffect(() => {
    if (generationProgress.error) {
      setGenerationError(generationProgress.error);
      setLoadingAction(null);
      // Keep the modal open to show the error
    }
  }, [generationProgress.error]);

  // Poll for newly created game if "new" query param is present
  useEffect(() => {
    if (!loading && newGameModalOpen && nid) {
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
            navigate(`/games/${nid}`, { replace: true });
            // Refresh the page to ensure images load properly
            window.location.reload();
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
  }, [newGameModalOpen, loading, nid, navigate]);

  useEffect(() => {
    let canceled = false;
    if (!nid) return;

    (async () => {
      try {
        const res = await apiCall<{
          success: boolean;
          game?: Game;
          error?: string;
        }>(`games/${nid}`);
        if (!canceled) {
          setData(res);
          setLoading(false);
        }
      } catch (error) {
        if (!canceled) {
          setLoading(false);
          console.error("Error fetching game:", error);
        }
      }
    })();
    return () => {
      canceled = true;
    };
  }, [nid]);

  const handlePlay = useCallback(async () => {
    if (!data?.game) return;

    setLoadingAction("play");
    try {
      await apiCall("run-game", {
        method: "POST",
        body: { directory: data.game.directory },
      });

      // Add a 5-second delay before removing the loading state
      setTimeout(() => {
        setLoadingAction(null);
      }, 5000);
    } catch (error) {
      console.error("Error running game:", error);
      setLoadingAction(null);
    }
  }, [data]);

  const handleConfirmNextChapter = useCallback(async () => {
    setConfirmNextChapterOpen(false);
    if (!data?.game || !nid) return;

    setOldChapterCount(data.game.chapters.length);
    setGeneratingChapterModalOpen(true);
    setLoadingAction("generate");

    try {
      const response = await apiCall<{
        success: boolean;
        error?: string;
        message?: string;
      }>("generate-next-chapter", {
        method: "POST",
        body: { directory: data.game.directory, gameNid: data.game.nid },
      });

      // Check if the response indicates failure
      if (!response.success) {
        setGenerationError(response.error || "Failed to generate next chapter");
        setLoadingAction(null);
        return;
      }
      // We'll rely on the polling to detect completion
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : String(err));
      setLoadingAction(null);
    }
  }, [data, nid]);

  const handleConfirmRegenerate = useCallback(async () => {
    setConfirmRegenerateOpen(false);
    if (!data?.game || !nid) return;

    setOldChapterCount(data.game.chapters.length - 1);
    setGeneratingChapterModalOpen(true);
    setLoadingAction("regenerate");

    try {
      await apiCall("regenerate-current-chapter", {
        method: "POST",
        body: { directory: data.game.directory, gameNid: data.game.nid }
      });
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : String(err));
      setLoadingAction(null);
    }
  }, [data, nid]);

  const handleGenerateNextChapter = useCallback(() => {
    if (!data?.game) return;
    setConfirmNextChapterOpen(true);
  }, [data]);

  // Poll for generate next chapter completion
  useEffect(() => {
    if ((loadingAction === "generate" || loadingAction === "regenerate") && oldChapterCount !== null && nid) {
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
  }, [loadingAction, oldChapterCount, nid, data]);

  // Handle test generation completion
  useEffect(() => {
    if (loadingAction === "test" && generationProgress.progress.currentStep === 16) {
      // When we reach the final step (index 16), we consider the test generation complete
      // Use setTimeout to allow the user to see the final step briefly
      const completionTimer = setTimeout(() => {
        setLoadingAction(null);
        setGeneratingChapterModalOpen(false);
      }, 3000);

      return () => clearTimeout(completionTimer);
    }
  }, [loadingAction, generationProgress.progress]);

  // Handle real chapter generation completion (non-test)
  useEffect(() => {
    // When in generate or regenerate mode and final step reached, close loader and refresh game
    if ((loadingAction === "generate" || loadingAction === "regenerate") && generationProgress.progress.currentStep === 16) {
      const completionTimer = setTimeout(async () => {
        // Close loader
        setLoadingAction(null);
        setGeneratingChapterModalOpen(false);
        // Refresh game data and auto-run
        if (nid) {
          try {
            const res = await apiCall<{
              success: boolean;
              game?: Game;
              error?: string;
              creationError?: string;
            }>(`games/${nid}`);
            if (res.success && res.game) {
              setData(res);
            }
          } catch (err) {
            console.error("Error refreshing game after chapter generation:", err);
          }
        }
      }, 3000);
      return () => clearTimeout(completionTimer);
    }
  }, [loadingAction, generationProgress.progress.currentStep, nid]);

  const handleTestGeneration = useCallback(async () => {
    if (!data?.game || !nid) return;

    setGenerationError(null); // Clear any previous errors
    setOldChapterCount(data.game.chapters.length);
    setGeneratingChapterModalOpen(true);
    setLoadingAction("test");

    try {
      const response = await apiCall<{
        success: boolean;
        error?: string;
        message?: string;
      }>("test-chapter-generation", {
        method: "POST",
        body: { gameNid: data.game.nid },
      });

      if (!response.success) {
        setGenerationError(response.error || "Failed to start test generation");
        setLoadingAction(null);
      }
      // The modal will stay open to show progress until completion is detected in the useEffect
    } catch (err) {
      console.error("Error starting test generation:", err);
      setGenerationError(err instanceof Error ? err.message : String(err));
      setLoadingAction(null);
    }
  }, [data, nid]);

  const handleConfirmDelete = useCallback(async () => {
    if (!data?.game) return;

    setDialogOpen(false);
    setLoadingAction("delete");

    try {
      await apiCall("delete-game", {
        method: "POST",
        body: { nid: data.game.nid, directory: data.game.directory },
      });
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error deleting game:", error);
      setLoadingAction(null);
    }
  }, [data, navigate]);

  const handleReturnHomeAndDeleteGame = useCallback(async () => {
    if (!nid) return;

    setDeletingFailedGame(true);

    try {
      // Delete the failed game
      await apiCall("delete-game", {
        method: "POST",
        body: { nid, directory: data?.game?.directory },
      });
    } catch (error) {
      console.error("Error deleting failed game:", error);
    } finally {
      setDeletingFailedGame(false);
      // Navigate home regardless of delete success
      navigate("/", { replace: true });
    }
  }, [nid, data, navigate]);

  const handleOpenInEditor = useCallback(async () => {
    if (!data?.game) return;

    setLoadingAction("editor");
    try {
      await apiCall("run-editor", {
        method: "POST",
        body: { projectName: data.game.directory },
      });

      // Add a 5-second delay before removing the loading state
      setTimeout(() => {
        setLoadingAction(null);
      }, 5000);

      // Close the modal if it was open
      setFixGameBugsModalOpen(false);
    } catch (error) {
      console.error("Error opening game in editor:", error);
      setLoadingAction(null);
    }
  }, [data]);

  const handleFixGameBugs = useCallback(() => {
    setFixGameBugsModalOpen(true);
  }, []);

  const disabled = loadingAction !== null || deletingFailedGame;

  return (
    <>
      {/* New Game Creation - Direct DOM implementation */}
      <AnimatePresence>
        {newGameModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg">
              {creationError ? (
                <div className="flex flex-col gap-4">
                  <div className="text-center mb-8">
                    <h3 className="text-lg font-semibold">
                      Game Creation Failed
                    </h3>
                    <p className="text-sm text-destructive">
                      An error occurred while creating your game
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-destructive border border-destructive mx-6">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{creationError}</p>
                  </div>
                  <div className="flex justify-end mt-6 mx-6 gap-2">
                    <Button
                      onClick={handleReturnHomeAndDeleteGame}
                      variant="secondary"
                      disabled={deletingFailedGame}
                    >
                      {deletingFailedGame ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <ChapterGeneratorLoader
                  progress={{
                    isGenerating: true,
                    currentStep: gameCreationProgress.progress.currentStep,
                    message: gameCreationProgress.progress.message || "Creating your new game..."
                  }}
                  title="Creating New Game"
                  description="The AI is generating your new game world, characters, and first chapter. This typically takes around 2 minutes, and will open automatically when complete. Do not close this window!"
                  mode="game"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regenerate Current Chapter Confirmation */}
      <AlertDialog
        open={confirmRegenerateOpen}
        onOpenChange={setConfirmRegenerateOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate Current Chapter?</AlertDialogTitle>
            <AlertDialogDescription>
              This will overwrite your current chapter. This is useful if the AI made a mistake in the current chapter. This is irreversible, but will not affect your previous chapters or game save.
              <br /><br />
              <i>This does not work if the current chapter is the prologue. In that case, you must delete the game and start over.</i>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRegenerate}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Chapter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      {/* Next Chapter Generation Loading/Error - Direct DOM implementation */}
      <AnimatePresence>
        {generatingChapterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg">
              {generationError && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 z-[110]"
                  onClick={() => {
                    setGenerationError(null);
                    setGeneratingChapterModalOpen(false);
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}

              {generationError ? (
                <div className="flex flex-col gap-4">
                  <div className="text-center mb-8">
                    <h3 className="text-lg font-semibold">
                      Chapter Generation Failed
                    </h3>
                    <p className="text-sm text-destructive">
                      An error occurred while generating the next chapter
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-md text-destructive border border-destructive mx-6">
                    <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>{generationError}</p>
                  </div>
                  <div className="flex justify-end mt-6 mx-6">
                    <Button
                      onClick={() => {
                        setGenerationError(null);
                        setGeneratingChapterModalOpen(false);
                      }}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <ChapterGeneratorLoader
                  progress={{
                    isGenerating: loadingAction === "generate" || loadingAction === "test" || loadingAction === "regenerate",
                    currentStep: generationProgress.progress.currentStep,
                    message: generationProgress.progress.message,
                  }}
                  title={
                    loadingAction === "test" ? "Testing Chapter Generation"
                      : loadingAction === "regenerate" ? "Re-generating Chapter"
                        : "Generating Next Chapter"
                  }
                  description={
                    loadingAction === "test"
                      ? "This is a test simulation showing the chapter generation process with 3-second intervals between steps."
                      : loadingAction === "regenerate"
                        ? "Overwriting your current chapter. Please wait—do not close this window."
                        : "The AI is creating your next chapter based on your gameplay. This typically takes around 2 minutes, and the game will launch automatically when complete. Do not close this window!"
                  }
                  mode="chapter"
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fix Game Bugs Dialog */}
      <Dialog open={fixGameBugsModalOpen} onOpenChange={setFixGameBugsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Fix Game Issues</DialogTitle>
            <DialogDescription>
              Sometimes the AI may generate content that causes issues in your game. You have two options:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="rounded-md bg-muted p-4">
                <h3 className="font-medium mb-2">Option 1: Regenerate the current chapter</h3>
                <p className="text-sm mb-3">
                  This will completely overwrite your current chapter with a new AI-generated version. This is useful if the current chapter has serious issues.
                </p>
                <Button
                  variant="default"
                  onClick={() => {
                    setFixGameBugsModalOpen(false);
                    setConfirmRegenerateOpen(true);
                  }}
                  disabled={loadingAction !== null}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate Chapter
                </Button>
              </div>

              <div className="rounded-md bg-muted p-4">
                <h3 className="font-medium mb-2">Option 2: Edit the game manually</h3>
                <p className="text-sm mb-4">
                  Open the game in the Lex Talionis Editor to make specific changes yourself.
                  <br />
                  <a
                    href="https://lt-maker.readthedocs.io/en/latest/source/getting_started/Getting-Started.html#level-editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline underline-offset-2 hover:text-primary"
                  >
                    View Lex Talionis Editor Documentation
                  </a>
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="default"
                    onClick={handleOpenInEditor}
                    disabled={loadingAction !== null}
                    className="w-fit"
                  >
                    {loadingAction === "editor" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Pencil className="mr-2 h-4 w-4" />
                    Open in Editor
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFixGameBugsModalOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-4 max-w-4xl mx-auto">
        <BlurFade>
          <Button
            variant="ghost"
            className="inline-flex items-center mb-4"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </BlurFade>
        {loading ? (
          <></>
        ) : !data?.success || !data.game ? (
          <div>
            <h1 className="text-xl font-bold mb-4">Error</h1>
            <p>Could not find the game: {data?.error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Title Image - Left Column */}
              {data.game?.directory && (
                <BlurFade delay={BLUR_FADE_DELAY}>
                  <div className="md:col-span-1">
                    <div className="rounded-md overflow-hidden shadow-lg">
                      <img
                        src={getTitleImagePath(data.game.directory)}
                        alt={`${data.game.title} title image`}
                        className="w-full aspect-[3/2] object-contain bg-black/10"
                        onError={(e) => {
                          // Create a reference to game to ensure it's defined
                          const game = data.game;
                          if (!game) return;

                          // Log the error details
                          console.error(`[Title Image Error] Failed to load image for game: ${game.title}`, {
                            src: e.currentTarget.src,
                            gameDirectory: game.directory,
                            isElectron: typeof window !== 'undefined' && !!(window as Window & { process?: { versions?: { electron?: string } } })?.process?.versions?.electron,
                            error: e
                          });
                          // Hide the image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                </BlurFade>
              )}

              {/* Title and Description - Right Column */}
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <div className="md:col-span-2 flex flex-col justify-center">
                  <h1 className="text-2xl font-bold mb-3">{data.game.title}</h1>
                  <p className="mb-2">{data.game.description}</p>
                  <p className="italic text-sm text-muted-foreground">
                    Tone: {data.game.tone}
                  </p>
                </div>
              </BlurFade>
            </div>

            {/* Current chapter header */}
            {data.game.chapters.length > 0 && (
              <BlurFade delay={BLUR_FADE_DELAY * 3}>
                <>
                  <div className="text-sm text-muted-foreground mb-1 uppercase tracking-wide">
                    Current Chapter
                  </div>
                  <h2 className="text-xl font-semibold mb-4">
                    {data.game.chapters.length === 1
                      ? `Prologue: ${data.game.chapters[0].title}`
                      : `Chapter ${data.game.chapters.length - 1}: ${data.game.chapters[data.game.chapters.length - 1].title}`}
                  </h2>
                </>
              </BlurFade>
            )}

            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6">
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

                <Button
                  variant="outline"
                  onClick={handleFixGameBugs}
                  disabled={disabled}
                >
                  {loadingAction === "regenerate" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Wrench className="mr-2 h-4 w-4" />
                  Fix Game Bugs
                </Button>

                {/* Debug button for testing chapter generation */}
                {showDebugButtons && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestGeneration}
                    disabled={disabled}
                    className="ml-2"
                  >
                    {loadingAction === "test" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Test Generation
                  </Button>
                )}

                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" noGlow disabled={disabled}>
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
                      <AlertDialogCancel disabled={loadingAction === "delete"}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmDelete}
                        disabled={loadingAction === "delete"}
                      >
                        {loadingAction === "delete" && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </BlurFade>
          </>
        )}
      </div>
    </>
  );
}
