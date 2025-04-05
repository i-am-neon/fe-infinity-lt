"use client";
import { MultiStepLoader, LoadingState } from "@/components/ui/multi-step-loader";

const chapterGenerationSteps: LoadingState[] = [
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

export type ChapterGenerationProgress = {
    isGenerating: boolean;
    currentStep: number;
    message?: string;
};

interface ChapterGeneratorLoaderProps {
    progress: ChapterGenerationProgress;
}

export function ChapterGeneratorLoader({ progress }: ChapterGeneratorLoaderProps) {
    // Use non-looping mode for chapter generation, as we want to show real progress
    return (
        <MultiStepLoader
            loadingStates={chapterGenerationSteps}
            loading={progress.isGenerating}
            duration={3000}
            loop={false}
            value={progress.currentStep}
        />
    );
} 