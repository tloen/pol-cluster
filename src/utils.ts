import { DSVRowArray, DSVRowString } from 'd3';
import { PointData, DisplayData } from './types';
import _ from "lodash";
import PCA from 'ml-pca';

const parseRow = (row: DSVRowString): number[] => {
  const { bioguide: id, ...votes } = row;
  return _.values(votes).map(parseFloat);
}

export function csvToPoints(csv: d3.DSVRowArray): DisplayData {
  const listolists = csv.map(parseRow);
  const pca = new PCA(listolists);
  const principalComponents = pca.predict(listolists).map(x => x.slice(0, 2));
  return principalComponents as DisplayData;
} 