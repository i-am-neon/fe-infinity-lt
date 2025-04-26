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
  retry?: boolean;
  retryDelay?: number;
  maxRetries?: number;
}

export default async function apiCall<T = unknown>(
  endpoint: string,
  { 
    method = "GET", 
    body, 
    retry = false, 
    retryDelay = 1000, 
    maxRetries = 3 
  }: ApiOptions = {}
): Promise<T> {
  if (isElectron()) {
    let retryCount = 0;
    
    const executeCall = async (): Promise<T> => {
      try {
        // Use IPC for Electron
        const response = await window.electron.ipcRenderer.invoke('api-call', {
          endpoint,
          method,
          body
        });

        // Type check the response
        if (typeof response !== 'object' || response === null) {
          throw new Error('Invalid response from server');
        }

        if ('success' in response && !response.success) {
          throw new Error(
            'error' in response && typeof response.error === 'string'
              ? response.error
              : 'API call failed'
          );
        }

        if (!('data' in response)) {
          throw new Error('Response missing data property');
        }

        return response.data as T;
      } catch (error) {
        console.error(`Error in Electron apiCall for endpoint ${endpoint}:`, error);
        
        // Check if we should retry
        if (retry && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying API call (${retryCount}/${maxRetries}) to ${endpoint} after ${retryDelay}ms...`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return executeCall();
        }
        
        throw error;
      }
    };
    
    return executeCall();
  } else {
    // Direct HTTP request for development
    const url = `${SERVER_URL}/${endpoint}`;
    let retryCount = 0;
    
    const executeCall = async (): Promise<T> => {
      try {
        const config: RequestInit = { method };

        if (body) {
          config.headers = { "Content-Type": "application/json" };
          config.body = JSON.stringify(body);
        }

        const res = await fetch(url, config);
        
        // Handle non-JSON responses (like when server is starting up)
        let json;
        try {
          json = await res.json();
        } catch (jsonError) {
          console.error(`Failed to parse JSON from ${url}:`, jsonError);
          throw new Error(`Server returned invalid JSON response. Server might still be starting up.`);
        }

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
        
        // Check if we should retry
        if (retry && retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying API call (${retryCount}/${maxRetries}) to ${endpoint} after ${retryDelay}ms...`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return executeCall();
        }
        
        throw error;
      }
    };
    
    return executeCall();
  }
}