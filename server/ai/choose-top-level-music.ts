import chooseMusic from "@/ai/choose-music.ts";
import modifyConstant from "@/game-engine-io/modify-constant.ts";

export default async function chooseTopLevelMusic({
  projectNameEndingInDotLtProj,
  gameTitle,
  gameDescription,
  tone,
}: {
  projectNameEndingInDotLtProj: string;
  gameTitle: string;
  gameDescription: string;
  tone: string;
}): Promise<string[]> {
  const promotionMusic = 'fdlan-winds';
  const [mainTheme, gameOverMusic] = await Promise.all([
    chooseMusic(`Title main theme for game. Title: ${gameTitle}. Description: ${gameDescription}. Tone: ${tone}`),
    chooseMusic(`Game Over music for game. Title: ${gameTitle}. Description: ${gameDescription}. Tone: ${tone}`),
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

