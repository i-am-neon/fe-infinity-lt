import { GridProps } from "../types/grid-props";
import { TerrainType } from "../types/terrain-type";
import {
    AirVent,
    Anchor,
    Axe,
    Bomb,
    BookOpen,
    Box,
    Command,
    Cross,
    Crown,
    DiamondMinus,
    Disc,
    Dog,
    Eye,
    Feather,
    Flame,
    Ghost,
    Key,
    Leaf,
    LucideIcon,
    Moon,
    Mountain,
    Music,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Skull,
    Square,
    Sun,
    Swords,
    Tag,
    Target,
    User,
    Wand,
    Wrench,
} from "lucide-react";
import React, { useState } from "react";

const classIconMap: Record<string, LucideIcon> = {
    Citizen: Crown,
    Dancer: Music,
    Myrmidon: Swords,
    Swordmaster: Swords,
    Mercenary: Swords,
    Hero: Swords,
    Thief: Key,
    Assassin: Skull,
    Rogue: DiamondMinus,
    Recruit: Tag,
    Soldier: Command,
    Cavalier: Dog,
    Paladin: ShieldCheck,
    "Great Knight": ShieldAlert,
    "Pegasus Knight": Feather,
    Falcoknight: Feather,
    Knight: Shield,
    General: ShieldCheck,
    Journeyman: Wrench,
    Fighter: Axe,
    Warrior: Axe,
    Pirate: Anchor,
    Berserker: Bomb,
    Brigand: Bomb,
    Archer: Target,
    Sniper: Target,
    Ranger: Mountain,
    Monk: Leaf,
    Cleric: Cross,
    Bishop: BookOpen,
    Mage: Flame,
    Sage: Sun,
    Shaman: Moon,
    "Mage Knight": Wand,
    Troubadour: Wand,
    Valkyrie: Ghost,
    "Wyvern Rider": AirVent,
    "Wyvern Lord": AirVent,
    "Wyvern Knight": AirVent,
    Necromancer: Skull,
    Revenant: Eye,
    Entombed: Ghost,
    "Sword Bonewalker": Swords,
    "Sword Wight": Swords,
    "Bow Bonewalker": Disc,
    "Bow Wight": Disc,
    Mogall: Eye,
    "Arch Mogall": Eye,
    Wall: Square,
    Snag: Box,
};

function getIconForUnit(unit: {
    class?: string;
    isBoss?: boolean;
    isPlayer?: boolean;
}): LucideIcon {
    if (unit.isBoss) {
        return Crown;
    }
    if (unit.isPlayer) {
        return User;
    }
    if (unit.class && classIconMap[unit.class]) {
        return classIconMap[unit.class];
    }
    return DiamondMinus;
}

