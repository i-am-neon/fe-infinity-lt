import genImage from "@/ai/lib/gen-image.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { testInitialGameIdea, testWorldSummary } from "@/ai/test-data/prologueTestData.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import { dirname } from "node:path";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import saveDefaultTitleImage from "@/game-engine-io/save-default-title-image.ts";
import { getGameTitleImagePath } from "@/file-io/get-path-within-user-data.ts";

export default async function genAndSaveTitleImage({ gameTitle, worldSummary, initialGameIdea, projectNameEndingInDotLtProj }: { gameTitle: string; worldSummary: WorldSummary; initialGameIdea: InitialGameIdea; projectNameEndingInDotLtProj: string; }) {
    try {
        const prompt = `generate an image for the title screen of a fire emblem GBA game with this info: 
        Game Title: ${gameTitle}
        World Summary: ${worldSummary}
        Initial Game Idea: ${initialGameIdea}
    
        Make sure to include the title text in a stylized way, do not put the description on there, but use it as context for image gen.
    
        The image should not contain the words "Fire Emblem", just the title text.
    
        The image should not contain any characters.
        
        The title text should be perfectly centered in the image.`;

        // Path for LT Maker
        const ltMakerFilePath = getPathWithinLtMaker(`${projectNameEndingInDotLtProj}/resources/panoramas/title_background.png`);

        // Get project name without the .ltproj extension for use in the user data path
        const projectName = projectNameEndingInDotLtProj.replace(/\.ltproj$/, "");

        // Path for user data folder
        const userDataFilePath = getGameTitleImagePath(projectName);

        // Ensure the user data directory exists
        ensureDirSync(dirname(userDataFilePath));

        // Generate and save the image to LT Maker
        await genImage({ prompt, filePath: ltMakerFilePath });

        // Copy the file to the user data directory
        await Deno.copyFile(ltMakerFilePath, userDataFilePath);
    } catch (error) {
        const logger = getCurrentLogger();
        logger.error("Error generating and saving title image. Defaulting to default title image.", { error: (error as Error).message });
        await saveDefaultTitleImage({ projectNameEndingInDotLtProj });
    }
}

if (import.meta.main) {
    const gameTitle = "Celestial Vanguard";
    const worldSummary = testWorldSummary;
    const initialGameIdea = testInitialGameIdea;
    const projectNameEndingInDotLtProj = "_the-grand-tourney.ltproj";
    await genAndSaveTitleImage({ gameTitle, worldSummary, initialGameIdea, projectNameEndingInDotLtProj });
}
