import { EnemyComposition } from "@/ai/types/enemy-composition.ts";

export function unpromotedVsPromotedUnits(enemyComposition: EnemyComposition) {
  return `## Unpromoted vs Promoted units
  
  You will be provided the percentage of unpromoted and promoted enemy units in the upcoming battle. This should map to the number of unpromoted and promoted unit classes you decide to use in the squad.
  
  If either percentage is 0, you should not include any of those kinds of units in the squad. For example if the enemy composition is 100% unpromoted units, you should never use promoted units like Paladins, Generals, Snipers etc.
  
  Here is the enemy composition percentages:
  ${JSON.stringify(enemyComposition, null, 2)}`;
}

