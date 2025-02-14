import { ClassOption } from "../get-all-class-options.ts";

export function availableClasses(classOptions: ClassOption[]) {
  return `## Available classes

When choosing classes, consider the Chapter Idea. For example, if this chapter's story is about a pirate raid, you might want to include classes like Pirates, Fighters, and Brigands. If it's a chapter about a dark mage with a band of wyverns, you might want to include Shamans, Mages, Wyvern Riders, etc.

At your disposal are the following available classes:
${JSON.stringify(classOptions, null, 2)}

When choosing the class, you must exactly match the class name from the list above. For example, you may not use "Peg. Knight", you must use the full provided class name "Pegasus Knight".`;
}

