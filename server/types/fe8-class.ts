import { z } from "zod";

export const UnpromotedFE8Classes = [
  "Citizen",
  "Dancer",
  "Myrmidon",
  "Mercenary",
  "Thief",
  "Rogue",
  "Recruit",
  "Soldier",
  "Cavalier",
  "Pegasus Knight",
  "Journeyman",
  "Fighter",
  "Warrior",
  "Pirate",
  "Brigand",
  "Archer",
  "Ranger",
  "Monk",
  "Cleric",
  "Mage",
  "Shaman",
  "Troubadour",
  "Valkyrie",
  "Wyvern Rider",
  "Revenant",
  "Entombed",
  "Sword Wight",
  "Bow Wight",
  "Mogall",
  "Wall",
  "Snag",
] as const;

export const PromotedFE8Classes = [
  "Swordmaster",
  "Hero",
  "Assassin",
  "Paladin",
  "Great Knight",
  "Falcoknight",
  "Knight",
  "General",
  "Berserker",
  "Sniper",
  "Bishop",
  "Sage",
  "Mage Knight",
  "Wyvern Lord",
  "Wyvern Knight",
  "Necromancer",
  "Sword Bonewalker",
  "Bow Bonewalker",
  "Arch Mogall",
] as const;

export type UnpromotedFE8Class = (typeof UnpromotedFE8Classes)[number];
export type PromotedFE8Class = (typeof PromotedFE8Classes)[number];

const FE8ClassesArray = [
  ...UnpromotedFE8Classes,
  ...PromotedFE8Classes,
] as const;

export const FE8ClassSchema = z.enum(FE8ClassesArray);
export type FE8Class = z.infer<typeof FE8ClassSchema>;

export const unpromotedClassDescriptions = `### Citizen
A non-combatant civilian with no combat abilities.

### Dancer
A support unit that can refresh an ally’s turn by dancing.

### Myrmidon
A swift sword-wielding unit with high critical hit rates.

### Mercenary
A balanced swordfighter with solid stats in both offense and defense.

### Thief
A nimble unit capable of picking locks and stealing items.

### Rogue
An advanced thief with better combat abilities and the ability to pick locks without keys.

### Recruit
A trainee soldier with limited abilities, usually promoting into a stronger class.

### Soldier
A lance-wielding foot unit with mediocre stats and limited promotion options.

### Cavalier
A mounted unit with balanced stats and the ability to use swords and lances.

### Pegasus Knight
A flying unit with high mobility and resistance but low defense.

### Journeyman
A young axe-wielding trainee who later grows into a stronger class.

### Fighter
A strong but slow axe user with high HP and strength.

### Warrior
A powerful axe-wielding unit with access to bows upon promotion.

### Pirate
An axe-wielding unit that can move over water terrain.

### Brigand
A rugged axe-wielding bandit with high movement in rough terrain.

### Archer
A ranged unit that specializes in bows but has no melee options.

### Ranger
A mounted unit that specializes in bows and swords, offering strong mobility.

### Monk
A light magic user with high resistance and strong attacks against dark magic.

### Cleric
A staff-using healer who restores allies’ HP but lacks offensive capabilities.

### Mage
A spellcaster proficient in anima magic, excelling in offense.

### Shaman
A dark magic user with slow but powerful spells.

### Troubadour
A mounted healer who uses staffs to support allies.

### Valkyrie
A promoted troubadour with access to light magic and staves.

### Wyvern Rider
A powerful flying unit with high strength and defense but low resistance.

### Revenant
A weak, slow-moving monster that attacks with claws.

### Entombed
A stronger version of the Revenant, with higher stats.

### Sword Wight
An undead warrior that wields swords with high skill.

### Bow Wight
An undead archer with long-range attacks.

### Mogall
A floating, dark magic-using monster with high resistance.`;

export const promotedClassDescriptions = `### Swordmaster
An expert swordsman with high critical hit rates and exceptional speed.

### Hero
A balanced and strong warrior with access to swords and axes.

### Assassin
A stealthy killer with a chance to perform instant-kill attacks.

### Paladin
A highly mobile mounted warrior with strong stats and access to multiple weapon types.

### Great Knight
A heavily armored mounted knight with high defense and access to three weapon types.

### Falcoknight
A promoted Pegasus Knight with better stats and the ability to use swords and lances.

### Knight
A heavily armored foot soldier with strong defense but low mobility.

### General
A promoted knight with even higher defense and the ability to wield multiple weapons.

### Berserker
A high-crit axe-wielding warrior that excels in dealing massive damage.

### Sniper
A highly accurate and powerful archer with extended range.

### Bishop
A promoted Cleric or Monk that excels in light magic and healing.

### Sage
A powerful magic user proficient in anima magic and staves.

### Mage Knight
A mounted mage with strong magic and mobility.

### Wyvern Lord
A promoted Wyvern Rider with immense strength and durability.

### Wyvern Knight
A faster and more agile version of the Wyvern Lord with a piercing attack ability.

### Necromancer
A dark magic user capable of summoning phantom units.

### Sword Bonewalker
An undead skeleton warrior that wields swords with high skill.

### Bow Bonewalker
An undead skeleton archer that specializes in ranged combat.

### Arch Mogall
A floating, dark magic-using monster with high resistance.`;

