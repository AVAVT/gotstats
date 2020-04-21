import React, { Component } from "react";

import SearchBox from "./SearchBox";
import QuickLinks from "./QuickLinks";
import LoadingIcon from "../../Shared/Components/LoadingIcon/LoadingIcon";
import { connect } from "react-redux";
import { cancelQuery } from "../../Redux/Games/gameActions";

class SideBar extends Component {
  render() {
    const {
      fetching,
      errorMessage,
      currentPage,
      totalPages,
      showQuickLinks,
      cancelQuery,
      canceled,
    } = this.props;

    const quickLinks = showQuickLinks ? (
      <div className="navi d-none d-md-block">
        <hr />
        <small className="tip help-block">
          <em>*Mouse over/tap on a chart to see more info.</em>
        </small>
        <QuickLinks scrollToElem={this.props.scrollToElem} />
      </div>
    ) : null;
    const searchBoxOrLoadProgress =
      errorMessage || !(fetching && totalPages > 0) ? (
        <>
          {errorMessage && (
            <div className="mb-3 text-danger">{errorMessage}</div>
          )}
          {canceled && (
            <div className="mb-3 text-secondary">
              Request cancelled, displaying data based on some recent games.
            </div>
          )}
          <SearchBox />
        </>
      ) : (
        <>
          <div className="d-flex align-items-center">
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
          <div className="mt-3">
            <button
              className="btn btn-block btn-secondary"
              onClick={cancelQuery}
            >
              Stop here
            </button>
          </div>
        </>
      );

    return (
      <div className="col-lg-3 col-md-4 order-md-2 sidebar">
        <nav className="side_nav sticky-top">
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
}
const mapReduxStateToProps = ({ chartsData, games }) => ({
  fetching: games.fetching,
  currentPage: games.fetchingPage,
  totalPages: games.fetchingTotalPage,
  errorMessage: games.fetchError,
  showQuickLinks: chartsData.results.length > 0,
  canceled: games.canceled,
});

const mapDispatchToProps = { cancelQuery };

export default connect(mapReduxStateToProps, mapDispatchToProps)(SideBar);
