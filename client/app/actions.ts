"use server";

import apiCall from "@/lib/api-call";

export async function ping() {
  const res = await apiCall("ping");
  console.log("res :>> ", res);
}

export async function createGame() {
  const res = await apiCall("create-game", {
    body: { projectName: "My Project" },
    method: "POST",
  });
  console.log("res :>> ", res);
}

