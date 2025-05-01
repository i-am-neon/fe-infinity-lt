import { VERSION } from "@/constants.ts";

const GITHUB_RELEASE_URL = "https://api.github.com/repos/i-am-neon/fe-infinity-lt/releases/tags/ai";

/**
 * Fetches the latest version information from GitHub
 */
export async function checkLatestVersion(): Promise<{
    currentVersion: string;
    latestVersion: string;
    updateAvailable: boolean;
    releaseUrl: string;
}> {
    const currentVersion = VERSION;
    let latestVersion = VERSION;
    let updateAvailable = false;
    let releaseUrl = "https://github.com/i-am-neon/fe-infinity-lt/releases/tag/ai";

    try {
        const response = await fetch(GITHUB_RELEASE_URL, {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "FE-Infinity-Update-Checker",
            },
        });

        if (!response.ok) {
            console.error(`GitHub API error: ${response.status} ${response.statusText}`);
            return { currentVersion, latestVersion, updateAvailable, releaseUrl };
        }

        const data = await response.json();

        // Check for assets in the release (where the version is in the filename)
        if (data.assets && data.assets.length > 0) {
            for (const asset of data.assets) {
                if (asset.name) {
                    // Extract version from pattern like "FE.Infinity-1.0.0-arm64.dmg"
                    const assetVersionMatch = asset.name.match(/FE\.?Infinity-(\d+\.\d+\.\d+)/i);
                    if (assetVersionMatch && assetVersionMatch[1]) {
                        latestVersion = assetVersionMatch[1];
                        break; // Found a version, stop looking
                    }
                }
            }
        }

        // Fallback to previous methods if no version found in assets
        if (latestVersion === VERSION) {
            // Extract version from GitHub release name
            if (data.name) {
                const versionMatch = data.name.match(/v?(\d+\.\d+\.\d+)/i);
                if (versionMatch && versionMatch[1]) {
                    latestVersion = versionMatch[1];
                }
            }

            // If still no version found, check the body
            if (latestVersion === VERSION && data.body) {
                const bodyVersionMatch = data.body.match(/v?(\d+\.\d+\.\d+)/i);
                if (bodyVersionMatch && bodyVersionMatch[1]) {
                    latestVersion = bodyVersionMatch[1];
                }
            }
        }

        // Check if there's a newer version available
        updateAvailable = isNewerVersion(latestVersion, currentVersion);

        // Get the proper release URL
        if (data.html_url) {
            releaseUrl = data.html_url;
        }

        return {
            currentVersion,
            latestVersion,
            updateAvailable,
            releaseUrl
        };
    } catch (error) {
        console.error("Error checking for updates:", error);
        return {
            currentVersion,
            latestVersion,
            updateAvailable,
            releaseUrl
        };
    }
}

/**
 * Compares version strings to determine if version1 is newer than version2
 */
function isNewerVersion(version1: string, version2: string): boolean {
    const v1Parts = version1.split('.').map(Number);
    const v2Parts = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
        const v1Part = v1Parts[i] || 0;
        const v2Part = v2Parts[i] || 0;

        if (v1Part > v2Part) return true;
        if (v1Part < v2Part) return false;
    }

    return false;
}

// For manual testing via Deno CLI
if (import.meta.main) {
    console.log("Checking for updates...");
    const result = await checkLatestVersion();
    console.log(JSON.stringify(result, null, 2));
} 