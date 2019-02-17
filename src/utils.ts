import { DSVRowArray, DSVRowString } from 'd3';
import { PointData, DisplayData } from './types';
import _ from "lodash";
import PCA from 'ml-pca';

const parseRow = (row: DSVRowString): number[] => {
  const { bioguide, bioguide_id: id, party, ...votes } = row;
  return [_.values(votes).map(parseFloat), party];
}

export function csvToPoints(csv: d3.DSVRowArray): DisplayData {
  const listolists = csv.map(parseRow);
  const votes = listolists.map(pair => pair[0]);
  const party = listolists.map(pair => pair[1]);
  const pca = new PCA(votes);
  const principalComponents: number[][] = pca.predict(votes).map(x => x.slice(0, 2));
  const pointsData = principalComponents.map((x, i) => x.concat(party[i]));
  return pointsData as DisplayData;
} 