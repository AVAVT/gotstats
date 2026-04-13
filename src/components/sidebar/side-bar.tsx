"use client";

import CancelablePromise from "cancelable-promise";
import { connect } from "react-redux";
import { Button } from "vat-ui";
import { freezeQuery, LARGE_GAME_PAGES_THRESHOLD } from "@/redux/games/game-actions";
import { StoreState } from "@/redux/type";
import { MIN_DATE } from "@/utils/constants";
import LoadingIcon from "../shared/loading-icon/loadingIcon";
import QuickLinks from "./quick-links";
import SearchBox from "./search-box";

export interface SideBarProps {
  fetching: CancelablePromise | null;
  currentPage: number;
  totalPages: number;
  showQuickLinks: boolean;
  freezeQuery: () => void;
  startDate: Date;
}

function SideBar({ fetching, currentPage, totalPages, showQuickLinks, freezeQuery, startDate }: SideBarProps) {
  const scrollToElem = (id: string) => {
    document.getElementById(id)?.scrollIntoView();
  };

  const quickLinks = showQuickLinks ? (
    <div className="navi hidden md:block">
      <hr />
      <small className="tip help-block">
        <em>*Mouse over/tap on a chart to see more info.</em>
      </small>
      <QuickLinks scrollToElem={scrollToElem} />
    </div>
  ) : null;

  const searchBoxOrLoadProgress = !(fetching && totalPages > 0) ? (
    <SearchBox />
  ) : (
    <>
      <div className="flex items-center">
        <LoadingIcon
          style={{
            width: 32,
            height: 32,
            marginRight: 15,
            flex: "0 0 auto",
          }}
        />
        <div>
          Fetching games result from OGS - Page {currentPage + 1}
          {totalPages && ` of ${totalPages}`}
        </div>
      </div>
      {totalPages >= LARGE_GAME_PAGES_THRESHOLD ? (
        <div className="mt-3 opacity-70 text-sm">
          Large number of games detected. Charts are automatically frozen until loading complete to prevent browser
          freeze.
        </div>
      ) : (
        startDate === MIN_DATE && (
          <div className="mt-3">
            <Button
              type="button"
              color="tertiary"
              className="text-foreground block w-full"
              onClick={freezeQuery}
              title="Set filter to current games (stop charts refreshing)"
            >
              Freeze charts
            </Button>
          </div>
        )
      )}
    </>
  );

  return (
    <div className="md:order-1 flex-none flex flex-col w-84 items-stretch sidebar">
      <nav className="side_nav sticky top-0">
        {searchBoxOrLoadProgress}

        {quickLinks}

        <hr />
        <a
          href="https://forums.online-go.com/t/g0tstats-is-back-with-more-stats/6524"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          Support thread on OGS forum
        </a>
      </nav>
    </div>
  );
}

const mapReduxStateToProps = ({ chartsData, games }: StoreState) => ({
  fetching: games.fetching,
  currentPage: games.fetchingPage,
  totalPages: games.fetchingTotalPage,
  showQuickLinks: chartsData.results.length > 0,
  startDate: chartsData.startDate,
});
const mapDispatchToProps = { freezeQuery };

export default connect(mapReduxStateToProps, mapDispatchToProps)(SideBar);
