import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { getPathWithinClient } from "@/file-io/get-path-within-client.ts";
import { dirname } from "node:path";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";

export default async function saveDefaultTitleImage({ projectNameEndingInDotLtProj }: { projectNameEndingInDotLtProj: string }) {
    // Path to default title image
    const defaultTitleImagePath = getPathWithinServer("assets/default-title-background/title_background.png");

    // Path for LT Maker
    const ltMakerFilePath = getPathWithinLtMaker(`${projectNameEndingInDotLtProj}/resources/panoramas/title_background.png`);

    // Get project name without the .ltproj extension for use in the client path
    const projectName = projectNameEndingInDotLtProj.replace(/\.ltproj$/, "");

    // Path for client public folder
    const clientFilePath = getPathWithinClient(`public/images/title-images/${projectName}.png`);

    // Ensure the client directory exists
    ensureDirSync(dirname(clientFilePath));

    // Copy the default image to LT Maker
    await Deno.copyFile(defaultTitleImagePath, ltMakerFilePath);

    // Copy the file to the client directory
    await Deno.copyFile(defaultTitleImagePath, clientFilePath);
}

if (import.meta.main) {
    const projectNameEndingInDotLtProj = "_crimson-dynasty.ltproj";
    await saveDefaultTitleImage({ projectNameEndingInDotLtProj });
} 