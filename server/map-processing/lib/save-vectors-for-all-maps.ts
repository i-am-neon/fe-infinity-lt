import { MapMetadata } from "@/types/maps/map-metadata.ts";
import generateAndStoreVector from "@/vector-db/generate-and-store-vector.ts";
import shortUuid from "@/lib/short-uuid.ts";

export default async function saveVectorsForAllMaps(
  mapMetadatas: MapMetadata[]
): Promise<void> {
  for (const mapMetadata of mapMetadatas) {
    const text = `Map Details:
Given Name: ${mapMetadata.givenName}
Original Name: ${mapMetadata.originalName}
Description: ${mapMetadata.description}
Setting: ${mapMetadata.setting}
Key Points of Interest: ${mapMetadata.keyPointsOfInterest.join(", ")}
Choke Points: ${mapMetadata.chokePoints.join(", ")}
Strategic Considerations: ${mapMetadata.strategicConsiderations.join(", ")}
Distinct Regions: ${mapMetadata.distinctRegions
      .map(
        (region) =>
          `Region Name: ${region.name}, Description: ${
            region.description
          }, Terrain Types: ${region.terrainTypes.join(
            ", "
          )}, Coordinates: from (${region.fromX}, ${region.fromY}) to (${
            region.toX
          }, ${region.toY})`
      )
      .join(" | ")}
`;
    await generateAndStoreVector({
      id: shortUuid(),
      text,
      metadata: mapMetadata,
    });
  }
}

if (import.meta.main) {
  // Example usage with dummy data
  const exampleMapMetadata: MapMetadata = {
    givenName: "Example Map",
    originalName: "Example_Map_Original",
    description: "A sample map description",
    distinctRegions: [
      {
        name: "Region 1",
        description: "A forested area",
        terrainTypes: ["Forest", "Hill"],
        fromX: 0,
        fromY: 0,
        toX: 10,
        toY: 10,
      },
    ],
    keyPointsOfInterest: ["Castle", "River"],
    chokePoints: ["Mountain Pass"],
    strategicConsiderations: ["Defensible", "Resource Rich"],
    setting: "outdoor",
  };
  saveVectorsForAllMaps([exampleMapMetadata])
    .then(() => console.log("Saved vectors for all maps"))
    .catch(console.error);
}
