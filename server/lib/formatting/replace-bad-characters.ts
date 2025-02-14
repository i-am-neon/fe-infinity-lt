export default function replaceBadCharacters(input: string): string {
  return input.replace(/—/g, "-");
}

