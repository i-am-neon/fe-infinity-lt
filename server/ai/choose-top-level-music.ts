import chooseMusic from "@/ai/choose-music.ts";
import modifyConstant from "@/game-engine-io/modify-constant.ts";

export default async function chooseTopLevelMusic({
  projectNameEndingInDotLtProj,
  gameDescription,
  tone,
}: {
  projectNameEndingInDotLtProj: string;
  gameDescription: string;
  tone: string;
}): Promise<string[]> {
  const [mainTheme, promotionMusic, gameOverMusic] = await Promise.all([
    chooseMusic(
      `Main Game Theme for Game Description: ${gameDescription} Tone: ${tone}`
    ),
    chooseMusic(
      `Promotion Music for Game Description: ${gameDescription} Tone: ${tone}`
    ),
    chooseMusic(
      `Game Over Music for Game Description: ${gameDescription} Tone: ${tone}`
    ),
  ]);
  await modifyConstant({
    projectNameEndingInDotLtProj,
    key: "music_main",
    newValue: mainTheme,
  });
  await modifyConstant({
    projectNameEndingInDotLtProj,
    key: "music_promotion",
    newValue: promotionMusic,
  });
  await modifyConstant({
    projectNameEndingInDotLtProj,
    key: "music_game_over",
    newValue: gameOverMusic,
  });

  return [mainTheme, promotionMusic, gameOverMusic];
}

