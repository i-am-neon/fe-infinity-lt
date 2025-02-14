import { z } from "zod";
import { TriggerEnumSchema } from "@/types/events/trigger-enum.ts";
import { SourceAsObjectSchema } from "@/types/events/source-as-object.ts";

export const AIEventSchema = z.object({
  name: z
    .string()
    .describe(
      'short, unique event name ex: "Death Eirika", "Defeat Boss", "Intro"'
    ),
  trigger: TriggerEnumSchema,
  condition: z.string().describe(`Common conditions:
- Check if the unit referenced by the event is a specific unit: "unit.nid == 'Eirika'"
- Check if the region referenced by the event is a specific region: "region.nid == 'House1'"
- Check if a unit is alive: "game.check_alive(unit.nid)" or "game.check_alive('Eirika')"
- Check if a unit is dead: "game.check_dead(unit.nid)" or "game.check_dead('Eirika')"
- Check the team of a unit: "unit.team == 'player'" or "game.get_unit('Eirika').team == 'player'"
- Check the current turn number: "game.turncount == 5" or "game.turncount < 10"
- Check nid of terrain at a position: "game.tilemap.get_terrain(position)"
- Check name of terrain at a position: "DB.terrain.get(game.tilemap.get_terrain(position)).name"
- Check the current mode: "game.mode.nid == 'Lunatic'"
- Check the current level: "game.level.nid == 'Chapter 2'"`),
  // NOTE: for now not using this because intro and outro events have onlyOnce as false. Should use in creating events in between the intro and outro.
  //   onlyOnce: z.boolean().describe(
  //     `If true, the event will only trigger once.
  // It is only true for events like:
  // - visiting villages
  // - barbarians destroying villages
  // - recruiting characters
  // - any time a character speaks mid-battle (recruiting characters, if the boss or another character says something at the beginning of a certain turn, boss fight quote)

  // The rest of the events are false.`
  //   ),
  sourceAsObject: SourceAsObjectSchema.array(),
});

export type AIEvent = z.infer<typeof AIEventSchema>;

