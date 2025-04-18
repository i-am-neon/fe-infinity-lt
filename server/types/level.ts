export interface Position {
  0: number;
  1: number;
}

export interface Music {
  player_phase: string | null;
  enemy_phase: string | null;
  other_phase: string | null;
  enemy2_phase: string | null;
  player_battle: string | null;
  enemy_battle: string | null;
  other_battle: string | null;
  enemy2_battle: string | null;
}

export interface Objective {
  simple: string;
  win: string;
  loss: string;
}

export interface Unit {
  nid: string;
  team: "player" | "enemy" | "other";
  ai: string;
  roam_ai: string | null;
  ai_group: string | null;
  starting_position: Position | null;
  starting_traveler: null;
  generic: boolean;
  variant?: string | null;
  level?: number;
  klass?: string;
  faction?: string;
  starting_items?: [string, boolean][];
  starting_skills?: string[];
}

export interface UnitGroup {
  nid: string;
  units: string[];
  positions: Record<string, Position>;
}

export interface LevelRegion {
  nid: string;
  region_type: string;
  position: number[];
  size: number[];
  sub_nid: string;
  condition: string;
  time_left: null;
  only_once: boolean;
  interrupt_move: boolean;
}

export interface Level {
  nid: string;
  name: string;
  tilemap: string;
  bg_tilemap: string | null;
  party: string;
  music: Music;
  objective: Objective;
  roam: boolean;
  roam_unit: string | null;
  go_to_overworld: boolean;
  should_record: boolean;
  tags?: string[];
  units: Unit[];
  regions: LevelRegion[];
  unit_groups: UnitGroup[];
  ai_groups: any[];
}

