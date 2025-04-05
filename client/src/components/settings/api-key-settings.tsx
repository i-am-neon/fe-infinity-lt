import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, InfoIcon, KeyIcon } from "lucide-react";
import { useEffect, useState } from 'react';

interface ApiKeyState {
    apiKey: string;
    savedKey: string; // Store the masked version of the saved key
    hasApiKey: boolean;
    isLoading: boolean;
}

export default function ApiKeySettings() {
    const [state, setState] = useState<ApiKeyState>({
        apiKey: '',
        savedKey: '',
        hasApiKey: false,
        isLoading: true
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    // Load existing API key on component mount
    useEffect(() => {
        async function loadKey() {
            try {
                if (window.electron) {
                    const hasKey = await window.electron.apiKeys.has();

                    if (hasKey) {
                        // Get partial key info if available
                        const key = await window.electron.apiKeys.get();
                        if (key && typeof key === 'string') {
                            // Mask the key to show only first 3 and last 3 characters
                            const maskedKey = maskApiKey(key);
                            setState(prev => ({
                                ...prev,
                                savedKey: maskedKey,
                                hasApiKey: true,
                                isLoading: false
                            }));
                        } else {
                            setState(prev => ({
                                ...prev,
                                hasApiKey: true,
                                isLoading: false
                            }));
                        }
                    } else {
                        setState(prev => ({
                            ...prev,
                            hasApiKey: false,
                            isLoading: false
                        }));
                    }
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                    setMessage({
                        text: 'API key management is only available in the desktop app',
                        type: 'error'
                    });
                }
            } catch (error) {
                console.error('Failed to load API key:', error);
                setState(prev => ({ ...prev, isLoading: false }));
                setMessage({
                    text: 'Failed to load API key',
                    type: 'error'
                });
            }
        }

        loadKey();
    }, []);

    // Helper function to mask the API key
    const maskApiKey = (key: string): string => {
        if (key.length <= 6) return key; // Don't mask very short keys

        const firstThree = key.substring(0, 3);
        const lastThree = key.substring(key.length - 3);
        const middleLength = key.length - 6;
        const maskedMiddle = '•'.repeat(Math.min(middleLength, 20));

        return `${firstThree}${maskedMiddle}${lastThree}`;
    };

    const handleInputChange = (value: string) => {
        setState(prev => ({ ...prev, apiKey: value }));
    };

    const saveKey = async () => {
        if (!window.electron) return;

        try {
            const key = state.apiKey.trim();

            if (!key) {
                setMessage({
                    text: 'Please enter an API key',
                    type: 'error'
                });
                return;
            }

            // Save the new key
            await window.electron.apiKeys.set(key);
            const maskedKey = maskApiKey(key);
            setState(prev => ({
                ...prev,
                apiKey: '',
                savedKey: maskedKey,
                hasApiKey: true
            }));
            setMessage({
                text: 'OpenAI API key saved successfully',
                type: 'success'
            });

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Failed to save API key:', error);
            setMessage({
                text: 'Failed to save API key',
                type: 'error'
            });
        }
    };

    const deleteKey = async () => {
        if (!window.electron) return;

        try {
            await window.electron.apiKeys.delete();
            setState(prev => ({
                ...prev,
                apiKey: '',
                savedKey: '',
                hasApiKey: false
            }));
            setMessage({
                text: 'OpenAI API key removed',
                type: 'success'
            });

            // Clear message after 3 seconds
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            console.error('Failed to delete API key:', error);
            setMessage({
                text: 'Failed to delete API key',
                type: 'error'
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyIcon className="h-5 w-5" />
                    OpenAI API Key
                </CardTitle>
                <CardDescription>
                    Provide your own OpenAI API key to use with the application
                </CardDescription>
            </CardHeader>
            <CardContent>
                {message.text && (
                    <Alert
                        variant={message.type === 'success' ? "default" : "destructive"}
                        className="mb-4"
                    >
                        <AlertTitle>
                            {message.type === 'success' ? 'Success' : 'Error'}
                        </AlertTitle>
                        <AlertDescription>
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}

                {state.isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        <p>Loading API key settings...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {state.hasApiKey ? (
                            <div className="space-y-3">
                                <div>
                                    <Label>Current API Key</Label>
                                    <div className="mt-1 font-mono p-2 bg-secondary/30 rounded flex justify-between items-center">
                                        <code className="text-sm">{state.savedKey}</code>
                                        <Button
                                            onClick={deleteKey}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Delete Key
                                        </Button>
                                    </div>
                                </div>
                                <div className="pt-2 text-sm text-muted-foreground">
                                    To update your key, first delete the current one, then add a new key.
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="api-key">API Key</Label>
                                </div>
                                <Input
                                    id="api-key"
                                    value={state.apiKey}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    placeholder="sk-..."
                                    className="font-mono"
                                />
                                <Button
                                    onClick={saveKey}
                                    className="mt-2"
                                >
                                    Save Key
                                </Button>
                            </div>
                        )}

                        <div className="pt-2">
                            <a
                                href="https://youtu.be/hSVTPU-FVLI?si=I3XiUP4gatl6RnwN"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <InfoIcon className="h-4 w-4 mr-1" />
                                How to find your OpenAI API key
                                <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex flex-col items-start">
                <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium flex items-center">
                        <InfoIcon className="h-4 w-4 mr-1" />
                        Important Notes:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Your API key is encrypted and stored only on your device.</li>
                        <li>This app only makes API calls directly to OpenAI and never to any other server.</li>
                        <li>OpenAI will charge you directly for usage (each chapter costs a fraction of a penny to generate).</li>
                        <li>FE Infinity doesn't take any commission or make money from your API usage.</li>
                        <li>The code is open-source, so you can verify these security practices yourself.</li>
                    </ul>
                </div>
            </CardFooter>
        </Card>
    );
} 