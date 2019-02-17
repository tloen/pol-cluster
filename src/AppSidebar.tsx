import * as React from "react";
import { Button, Classes, Drawer } from "@blueprintjs/core";
import classnames from "classnames";

export default class AppSidebar extends React.Component {
  public render() {
    return (
      <Drawer
        // className={this.props.data.themeName}
        icon="heatmap"
        // onClose={this.handleClose}
        title="Pol-Cluster"
        // {...this.state}
        isOpen={true}
        hasBackdrop={false}
        autoFocus={false}
        size={Drawer.SIZE_SMALL}
      >
        <div className={classnames(Classes.DRAWER_BODY)}>
          <div className={Classes.DIALOG_BODY}>
            <p>
              <strong>
                A Calamari Comitatus production
              </strong>
            </p>
            <p>
              Palantir Foundry radically reimagines the way enterprises interact
              with data by amplifying and extending the power of data
              integration. With Foundry, anyone can source, fuse, and transform
              data into any shape they desire. Business analysts become data
              engineers — and leaders in their organization’s data revolution.
            </p>
            <p>
              Foundry’s back end includes a suite of best-in-class data
              integration capabilities: data provenance, git-style versioning
              semantics, granular access controls, branching, transformation
              authoring, and more. But these powers are not limited to the
              back-end IT shop.
            </p>
            <p>
              In Foundry, tables, applications, reports, presentations, and
              spreadsheets operate as data integrations in their own right.
              Access controls, transformation logic, and data quality flow from
              original data source to intermediate analysis to presentation in
              real time. Every end product created in Foundry becomes a new data
              source that other users can build upon. And the enterprise data
              foundation goes where the business drives it.
            </p>
            <p>
              Start the revolution. Unleash the power of data integration with
              Palantir Foundry.
            </p>
          </div>
        </div>
        <div className={Classes.DRAWER_FOOTER}>
          <Button 
            text="Close"
          />
        </div>
      </Drawer>
    );
  }
}