import { getPathWithinLtMaker } from "@/file-io/get-path-within-lt-maker.ts";
import readOrCreateJSON from "@/game-engine-io/read-or-create-json.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

/**
 * Removes all events from events.json that match the given level_nid
 */
export async function removeEventsByLevelNid({
    projectNameEndingInDotLtProj,
    levelNid,
}: {
    projectNameEndingInDotLtProj: string;
    levelNid: string;
}): Promise<void> {
    const logger = getCurrentLogger();
    const filePath = getPathWithinLtMaker(
        `${projectNameEndingInDotLtProj}/game_data/events.json`
    );

    logger.info("Removing events for level", { levelNid });

    const [events, wasFallback] = await readOrCreateJSON<any[]>(
        filePath,
        [],
        projectNameEndingInDotLtProj
    );

    if (wasFallback) {
        logger.warn("Could not read events.json, using fallback");
        return;
    }

    const originalCount = events.length;
    const filteredEvents = events.filter((event) => event.level_nid !== levelNid);
    const removedCount = originalCount - filteredEvents.length;

    if (removedCount === 0) {
        logger.warn(`No events found for level_nid ${levelNid}`);
        return;
    }

    await Deno.writeTextFile(filePath, JSON.stringify(filteredEvents, null, 2));
    logger.info("Events removed successfully", {
        levelNid,
        removedCount,
        remainingEvents: filteredEvents.length
    });
}

if (import.meta.main) {
    // For testing
    removeEventsByLevelNid({
        projectNameEndingInDotLtProj: "_test.ltproj",
        levelNid: "test",
    }).then(() => {
        console.log("Removed events successfully.");
    });
} 