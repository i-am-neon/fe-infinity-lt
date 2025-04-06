"use client";
import { MultiStepLoader, LoadingState } from "@/components/ui/multi-step-loader";

const chapterGenerationSteps: LoadingState[] = [
    // Initializing phase
    { text: "Initializing game engine..." },
    { text: "Loading game data..." },
    { text: "Analyzing previous chapter..." },
    { text: "Processing player choices..." },
    // Generation phase
    { text: "Generating chapter idea and storyline..." },
    { text: "Creating new characters and assigning traits..." },
    { text: "Selecting portraits for characters..." },
    { text: "Composing battle music..." },
    { text: "Writing dialogue for intro event..." },
    { text: "Writing dialogue for outro event..." },
    { text: "Selecting background scenes..." },
    { text: "Creating the map layout..." },
    { text: "Placing units on the battlefield..." },
    { text: "Setting up special map interactions..." },
    { text: "Writing recruitment conversations..." },
    { text: "Creating boss battle dialogues..." },
    { text: "Finalizing chapter assembly..." }
];

// Define the step indexes where each phase begins
export const GENERATION_PHASES = {
    INITIALIZING: 0,
    GENERATION: 4, // Index of the first generation step
};

export type ChapterGenerationProgress = {
    isGenerating: boolean;
    currentStep: number;
    message?: string;
    error?: string;
};

interface ChapterGeneratorLoaderProps {
    progress: ChapterGenerationProgress;
    title?: string;
    description?: string;
}

export function ChapterGeneratorLoader({
    progress,
    title = "Generating Next Chapter",
    description = "The AI is creating your next chapter based on your gameplay. This typically takes around five minutes, and the game will launch automatically when complete."
}: ChapterGeneratorLoaderProps) {
    // Use non-looping mode for chapter generation, as we want to show real progress
    return (
        <MultiStepLoader
            loadingStates={chapterGenerationSteps}
            loading={progress.isGenerating}
            duration={3000}
            loop={false}
            value={progress.currentStep}
            title={title}
            description={description}
        />
    );
} 