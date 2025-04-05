import { useTheme } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ApiKeySettings from "@/components/settings/api-key-settings";

export default function SettingsPage() {
    const { theme } = useTheme();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto py-10">
            <Button
                variant="ghost"
                className="mb-2 flex items-center gap-1 pl-0"
                onClick={() => navigate(-1)}
            >
                <ChevronLeft className="h-4 w-4" />
                Back
            </Button>

            <h1 className="text-3xl font-bold my-6">Settings</h1>

            <div className="grid gap-6">
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

                <Card>
                    <CardHeader>
                        <CardTitle>AI Provider Settings</CardTitle>
                        <CardDescription>
                            Configure your AI provider API keys for OpenAI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ApiKeySettings />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 