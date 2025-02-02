"use server";

import apiCall from "@/lib/api-call";

export async function ping() {
  const res = await apiCall("ping");
  console.log("res :>> ", res);
}

export async function createGame() {
  const res = await apiCall("create-game", {
    body: { projectName: "test" },
    method: "POST",
  });
  console.log("res :>> ", res);
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

