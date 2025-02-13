"use client";
import { useEffect, useState, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
} from "@/components/ui/dialog";

export default function GameDetailPage() {
  const { nid } = useParams() as { nid: string };

  const [data, setData] = useState<{
    success: boolean;
    game?: Game;
    error?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (!loading && newGameModalOpen) {
      // Auto-dismiss the modal 3 seconds after game data has loaded
      const timer = setTimeout(() => setNewGameModalOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, newGameModalOpen]);

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
        window.location.href = "/";
      }
    });
  }, [data]);

  const disabled = loadingAction !== null || isPending;

  return (
    <>
      {newGameModalOpen && (
        <Dialog open={newGameModalOpen} onOpenChange={setNewGameModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Game is being created</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <p>
                Your game is being created and will open automatically when
                finished.
              </p>
            </div>
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