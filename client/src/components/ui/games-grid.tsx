import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashedBorderCard } from "@/components/ui/dashed-border-card";
import { GlowCard } from "@/components/ui/glow-card";
import apiCall from "@/lib/api-call";
import { Game } from "@/types/game";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      const response = await apiCall<{
        success: boolean;
        games: Game[];
        error?: string;
      }>("games");

      if (response.success && response.games) {
        setGames(response.games);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      setError("Failed to fetch games");
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="w-full text-center py-4">Loading games...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">{error}</div>;
  }

  if (games.length === 0) {
    return (
      <div className="w-full text-center py-4">
        No games found. Create your first game!
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
      {games.map((game) => (
        <Link
          key={game.nid}
          to={`/games/${game.nid}`}
          className="relative block"
        >
          <GlowCard className="hover:bg-accent/50 transition-colors duration-200">
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </GlowCard>
        </Link>
      ))}

      {/* Create New Game Card */}
      <div
        onClick={() => window.dispatchEvent(new CustomEvent('openCreateGameDialog'))}
        className="cursor-pointer"
      >
        <DashedBorderCard className="hover:bg-accent/20 transition-colors duration-200 flex items-center justify-center h-full">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-primary/10 p-3 mb-2">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-center">Create New</CardTitle>
          </div>
        </DashedBorderCard>
      </div>
    </div>
  );
}

