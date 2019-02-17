export interface VisualizationOptions {}

export type PointData = [number, number];

export type DisplayData = PointData[];

export interface DisplayInfo {
  options: VisualizationOptions;
  data: DisplayData;
}
