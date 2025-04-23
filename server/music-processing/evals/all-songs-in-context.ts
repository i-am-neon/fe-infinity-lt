import { getCurrentLogger } from "@/lib/current-logger.ts";
import { sluggify } from "@/lib/sluggify.ts";
import generateStructuredData from "@/ai/lib/generate-structured-data.ts";
import concatAllMusicOptions from "@/music-processing/concat-all-music-options.ts";
import { z } from "zod";

export default async function allSongsInContext(scenario: string): Promise<string> {
    const logger = getCurrentLogger();
    const optionsJson = concatAllMusicOptions();
    const schema = z.object({ songName: z.string() });
    const systemMessage = `You are given a description of a scenario and a list of song metadata options in JSON format.
Choose the most appropriate songName from the options based on the scenario.
Return an object with a single property songName set to the chosen name.`;
    const { songName } = await generateStructuredData({
        fnName: "allSongsInContext",
        schema,
        systemMessage,
        prompt: `scenario: ${scenario}\noptions: ${optionsJson}`,
        model: "fast",
    });
    if (!songName) {
        throw new Error("No songName returned from LLM.");
    }
    const sluggified = sluggify(songName);
    logger.debug("LLM chose music track:", { scenario, songName, sluggified });
    return sluggified;
}

if (import.meta.main) {
    const scenario = 'Within the battered halls of Castle Roen, Serin Ashvale steels herself as the cursed fog creeps through the shattered gates. Eldric Fenmere, his trembling hands betraying both age and regret, tends to the wounded with supplies scavenged from the remains of the royal infirmary. Maev of Mirebrook, silent and sharp-eyed, paces the barricades, her distrustful gaze ever wary of both undead and desperate survivors. Brayden Thorne, his shoulders squared with grim determination, sharpens his battered axe and voices defiance against the encroaching night. As the dead begin to claw at the ancient stones, the four gather in the war room, debating a perilous escape through the haunted Marketward—a treacherous district rumored to offer a route toward the legendary Shrine of Respite. Their hopes are flickers in the darkness, their alliances uneasy, but with the fog thickening each moment, there is no choice but to flee or perish.';
    const result = await allSongsInContext(scenario);
    console.log(result);
}