/// TS_IGNORE
/* tslint:disable */

import * as React from "react";
import * as d3 from "d3";
import "./Visualization.css";
import { DisplayData, VisualizationOptions, RawData } from "./types";
import { rawDataToDisplay } from "./utils";

const colormap = (s: string) => ({ Republican: "#f00", Democrat: "#00f" }[s]);

export interface VisualizationProps {
  options: VisualizationOptions;
  data: RawData | null;
}

export interface VisualizationState {
  displayData: DisplayData | null;
}

const defaultVisualizationState: VisualizationState = {
  displayData: null
};

export default class Visualization extends React.Component<VisualizationProps, VisualizationState> {
  public state: VisualizationState = defaultVisualizationState;

  public componentDidUpdate(prevProps) {
    if (this.props.data != prevProps.data) // hack
      this.setState({ displayData: rawDataToDisplay(this.props.data, this.props.options) });
    this.drawData();
  }

  public drawData() {
    const { options } = this.props;
    const { displayData: data } = this.state;

    var width = 500;
    var height = 500;
    var margin = { top: 20, right: 20, bottom: 30, left: 40 };
    var xValue = function(d) {
        return d[0];
      }, // data -> value
      xScale = d3.scaleLinear().range([0, width]), // value -> display
      xMap = function(d) {
        return xScale(xValue(d));
      }, // data -> display
      xAxis = d3.axisBottom(xScale);

    // setup y
    var yValue = function(d) {
        return d[1];
      }, // data -> value
      yScale = d3.scaleLinear().range([height, 0]), // value -> display
      yMap = function(d) {
        return yScale(yValue(d));
      }, // data -> display
      yAxis = d3.axisLeft(yScale);

    // setup fill color
    var cValue = function(d) {
        return d[2];
      },
      color = d3.scaleOrdinal(d3.schemeCategory10);

    // add the graph canvas to the body of the webpage
    const vect = d3.select("#vector");
    vect.select("svg").remove();

    if (data == null) return;

    const svg = vect
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
    yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);

    // x-axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("class", "axisWhite")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "y axis")
      .attr("class", "axisWhite")
      .call(yAxis);

    // draw dots
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) {
        return colormap(cValue(d));
      });
  }

  public render() {
    return (
      <div className="content-container">
        <div id="vector" />
      </div>
    );
  }
}
