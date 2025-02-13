"use server";

import apiCall from "@/lib/api-call";

export async function ping() {
  await apiCall("ping");
}

export async function createGame({ title, description, tone }: { title: string; description: string; tone: string }): Promise<{
  success: boolean;
  projectNameEndingInDotLtProj?: string;
  gameNid?: string;
  error?: string;
}> {
  return apiCall("create-game", {
    method: "POST",
    body: { title, description, tone },
  });
}

import type { Game } from "@/types/game";

export async function listGames(): Promise<Game[]> {
  const res = await apiCall<{
    success: boolean;
    games?: Game[];
    error?: string;
  }>("games");
  if (!res.success || !res.games) {
    return [];
  }
  return res.games;
}

export async function openGame(directory: string) {
  return apiCall("run-game", {
    method: "POST",
    body: { directory },
  });
}

export async function generateNextChapter(directory: string, gameNid: string) {
  return apiCall("generate-next-chapter", {
    method: "POST",
    body: { directory, gameNid },
  });
}

/**
 * Delete game from DB and remove project directory
 */
export async function deleteGame(nid: string, directory: string) {
  return apiCall("delete-game", {
    method: "POST",
    body: { nid, directory },
  });
}