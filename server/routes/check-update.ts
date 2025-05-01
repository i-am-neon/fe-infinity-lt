import { checkLatestVersion } from "@/lib/version-checker.ts";

/**
 * Handles the check-update API endpoint
 * Returns the current version, latest version, and whether an update is available
 */
export async function handleCheckUpdate(req: Request): Promise<Response> {
    try {
        // Get version information from GitHub
        const versionInfo = await checkLatestVersion();

        // Return the version information
        return new Response(JSON.stringify(versionInfo), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error in handleCheckUpdate:", error);

        return new Response(JSON.stringify({
            error: "Failed to check for updates",
            message: error instanceof Error ? error.message : String(error)
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
} 