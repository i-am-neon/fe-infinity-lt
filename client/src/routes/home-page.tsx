import ApiKeyNotice from "@/components/api-key-notice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { getAssetPath } from "@/lib/asset-path";
import { HelpCircle, KeyIcon, Loader2, Map, Settings } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FeInfinityTitle } from "@/components/ui/fe-infinity-title";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "@/components/ui/constants";

const showDebugButtons = false;

export default function HomePage() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [creatingGameModalOpen, setCreatingGameModalOpen] = useState(false);
  const [gameIdea, setGameIdea] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Test function states
  const [testingMockGame, setTestingMockGame] = useState(false);
  const [testingSimilarity, setTestingSimilarity] = useState(false);
  const [runningDefault, setRunningDefault] = useState(false);
  const [testingApiKey, setTestingApiKey] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [testResults, setTestResults] = useState<any>(null);
  const [showTestResults, setShowTestResults] = useState(false);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);

  // Add useEffect to listen for custom event
  useEffect(() => {
    const handleOpenDialog = () => {
      setDialogOpen(true);
    };

    window.addEventListener('openCreateGameDialog', handleOpenDialog);

    return () => {
      window.removeEventListener('openCreateGameDialog', handleOpenDialog);
    };
  }, []);

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
      // Get image generation preference from localStorage
      const generateCustomImage = localStorage.getItem("generateCustomImages") !== "false";

      const res = await apiCall<{
        success: boolean;
        gameNid?: string;
        error?: string;
      }>("create-game", {
        method: "POST",
        body: { title, description, tone, generateCustomImage },
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

  // Handler for testing API key
  const handleTestApiKey = useCallback(async () => {
    setTestingApiKey(true);
    setTestResults(null);
    setError(null);
    setShowTestResults(true);

    try {
      // Check if we're in Electron
      const isElectron = !!window.electron?.apiKeys?.has;

      // If in Electron, check if we have an API key
      if (isElectron) {
        const hasKey = await window.electron.apiKeys.has();
        // If no key in Electron, display a message
        if (!hasKey) {
          setTestResults({
            success: false,
            error: "No API key found. Please add your OpenAI API key in Settings."
          });
          setTestingApiKey(false);
          return;
        }
      }

      // Proceed with API key test (works in both Electron and development)
      const res = await apiCall<{
        success: boolean;
        message?: string;
        error?: string;
        model?: string;
        source?: string;
        usage?: {
          prompt_tokens: number;
          completion_tokens: number;
          total_tokens: number;
        };
      }>("test-api-key", {
        method: "POST",
      });

      setTestResults(res);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setTestResults({
        success: false,
        error: errorMessage
      });
    } finally {
      setTestingApiKey(false);
    }
  }, []);

  // Handler for generating a new game idea (title, description, tone)
  const handleGenerateStoryCall = useCallback(async () => {
    setIsGeneratingIdea(true);
    setError(null);
    try {
      const res = await apiCall<{
        success: boolean;
        title?: string;
        description?: string;
        tone?: string;
        error?: string;
      }>("generate-story", { method: "POST" });
      if (res.success && res.title && res.description && res.tone) {
        // Combine into same format as selector
        setGameIdea(`${res.title} - ${res.description} - ${res.tone}`);
      } else {
        setError(res.error || "Failed to generate story idea.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate story idea.";
      setError(msg);
    } finally {
      setIsGeneratingIdea(false);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with title and settings */}
      <BlurFade delay={BLUR_FADE_DELAY}>
        <div className="flex items-center mb-6 mt-4 relative">
          {/* Settings button moved to the left */}
          <Button
            variant="ghost"
            size="lg"
            className="absolute left-0"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-7 w-7" />
            <span className="sr-only">Settings</span>
          </Button>

          {/* Centered title with logo */}
          <div className="flex items-center justify-center w-full">
            <img src={getAssetPath('logo.png')} alt="FE Infinity Logo" className="h-10 mr-3" />
            <FeInfinityTitle size="lg" />
          </div>
        </div>
      </BlurFade>

      {/* API Key Notice */}
      <BlurFade delay={BLUR_FADE_DELAY * 2}>
        <ApiKeyNotice />
      </BlurFade>

      {/* Main Content */}
      <div className="flex flex-col items-center gap-8">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleGenerateStoryCall}
                disabled={isGeneratingIdea}
              >
                {isGeneratingIdea && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Story
              </Button>
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

        {/* Help Dialog */}
        <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">How to Play FE Infinity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">1. Create a game</h3>
                <p className="text-sm text-muted-foreground">
                  This will take about 2 minutes. The AI creates a unique game world, an original story, and the Prologue chapter of the game.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">2. Play the first chapter</h3>
                <p className="text-sm text-muted-foreground">
                  After completing a chapter, going to the next chapter will give you the message "This chapter has not been generated yet".
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">3. Generate the next chapter</h3>
                <p className="text-sm text-muted-foreground">
                  Click "Generate Next Chapter" on the game page within the FE Infinity app. This will take about 2 minutes. The AI reads which characters died and player choices and creates the next chapter.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg">4. Continue your adventure</h3>
                <p className="text-sm text-muted-foreground">
                  Play the next chapter and repeat the process as desired.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setHelpDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Test Buttons - only shown when showDebugButtons is true */}
        {showDebugButtons && (
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
            <Button
              onClick={handleTestApiKey}
              disabled={testingApiKey}
              variant="outline"
              className="gap-1"
            >
              {testingApiKey ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <KeyIcon className="h-4 w-4" />
              )}
              Test API Key
            </Button>
            <Button
              onClick={() => navigate('/unit-placement-test')}
              variant="outline"
              className="gap-1"
            >
              <Map className="h-4 w-4" />
              Unit Placement Test
            </Button>
          </div>
        )}

        {/* Test Results - only shown when showDebugButtons is true and there are results */}
        {showDebugButtons && showTestResults && testResults && (
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

        {/* Games section with fixed width container */}
        <div className="w-full max-w-[600px] mx-auto">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="w-full max-w-[600px] mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Games</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setHelpDialogOpen(true)}
                  className="ml-2"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Button>
              </div>
            </div>
          </BlurFade>
          <GamesGrid />
        </div>
      </div>
    </div>
  );
}
