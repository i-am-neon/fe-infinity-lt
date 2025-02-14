import z from "zod";

export const WeaponTypeSchema = z.enum([
  "Sword",
  "Lance",
  "Axe",
  "Bow",
  "Staff",
  "Light",
  "Anima",
  "Dark",
]);

export type WeaponType = z.infer<typeof WeaponTypeSchema>;

export type WeaponRank = "E" | "D" | "C" | "B" | "A" | "S";
