import { useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ImageIcon, InfoIcon, ExternalLink } from "lucide-react";
import ApiKeySettings from "@/components/settings/api-key-settings";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "@/components/ui/constants";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import VersionDisplay from "@/components/version-display";
import { openExternalLink } from "@/lib/utils";

export default function SettingsPage() {
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [generateCustomImages, setGenerateCustomImages] = useState(true);

    // Load saved preference on mount
    useEffect(() => {
        const savedPreference = localStorage.getItem("generateCustomImages");
        // Default to true if not set
        setGenerateCustomImages(savedPreference !== "false");
    }, []);

    // Save preference when changed
    const handleToggleImageGeneration = (checked: boolean) => {
        setGenerateCustomImages(checked);
        localStorage.setItem("generateCustomImages", checked.toString());
    };

    // Export application logs: zip and save to Downloads folder via Electron
    const handleExportLogs = async () => {
        if (!window.electron) {
            alert('Export Logs is only available in the packaged application.');
            return;
        }
        try {
            const response = await window.electron.ipcRenderer.invoke('exportLogs') as { success: boolean; path?: string; error?: string };
            if (response.success) {
                alert(`Logs exported to ${response.path}`);
            } else {
                alert(`Failed to export logs: ${response.error}`);
            }
        } catch (error) {
            alert(`Error exporting logs: ${error}`);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <BlurFade>
                <Button
                    variant="ghost"
                    className="mb-2 flex items-center gap-1 pl-0"
                    onClick={() => navigate(-1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>

                <h1 className="text-3xl font-bold my-6">Settings</h1>
            </BlurFade>

            <div className="grid gap-6">
                <BlurFade delay={BLUR_FADE_DELAY * 2}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>
                                Customize how the application looks on your device.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">
                                        Current theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                    </span>
                                    <ModeToggle />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>


                <BlurFade delay={BLUR_FADE_DELAY * 3}>
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Provider Settings</CardTitle>
                            <CardDescription className="flex flex-col">
                                <span>Configure your AI provider API keys for OpenAI.</span>
                                <span
                                    className="mt-2 underline underline-offset-2 hover:text-primary cursor-pointer w-fit"
                                    onClick={() => openExternalLink("https://youtu.be/8Oq-E6JTVzo")}
                                >
                                    How-To Video <ExternalLink className="inline h-3 w-3" />
                                </span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ApiKeySettings />
                        </CardContent>
                    </Card>
                </BlurFade>

                <BlurFade delay={BLUR_FADE_DELAY * 4}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ImageIcon className="h-5 w-5" />
                                Custom Title Images
                            </CardTitle>
                            <CardDescription>
                                Control whether AI generates custom title images for your games
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label htmlFor="image-generation">Generate custom title images</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Costs approximately $0.15 in OpenAI credits <span className="font-medium">per game</span> (not per chapter)
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <Switch
                                        id="image-generation"
                                        checked={generateCustomImages}
                                        onCheckedChange={handleToggleImageGeneration}
                                    />
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {generateCustomImages ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-md mt-2 ${generateCustomImages ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200" : "bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"}`}>
                                {generateCustomImages ? (
                                    <p className="text-sm">AI will generate a unique custom title image for each new game you create. (Recommended)</p>
                                ) : (
                                    <p className="text-sm">Default title image will be used for all new games to save on API costs.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>

                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Export Logs</CardTitle>
                            <CardDescription>
                                Zip all application logs and save to your Downloads folder.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="secondary" onClick={handleExportLogs}>
                                Export Logs
                            </Button>
                        </CardContent>
                    </Card>
                </BlurFade>

                <BlurFade delay={BLUR_FADE_DELAY * 6}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <InfoIcon className="h-5 w-5" />
                                About FE Infinity
                            </CardTitle>
                            <CardDescription>
                                Application version and information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <VersionDisplay />
                            <div className="mt-4 text-sm text-muted-foreground">
                                <p>
                                    FE Infinity is an AI system that creates Fire Emblem games as you play them.
                                    New chapters are generated based on your decisions and battle outcomes.
                                </p>
                                <div className="mt-2">
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openExternalLink('https://feinfinity.vercel.app');
                                        }}
                                        className="text-primary hover:underline"
                                    >
                                        Visit Website
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </BlurFade>
            </div>
        </div>
    );
} 