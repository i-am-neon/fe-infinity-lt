/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import TerrainGridComponent from "../components/map";
import { MapInfo, Unit } from "../types/grid-props";
import { TerrainType } from "../types/terrain-type";
import apiCall from "../lib/api-call";

export default function UnitPlacementTestPage() {
    const [maps, setMaps] = useState<MapInfo[]>([]);
    const [selectedMap, setSelectedMap] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [terrainGrid, setTerrainGrid] = useState<Record<string, TerrainType>>({});
    const [units, setUnits] = useState<Unit[]>([]);
    const [mapMetadata, setMapMetadata] = useState<any>(null);
    const [timeElapsed, setTimeElapsed] = useState<number | null>(null);

    // Fetch available maps
    useEffect(() => {
        async function fetchMaps() {
            try {
                const response = await apiCall<{ maps: MapInfo[] }>(
                    "test-unit-placement/maps"
                );
                setMaps(response.maps);
            } catch (err) {
                console.error("Failed to fetch maps:", err);
                setError("Failed to fetch maps. Please try again later.");
            }
        }

        fetchMaps();
    }, []);

    // Handle map selection
    const handleMapSelect = useCallback(
        async (event: React.ChangeEvent<HTMLSelectElement>) => {
            const mapName = event.target.value;
            setSelectedMap(mapName);

            if (mapName) {
                try {
                    setLoading(true);
                    setError(null);
                    setTimeElapsed(null);

                    const response = await apiCall<{ terrainGrid: Record<string, TerrainType> }>(
                        `test-unit-placement/terrain/${encodeURIComponent(mapName)}`
                    );

                    setTerrainGrid(response.terrainGrid);
                    setUnits([]);
                    setMapMetadata(null);
                } catch (err) {
                    console.error("Failed to fetch terrain grid:", err);
                    setError("Failed to fetch terrain data. Please try again later.");
                    setTerrainGrid({});
                    setUnits([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setTerrainGrid({});
                setUnits([]);
                setMapMetadata(null);
                setTimeElapsed(null);
            }
        },
        []
    );

    // Generate unit placement
    const handleGenerateUnits = useCallback(async () => {
        if (!selectedMap) return;

        try {
            setLoading(true);
            setError(null);
            setTimeElapsed(null);

            const startTime = performance.now();

            const response = await apiCall<{
                terrainGrid: Record<string, TerrainType>;
                unitPlacement: {
                    bossCoords: { x: number; y: number };
                    playerUnitCoords: { x: number; y: number }[];
                    genericEnemies: Unit[];
                    recruitableUnits: Unit[];
                };
                mapMetadata: any;
            }>("test-unit-placement/unit-placement", {
                method: "POST",
                body: { mapName: selectedMap },
            });

            console.log('response :>> ', response);

            const endTime = performance.now();
            setTimeElapsed(endTime - startTime);

            // Format units
            const formattedUnits: Unit[] = [
                // Boss unit
                {
                    ...response.unitPlacement.bossCoords,
                    isBoss: true,
                    class: "General"
                },
                // Player units
                ...response.unitPlacement.playerUnitCoords.map(coords => ({
                    ...coords,
                    isPlayer: true
                })),
                // Recruitable units
                ...response.unitPlacement.recruitableUnits.map(unit => ({
                    ...unit,
                    isGreen: true
                })),
                // Generic enemies
                ...response.unitPlacement.genericEnemies
            ];

            setUnits(formattedUnits);
            setMapMetadata(response.mapMetadata);
        } catch (err) {
            console.error("Failed to generate units:", err);
            setError("Failed to generate units. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [selectedMap]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Unit Placement Test</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="map-select" className="block text-sm font-medium text-gray-700">
                    Select Map
                </label>
                <select
                    id="map-select"
                    value={selectedMap}
                    onChange={handleMapSelect}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={loading}
                >
                    <option value="">-- Select a map --</option>
                    {maps.map((map) => (
                        <option key={map.originalName} value={map.originalName}>
                            {map.originalName} ({map.setting})
                        </option>
                    ))}
                </select>
            </div>

            {selectedMap && (
                <div className="mb-4">
                    <button
                        onClick={handleGenerateUnits}
                        disabled={loading || !selectedMap}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? "Generating..." : "Generate Units"}
                    </button>

                    {timeElapsed !== null && (
                        <div className="mt-2">
                            Time elapsed: <span className="font-medium">{(timeElapsed / 1000).toFixed(2)}s</span>
                        </div>
                    )}
                </div>
            )}

            {Object.keys(terrainGrid).length > 0 && (
                <div className="flex flex-wrap gap-8 mt-4">
                    <div className="relative">
                        <TerrainGridComponent terrainGrid={terrainGrid} units={units} />
                    </div>

                    {mapMetadata && (
                        <div className="flex-1 overflow-auto max-h-[70vh]">
                            <h2 className="text-xl font-semibold mb-2">Map Metadata</h2>
                            <div className="border p-4 rounded">
                                <h3 className="font-semibold">{mapMetadata.givenName}</h3>
                                <p className="text-sm mb-2">{mapMetadata.description}</p>

                                <h4 className="font-semibold mt-4">Key Points of Interest</h4>
                                <ul className="list-disc list-inside text-sm">
                                    {mapMetadata.keyPointsOfInterest?.map((point: string, index: number) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>

                                <h4 className="font-semibold mt-4">Choke Points</h4>
                                <ul className="list-disc list-inside text-sm">
                                    {mapMetadata.chokePoints?.map((point: string, index: number) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>

                                <h4 className="font-semibold mt-4">Strategic Considerations</h4>
                                <ul className="list-disc list-inside text-sm">
                                    {mapMetadata.strategicConsiderations?.map((point: string, index: number) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
} 