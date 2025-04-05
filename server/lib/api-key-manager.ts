// API key manager for handling keys from both environment variables and client requests

/**
 * The current API key, prioritizing client-provided key over environment variable
 */
let currentOpenAIKey: string | null = null;

/**
 * Set a client-provided OpenAI API key
 * @param key The API key
 */
export function setApiKey(key: string): void {
    // Don't set empty strings as keys
    if (!key || key.trim() === '') {
        currentOpenAIKey = null;
        console.log('Cleared OpenAI API key');
        return;
    }

    currentOpenAIKey = key.trim();
    console.log(`Using client-provided OpenAI API key`);
}

/**
 * Get the current OpenAI API key, prioritizing client-provided key
 * @returns The API key or null if not set
 */
export function getApiKey(): string | null {
    // If we have a client-provided key, use it
    if (currentOpenAIKey) {
        return currentOpenAIKey;
    }

    // Otherwise, fall back to environment variable
    const envKey = Deno.env.get('OPENAI_API_KEY');

    // Don't return empty strings as keys
    if (!envKey || envKey.trim() === '') {
        return null;
    }

    return envKey;
}

/**
 * Reset client-provided API key (useful for testing)
 */
export function resetApiKey(): void {
    currentOpenAIKey = null;
    console.log('Reset client-provided OpenAI API key');
}

/**
 * Force check if the API key is set and valid (has a value)
 * @returns Boolean indicating if the API key is currently set and valid
 */
export function hasValidApiKey(): boolean {
    const key = getApiKey();
    return !!key && key.trim() !== '';
}

/**
 * Get the OpenAI API key
 * @returns The OpenAI API key or null if not set
 */
export function getOpenAIApiKey(): string | null {
    return getApiKey();
} 