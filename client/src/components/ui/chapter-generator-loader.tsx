"use client";
import { MultiStepLoader, LoadingState } from "@/components/ui/multi-step-loader";

// Shared generation phase steps (used by both chapter and game creation)
const generationPhaseSteps: LoadingState[] = [
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

// Steps for chapter generation - initializing phase + generation phase
const chapterGenerationSteps: LoadingState[] = [
    // Initializing phase
    { text: "Initializing game engine..." },
    { text: "Loading game data..." },
    { text: "Analyzing previous chapter..." },
    { text: "Processing player choices..." },
    // Generation phase steps are added dynamically in the component
];

// Steps specific to game creation (pre-generation)
const gameCreationPreSteps: LoadingState[] = [
    { text: "Initializing project..." },
    { text: "Creating game world..." },
    { text: "Generating main characters..." },
    { text: "Designing world map..." },
    { text: "Setting up initial conditions..." },
    { text: "Generating storyline..." },
    // After these steps, the CREATE_FIRST_CHAPTER step begins
    // and gen-chapter.ts takes over with generationPhaseSteps
];

// Steps specific to game creation (post-generation)
const gameCreationPostSteps: LoadingState[] = [
    { text: "Setting up game files..." },
    { text: "Finalizing game creation..." }
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
    description = "The AI is creating your next chapter based on your gameplay. This typically takes around five minutes, and the game will launch automatically when complete.",
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