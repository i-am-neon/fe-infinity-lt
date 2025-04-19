"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "@/lib/api-call";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ChevronLeft, RefreshCw, Wand2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { GlowCard } from "@/components/ui/glow-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast, Toaster } from "sonner";

interface StoryIdea {
  title: string;
  description: string;
  tone: string;
}

// Organize tags into categories
const tagCategories = {
  genre: [
    "dark fantasy",
    "high fantasy",
    "political intrigue",
    "epic adventure",
    "war chronicle",
    "mystery"
  ],
  tone: [
    "lighthearted",
    "strategic",
    "romantic",
    "tragic",
    "comedic",
    "suspenseful"
  ],
  setting: [
    "kingdom",
    "empire",
    "wilderness",
    "coastal",
    "mountain",
    "islands"
  ]
};

const presets: StoryIdea[] = [
  {
    title: "Revenant Oath",
    description:
      "A once-feared warlord reawakens, determined to reclaim a lost empire. As the undead legions grow, every choice teeters between redemption and eternal damnation.",
    tone: "dark fantasy, vengeful",
  },
  {
    title: "The Grand Tourney",
    description:
      "Once a year, the kingdom hosts a grand festival where duels, wits, and whispers decide the fates of nobles and commoners alike. Every move in the arena or the court can forge alliances or fuel rivalries.",
    tone: "whimsical, light-hearted, comedy",
  },
  {
    title: "Fractured Bonds",
    description:
      "A crumbling kingdom is torn by rival factions vying for the throne. Trust is a fragile currency in this world of spies, shifting loyalties, and high-stakes diplomacy.",
    tone: "political intrigue, strategic",
  },
  {
    title: "Celestial Vanguard",
    description:
      "When star-beings descend from the heavens, a band of unlikely heroes must master ancient magic to save their realm. The boundary between divine and mortal blurs with each passing day.",
    tone: "epic fantasy, mystical",
  },
  {
    title: "Crimson Dynasty",
    description:
      "The royal family's blood magic sustains the empire, but at a terrible cost. As the power wanes and rebellion stirs, a young heir must choose between tradition and transformation.",
    tone: "dark political, tragic",
  },
  {
    title: "Nomad's Legacy",
    description:
      "Wandering tribes navigate a harsh world where ancient ruins hold forgotten technologies. When a mysterious artifact is discovered, it sparks a race that could lead to salvation or destruction.",
    tone: "post-apocalyptic, adventure",
  },
  // Add more presets as needed
];

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [blurb, setBlurb] = useState("");
  const [feedback, setFeedback] = useState("");
  const [generated, setGenerated] = useState<StoryIdea | null>(null);
  const [isTweakLoading, setIsTweakLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTweakOptions, setShowTweakOptions] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleReset = () => {
    setSelectedPreset(null);
    setSelectedTags([]);
    setBlurb("");
    setFeedback("");
    setGenerated(null);
    setError(null);
  };

  const handleGenerate = async () => {
    setError(null);
    setIsTweakLoading(true);
    try {
      const res = await apiCall<{ success: boolean; title?: string; description?: string; tone?: string; error?: string }>(
        "generate-story",
        {
          method: "POST",
          body: { tags: selectedTags, blurb },
        }
      );
      if (res.success && res.title && res.description && res.tone) {
        setGenerated({ title: res.title, description: res.description, tone: res.tone });
      } else {
        const errorMessage = res.error || "Failed to generate story";
        setError(errorMessage);

        toast.error("Failed to generate story", {
          description: errorMessage
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setError(errorMessage);

      toast.error("Error generating story", {
        description: errorMessage
      });
    } finally {
      setIsTweakLoading(false);
    }
  };

  const handleTweak = async () => {
    if (!generated) return;
    setError(null);
    setIsTweakLoading(true);
    console.log('calling tweak with', { selectedTags, blurb, feedback, generated });
    try {
      const res = await apiCall<{ success: boolean; title?: string; description?: string; tone?: string; error?: string }>(
        "generate-story",
        {
          method: "POST",
          body: {
            tags: selectedTags,
            blurb,
            feedback,
            previousIdea: generated
          },
        }
      );
      if (res.success && res.title && res.description && res.tone) {
        setGenerated({ title: res.title, description: res.description, tone: res.tone });
        setFeedback("");
      } else {
        const errorMessage = res.error || "Failed to tweak story";
        setError(errorMessage);

        toast.error("Failed to tweak story", {
          description: errorMessage
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setError(errorMessage);

      toast.error("Error tweaking story", {
        description: errorMessage
      });
    } finally {
      setIsTweakLoading(false);
    }
  };

  const handleCreateStory = async () => {
    if (!generated) return;
    setError(null);
    setIsCreateLoading(true);
    try {
      const res = await apiCall<{ success: boolean; gameId?: string; gameNid?: string; error?: string; message?: string }>(
        "create-game",
        {
          method: "POST",
          body: {
            title: generated.title,
            description: generated.description,
            tone: generated.tone
          },
        }
      );

      if (res.success && (res.gameId || res.gameNid)) {
        const gameIdentifier = res.gameId || res.gameNid;
        navigate(`/games/${gameIdentifier}?new=true`);
        toast.success(res.message || "Game creation started", {
          description: "Your game is being generated and will be ready shortly."
        });
      } else {
        const errorMessage = res.error || "Failed to create game";
        setError(errorMessage);
        setIsCreateLoading(false);
        toast.error("Failed to start game creation", {
          description: errorMessage
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error";
      setError(errorMessage);
      setIsCreateLoading(false);
      toast.error("Error creating game", {
        description: errorMessage
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          className="inline-flex items-center"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                aria-label="Reset"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">Create New Story</h1>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Presets</h2>
        <div className="relative px-12">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {presets.map((p) => (
                <CarouselItem key={p.title} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div
                    className="cursor-pointer h-full p-1"
                    onClick={() => {
                      setSelectedPreset(p.title);
                      setGenerated(p);
                    }}
                  >
                    <GlowCard className={selectedPreset === p.title ? "bg-muted" : ""}>
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="text-sm mt-2">{p.description}</p>
                      <p className="mt-2 italic text-xs">Tone: {p.tone}</p>
                    </GlowCard>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-10" />
            <CarouselNext className="-right-10" />
          </Carousel>
        </div>
      </section>

      {generated && (
        <section className="mt-8 max-w-4xl">
          <h2 className="text-lg font-semibold mb-2">Your Story Idea</h2>
          <div className="p-6 border rounded-lg">
            <h3 className="font-bold text-xl">{generated.title}</h3>
            <p className="mt-2">{generated.description}</p>
            <p className="mt-1 italic">Tone: {generated.tone}</p>

            <div className="mt-6 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowTweakOptions(!showTweakOptions)}
                className="flex-1"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {showTweakOptions ? "Hide Tweak Options" : "Tweak"}
              </Button>

              <Button
                onClick={handleCreateStory}
                disabled={isCreateLoading || isTweakLoading}
                className="flex-1"
              >
                {isCreateLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Game
              </Button>
            </div>

            {showTweakOptions && (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold mb-2">Feedback / Tweak</h4>
                <Textarea
                  placeholder="Enter feedback about what you'd like to change..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="mb-4 w-full"
                />
                <Button onClick={handleTweak} disabled={isTweakLoading || isCreateLoading}>
                  {isTweakLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Apply Tweaks
                </Button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      {!generated && (
        <>
          <hr className="my-6" />
          <section>
            <h2 className="text-lg font-semibold mb-2">Or, Create Your Own</h2>
            <p className="text-muted-foreground mb-6">
              Select tags from each category below to influence your story idea. You can choose multiple tags, a single tag, or no tags from any category—it's completely optional. Add a brief concept if you wish, then click "Generate Story." After the AI creates your idea, you can further tweak and refine it to your liking.
            </p>

            <div className="space-y-6">
              {/* Genre Tags */}
              <div>
                <h3 className="text-sm font-medium mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tagCategories.genre.map((tag) => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tone Tags */}
              <div>
                <h3 className="text-sm font-medium mb-2">Tone</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tagCategories.tone.map((tag) => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Setting Tags */}
              <div>
                <h3 className="text-sm font-medium mb-2">Setting</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tagCategories.setting.map((tag) => (
                    <Button
                      key={tag}
                      size="sm"
                      variant={selectedTags.includes(tag) ? "secondary" : "outline"}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Concept (Optional)</h3>
              <Textarea
                placeholder="Describe your story concept in a few words..."
                value={blurb}
                onChange={(e) => setBlurb(e.target.value)}
                className="mb-4 w-1/2"
              />
              <Button onClick={handleGenerate} disabled={isTweakLoading}>
                {isTweakLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Generate Story
              </Button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </section>
        </>
      )}
    </div>
  );
}