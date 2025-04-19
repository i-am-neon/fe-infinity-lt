"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiCall from "@/lib/api-call";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface StoryIdea {
  title: string;
  description: string;
  tone: string;
}

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
  // Add more presets as needed
];

const availableTags = [
  "dark fantasy",
  "lighthearted",
  "political intrigue",
  "epic adventure",
  "romantic",
  "strategic",
];

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [blurb, setBlurb] = useState("");
  const [feedback, setFeedback] = useState("");
  const [generated, setGenerated] = useState<StoryIdea | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerate = async () => {
    setError(null);
    setIsLoading(true);
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
        setError(res.error || "Failed to generate story");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTweak = async () => {
    if (!generated) return;
    setError(null);
    setIsLoading(true);
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
        setError(res.error || "Failed to tweak story");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create New Story</h1>
        {/** Back button **/}
        <Button variant="link" onClick={() => navigate("/")}>← Home</Button>
      </header>

      <section>
        <h2 className="text-lg font-semibold mb-2">Presets</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {presets.map((p) => (
            <div
              key={p.title}
              className={`min-w-[200px] p-4 border rounded cursor-pointer ${selectedPreset === p.title ? "border-blue-500" : "border-gray-200"
                }`}
              onClick={() => {
                setSelectedPreset(p.title);
                setGenerated(p);
              }}
            >
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm">{p.description}</p>
              <p className="mt-1 italic text-xs">Tone: {p.tone}</p>
            </div>
          ))}
        </div>
      </section>

      {!generated && (
        <>
          <hr className="my-6" />
          <section>
            <h2 className="text-lg font-semibold mb-2">Generate Your Own</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {availableTags.map((tag) => (
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
            <Textarea
              placeholder="Optional blurb..."
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              className="mb-4 w-full"
            />
            <Button onClick={handleGenerate} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Generate Story
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </section>
        </>
      )}

      {generated && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Your Story Idea</h2>
          <h3 className="font-bold text-xl">{generated.title}</h3>
          <p className="mt-2">{generated.description}</p>
          <p className="mt-1 italic">Tone: {generated.tone}</p>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Feedback / Tweak</h4>
            <Textarea
              placeholder="Enter feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="mb-4 w-full"
            />
            <Button onClick={handleTweak} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Tweak Story
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </section>
      )}
    </div>
  );
}