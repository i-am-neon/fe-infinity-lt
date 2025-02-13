/**
 * Splits a string into segments of `chunkSize` words, separated by "|".
 */
export default function breakTextIntoGameLines(
  text: string,
  chunkSize = 15
): string {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks.join("|");
}

if (import.meta.main) {
  const demoText =
    "In the heart of Elaria, a land ravaged by the mysterious Blight, the Kingdom of Morneth stands on the brink of collapse. Amidst the desolation of Graymoor Plains and the fading hope of Eldoria, Sir Calen Alden, a noble-hearted knight, embarks on a perilous journey. Haunted by loss and driven by duty, Calen seeks a cure rumored to dwell in the depths of the Obsidian Mines or within the ancient tomes of Verdant Vale. Joined by Elara Venth, a curious scholar, and Marek Thorn, a cynical ex-miner, the trio navigates a world steeped in secrets and shadows, where every step could lead to salvation or ruin.";
  console.log(breakTextIntoGameLines(demoText));
}

