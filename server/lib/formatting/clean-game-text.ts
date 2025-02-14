import replaceBadCharacters from "@/lib/formatting/replace-bad-characters.ts";
import breakTextIntoGameLines from "@/lib/formatting/break-text-into-game-lines.ts";

export default function cleanGameText(text: string): string {
  return breakTextIntoGameLines(replaceBadCharacters(text));
}

