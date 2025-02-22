import { z } from "zod";

export const AffinitySchema = z
  .enum(["Anima", "Dark", "Fire", "Ice", "Light", "Thunder", "Wind"])
  .describe(
    'Must be one of these and not anything else: "Anima", "Dark", "Fire", "Ice", "Light", "Thunder", "Wind"'
  );

export type Affinity = z.infer<typeof AffinitySchema>;

