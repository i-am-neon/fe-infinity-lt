import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import apiCall from "@/lib/api-call";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface VersionInfo {
    currentVersion: string;
    latestVersion: string;
    updateAvailable: boolean;
    releaseUrl: string;
}

export default function UpdateNotification() {
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dismissed, setDismissed] = useState(false);

    const checkForUpdates = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiCall<VersionInfo>("check-update");
            setVersionInfo(response);

            // Check if this update was previously dismissed
            if (response.updateAvailable) {
                const dismissedVersion = localStorage.getItem("dismissedUpdateVersion");
                if (dismissedVersion === response.latestVersion) {
                    setDismissed(true);
                }
            }
        } catch (err) {
            console.error("Error checking for updates:", err);
            setError("Failed to check for updates");
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = () => {
        if (versionInfo) {
            // Store the dismissed version to prevent showing the same update again
            localStorage.setItem("dismissedUpdateVersion", versionInfo.latestVersion);
            setDismissed(true);
        }
    };

    useEffect(() => {
        checkForUpdates();
    }, []);

    // Don't render anything if no update available, dismissed, loading, or error
    if (!versionInfo?.updateAvailable || dismissed || loading || error) {
        return null;
    }

    return (
        <Alert className="mb-4 border-amber-500 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20">
            <AlertTitle className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Update Available
            </AlertTitle>
            <AlertDescription className="mt-1 mb-3">
                A new version ({versionInfo.latestVersion}) is available. You're currently using {versionInfo.currentVersion}.
            </AlertDescription>

            <div className="flex gap-2 mt-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDismiss}
                >
                    Dismiss
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={() => window.open("https://feinfinity.vercel.app/downloads", "_blank")}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                >
                    Download Update
                </Button>
            </div>
        </Alert>
    );
} 