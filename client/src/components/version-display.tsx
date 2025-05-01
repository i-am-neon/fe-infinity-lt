import { useEffect, useState } from "react";
import apiCall from "@/lib/api-call";

interface VersionInfo {
    currentVersion: string;
    latestVersion: string;
    updateAvailable: boolean;
    releaseUrl: string;
}

export default function VersionDisplay() {
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVersionInfo = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiCall<VersionInfo>("check-update");
                setVersionInfo(response);
            } catch (err) {
                console.error("Error fetching version info:", err);
                setError("Failed to fetch version information");
            } finally {
                setLoading(false);
            }
        };

        fetchVersionInfo();
    }, []);

    if (loading) {
        return <div className="text-sm text-muted-foreground">Loading version info...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-500">Error loading version</div>;
    }

    if (!versionInfo) {
        return <div className="text-sm text-muted-foreground">Version information unavailable</div>;
    }

    return (
        <div className="space-y-1">
            <div className="text-sm font-medium">
                Version: <span className="font-normal">{versionInfo.currentVersion}</span>
            </div>
            {versionInfo.updateAvailable && (
                <div className="text-xs text-amber-600 dark:text-amber-400">
                    Update available: {versionInfo.latestVersion}
                </div>
            )}
        </div>
    );
} 