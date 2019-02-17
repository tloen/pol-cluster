import * as React from "react";
import { Button, Classes, Drawer, MenuItem, Divider, Checkbox } from "@blueprintjs/core";
import classnames from "classnames";
import { VisualizationOptions, RawData, RawRow, categoryList } from "./types";
import { Select, IItemRendererProps, ItemRenderer } from "@blueprintjs/select";
import "./AppSidebar.css";

interface AppSidebarProps {
  data: RawData;
  open: boolean;
  closeSidebar: () => void;
  updateOptions: (update: Partial<VisualizationOptions>) => void;
  options: VisualizationOptions;
}

const SenatorSelect = Select.ofType<RawRow>();

const senatorPredicate = (query: string, item: RawRow): boolean =>
  item.full_name.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1;

const renderSenator: ItemRenderer<RawRow> = (senator, { handleClick, modifiers, query }) => {
  return <MenuItem
    active={modifiers.active}
    label={senator.party}
    onClick={handleClick}
    text={senator.full_name}
    key={senator.full_name}
  />
}

export default class AppSidebar extends React.Component<AppSidebarProps> {

  private selectSenator = (senator: RawRow | null) => {
    this.props.updateOptions({
      selected: senator
    });
  }

  public render() {
    const { data, options } = this.props;
    return (
      <>
        <div className={classnames(Classes.DRAWER_BODY, "app-sidebar")}>
          <div className={Classes.DRAWER_HEADER}>
            <h2>The Shape of Politics</h2> 
          </div>
          <div className={Classes.DIALOG_BODY}>
            <SenatorSelect items={data || []} itemPredicate={senatorPredicate} itemRenderer={renderSenator} onItemSelect={this.selectSenator}>
              <Button text={
                (options.selected && options.selected.full_name) || 
                (data != null && "Pick a senator...") || "No senators loaded"} 
                icon="person"
                rightIcon="double-caret-vertical" />
            </SenatorSelect>
            <div className="checkboxes">
            {
              categoryList.map(
                (category) => <Checkbox label={category} checked={options.selectedCategories.indexOf(category) !== -1}
                disabled={options.selectedCategories.indexOf(category) !== -1 && options.selectedCategories.length === 1} onChange={() => {
                  const i = options.selectedCategories.indexOf(category);
                  const selcat = [...options.selectedCategories]
                  if (i !== -1) {
                    selcat.splice(i, 1);
                    this.props.updateOptions({ selectedCategories: selcat });
                  } else {
                    this.props.updateOptions({ selectedCategories: selcat.concat(category) });
                  }
                }}
                key={category}/>
              )
            }
            </div>
            <p>
              Imagine that one day you're watching the news with your friend and this
              politician who you don't know pops up on the TV. "Who's Kirsten Gillibrand?"
              you ask your friend. "What does she believe?"
            </p>
            <p>
              "Oh, well, she's sorta like Elizabeth Warren," your friend might answer.
              Now, while this is obviously oversimplifying things, there's some truth here.
              Kirsten Gillibrand is definitely more like Elizabeth Warren then like Ted Cruz.
              But how would you even begin to compare the two?
            </p>
            <p>
              For starters, you could look at voting records. See what percentage of policy
              issues these two politicians agree on. But what if what you want to go further
              than individual politicians and understand groups of politicians? Or maybe even
              identify clusters and voting blocks between them?
            </p>
            <p>
              You could use this neat machine learning algorithm called
              principal component analysis (PCA). Here, we use PCA to find the two
              most significant variables that influence how senators vote.  We can then
              use this information to visualize naturally arising groups of polticians
              with similar behaviors and beliefs. 
            </p>
            <p>
              The most obvious cluster is political party: no matter the issue, our senators
              appear to be deeply partisan. But if you look closer, you'll find a few other
              interesting clusters, like a small group of democratic-socialist-leaning
              politicians around Bernie Sanders. 
            </p>
            <p>
              Play around and see if you can find a few other interesting trends! 
             </p>
             <p>
              <strong>Copyright 2019 Calamari Comitatus</strong>
            </p>
         </div>
        </div>
      </>
    );
  }
}
