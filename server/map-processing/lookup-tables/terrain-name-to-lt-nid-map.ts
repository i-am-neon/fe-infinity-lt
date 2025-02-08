const terrainNameToLTNidMap: Map<string, string> = new Map([
  ["Plains", "1"],
  ["Sand", "1"],
  ["Desert", "1"],
  ["Snag", "1"],
  ["Snag Bridge", "1"],

  ["--", "0"],
  ["Village Wall", "0"],
  ["Closed Village Entrance", "0"],
  ["Castle Wall", "0"],
  ["Gunnel", "0"],

  ["Forest", "2"],
  ["Thicket", "3"],
  ["Bridge", "4"],
  ["Stairs", "5"],

  ["Floor", "6"],
  ["Deck", "6"],
  ["Roof", "6"],

  ["Road", "7"],
  ["Pillar", "8"],

  ["Wall", "9"],
  ["Brace", "9"],

  ["Fence", "Fence"],

  ["Lake", "10"],
  ["Water", "10"],

  ["Sea", "11"],

  ["River", "12"],
  ["Hill", "20"],
  ["Mountain", "21"],
  ["Peak", "21"],
  ["Cliff", "22"],
  ["Barrel", "25"],
  ["House", "30"],
  ["Fort", "31"],

  ["Gate", "32"],
  ["Fort Gate", "32"],
  ["Castle Gate", "32"],

  ["Armory", "33"],
  ["Vendor", "34"],
  ["Arena", "Arena"],

  ["Village", "35"],
  ["Village Entrance", "35"],
  ["Inn", "35"],

  ["Chest", "36"],
  ["Opened Chest", "36"],
  ["Door", "37"],
  ["Throne", "38"],
  ["Ruins", "Ruins"],

  ["Village Ruins", "Ruins"],
  ["Visitable Ruins", "Ruins"],
]);

export default function getTerrainLTNid(
  terrainName: string
): string | undefined {
  return terrainNameToLTNidMap.get(terrainName);
}

