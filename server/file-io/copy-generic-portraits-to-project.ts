import copyFileToLtMaker from "@/file-io/copy-file-to-lt-maker.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { join } from "node:path";
import { appendPortraitsJson } from "@/game-engine-io/write-character/append-portraits-json.ts";

export default async function copyGenericPortraitsToProject(
  newProjectNameEndingInDotLtProj: string
): Promise<void> {
  const genericPortraitSourcePath = getPathWithinServer(
    "assets/generic-portraits"
  );
  const portraitsDestinationDir = join(
    newProjectNameEndingInDotLtProj,
    "resources",
    "portraits"
  );

  for await (const entry of Deno.readDir(genericPortraitSourcePath)) {
    if (!entry.isFile) continue;
    const filePathInServer = join("assets", "generic-portraits", entry.name);
    await copyFileToLtMaker({
      filePathInServer,
      ltMakerSubdirectory: portraitsDestinationDir,
    });
  }
  await appendPortraitsJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "Man1",
    blinkingOffset: [24, 32],
    smilingOffset: [16, 48],
  });
  await appendPortraitsJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "Man2",
    blinkingOffset: [24, 32],
    smilingOffset: [16, 48],
  });
  await appendPortraitsJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "Man3",
    blinkingOffset: [24, 24],
    smilingOffset: [16, 40],
  });
  await appendPortraitsJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "Woman1",
    blinkingOffset: [24, 32],
    smilingOffset: [16, 48],
  });
  await appendPortraitsJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "Woman2",
    blinkingOffset: [24, 32],
    smilingOffset: [16, 48],
  });
  await appendPortraitsJson({
    projectNameEndingInDotLtProj: newProjectNameEndingInDotLtProj,
    nid: "OldMan1",
    blinkingOffset: [24, 40],
    smilingOffset: [16, 56],
  });
}

if (import.meta.main) {
  await copyGenericPortraitsToProject("_the-grand-tourney.ltproj");
  console.log("Generic portraits copied successfully.");
}

