"use server";

import { SERVER_URL } from "@/constants";

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
  const res = await fetch(url, config);
  return res.json() as Promise<T>;
}

