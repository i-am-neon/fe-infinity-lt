"use server";

import apiCall from "@/lib/api-call";

export async function ping() {
  const res = await apiCall("ping");
  console.log("res :>> ", res);
}

export async function createGame() {
  const res = await apiCall("create-game", {
    body: { projectName: "OH MY GOD" },
    method: "POST",
  });
  console.log("res :>> ", res);
}

export async function listGames() {
  const res = await apiCall("games");
  return res.games || [];
}

export async function openGame(directory: string) {
  return apiCall("run-game", {
    method: "POST",
    body: { directory },
  });
}