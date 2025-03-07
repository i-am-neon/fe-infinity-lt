import { useState } from 'react';
import apiCall from '../lib/api-call';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ModeToggle } from '../components/ui/theme-toggle';

export default function HomePage() {
  const [pingResult, setPingResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePing = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiCall<{ result: string }>('ping');
      setPingResult(result.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-between w-full">
          <h1 className="text-3xl font-bold">FE Infinity</h1>
          <ModeToggle />
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Server Connection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handlePing}
              disabled={loading}
            >
              {loading ? 'Pinging...' : 'Ping Server'}
            </Button>
            
            {pingResult && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded">
                <p>Server response: {pingResult}</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded">
                <p>Error: {error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}