import z from "zod";

export const SourceAsObjectSchema = z.object({
  command: z.enum(["music"]).describe(`## Music
Required arg: "Music"
Optional arg: "FadeIn" (how long in ms to fade in the current music)
Notes:
Fades in *Music* over the course of *FadeIn* milliseconds. Fade in defaults to 400 milliseconds.`),
  args: z.array(z.string()),
});

export type SourceAsObject = z.infer<typeof SourceAsObjectSchema>;

