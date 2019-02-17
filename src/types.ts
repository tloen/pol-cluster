export interface VisualizationOptions {}

export type PointData = [number, number, string];

export type DisplayData = PointData[];

export interface RawRow {
  party: string; 
  votes: number[];
}

export type RawData = RawRow[]