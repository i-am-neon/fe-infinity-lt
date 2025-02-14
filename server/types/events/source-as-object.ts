import z from "zod";

export const SourceAsObjectSchema = z.object({
  command: z.enum(["add_portrait", "speak", "narrate"]),
  args: z.array(z.string()),
}).describe(`## add_portrait
Adds a portrait to the screen. A portrait must be added before it can speak.
Required args: character firstName, screen position (one of: "OffscreenLeft", "FarLeft", "Left", "MidLeft", "MidRight", "Right", "FarRight", "OffscreenRight". IMPORTANT: no two characters may occupy the same screen position!)

## speak
Causes the *Speaker* to speak some *Text*.

Required args: Speaker (character firstName), Text (string)

## narrate
Causes the narrator to speak some text. This will appear in a text box in the center of the screen. There should not be two narrate commands in a row. In this case just use one narrate command with the combined text.

Required args: Text (string)`);

export type SourceAsObject = z.infer<typeof SourceAsObjectSchema>;

