import { VERSION } from "@/constants.ts";

// Change from tag-specific URL to latest releases endpoint
const GITHUB_API_BASE = "https://api.github.com/repos/i-am-neon/fe-infinity-lt";
const GITHUB_LATEST_RELEASE_URL = `${GITHUB_API_BASE}/releases/latest`;
const GITHUB_RELEASES_URL = `${GITHUB_API_BASE}/releases`;

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
    let releaseUrl = "https://github.com/i-am-neon/fe-infinity-lt/releases/latest";

    try {
        // First try getting the latest release
        let response = await fetch(GITHUB_LATEST_RELEASE_URL, {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "FE-Infinity-Update-Checker",
            },
        });

        // If no latest release is found, try getting all releases and find the most recent
        if (response.status === 404) {
            response = await fetch(GITHUB_RELEASES_URL, {
                headers: {
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "FE-Infinity-Update-Checker",
                },
            });

            if (!response.ok) {
                console.error(`GitHub API error: ${response.status} ${response.statusText}`);
                return { currentVersion, latestVersion, updateAvailable, releaseUrl };
            }

            const releases = await response.json();
            if (releases.length === 0) {
                return { currentVersion, latestVersion, updateAvailable, releaseUrl };
            }

            // Get the most recent release
            const data = releases[0];
            if (data.html_url) {
                releaseUrl = data.html_url;
            }
            latestVersion = extractVersionFromRelease(data);
        } else if (!response.ok) {
            console.error(`GitHub API error: ${response.status} ${response.statusText}`);
            return { currentVersion, latestVersion, updateAvailable, releaseUrl };
        } else {
            // We got the latest release
            const data = await response.json();
            if (data.html_url) {
                releaseUrl = data.html_url;
            }
            latestVersion = extractVersionFromRelease(data);
        }

        // Check if there's a newer version available
        updateAvailable = isNewerVersion(latestVersion, currentVersion);

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
 * Extracts version information from a GitHub release object
 */
function extractVersionFromRelease(releaseData: any): string {
    // First try to extract from tag name
    if (releaseData.tag_name) {
        const tagVersionMatch = releaseData.tag_name.match(/v?(\d+\.\d+\.\d+)/i);
        if (tagVersionMatch && tagVersionMatch[1]) {
            return tagVersionMatch[1];
        }
    }

    // Check for assets in the release (where the version is in the filename)
    if (releaseData.assets && releaseData.assets.length > 0) {
        for (const asset of releaseData.assets) {
            if (asset.name) {
                // Extract version from pattern like "FE.Infinity-1.0.0-arm64.dmg"
                const assetVersionMatch = asset.name.match(/FE\.?Infinity-(\d+\.\d+\.\d+)/i);
                if (assetVersionMatch && assetVersionMatch[1]) {
                    return assetVersionMatch[1];
                }
            }
        }
    }

    // Extract version from GitHub release name
    if (releaseData.name) {
        const versionMatch = releaseData.name.match(/v?(\d+\.\d+\.\d+)/i);
        if (versionMatch && versionMatch[1]) {
            return versionMatch[1];
        }
    }

    // If still no version found, check the body
    if (releaseData.body) {
        const bodyVersionMatch = releaseData.body.match(/v?(\d+\.\d+\.\d+)/i);
        if (bodyVersionMatch && bodyVersionMatch[1]) {
            return bodyVersionMatch[1];
        }
    }

    // Return current version if no version found
    return VERSION;
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