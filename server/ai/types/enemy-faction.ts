import { z } from "zod";

export const EnemyFactionSchema = z
  .object({
    nid: z
      .string()
      .describe(
        "a string that matches the faction name, but without spaces or special characters"
      ),
    name: z
      .string()
      .describe(
        "must thematically match or reference the chapter. Should be singular not plural (ex 'Soldier' instead of 'Soldiers', etc)."
      ),
    desc: z
      .string()
      .describe("a short one-liner describing their purpose or flavor"),
    icon_nid: z
      .string()
      .describe(
        "choose from [BanditEmblem, BlankEmblem, ConfederacyEmblem, EmpireEmblem, KnightEmblem, MonsterEmblem, NeutralEmblem, ResistanceEmblem, TemplarEmblem]"
      ),
  })
  .describe(
    "The enemy faction for this chapter. The name should thematically match the chapter. The nid should be the name without spaces or special characters. The desc is a short sentence describing them. The icon_nid must be one of [BanditEmblem, BlankEmblem, ConfederacyEmblem, EmpireEmblem, KnightEmblem, MonsterEmblem, NeutralEmblem, ResistanceEmblem, TemplarEmblem]."
  );

export type EnemyFaction = z.infer<typeof EnemyFactionSchema>;

