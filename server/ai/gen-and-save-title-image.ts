import genImage from "@/ai/lib/gen-image.ts";
import { WorldSummary } from "@/ai/types/world-summary.ts";
import { InitialGameIdea } from "@/ai/types/initial-game-idea.ts";
import { testInitialGameIdea, testWorldSummary } from "@/ai/test-data/prologueTestData.ts";
import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";

export default async function genAndSaveTitleImage({ gameTitle, worldSummary, initialGameIdea, projectNameEndingInDotLtProj }: { gameTitle: string; worldSummary: WorldSummary; initialGameIdea: InitialGameIdea; projectNameEndingInDotLtProj: string; }) {
    const prompt = `generate an image for the title screen of a fire emblem GBA game with this info: 
    Game Title: ${gameTitle}
    World Summary: ${worldSummary}
    Initial Game Idea: ${initialGameIdea}

    Make sure to include the title text in a stylized way, do not put the description on there, but use it as context for image gen.

    The image should not contain the words "Fire Emblem", just the title text.

    The image should not contain any characters.
    
    The top 1/10th of the image will be cut off, so make sure the title text is not too close to the top of the image.`;

    const filePath = getPathWithinLtMaker(`${projectNameEndingInDotLtProj}/resources/panoramas/title_background.png`);

    await genImage({ prompt, filePath });
};

if (import.meta.main) {
    const gameTitle = "Celestial Vanguard";
    const worldSummary = testWorldSummary;
    const initialGameIdea = testInitialGameIdea;
    const projectNameEndingInDotLtProj = "_celestial-vanguard.ltproj";
    await genAndSaveTitleImage({ gameTitle, worldSummary, initialGameIdea, projectNameEndingInDotLtProj });
}
