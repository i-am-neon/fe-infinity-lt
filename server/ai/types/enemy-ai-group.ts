import { z } from "zod";

export const EnemyAIGroupSchema = z.enum([
  "None",
  "Attack",
  "Pursue",
  "Defend",
  "Guard",
  "AttackTile",
  "PursueVillage",
  "FollowBoss",
  "FollowWagon",
  "Berserk",
  "Heal",
  "Thief",
  "SimpleThief",
  "Seize",
]).describe(`
Defines different enemy AI behavior groups:

- None: Does not take any action.
- Attack: Attacks any enemy within range.
- Pursue: Pursues and attacks enemies aggressively.
- Defend: Attacks enemies while holding a defensive position.
- Guard: Guards a location and attacks approaching enemies.
- AttackTile: Prioritizes attacking enemies on specific tiles.
- PursueVillage: Pursues villages and interacts with destructible objects.
- FollowBoss: Follows the boss unit while attacking enemies.
- FollowWagon: Follows a wagon unit while attacking enemies.
- Berserk: Attacks any unit within range indiscriminately.
- Heal: Prioritizes healing allies and avoids enemies.
- Thief: Steals from enemies and interacts with doors and chests.
- SimpleThief: Steals from enemies and opens doors.
- Seize: Interacts with seize objectives and attacks enemies.
`);

export type EnemyAIGroup = z.infer<typeof EnemyAIGroupSchema>;

