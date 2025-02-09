import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { getPathWithinServer } from "@/file-io/get-path-within-server.ts";
export interface AutoFrameResult {
  blinkingOffset: [number, number];
  smilingOffset: [number, number];
}

/**
 * Replicates the Python auto_frame_portrait logic:
 * - image must be 128x112.
 * - main frame: (0,0)->(96,80)
 * - blink frame: (96,48)->(32,16)
 * - mouth frame: (96,80)->(32,16)
 * We scan the main frame in increments of 8 for sub-frames of 32x16 and
 * measure similarity via XOR (as BigInt).
 */
export default async function autoFramePortrait(
  filePath: string
): Promise<AutoFrameResult> {
  const data = await Deno.readFile(filePath);
  const image = await Image.decode(data);

  if (image.width !== 128 || image.height !== 112) {
    throw new Error(
      `Image must be 128x112, but received ${image.width}x${image.height}`
    );
  }

  const mainFrame = image.clone().crop(0, 0, 96, 80);
  const blinkFrame = image.clone().crop(96, 48, 32, 16);
  const mouthFrame = image.clone().crop(96, 80, 32, 16);

  function testSimilarity(imgA: Image, imgB: Image): bigint {
    let diff = 0n;
    for (let xLocal = 0; xLocal < 32; xLocal++) {
      for (let yLocal = 0; yLocal < 16; yLocal++) {
        // getPixelAt is 1-based in imagescript
        const colA = imgA.getPixelAt(xLocal + 1, yLocal + 1) >>> 0;
        const colB = imgB.getPixelAt(xLocal + 1, yLocal + 1) >>> 0;
        // XOR 32-bit, then convert to BigInt before summation
        const xorVal = BigInt((colA ^ colB) >>> 0);
        diff += xorVal;
      }
    }
    return diff;
  }

  // We'll store best similarities as BigInt. Use an arbitrarily large initial value.
  const MAX_SAFE_BIGINT = BigInt(Number.MAX_SAFE_INTEGER);
  let bestBlinkSimilarity = MAX_SAFE_BIGINT;
  let bestMouthSimilarity = MAX_SAFE_BIGINT;
  let bestBlinkPos: [number, number] = [0, 0];
  let bestMouthPos: [number, number] = [0, 0];

  for (let x = 0; x <= 64; x += 8) {
    for (let y = 0; y <= 64; y += 8) {
      const subFrame = mainFrame.clone().crop(x, y, 32, 16);
      const blinkSim = testSimilarity(blinkFrame, subFrame);
      const mouthSim = testSimilarity(mouthFrame, subFrame);

      if (blinkSim < bestBlinkSimilarity) {
        bestBlinkSimilarity = blinkSim;
        bestBlinkPos = [x, y];
      }
      if (mouthSim < bestMouthSimilarity) {
        bestMouthSimilarity = mouthSim;
        bestMouthPos = [x, y];
      }
    }
  }

  return {
    blinkingOffset: bestBlinkPos,
    smilingOffset: bestMouthPos,
  };
}
if (import.meta.main) {
  const result = await autoFramePortrait(
    getPathWithinServer("assets/test/portraitGarcia.png")
  );
  console.log("Final result:", result);
}

