import { join, basename } from "node:path";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function copyFileToLtMaker({
  filePathInServer,
  ltMakerSubdirectory,
  newFileName,
}: {
  filePathInServer: string;
  ltMakerSubdirectory: string;
  newFileName?: string;
}): Promise<void> {
  const absoluteSourcePath = getPathWithinServer(filePathInServer);
  const fileStat = await Deno.stat(absoluteSourcePath);

  if (!fileStat.isFile) {
    throw new Error(`Source path is not a file: ${absoluteSourcePath}`);
  }

  const fileName = basename(absoluteSourcePath);
  const destinationPath = getPathWithinLtMaker(
    join(ltMakerSubdirectory, newFileName || fileName)
  );
  await Deno.copyFile(absoluteSourcePath, destinationPath);
}

if (import.meta.main) {
  await copyFileToLtMaker({
    filePathInServer: "assets/tilesets/0e00ea10.png",
    ltMakerSubdirectory: "_test-ltproj/resources/tilesets",
  });
  console.log("File copied successfully.");
}
