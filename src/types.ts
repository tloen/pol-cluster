export interface VisualizationOptions {}

export type PointData = [number, number, string];

export type DisplayData = PointData[];

export interface DisplayInfo {
  options: VisualizationOptions;
  data: DisplayData;
}
