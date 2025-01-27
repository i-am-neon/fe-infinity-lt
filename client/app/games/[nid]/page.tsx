import { Game } from "@/types/game"
import { openGame, generateNextChapter } from "@/app/actions"
import apiCall from "@/lib/api-call"
import { Button } from "@/components/ui/button"

interface GameDetailPageProps {
  params: { nid: string }
}

export default async function GameDetailPage({ params }: GameDetailPageProps) {
  const { nid } = params;
  // Fetch the single game
  const data = await apiCall<{ success: boolean; game?: Game; error?: string }>(
    `games/${nid}`
  );

  if (!data.success || !data.game) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Error</h1>
        <p>Could not find the game: {data.error}</p>
      </div>
    );
  }

  const game = data.game;

  async function handlePlay() {
    "use server";
    await openGame(game.directory);
  }

  async function handleGenerateNextChapter() {
    "use server";
    await generateNextChapter(game.directory, game.nid);
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Game: {game.title}</h1>
      <p>Description: {game.description}</p>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Button onClick={handlePlay}>Play Game</Button>
        <Button variant="secondary" onClick={handleGenerateNextChapter}>
          Generate Next Chapter
        </Button>
      </div>
    </div>
  );
}