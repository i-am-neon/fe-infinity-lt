"use client";
import { MultiStepLoader, LoadingState } from "@/components/ui/multi-step-loader";

// Shared generation phase steps (used by both chapter and game creation)
const generationPhaseSteps: LoadingState[] = [
    { text: "Drafting chapter storyline" },
    { text: "Crafting new character profiles" },
    { text: "Assigning portraits to characters" },
    { text: "Choosing battle theme music" },
    { text: "Writing chapter intro scene dialogue" },
    { text: "Writing chapter outro scene dialogue" },
    { text: "Choosing scene backdrops" },
    { text: "Building the map layout" },
    { text: "Positioning units on the battlefield" },
    { text: "Configuring map interactables" },
    { text: "Writing recruitment conversation scenes" },
    { text: "Generating boss battle sequences" },
    { text: "Finalizing and reviewing the chapter" }
];

// Steps for chapter generation: initialization phase
const chapterGenerationSteps: LoadingState[] = [
    { text: "Initializing game engine" },
    { text: "Loading game data" },
    { text: "Analyzing previous chapter" },
    { text: "Processing player choices" }
];

// Steps specific to game creation (pre-generation)
const gameCreationPreSteps: LoadingState[] = [
    { text: "Initializing project environment" },
    { text: "Creating unique game world" },
    { text: "Generating initial main characters" },
    { text: "Designing the world map layout" },
    { text: "Configuring initial settings" },
    { text: "Drafting the overarching storyline" }
];

// Steps specific to game creation (post-generation)
const gameCreationPostSteps: LoadingState[] = [
    { text: "Setting up game files and resources" },
    { text: "Performing final touches and cleanup" }
];

// Define the step indexes where each phase begins
export const GENERATION_PHASES = {
    INITIALIZING: 0,
    GENERATION: 4, // Index of the first generation step
};

// This must match the CREATE_FIRST_CHAPTER value in server/routes/create-game.ts
export const GAME_CREATION_STEPS = {
    CREATE_FIRST_CHAPTER: 7
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
    description = "The AI is creating your next chapter based on your gameplay. This typically takes around 2-3 minutes, and the game will launch automatically when complete.",
    mode = 'chapter' // Default to chapter generation mode
}: ChapterGeneratorLoaderProps) {
    // Combine the appropriate steps based on mode
    const steps = mode === 'game'
        ? [...gameCreationPreSteps, ...generationPhaseSteps, ...gameCreationPostSteps]
        : [...chapterGenerationSteps, ...generationPhaseSteps];

    // Adjust the current step index if needed based on mode
    let adjustedCurrentStep = progress.currentStep;

    // Map the progress step to the appropriate step in our combined array
    if (mode === 'game') {
        // For game creation, if we're in the generation phase, we need to adjust the mapping
        // In create-game.ts, the first generation phase step is CREATE_FIRST_CHAPTER + 0
        if (progress.currentStep >= GAME_CREATION_STEPS.CREATE_FIRST_CHAPTER) {
            // Calculate offset within the generation phase
            const generationPhaseIndex = progress.currentStep - GAME_CREATION_STEPS.CREATE_FIRST_CHAPTER;

            // Map to the correct position in our combined array
            // Generation phase steps start after the pre-steps
            if (generationPhaseIndex < generationPhaseSteps.length) {
                adjustedCurrentStep = gameCreationPreSteps.length + generationPhaseIndex;
            } else {
                // We've moved to post-generation steps
                adjustedCurrentStep = gameCreationPreSteps.length + generationPhaseSteps.length;
            }
        }
    } else if (mode === 'chapter') {
        // For chapter generation, we need to handle the transition from initialization to generation
        // In create-next-chapter.ts, generation phase steps are offset by INITIALIZING_STEPS.GENERATION_START (4) 
        if (progress.currentStep >= GENERATION_PHASES.GENERATION) {
            // We're in the generation phase
            // No change needed as our array is already structured this way
        }
    }

    // Use non-looping mode for generation, as we want to show real progress
    return (
        <MultiStepLoader
            loadingStates={steps}
            loading={progress.isGenerating}
            duration={3000}
            loop={false}
            value={adjustedCurrentStep}
            title={title}
            description={description}
        />
    );
} 