import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { dirname } from "node:path";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
import { getGameTitleImagePath } from "@/file-io/get-path-within-user-data.ts";

export default async function saveDefaultTitleImage({ projectNameEndingInDotLtProj }: { projectNameEndingInDotLtProj: string }) {
    // Path to default title image
    const defaultTitleImagePath = getPathWithinServer("assets/default-title-background/title_background.png");

    // Path for LT Maker
    const ltMakerFilePath = getPathWithinLtMaker(`${projectNameEndingInDotLtProj}/resources/panoramas/title_background.png`);

    // Get project name without the .ltproj extension for use in the user data path
    const projectName = projectNameEndingInDotLtProj.replace(/\.ltproj$/, "");

    // Path for user data folder
    const userDataFilePath = getGameTitleImagePath(projectName);

    // Ensure the user data directory exists
    ensureDirSync(dirname(userDataFilePath));

    // Copy the default image to LT Maker
    await Deno.copyFile(defaultTitleImagePath, ltMakerFilePath);

    // Copy the file to the user data directory
    await Deno.copyFile(defaultTitleImagePath, userDataFilePath);
}

if (import.meta.main) {
    const projectNameEndingInDotLtProj = "_crimson-dynasty.ltproj";
    await saveDefaultTitleImage({ projectNameEndingInDotLtProj });
} 