"use client";
import { useEffect, useState, useCallback, useTransition } from "react";
import { Loader2 } from "lucide-react";
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

interface GameDetailPageProps {
  params: { nid: string };
}

export default function GameDetailPage({ params }: GameDetailPageProps) {
  // State for API data
  const [data, setData] = useState<{
    success: boolean;
    game?: Game;
    error?: string;
  } | null>(null);
  // Loading state for fetching game details
  const [loading, setLoading] = useState(true);

  // Track which action is currently loading: "play", "generate", or "delete"
  // We'll disable all buttons if one is active
  const [loadingAction, setLoadingAction] = useState<
    "play" | "generate" | "delete" | null
  >(null);
  const [isPending, startTransition] = useTransition();

  // Dialog state for delete confirmation
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch game info client-side once on mount or when nid changes
  useEffect(() => {
    let canceled = false;
    (async () => {
      const res = await apiCall<{
        success: boolean;
        game?: Game;
        error?: string;
      }>(`games/${params.nid}`);
      if (!canceled) {
        setData(res);
        setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, [params.nid]);

  const handlePlay = useCallback(() => {
    setLoadingAction("play");
    startTransition(async () => {
      await openGame(data?.game?.directory ?? "");
      setLoadingAction(null);
    });
  }, [data]);

  const handleGenerateNextChapter = useCallback(() => {
    setLoadingAction("generate");
    startTransition(async () => {
      if (data?.game) {
        await generateNextChapter(data.game.directory, data.game.nid);
      }
      setLoadingAction(null);
    });
  }, [data]);

  const handleConfirmDelete = useCallback(() => {
    setDialogOpen(false);
    setLoadingAction("delete");
    startTransition(async () => {
      if (data?.game) {
        await deleteGame(data.game.nid, data.game.directory);
        // Redirect to home (or wherever you prefer) after deletion
        window.location.href = "/";
      }
    });
  }, [data]);

  const disabled = loadingAction !== null || isPending;

  // Instead of early returns, we use conditional rendering so that
  // hooks always run in the same order.
  return (
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
                    This will permanently delete the game’s data and files. This
                    action cannot be undone.
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
  );
}
