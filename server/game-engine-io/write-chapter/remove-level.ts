import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";
import { getGameByNid } from "@/db/games.ts";

/**
 * Removes the last level from levels.json
 */
export async function removeLastLevel({
    projectNameEndingInDotLtProj,
    gameNid,
}: {
    projectNameEndingInDotLtProj: string;
    gameNid: string;
}): Promise<void> {
    const logger = getCurrentLogger();
    const filePath = getPathWithinLtMaker(
        `${projectNameEndingInDotLtProj}/game_data/levels.json`
    );

    // Get the game to determine the last chapter's nid
    const game = getGameByNid(gameNid);
    if (!game || game.chapters.length === 0) {
        logger.warn("No chapters to remove in game", { gameNid });
        return;
    }

    const lastChapter = game.chapters[game.chapters.length - 1];
    const levelNidToRemove = lastChapter.level.nid;

    logger.info("Removing level from levels.json", { levelNid: levelNidToRemove });

    const [levels, wasFallback] = await readOrCreateJSON<any[]>(
        filePath,
        [],
        projectNameEndingInDotLtProj
    );

    if (wasFallback) {
        logger.warn("Could not read levels.json, using fallback");
        return;
    }

    // Find and remove the level with the given nid
    const levelIndex = levels.findIndex((level) => level.nid === levelNidToRemove);
    if (levelIndex === -1) {
        logger.warn(`Level with nid ${levelNidToRemove} not found in levels.json`);
        return;
    }

    levels.splice(levelIndex, 1);
    await Deno.writeTextFile(filePath, JSON.stringify(levels, null, 2));
    logger.info("Level removed successfully", { levelNid: levelNidToRemove });
}

if (import.meta.main) {
    // For testing
    removeLastLevel({
        projectNameEndingInDotLtProj: "_test.ltproj",
        gameNid: "test-game",
    }).then(() => {
        console.log("Removed level successfully.");
    });
} 