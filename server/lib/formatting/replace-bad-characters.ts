export default function replaceBadCharacters(input: string): string {
  const replacements: { [key: string]: string } = {
    "—": "-",
    "’": "'",
    "‘": "'",
    ";": ":",
    "…": "..."
  };

  let result = input;
  for (const [badChar, replacement] of Object.entries(replacements)) {
    result = result.split(badChar).join(replacement);
  }

  return result;
}

if (import.meta.main) {
  console.log(replaceBadCharacters("’Hello—world;…"));
}

