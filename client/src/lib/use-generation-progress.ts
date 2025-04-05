import { useState, useEffect } from "react";
import apiCall from "@/lib/api-call";
import { ChapterGenerationProgress } from "@/components/ui/chapter-generator-loader";

export type GenerationProgressState = {
    isLoading: boolean;
    progress: ChapterGenerationProgress;
    error: string | null;
};

/**
 * Custom hook to poll and track chapter generation progress
 */
export default function useGenerationProgress(
    gameNid: string | undefined,
    isGenerating: boolean
): GenerationProgressState {
    const [state, setState] = useState<GenerationProgressState>({
        isLoading: false,
        progress: {
            isGenerating: false,
            currentStep: 0,
            message: "",
        },
        error: null,
    });

    useEffect(() => {
        if (!gameNid || !isGenerating) {
            setState((prev) => ({
                ...prev,
                progress: {
                    isGenerating: false,
                    currentStep: 0,
                    message: "",
                },
            }));
            return;
        }

        setState((prev) => ({ ...prev, isLoading: true }));

        const pollId = setInterval(async () => {
            try {
                const response = await apiCall<{
                    success: boolean;
                    progress?: {
                        step: number;
                        message: string;
                    };
                    error?: string;
                }>(`generation-progress?gameNid=${encodeURIComponent(gameNid)}`);

                if (response.success && response.progress) {
                    setState({
                        isLoading: false,
                        progress: {
                            isGenerating: true,
                            currentStep: response.progress.step,
                            message: response.progress.message,
                        },
                        error: null,
                    });

                    // Check for error flag in progress
                    if (response.progress.error) {
                        setState({
                            isLoading: false,
                            progress: {
                                isGenerating: false,
                                currentStep: response.progress.step,
                                message: response.progress.message,
                            },
                            error: response.progress.message,
                        });
                    }
                } else if (response.error) {
                    setState({
                        isLoading: false,
                        progress: {
                            isGenerating: false,
                            currentStep: 0,
                            message: "",
                        },
                        error: response.error,
                    });
                }
            } catch (error) {
                console.error("Error fetching generation progress:", error);
                setState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: error instanceof Error ? error.message : "Unknown error",
                }));
            }
        }, 1000);

        return () => clearInterval(pollId);
    }, [gameNid, isGenerating]);

    return state;
} 