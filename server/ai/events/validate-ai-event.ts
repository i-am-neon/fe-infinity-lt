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

  // Track whether each character has spoken since being added
  const hasSpokeAfterAddition: Record<string, boolean> = {};
  // Track character first appearance and last removal indices
  const firstAddIndex: Record<string, number> = {};
  const lastRemoveIndex: Record<string, number> = {};
  // Track re-additions after removal
  const readdedAfterRemoval: Record<string, boolean> = {};

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

      // Track first addition
      if (firstAddIndex[portraitName] === undefined) {
        firstAddIndex[portraitName] = i;
        hasSpokeAfterAddition[portraitName] = false;
      } else if (lastRemoveIndex[portraitName] !== undefined) {
        // Character is being re-added after removal
        readdedAfterRemoval[portraitName] = true;
      }

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
      lastRemoveIndex[portraitName] = i;

      // Check if character was removed without speaking
      if (
        firstAddIndex[portraitName] !== undefined &&
        !hasSpokeAfterAddition[portraitName]
      ) {
        // This is a warning, not an error that breaks validation
        errors.push(
          `Character '${portraitName}' had portrait added at index ${firstAddIndex[portraitName]} but was removed at index ${i} without speaking.`
        );
      }
    } else if (
      obj.command === "speak" &&
      Array.isArray(obj.args) &&
      obj.args.length > 0
    ) {
      // Clean the speaker name for comparison
      const rawSpeaker = obj.args[0];
      const speakerName = rawSpeaker.replace(/\(.*?\)/g, "").trim();

      // Mark that this character has spoken
      hasSpokeAfterAddition[speakerName] = true;

      // Check if the character has been added at all
      if (!addedCharacters.has(speakerName)) {
        errors.push(
          `Speaker '${rawSpeaker}' does not have a prior add_portrait command.`
        );
      }
      // Check if the character is currently visible
      else if (!visibleCharacters.has(speakerName)) {
        errors.push(
          `Speaker '${rawSpeaker}' speaks after their portrait was removed.`
        );
      }
    }
  }

  // Check for characters who were added at the beginning, removed without speaking,
  // and then re-added later - sign of poor narrative flow
  for (const character of Object.keys(firstAddIndex)) {
    if (
      readdedAfterRemoval[character] &&
      lastRemoveIndex[character] !== undefined &&
      firstAddIndex[character] < 10 // Only flag if added in first 10 commands
    ) {
      errors.push(
        `Narrative flow issue: Character '${character}' was added at the beginning (index ${firstAddIndex[character]}), removed without speaking, then re-added later. Characters should only be added when they enter the scene.`
      );
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

