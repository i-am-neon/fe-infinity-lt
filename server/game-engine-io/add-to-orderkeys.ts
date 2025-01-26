import { getPathWithinLtMaker } from "../file-io/get-path-within-lt-maker.ts";

export default async function addToOrderKeys({
  relativeDirPath,
  orderKey,
}: {
  relativeDirPath: string;
  orderKey: string;
}): Promise<void> {
  const orderKeysPath = getPathWithinLtMaker(`${relativeDirPath}/.orderkeys`);
  let orderKeys: string[] = [];

  try {
    const content = await Deno.readTextFile(orderKeysPath);
    if (content.trim()) {
      orderKeys = JSON.parse(content);
      if (!Array.isArray(orderKeys)) {
        orderKeys = content.split("\n").filter((key) => key.trim());
      }
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  if (!orderKeys.includes(orderKey)) {
    orderKeys.push(orderKey);
  }

  await Deno.writeTextFile(orderKeysPath, JSON.stringify(orderKeys, null, 4));
}

if (import.meta.main) {
  addToOrderKeys({
    relativeDirPath: "_new.ltproj/game_data/events",
    orderKey: "test",
  }).then(() => {
    console.log("Added order key");
  });
}
