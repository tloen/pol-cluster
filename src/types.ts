export interface VisualizationOptions {
  selected: RawRow | null;
  selectedCategories: string[];
}

export type PointData = [number, number, string, string, string, string];

export type DisplayData = PointData[];

export interface RawRow {
  party: string; 
  votes: number[];
  full_name: string;
  state: string;
  gender: string;
}

export const categoryList = [
  "economy",
  "immigration",
  "defense",
  "healthcare",
  "education",
  "environment",
  "infrastructure",
  "science and technology",
  "legal"
];

export interface CategoryEntry {
  bill: string
}

export type RawData = RawRow[];