export default function TerrainGridComponent({
    terrainGrid,
    units = [],
}: GridProps) {
    const [hoverCoords, setHoverCoords] = useState<{
        x: number;
        y: number;
    } | null>(null);

    function colorForTerrain(terrain: TerrainType) {
        switch (terrain) {
            case "Wall":
                return "bg-gray-700";
            case "Plain":
                return "bg-green-300";
            case "Forest":
                return "bg-green-700";
            case "Thicket":
                return "bg-green-800";
            case "Bridge":
                return "bg-yellow-400";
            case "Stairs":
                return "bg-gray-300";
            case "Floor":
                return "bg-gray-200";
            case "Road":
                return "bg-stone-500";
            case "Pillar":
                return "bg-slate-600";
            case "Lake":
                return "bg-blue-300";
            case "Sea":
                return "bg-blue-800";
            case "River":
                return "bg-blue-400";
            case "Hill":
                return "bg-green-500";
            case "Mountain":
                return "bg-gray-400";
            case "Cliff":
                return "bg-gray-300";
            case "Barrel":
                return "bg-yellow-800";
            case "House":
                return "bg-red-600";
            case "Fort":
                return "bg-red-700";
            case "Gate":
                return "bg-red-800";
            case "Armory":
                return "bg-purple-800";
            case "Vendor":
                return "bg-orange-400";
            case "Village":
                return "bg-purple-400";
            case "Chest":
                return "bg-yellow-400";
            case "Door":
                return "bg-yellow-700";
            case "Throne":
                return "bg-purple-600";
            default:
                return "bg-white";
        }
    }

    function getUnitBackgroundClass(unit: {
        isBoss?: boolean;
        isPlayer?: boolean;
        isGreen?: boolean;
    }): string {
        if (unit.isBoss) {
            return "bg-purple-500";
        } else if (unit.isPlayer) {
            return "bg-blue-500";
        } else if (unit.isGreen) {
            return "bg-green-500";
        } else {
            return "bg-red-500";
        }
    }

    const coords = Object.keys(terrainGrid).map((key) => {
        const [xStr, yStr] = key.split(",");
        return {
            x: parseInt(xStr, 10),
            y: parseInt(yStr, 10),
            terrain: terrainGrid[key],
        };
    });

    const maxX = Math.max(...coords.map((c) => c.x));
    const maxY = Math.max(...coords.map((c) => c.y));
    const rowArrays: { x: number; y: number; terrain: TerrainType }[][] = [];

    for (let y = 0; y <= maxY; y++) {
        const row: { x: number; y: number; terrain: TerrainType }[] = [];
        for (let x = 0; x <= maxX; x++) {
            const terrain = terrainGrid[`${x},${y}`] || "Plain";
            row.push({ x, y, terrain });
        }
        rowArrays.push(row);
    }

    return (
        <div className="relative mt-10">
            {hoverCoords && (
                <div className="absolute -top-10 left-0 bg-black/70 text-white px-3 py-2 rounded shadow-md z-10">
                    <strong>Position:</strong> ({hoverCoords.x}, {hoverCoords.y}) |
                    <strong> Terrain:</strong> {terrainGrid[`${hoverCoords.x},${hoverCoords.y}`]}
                    {units.find(u => u.x === hoverCoords.x && u.y === hoverCoords.y) && (
                        <span> | <strong>Unit:</strong> {
                            units.find(u => u.x === hoverCoords.x && u.y === hoverCoords.y)?.class ||
                            (units.find(u => u.x === hoverCoords.x && u.y === hoverCoords.y)?.isBoss ? "Boss" :
                                units.find(u => u.x === hoverCoords.x && u.y === hoverCoords.y)?.isPlayer ? "Player" :
                                    units.find(u => u.x === hoverCoords.x && u.y === hoverCoords.y)?.isGreen ? "Ally" : "Enemy")
                        }</span>
                    )}
                </div>
            )}
            <div className="flex flex-col gap-1">
                {rowArrays.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1">
                        {row.map((cell) => {
                            const unitHere = units.find(
                                (u) => u.x === cell.x && u.y === cell.y
                            );
                            return (
                                <div
                                    key={`${cell.x}-${cell.y}`}
                                    onMouseEnter={() => setHoverCoords({ x: cell.x, y: cell.y })}
                                    onMouseLeave={() => setHoverCoords(null)}
                                    className={`${colorForTerrain(
                                        cell.terrain
                                    )} relative h-12 w-12 hover:ring-2 hover:ring-yellow-400 hover:ring-offset-1 transition-all duration-75`}
                                >
                                    <div className="absolute top-0 w-full text-center text-xs text-white">
                                        {cell.terrain}
                                    </div>
                                    {unitHere && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <div
                                                className={
                                                    "h-8 w-8 rounded-full flex items-center justify-center " +
                                                    getUnitBackgroundClass(unitHere)
                                                }
                                            >
                                                {React.createElement(getIconForUnit(unitHere), {
                                                    className: "h-5 w-5 text-white",
                                                })}
                                            </div>
                                            <div className="text-xs text-white">
                                                {unitHere.isGreen
                                                    ? unitHere.name
                                                    : unitHere.class ??
                                                    (unitHere.isBoss
                                                        ? "Boss"
                                                        : unitHere.isPlayer
                                                            ? "Player"
                                                            : "")}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
} 