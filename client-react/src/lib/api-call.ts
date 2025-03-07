// Detect if running in Electron (TypeScript-safe approach)
const isElectron = (): boolean => {
  return window !== undefined &&
         typeof window === 'object' &&
         'electron' in window;
};

const SERVER_URL = "http://localhost:8000";

interface ApiOptions {
  method?: string;
  body?: unknown;
}

export default async function apiCall<T = unknown>(
  endpoint: string,
  { method = "GET", body }: ApiOptions = {}
): Promise<T> {
  if (isElectron()) {
    try {
      // Use IPC for Electron
      const response = await window.electron.ipcRenderer.invoke('api-call', {
        endpoint,
        method,
        body
      });
      
      if (!response.success) {
        throw new Error(response.error || 'API call failed');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error in Electron apiCall for endpoint ${endpoint}:`, error);
      throw error;
    }
  } else {
    // Direct HTTP request for development
    const url = `${SERVER_URL}/${endpoint}`;
    const config: RequestInit = { method };
    
    if (body) {
      config.headers = { "Content-Type": "application/json" };
      config.body = JSON.stringify(body);
    }
    
    try {
      const res = await fetch(url, config);
      const json = await res.json();
      
      if (!res.ok) {
        console.error(
          `API call to ${url} failed with status ${res.status}. Response:`,
          json
        );
        throw new Error(json.error || `API call to ${url} failed with status ${res.status}`);
      }
      
      return json as T;
    } catch (error) {
      console.error(
        `Error in apiCall for endpoint ${endpoint}:`,
        error
      );
      throw error;
    }
  }
}