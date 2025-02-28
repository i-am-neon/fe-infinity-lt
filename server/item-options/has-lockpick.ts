/**
 * Checks if the array of starting items contains a lockpick
 * @param items Array of [itemNid, isDroppable] tuples
 * @returns Boolean indicating whether a lockpick is present
 */
export default function hasLockpick(items: [string, boolean][]): boolean {
  return items.some(([itemNid]) => itemNid === "Lockpick");
}

if (import.meta.main) {
  // Example usage
  const withLockpick: [string, boolean][] = [
    ["Iron_Sword", false],
    ["Lockpick", false],
    ["Vulnerary", false],
  ];
  
  const withoutLockpick: [string, boolean][] = [
    ["Iron_Sword", false],
    ["Vulnerary", false],
  ];
  
  console.log("Has lockpick:", hasLockpick(withLockpick)); // true
  console.log("Has lockpick:", hasLockpick(withoutLockpick)); // false
}