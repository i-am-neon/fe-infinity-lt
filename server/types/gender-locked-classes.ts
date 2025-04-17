import { FE8Class } from "@/types/fe8-class.ts";

export const MaleOnlyClasses: FE8Class[] = [
  "Fighter",
  "Warrior",
  "Brigand",
  "Pirate",
  "Berserker",
  "Journeyman",
];

export const FemaleOnlyClasses: FE8Class[] = [
  "Pegasus Knight",
  "Falcoknight",
  "Troubadour",
  "Valkyrie",
  "Recruit"
];

// Function to check if a class is valid for a given gender
export function isClassValidForGender(
  className: FE8Class,
  gender: "male" | "female"
): boolean {
  if (gender === "male" && FemaleOnlyClasses.includes(className)) {
    return false;
  }
  if (gender === "female" && MaleOnlyClasses.includes(className)) {
    return false;
  }
  return true;
}

if (import.meta.main) {
  console.log("Male-only classes:", MaleOnlyClasses);
  console.log("Female-only classes:", FemaleOnlyClasses);
  console.log("Is Fighter valid for female?", isClassValidForGender("Fighter", "female"));
  console.log("Is Pegasus Knight valid for male?", isClassValidForGender("Pegasus Knight", "male"));
}