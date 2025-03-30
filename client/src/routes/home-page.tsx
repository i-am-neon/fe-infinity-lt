import { ModeToggle } from "@/components/mode-toggle";
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
import {
  NonClosableDialog,
  NonClosableDialogContent,
  NonClosableDialogHeader,
  NonClosableDialogTitle,
} from "@/components/ui/non-closable-dialog";
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

  // Test function states
  const [testingMockGame, setTestingMockGame] = useState(false);
  const [testingSimilarity, setTestingSimilarity] = useState(false);
  const [runningDefault, setRunningDefault] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testResults, setTestResults] = useState<any>(null);
  const [showTestResults, setShowTestResults] = useState(false);

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

  // Handler for adding a mock game
  const handleAddMockGame = useCallback(async () => {
    setTestingMockGame(true);
    setTestResults(null);
    setError(null);

    try {
      const res = await apiCall<{
        success: boolean;
        game?: unknown;
        error?: string;
        message?: string;
      }>("add-mock-game", {
        method: "POST",
      });

      setTestResults(res);
      setShowTestResults(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setTestingMockGame(false);
    }
  }, []);

  // Handler for testing similarity search
  const handleTestSimilaritySearch = useCallback(async () => {
    setTestingSimilarity(true);
    setTestResults(null);
    setError(null);

    try {
      const res = await apiCall<{
        success: boolean;
        results?: unknown[];
        error?: string;
      }>("test-similarity-search");

      setTestResults(res);
      setShowTestResults(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setTestingSimilarity(false);
    }
  }, []);

  // Handler for running default project
  const handleRunDefaultProject = useCallback(async () => {
    setRunningDefault(true);
    setError(null);

    try {
      await apiCall("run-game", {
        method: "POST",
        body: { directory: "testing_proj.ltproj" },
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setRunningDefault(false);
    }
  }, []);

  // Handler for running LT Maker editor
  const handleRunEditor = useCallback(async () => {
    setError(null);

    try {
      await apiCall("run-editor", {
        method: "POST",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-between w-full">
          <ModeToggle />
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

        <NonClosableDialog
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
        </NonClosableDialog>

        {/* Test Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[600px] mb-4">
          <Button
            onClick={handleAddMockGame}
            disabled={testingMockGame}
            variant="outline"
          >
            {testingMockGame && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Mock Game
          </Button>
          <Button
            onClick={handleTestSimilaritySearch}
            disabled={testingSimilarity}
            variant="outline"
          >
            {testingSimilarity && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Test Similarity Search
          </Button>
          <Button
            onClick={handleRunDefaultProject}
            disabled={runningDefault}
            variant="outline"
          >
            {runningDefault && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Run Default Project
          </Button>
          <Button
            onClick={handleRunEditor}
            variant="outline"
          >
            Open LT Editor
          </Button>
        </div>

        {/* Test Results */}
        {showTestResults && testResults && (
          <div className="w-full max-w-[600px] mb-4 p-4 bg-secondary/50 rounded-md overflow-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Test Results</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTestResults(false)}
              >
                Close
              </Button>
            </div>
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        <GamesGrid />
      </main>
    </div>
  );
}
