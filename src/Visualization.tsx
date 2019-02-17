/// TS_IGNORE
/* tslint:disable */

import * as React from "react";
import * as d3 from "d3";
import "./Visualization.css";
import { DisplayData, VisualizationOptions, RawData } from "./types";
import { rawDataToDisplay } from "./utils";
import ReactResizeDetector from "react-resize-detector";
import _ from "lodash";
import { openSync } from "fs";

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

export default class Visualization extends React.Component<
  VisualizationProps,
  VisualizationState
> {
  public state: VisualizationState = defaultVisualizationState;

  public componentDidUpdate(prevProps) {
    if (
      this.props.data != prevProps.data ||
      this.props.options.selected != prevProps.options.selected ||
      this.props.options.selectedCategories !=
        prevProps.options.selectedCategories
    )
      // hack
      this.setState({
        displayData: rawDataToDisplay(this.props.data, this.props.options)
      });
    this.drawData();
  }

  private drawDataUnconditionally = (width?: number, height?: number) => {
    const { options } = this.props;
    const { displayData: data } = this.state;

    var width = (width || 625) * 0.7;
    var height = (height || 625) * 0.7;
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
    /*
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);*/

    var tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("color", "white")
      .text("a simple tooltip");

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
      .attr("r", function(d) {
        if (options.selected && d[3] == options.selected.full_name) {
          return 20;
        } else {
          return 5.5;
        }
      })
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("opacity", "0.5")
      .attr("full_name", function(d) {
        return d[3];
      })
      .attr("state", function(d) {
        return d[4];
      })
      .attr("gender", function(d) {
        return d[5];
      })
      .style("fill", function(d) {
        return colormap(cValue(d));
      })
      .on("mouseover", function(d) {
        d3.select(this).attr("r", function(d) {
          if (options.selected && d[3] == options.selected.full_name) {
            return 20;
          } else {
            return 10;
          }
        });
        return (
          tooltip
            .style("visibility", "visible")
            /*.style("margin-top", "180px")
            .style("margin-left", "430px")*/
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 25 + "px")
            .style("font-size", "14pt")
            .style("font-weight", "bold")
            .style("color", "#1e1e1e")
            .text(
              d3.select(this).attr("full_name") +
                ", " +
                d3.select(this).attr("state") +
                ", " +
                d3.select(this).attr("gender")
            )
            .transition()
            .duration(500)
            .style("opacity", 1)
        );
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("r", d => {
          if (options.selected && d[3] == options.selected.full_name) {
            return 20;
          } else {
            return 5.5;
          }
        });
        tooltip.transition()
        .duration(500)
        .style("opacity", 0)
      });
  };

  public drawData = _.debounce(this.drawDataUnconditionally, 20);

  public render() {
    return (
      <>
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={this.drawData}
        />
        <div className="content-container">
          <div id="vector" />
        </div>
      </>
    );
  }
}
