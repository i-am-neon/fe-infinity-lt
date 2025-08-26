import { FreeTierExceededError } from "@/ai/lib/generate-structured-data.ts";

export type FriendlyError = {
    title: string;
    description: string;
};

// Centralized, user-facing error copy
const COPY = {
    NO_OBJECT: {
        title: "Error",
        description:
            "The AI didn’t return a valid result. Please try again in a minute. If it keeps happening, please report this bug in Discord.",
    },
    QUOTA: {
        title: "You've reached your AI quota",
        description:
            "Your AI usage limit has been reached. This quota resets at midnight US Pacific Time. Wait and try again later, or update your API key/plan in Settings.",
    },
} as const;

export function toFriendlyError(err: unknown): FriendlyError | null {
    // Quota exceeded bucket
    if (err instanceof FreeTierExceededError) {
        return COPY.QUOTA;
    }

    // Heuristic: treat structured-data no object errors uniformly
    const msg = (err instanceof Error ? err.message : String(err || ""))
        .toLowerCase();
    if (
        msg.includes("noobjectgeneratederror") ||
        msg.includes("no object generated") ||
        msg.includes("didn’t return a valid result") ||
        msg.includes("didn't return a valid result")
    ) {
        return COPY.NO_OBJECT;
    }

    return null;
}


