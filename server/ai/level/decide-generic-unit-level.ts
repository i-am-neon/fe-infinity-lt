import { FE8Class, PromotedFE8Classes } from "@/types/fe8-class.ts";

export default function decideGenericUnitLevel({
  chapter,
  fe8Class,
}: {
  chapter: number;
  fe8Class: FE8Class;
}): number {
  function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const isPromoted = (PromotedFE8Classes as readonly FE8Class[]).includes(
    fe8Class
  );
  console.log("isPromoted :>> ", isPromoted);
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

  return level;
}

if (import.meta.main) {
  // Example usage
  console.log(
    "Level:",
    decideGenericUnitLevel({ chapter: 12, fe8Class: "Knight" })
  );
}

