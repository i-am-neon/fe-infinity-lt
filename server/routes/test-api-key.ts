import { getOpenAIApiKey, hasValidApiKey } from "@/lib/api-key-manager.ts";
import OpenAI from "openai";

export async function handleTestApiKey(req: Request): Promise<Response> {
    // Get the API key and explicitly check for validity
    if (!hasValidApiKey()) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "No OpenAI API key found. Please add your API key in settings."
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    const apiKey = getOpenAIApiKey();

    try {
        // Initialize OpenAI client with the API key
        const openai = new OpenAI({
            apiKey: apiKey as string,
        });

        // Make a simple API call
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that responds with a single short sentence."
                },
                {
                    role: "user",
                    content: "Say 'Hello, your API key is working correctly!'"
                }
            ],
            max_tokens: 50
        });

        // Return the success response
        return new Response(
            JSON.stringify({
                success: true,
                message: response.choices[0]?.message?.content || "API key is working correctly!",
                model: response.model,
                usage: response.usage
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error testing OpenAI API key:", error);

        // Format the error message
        let errorMessage = "Error testing API key";
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return new Response(
            JSON.stringify({
                success: false,
                error: errorMessage
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
} 