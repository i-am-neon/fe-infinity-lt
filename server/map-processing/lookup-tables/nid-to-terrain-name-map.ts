const nidToTerrainNameMap: Map<string, string> = new Map([
  ["1", "Plain"],
  ["0", "--"],
  ["2", "Forest"],
  ["3", "Thicket"],
  ["4", "Bridge"],
  ["5", "Stairs"],
  ["6", "Floor"],
  ["7", "Road"],
  ["8", "Pillar"],
  ["9", "Wall"],
  ["Fence", "Fence"],
  ["10", "Lake"],
  ["11", "Sea"],
  ["12", "River"],
  ["20", "Hill"],
  ["21", "Mountain"],
  ["22", "Cliff"],
  ["25", "Barrel"],
  ["30", "House"],
  ["31", "Fort"],
  ["32", "Gate"],
  ["33", "Armory"],
  ["34", "Vendor"],
  ["Arena", "Arena"],
  ["35", "Village"],
  ["36", "Chest"],
  ["37", "Door"],
  ["38", "Throne"],
  ["Ruins", "Ruins"],
  ["Village Ruins", "Ruins"],
]);

export default function getTerrainName(nid: string): string | undefined {
  return nidToTerrainNameMap.get(nid);
}
