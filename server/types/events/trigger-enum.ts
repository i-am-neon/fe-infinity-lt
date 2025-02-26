import { z } from "zod";

export const TriggerEnumSchema = z.enum([
  "level_start",
  "level_end",
  "overworld_start",
  "level_select",
  "phase_change",
  "turn_change",
  "enemy_turn_change",
  "enemy2_turn_change",
  "other_turn_change",
  "on_region_interact",
  "combat_death",
  "unit_death",
  "unit_wait",
  "unit_select",
  "unit_deselect",
  "unit_level_up",
  "during_unit_level_up",
  "combat_start",
  "combat_end",
  "Seize",
  "on_talk",
  "on_support",
  "on_base_convo",
  "on_prep_start",
  "on_base_start",
  "on_title_screen",
  "on_startup",
  "time_region_complete",
  "on_overworld_node_select",
  "roam_press_start",
  "roam_press_info",
  "roam_press_aux",
  "roaming_interrupt",
  "Chest",
])
  .describe(`- \`level_start\`: This trigger fires at the very beginning of the chapter. Useful for introductory dialogue or additional level setup.
- \`level_end\`: This trigger fires at the end of the chapter. Useful for ending chapter dialogue.
- \`turn_change\`: This triggers fires right before the turn changes to the player's turn. Useful for dialogue or reinforcements.
- \`enemy_turn_change\`: This trigger fires right before the turn changes to the enemy team's turn. Useful for "same turn reinforcements" and other evil deeds.
- \`enemy2_turn_change\`: This trigger fires right before the turn changes to the enemy2 team's turn.
- \`other_turn_change\`: This trigger fires right before the turn changes to the other team's turn.
- \`unit_death\` {\`unit\`, \`position\`}: This trigger fires whenever *any* unit dies (this includes generic units). Useful for death quotes.
- \`unit_wait\` {\`unit\`, \`position\`}: This trigger fires whenever a unit waits.
- \`unit_select\` {\`unit\`, \`position\`}: This trigger fires when the player selects a unit.
- \`unit_level_up\` {\`unit\`}: This trigger fires right after a unit levels up.
- \`during_unit_level_up\` {\`unit\`, \`unit2\`}: This trigger fires when the unit levels up, right after the level up screen shows what stats have increased.
- \`combat_start\` {\`unit\`, \`unit2\`, \`item\`, \`position\`}: This trigger fires at the beginning of combat. Useful for boss fight quotes.
- \`combat_end\` {\`unit\`, \`unit2\`, \`item\`, \`position\`}: This trigger fires at the end of combat. Useful for checking win or loss conditions.
- \`on_talk\` {\`unit\`, \`unit2\`, \`position\`}: This trigger fires when two units "Talk" to one another.
- \`on_support\` {\`unit\`, \`unit2\`, \`item\`, \`position\`}: This trigger fires when two units "Support" with one another. For this trigger, \`item\` contains the nid of the support rank ('C', 'B', 'A', or 'S', for example).
- \`on_base_convo\` {\`unit\`}: This trigger fires when the player selects a base conversation to view. For this trigger, \`unit\` contains the title of the base conversation.
- \`Seize\`: This trigger fires when a unit Seizes a gate, marking the end of the chapter.
- \`Chest\`: This trigger fires when a unit opens a chest in battle.`);

export type TriggerEnum = z.infer<typeof TriggerEnumSchema>;

