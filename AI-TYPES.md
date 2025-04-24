# AI Types in Lex Talionis

This document describes the behavior of different AI types in the Lex Talionis Fire Emblem engine. Enemy units are assigned these AI types to determine how they behave during enemy phases.

## Basic AI Types

### None
- No action targeting
- Used for player units that are controlled by the player directly

### Pursue
- Aggressively hunts down enemy units across the map
- Will attack enemies within a view range of -4 (very aggressive)
- Highest pursuit range of the standard AI types

### Attack
- Will move and attack enemies within a view range of -3
- If the unit can move and attack this turn or the next, it will do so
- More aggressive than Defend, less aggressive than Pursue

### Defend
- Only attacks enemies that come within its view range of -2
- Will return to its starting position if no enemies are in range
- Maintains position unless enemies come within range

### Guard
- Will not move from its position
- Will attack enemies that come within its attack range (-1)
- Stationary defense - despite showing stationary range in UI, Guard units may still charge when enough units are in the same AI Group

## Specialized AI Types

### AttackTile
- Attacks enemies within view range -2
- Specifically targets units with the "Tile" tag within a wider view range (-4)
- Used for units that should prioritize destroying breakable tiles/objects

### PursueVillage
- Attacks enemies within view range -2
- Will interact with "Destructible" events (villages, homes)
- Used for enemy units that raid villages

### FollowBoss
- Attacks enemies within view range -2
- Will move toward allies with the "Boss" tag
- Used for minions that should stay close to their leader

### FollowWagon
- Attacks enemies within view range -2
- Will move toward allies with the "Wagon" class
- Used for escort missions or protecting supply wagons

### Berserk
- Aggressively attacks enemies within view range -4
- Doesn't have any secondary behaviors
- Used for confused or berserk units that simply attack

### Heal
- Prioritizes supporting allies within view range -3
- Will move away from enemies within view range -3
- Used for healer units to keep them safe while healing allies

### Thief
- Will steal from enemies within view range -2
- Will interact with "Door" and "Chest" events
- Full-featured thief behavior to unlock doors and loot chests

### SimpleThief
- Will steal from enemies within view range -2
- Will attack "Door" targets
- Simplified thief behavior without chest targeting

### Seize
- Will interact with "Enemy_Seize" events 
- Will attack enemies within view range -2
- Used for enemy commanders trying to seize objectives

### JoshuaDefend
- Will attack any enemies EXCEPT "Natasha" within view range -2
- Will return to starting position when not engaged
- Special case AI for character interactions

## AI Groups and Advanced Behavior

Enemy units can be assigned to AI Groups, which allows them to coordinate their attacks. When enough units in the same group could potentially attack your army (equal to the threshold set for that group), they will all charge at once, even if they have "Guard" AI type.

Note that this behavior means that even enemies displaying stationary range indicators may still charge under certain conditions, particularly when many units share the same AI Group. 