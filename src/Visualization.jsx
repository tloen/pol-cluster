/// TS_IGNORE
/* tslint:disable */

import * as React from "react";
import * as d3 from "d3";
import { csvToPoints } from "./utils";
import "./Visualization.css";

const colormap = s => ({"Republican": "#f00", "Democrat": "#00f"}[s]);

export default class Visualization extends React.Component {
  componentDidMount() {
    console.log('mounted')
    d3.csv('./joined.csv').then(
      (csv) => {
        const data = csvToPoints(csv); // ordered pairs
        this.drawData(data);
      }
    )
  }

  drawData(data) {
    var width = 500;
    var height = 500;
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var xValue = function(d) { return d[0];}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale);

    // setup y
    var yValue = function(d) { return d[1];}, // data -> value
        yScale = d3.scaleLinear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);

    // setup fill color
    var cValue = function(d) { return d[2];},
        color = d3.scaleOrdinal(d3.schemeCategory10);

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#vector").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    /*
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);*/

    var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .text("a simple tooltip");

    /*
    var data = [
      [0.7, 0.8, "Republican"],
      [0.8, 0.8, "Democrat"],
      [-0.4, -0.8, "Democrat"],
      [-0.2, 0.2, "Republican"],
      [-0.2, 0.1, "Democrat"],
      [0.6, 0.2, "Republican"]
    ]
    */

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("class", "axisWhite")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)

    svg.append("g")
        .attr("class", "y axis")
        .attr("class", "axisWhite")
        .call(yAxis)

    // draw dots
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("full_name", function(d) { return d[3]; })
        .attr("state", function(d) { return d[4]; })
        .attr("gender", function(d) { return d[5]; })
        .style("fill", function(d) { return colormap(cValue(d)); } )
        .on("mouseover", function(d) {
          d3.select(this).attr("r", 10);
          return tooltip.style("visibility", "visible")
            .style("left", d3.select(this).attr("cx") + "px")
            .style("top", d3.select(this).attr("cy") + "px")
            .text(d3.select(this).attr("full_name") + ", " + d3.select(this).attr("state") + ", " + d3.select(this).attr("gender"));
        })
        .on("mouseout", function(d) {
          d3.select(this).attr("r", 3.5);
          return tooltip.style("visibility", "hidden");
        });
  }

  render() {
    return <div className="content-container">
      <div id="vector" />
    </div>;
  }
}
