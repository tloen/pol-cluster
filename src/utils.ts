import { DSVRowArray, DSVRowString } from 'd3';
import { PointData, DisplayData } from './types';
import _ from "lodash";
import PCA from 'ml-pca';

const parseRow = (row: DSVRowString): number[] => {
  const { bioguide, bioguide_id: id, party, full_name, state, gender, ...votes } = row;
  return [_.values(votes).map(parseFloat), party, full_name, state, gender];
}

export function csvToPoints(csv: d3.DSVRowArray): DisplayData {
  const listolists = csv.map(parseRow);
  const votes = listolists.map(pair => pair[0]);
  const party = listolists.map(pair => pair[1]);
  const full_name = listolists.map(pair => pair[2]);
  const state = listolists.map(pair => pair[3]);
  const gender = listolists.map(pair => pair[4]);
  const pca = new PCA(votes);
  const principalComponents: number[][] = pca.predict(votes).map(x => x.slice(0, 2));
  const pointsData = principalComponents.map((x, i) => x.concat([party[i], full_name[i], state[i], gender[i]]));
  return pointsData as DisplayData;
}
