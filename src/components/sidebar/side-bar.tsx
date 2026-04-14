"use client";

import CancelablePromise from "cancelable-promise";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import { connect } from "react-redux";
import { cn } from "vat-ui";
import LoadProgress from "@/components/sidebar/load-progress";
import { StoreState } from "@/redux/type";
import AdvancedFeatures from "./advanced-features";
import QuickLinks from "./quick-links";
import SearchBox from "./search-box";

export interface SideBarProps {
  fetching: CancelablePromise | null;
  totalPages: number;
  showQuickLinks: boolean;
}

function SideBar({ fetching, totalPages, showQuickLinks }: SideBarProps) {
  const path = usePathname();
  const isYearInReview = path.includes("year-in-review");

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
    <Fragment>
      <SearchBox />
      <AdvancedFeatures />
    </Fragment>
  ) : (
    <LoadProgress />
  );

  return (
    <div className={cn(isYearInReview ? "hidden" : "md:order-1 flex-none flex flex-col w-84 items-stretch sidebar")}>
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
  totalPages: games.fetchingTotalPage,
  showQuickLinks: chartsData.results.length > 0,
});

export default connect(mapReduxStateToProps)(SideBar);
