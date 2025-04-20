export type AiEventValidationResult = {
  isValid: boolean;
  errors: string[];
};

/**
 * Validates that every character who speaks in the AIEvent has an add_portrait command beforehand.
 * Also validates that no more than 6 portraits are visible at once.
 * Ignores LLM-based checks. This is purely algorithmic.
 */
export function validateAiEventPortraits(
  // deno-lint-ignore no-explicit-any
  aiEventCandidate: any
): AiEventValidationResult {
  if (!aiEventCandidate || !aiEventCandidate.sourceObjects) {
    return { isValid: true, errors: [] };
  }

  const { sourceObjects } = aiEventCandidate;
  if (!Array.isArray(sourceObjects)) {
    return { isValid: true, errors: [] };
  }

  const addedCharacters = new Set<string>();
  const visibleCharacters = new Set<string>();
  const errors: string[] = [];

  for (let i = 0; i < sourceObjects.length; i++) {
    const obj = sourceObjects[i];
    if (
      obj.command === "add_portrait" &&
      Array.isArray(obj.args) &&
      obj.args.length > 0
    ) {
      // Always store the "cleaned" speaker name
      const portraitName = obj.args[0].replace(/\(.*?\)/g, "").trim();
      addedCharacters.add(portraitName);
      visibleCharacters.add(portraitName);

      // Check if we exceed 6 visible portraits
      if (visibleCharacters.size > 6) {
        errors.push(
          `Too many visible portraits (${visibleCharacters.size}) at command index ${i}. Use remove_portrait before adding new portraits.`
        );
      }
    } else if (
      obj.command === "remove_portrait" &&
      Array.isArray(obj.args) &&
      obj.args.length > 0
    ) {
      const portraitName = obj.args[0].replace(/\(.*?\)/g, "").trim();
      visibleCharacters.delete(portraitName);
    } else if (
      obj.command === "speak" &&
      Array.isArray(obj.args) &&
      obj.args.length > 0
    ) {
      // Clean the speaker name for comparison
      const rawSpeaker = obj.args[0];
      const speakerName = rawSpeaker.replace(/\(.*?\)/g, "").trim();
      if (!addedCharacters.has(speakerName)) {
        errors.push(
          `Speaker '${rawSpeaker}' does not have a prior add_portrait command.`
        );
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

if (import.meta.main) {
  const testEvent = {
    sourceObjects: [
      { command: "add_portrait", args: ["John"] },
      { command: "speak", args: ["John", "Hello!"] },
      { command: "speak", args: ["Jane", "Hi!"] },
    ],
  };
  console.log(validateAiEventPortraits(testEvent));
  // { isValid: false, errors: [ "Speaker 'Jane' does not have a prior add_portrait command." ]
}

