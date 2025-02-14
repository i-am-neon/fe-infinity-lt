export default function decideCharacterLevel(chapter: number): {
  isPromoted: boolean;
  level: number;
} {
  function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let isPromoted = false;
  if (chapter <= 10) {
    isPromoted = false;
  } else if (chapter >= 21) {
    isPromoted = true;
  } else {
    const ratio = (chapter - 10) / (20 - 10);
    const r = Math.random();
    isPromoted = r < ratio;
  }

  let level = 1;
  if (isPromoted) {
    if (chapter <= 20) {
      level = randomInRange(1, 3);
    } else {
      level = randomInRange(3, 8);
    }
  } else {
    if (chapter <= 10) {
      level = randomInRange(1, 5);
    } else if (chapter <= 20) {
      level = randomInRange(5, 10);
    } else {
      level = randomInRange(10, 15);
    }
  }

  return { isPromoted, level };
}

if (import.meta.main) {
  // Example usage
  const testChapters = [1, 3, 5, 7, 10, 11, 15, 20, 21, 25, 30];
  for (const ch of testChapters) {
    const { isPromoted, level } = decideCharacterLevel(ch);
    console.log(`Chapter ${ch}: promoted=${isPromoted}, level=${level}`);
  }
}

