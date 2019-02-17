export interface VisualizationOptions {}

export type PointData = [number, number, string, string, string, string];

export type DisplayData = PointData[];

export interface RawRow {
  party: string; 
  votes: number[];
  full_name: string;
  state: string;
  gender: string;
}

export type RawData = RawRow[]