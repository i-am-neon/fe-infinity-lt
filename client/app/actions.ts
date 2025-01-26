"use server";

import apiCall from "@/lib/api-call";

export default async function ping() {
  const res = await apiCall("ping");
  console.log("res :>> ", res);
}
