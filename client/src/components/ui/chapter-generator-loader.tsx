"use client";
import { MultiStepLoader, LoadingState } from "@/components/ui/multi-step-loader";

// Steps for next chapter generation
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

// Steps for new game creation
const gameCreationSteps: LoadingState[] = [
    { text: "Initializing project..." },
    { text: "Creating game world..." },
    { text: "Generating main characters..." },
    { text: "Designing world map..." },
    { text: "Creating player army..." },
    { text: "Setting up initial conditions..." },
    { text: "Generating storyline..." },
    { text: "Creating first chapter..." },
    { text: "Setting up game files..." },
    { text: "Finalizing game creation..." }
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
    mode?: 'chapter' | 'game'; // New prop to determine which steps to use
}

export function ChapterGeneratorLoader({
    progress,
    title = "Generating Next Chapter",
    description = "The AI is creating your next chapter based on your gameplay. This typically takes around five minutes, and the game will launch automatically when complete.",
    mode = 'chapter' // Default to chapter generation mode
}: ChapterGeneratorLoaderProps) {
    // Choose which steps to use based on mode
    const steps = mode === 'game' ? gameCreationSteps : chapterGenerationSteps;

    // Use non-looping mode for generation, as we want to show real progress
    return (
        <MultiStepLoader
            loadingStates={steps}
            loading={progress.isGenerating}
            duration={3000}
            loop={false}
            value={progress.currentStep}
            title={title}
            description={description}
        />
    );
} 