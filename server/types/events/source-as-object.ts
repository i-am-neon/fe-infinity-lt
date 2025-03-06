import z from "zod";

export const SourceAsObjectSchema = z.object({
  command: z.enum([
    "add_portrait",
    "speak",
    "narrate",
    "give_money",
    "give_item",
    "bop_portrait",
  ]),
  args: z.array(z.string()),
}).describe(`## add_portrait
Adds a portrait to the screen. A portrait must be added before it can speak.
Required args: character firstName, screen position (one of: "OffscreenLeft", "FarLeft", "Left", "MidLeft", "MidRight", "Right", "FarRight", "OffscreenRight".
- IMPORTANT: no two characters may occupy the same screen position!)
- Use OffscreenLeft or OffscreenRight to have the character not visible on the screen, but their text bubble pointing in their direction. If you want a character to speak offscreen, use one of these positions. In this situation you don't need to add "(from offscreen)" or the like to the character's speaking text.

## speak
Causes the *Speaker* to speak some *Text*.

Required args: Speaker (character firstName), Text (string)

## narrate
Causes the narrator to speak some text. This will appear in a text box in the center of the screen. There should not be two narrate commands in a row. In this case just use one narrate command with the combined text.

Required args: Text (string)

## give_money
Gives the player some money. This should be in line with Fire Emblem 8 gold amounts. For example, 1000 gold is a reasonable amount to give the player in the early game.

Required args: Amount (number)

## give_item
Gives the player an item. The item must be from Fire Emblem 8.

Required args: 'convoy' (should always be 'convoy'), Item Name (string)

## bop_portrait
Causes a portrait to briefly bob up and down. Often used to illustrate a surprised or shocked reaction.

Required args: character firstName (string)
`);

export type SourceAsObject = z.infer<typeof SourceAsObjectSchema>;

