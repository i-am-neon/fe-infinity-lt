import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ApiKeyNotice() {
    const [isElectron, setIsElectron] = useState(false);
    const [hasApiKey, setHasApiKey] = useState(false);
    const [loading, setLoading] = useState(true);

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
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">
                OpenAI API Key Required
            </h3>
            <p className="text-yellow-700 mb-3">
                You need to provide an OpenAI API key to use this application.
            </p>
            <Link
                to="/settings"
                className="inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
                Add API Key in Settings
            </Link>
        </div>
    );
} 