export type VectorType =
  | "maps"
  | "portraits-male"
  | "portraits-female"
  | "music"
  | "items"
  | "scene-backgrounds";

export interface Vector {
  id: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

export interface SimilarityResult {
  id: string;
  score: number;
  metadata: Record<string, unknown> | null;
}