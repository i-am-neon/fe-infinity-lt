import { getPathWithinLtMaker } from "../file-io/get-path-within-lt-maker.ts";

export default async function addToOrderKeys({
  relativeDirPath,
  orderKey,
}: {
  relativeDirPath: string;
  orderKey: string;
}): Promise<void> {
  // If the order keys file doesn't exist, create it
  const orderKeysPath = getPathWithinLtMaker(`${relativeDirPath}/.orderkeys`);
  try {
    await Deno.readTextFile(orderKeysPath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(orderKeysPath, "");
    } else {
      throw error;
    }
  }

  // Add the order key
  await Deno.writeTextFile(orderKeysPath, `${orderKey}\n`, {
    append: true,
  });
}

if (import.meta.main) {
  addToOrderKeys({
    relativeDirPath: "_new.ltproj/game_data/events",
    orderKey: "test",
  }).then(() => {
    console.log("Added order key");
  });
}

