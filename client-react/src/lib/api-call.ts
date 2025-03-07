const SERVER_URL = "http://localhost:8000";

interface ApiOptions {
  method?: string;
  body?: unknown;
}

export default async function apiCall<T = unknown>(
  endpoint: string,
  { method = "GET", body }: ApiOptions = {}
): Promise<T> {
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
      throw new Error(`API call to ${url} failed with status ${res.status}`);
    }
    return json as T;
  } catch (error) {
    console.error(
      `Error in apiCall for endpoint ${endpoint} with config ${JSON.stringify(
        config
      )}:`,
      error
    );
    throw error;
  }
}