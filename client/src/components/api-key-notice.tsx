import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function ApiKeyNotice() {
    const [isElectron, setIsElectron] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function checkKeys() {
            try {
                // Check if we're in Electron
                if (window.electron && window.electron.apiKeys) {
                    setIsElectron(true);
                    // Check if API key is set
                    const hasKey = await window.electron.apiKeys.has();
                    setHasApiKey(hasKey);
                }
            } catch (error) {
                console.error('Error checking API key:', error);
            } finally {
                setLoading(false);
            }
        }

        checkKeys();
    }, []);

    // If not in Electron or still loading, don't show anything
    if (!isElectron || loading) {
        return null;
    }

    // If API key is present, don't show a notice
    if (hasApiKey) {
        return null;
    }

    // If API key is missing in Electron, show a notice
    return (
        <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>OpenAI API Key Required</AlertTitle>
            <AlertDescription className="flex flex-col">
                <span className="mb-3">You need to provide an OpenAI API key to use this application.</span>
                <Button variant="outline" onClick={() => navigate('/settings')} className="w-fit">
                    Add API Key in Settings
                </Button>
            </AlertDescription>
        </Alert>
    );
} 