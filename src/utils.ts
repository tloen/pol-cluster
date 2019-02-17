import { DSVRowArray, DSVRowString } from 'd3';
import { PointData, DisplayData, RawRow, RawData, VisualizationOptions } from './types';
import _ from "lodash";
import categories from "./categories";
import PCA from 'ml-pca';

const parseRow = (row: DSVRowString): RawRow => {
  const { bioguide, bioguide_id: id, party, full_name, state, gender, ...votes } = row;
  return {
    party,
    votes: _.values(votes).map(parseFloat),
    full_name,
    state,
    gender
  };
}

export function csvToRawData(csv: d3.DSVRowArray): RawData {
  const rows = csv.map(parseRow);
  return rows;
}

export function rawDataToDisplay(rawData: RawData, options: VisualizationOptions): DisplayData {
  const { selectedCategories } = options;
  console.log(options);
  const votes = rawData.map(row => row.votes).map(
    v => v.filter((value, index) => _.some(selectedCategories, category => categories[index][category]))
  );
  const party = rawData.map(row => row.party);
  const full_name = rawData.map(row => row.full_name);
  const state = rawData.map(row => row.state);
  const gender = rawData.map(row => row.gender);
  const pca = new PCA(votes);
  const principalComponents: number[][] = pca.predict(votes).map(x => x.slice(0, 2));
  const pointsData = principalComponents.map((x: any[], i) => x.concat([party[i], full_name[i], state[i], gender[i]]));
  return pointsData as DisplayData;
}
