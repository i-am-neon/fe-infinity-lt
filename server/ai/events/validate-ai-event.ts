export type AiEventValidationResult = {
  isValid: boolean;
  errors: string[];
};

/**
 * Validates that every character who speaks in the AIEvent has an add_portrait command beforehand.
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
    } else if (
      obj.command === "speak" &&
      Array.isArray(obj.args) &&
      obj.args.length > 0
    ) {
      // Clean the speaker name for comparison
      const rawSpeaker = obj.args[0];
      const speakerName = rawSpeaker.replace(/\(.*?\)/g, "").trim();
      if (!addedCharacters.has(speakerName)) {
        return {
          isValid: false,
          errors: [
            `Speaker '${rawSpeaker}' does not have a prior add_portrait command.`,
          ],
        };
      }
    }
  }

  return { isValid: true, errors: [] };
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

