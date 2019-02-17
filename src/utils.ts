import { DSVRowArray, DSVRowString } from 'd3';
import { PointData, DisplayData, RawRow, RawData, VisualizationOptions } from './types';
import _ from "lodash";
import PCA from 'ml-pca';

const parseRow = (row: DSVRowString): RawRow => {
  const { bioguide, bioguide_id: id, party, ...votes } = row;
  return {
    party,
    votes: _.values(votes).map(parseFloat)
  };
}

export function csvToRawData(csv: d3.DSVRowArray): RawData {
  const rows = csv.map(parseRow);
  return rows;
}

export function rawDataToDisplay(rawData: RawData, options: VisualizationOptions): DisplayData {
  const votes = rawData.map(row => row.votes);
  const party = rawData.map(row => row.party);
  const pca = new PCA(votes);
  const principalComponents: number[][] = pca.predict(votes).map(x => x.slice(0, 2));
  const pointsData = principalComponents.map((x: any[], i) => x.concat(party[i]));
  return pointsData as DisplayData;
} 