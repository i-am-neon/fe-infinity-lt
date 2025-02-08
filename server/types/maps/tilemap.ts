export type Tilemap = {
  nid: string;
  size: [number, number];
  autotile_fps: number;
  layers: TilemapLayer[];
  tilesets: string[];
};

export type TilemapLayer = {
  nid: string;
  visible: boolean;
  foreground: boolean;
  terrain_grid: Record<string, string>;
  sprite_grid: Record<string, [string, [number, number]]>;
};
