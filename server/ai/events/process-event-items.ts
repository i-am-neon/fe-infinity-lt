import { AIEvent } from "@/ai/types/ai-event.ts";
import chooseItem from "@/item-options/choose-item.ts";
import { getCurrentLogger } from "@/lib/current-logger.ts";

/**
 * Processes an AIEvent to convert any "give_item" commands to use valid game item NIDs
 * by calling the chooseItem function with the original item name.
 */
export default async function processEventItems(
  event: AIEvent
): Promise<AIEvent> {
  const logger = getCurrentLogger();
  const updatedEvent: AIEvent = {
    ...event,
    sourceObjects: [...event.sourceObjects],
  };

  // Find all "give_item" commands
  const giveItemCommands = updatedEvent.sourceObjects.filter(
    (obj) => obj.command === "give_item"
  );

  if (giveItemCommands.length === 0) {
    return updatedEvent;
  }

  logger.debug(
    `Processing ${giveItemCommands.length} give_item commands in event ${event.name}`
  );

  // Process each give_item command
  for (const command of giveItemCommands) {
    if (command.args.length === 0) continue;

    const originalItemName = command.args[1];
    try {
      const gameItemNid = await chooseItem(originalItemName);

      // Replace the original item name with the game NID
      const commandIndex = updatedEvent.sourceObjects.indexOf(command);
      if (commandIndex !== -1) {
        updatedEvent.sourceObjects[commandIndex] = {
          ...command,
          args: ["convoy", gameItemNid],
        };
      }

      logger.debug(
        `Replaced item "${originalItemName}" with "${gameItemNid}" in event ${event.name}`
      );
    } catch (error) {
      logger.warn(
        `Failed to find matching item for "${originalItemName}" in event ${event.name}`,
        {
          error,
        }
      );
      // Keep the original item name if we can't find a match
    }
  }

  return updatedEvent;
}

if (import.meta.main) {
  const testEvent: AIEvent = {
    name: "Test Event",
    trigger: "level_start",
    condition: "True",
    sourceObjects: [
      { command: "give_item", args: ["convoy", "Iron Sword"] },
      { command: "give_item", args: ["convoy", "Magic Necklace"] },
    ],
  };

  processEventItems(testEvent).then((processed) => {
    console.log("Original:", testEvent);
    console.log("Processed:", processed);
  });
}

