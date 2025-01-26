import { getPathWithinLtMaker } from "./get-path-within-lt-maker.ts";

export default async function writeFileWithinLtMaker({
  relativePath,
  text,
  append = false,
}: {
  relativePath: string;
  text: string;
  append?: boolean;
}): Promise<void> {
  const path = getPathWithinLtMaker(relativePath);
  await Deno.writeTextFile(path, text, { append });
}

