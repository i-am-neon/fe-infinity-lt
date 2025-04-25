import {
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { DashedBorderCard } from "@/components/ui/dashed-border-card";
import { GlowCard } from "@/components/ui/glow-card";
import apiCall from "@/lib/api-call";
import { getTitleImagePath } from "@/lib/asset-path";
import { Game } from "@/types/game";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "./constants";

export default function GamesGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchGames = async () => {
    try {
      // Use enhanced apiCall with automatic retries
      const response = await apiCall<{
        success: boolean;
        games: Game[];
        error?: string;
      }>("games", {
        // Enable automatic retries with exponential backoff for the initial page load
        retry: retryCount < 3, 
        retryDelay: 100 * Math.pow(2, retryCount), // Exponential backoff: 1s, 2s, 4s
        maxRetries: 3
      });

      if (response.success && response.games) {
        setGames(response.games);
        setError(null);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      
      // Only show error if we've already retried a few times
      if (retryCount >= 2) {
        setError("Failed to fetch games");
      }
      
      // Increment retry count for tracking purposes
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Add initial delay before first fetch to ensure server is ready
    const initialDelay = setTimeout(() => {
      fetchGames();
    }, 1500); // Increased delay to give server more time to initialize

    // Set up regular polling after initial fetch
    const interval = setInterval(fetchGames, 5000);
    
    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    // Return invisible placeholder items to maintain grid width during loading
    return (
      <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="invisible h-[240px]"></div>
        <div className="invisible h-[240px]"></div>
      </div>
    );
  }

  if (error) {
    return <div className="w-full text-center py-4 text-red-500">{error}</div>;
  }

  if (games.length === 0) {
    return (
      <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 mx-auto">
        {/* Create New Game Card */}
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <Link to="/create-story" className="cursor-pointer">
            <DashedBorderCard className="hover:bg-accent/20 transition-colors duration-200 flex items-center justify-center h-full">
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-primary/10 p-3 mb-2">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-center">Create New</CardTitle>
                <CardDescription className="text-center mt-2">
                  Start your first game adventure
                </CardDescription>
              </div>
            </DashedBorderCard>
          </Link>
        </BlurFade>
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2">
      {games.map((game, index) => (
        <BlurFade key={game.nid} delay={BLUR_FADE_DELAY * (index + 4)}>
          <Link
            to={`/games/${game.nid}`}
            className="relative block"
          >
            <GlowCard className="hover:bg-accent/50 transition-colors duration-200 overflow-hidden">
              <div className="w-full aspect-[3/2] overflow-hidden bg-black/10 rounded-t-md">
                <img
                  src={getTitleImagePath(game.directory)}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Log the error details
                    console.error(`[Games Grid Image Error] Failed to load image for game: ${game.title}`, {
                      src: e.currentTarget.src,
                      gameDirectory: game.directory,
                      isElectron: typeof window !== 'undefined' &&
                        !!(window as Window & { process?: { versions?: { electron?: string } } })?.process?.versions?.electron,
                      error: e
                    });
                    // Hide the image if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <CardHeader className="py-3">
                <CardTitle className="text-center">{game.title}</CardTitle>
              </CardHeader>
            </GlowCard>
          </Link>
        </BlurFade>
      ))}

      {/* Create New Game Card */}
      <BlurFade delay={BLUR_FADE_DELAY * (games.length + 4)}>
        <Link to="/create-story" className="cursor-pointer">
          <DashedBorderCard className="hover:bg-accent/20 transition-colors duration-200 flex items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-primary/10 p-3 mb-2">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-center">Create New</CardTitle>
            </div>
          </DashedBorderCard>
        </Link>
      </BlurFade>
    </div>
  );
}

