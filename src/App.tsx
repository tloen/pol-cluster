import * as React from "react";
import AppSidebar from "./AppSidebar";
import Visualization from "./Visualization";
import "./App.css";
import "./Resizer.css";
import { Button } from "@blueprintjs/core";
import { VisualizationOptions } from "./types";
import SplitPane from "react-split-pane";
import { csv } from 'd3';
import { csvToPoints } from './utils';

// import logo from './logo.svg';

interface AppState {
  data?: any;
  visualizationOptions: VisualizationOptions;
  sidebarOpen: boolean;
}

const defaultAppState: AppState = {
  data: {},
  visualizationOptions: {},
  sidebarOpen: true
};

class App extends React.Component<{}, AppState> {
  public state: AppState = defaultAppState;

  private closeSidebar = (): void => {
    this.setState({ sidebarOpen: false });
  };

  private updateVizOptions = (update: Partial<VisualizationOptions>): void => {
    this.setState({
      visualizationOptions: { ...this.state.visualizationOptions, update }
    });
  };

  public componentDidMount() {
    csv('./joined.csv').then(
      (table) => {
        const data = csvToPoints(table); // ordered pairs
        this.setState({ data });
      }
    )
  }

  public render() {
    const {data, visualizationOptions} = this.state;
    return (
      <div className="App">
        <SplitPane allowResize={false} split="vertical" defaultSize={350} primary="second">
          <div className="visualization-pane">
            <Visualization data={data} options={visualizationOptions}/>
          </div>
          <div>
            <AppSidebar
              open={this.state.sidebarOpen}
              closeSidebar={this.closeSidebar}
              updateOptions={this.updateVizOptions}
            />
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default App;
