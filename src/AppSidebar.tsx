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
            <br />
            {
              categoryList.map(
                (category) => <Checkbox label={category} checked={options.selectedCategories.indexOf(category) !== -1} onChange={() => {
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
            <p>
              <strong>A Calamari Comitatus production</strong>
            </p>
            <p>
              Consider Jean-Paul Sartre. Sartre has the example of the
              restaurant waiter, who follows strict, preprogrammed rules and
              denies his true freedom. The waiter is act in bad faith: he
              restricts the space of the things he think he might do, and hides
              from himself the fact that we can be doing basically anything at
              basically any time. In forgetting his own freedom, he avoids
              responsibility for his actions as a waiter.
            </p>
            <p>
              In the limit, Sartre says that we should aspire to an authentic
              human existence of infinite entropy, where at any given moment the
              probability distribution is evenly spread over innumerable
              possibilities (rather than concentrated by habit, routine, or
              social commitment). The enormous burden of the entropy this adds
              is called anguish. And it’s a good thing.
            </p>
            <p>
              Consider Tyler Cowen. Tyler makes a distinction between
              complacency and disruptiveness. Complacent individuals don’t spend
              much time outside their comfort zone. They interact with people
              like them, they stay in the same place, and they listen to the
              same music and shop at the same stores all the time.
            </p>
            <p>
              Complacency is a condition where entropy has fallen below healthy
              levels (either that, or it’s all being channeled into mentally
              exhausting information work), leading to stagnation on a larger
              scale. The solution is to inject more entropy in an almost
              methodical manner: getting off social media, talking to Uber
              drivers, making decisions based on coin flips, applying to jobs in
              new cities. Cowen’s disruptiveness is destabilizing. It’s a kind
              of rootless, centerless, capitalist-Protestant restlessness that
              trades short-term comfort for long-term fulfilment.
            </p>
            <p>
              Between the existentialist and the libertarian, two facts emerge.
              First, that entropy is a good thing. Second, that it can be
              uncomfortable as hell.
            </p>
          </div>
        </div>
        <div className={Classes.DRAWER_FOOTER}>
          <Button text="Close" onClick={this.props.closeSidebar} />
        </div>
      </>
    );
  }
}
