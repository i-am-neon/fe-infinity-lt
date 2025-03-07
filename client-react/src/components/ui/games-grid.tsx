import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiCall from "../../lib/api-call";
import { Game } from "../../types/game";

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
          <Card className="h-full hover:bg-accent/50 transition-colors duration-200">
            <CardHeader>
              <CardTitle>{game.title}</CardTitle>
              <CardDescription>{game.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
