import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

import { connect } from "react-redux";

class SideBar extends Component {
  static propTypes = {
    scrollToElem: PropTypes.func.isRequired,
    showQuickLinks: PropTypes.bool,
    showDatePicker: PropTypes.bool,
  }

  render() {
    const quickLinks = this.props.showQuickLinks ? (
      <div className="navi d-none d-md-block">
        <hr />
        <small className="tip help-block"><em>*Mouse over/tap on a chart to see more info.</em></small>
        <QuickLinks scrollToElem={this.props.scrollToElem} />
      </div>
    ) : null;

    return (
      <div className="col-lg-3 col-md-4 order-md-2 sidebar">
        <nav className="side_nav sticky-top">
          <SearchBox />

          {quickLinks}

          <hr />
          <a href="https://forums.online-go.com/t/g0tstats-is-back-with-more-stats/6524" target="_blank" rel="noopener noreferrer nofollow">Support thread on OGS forum</a>
        </nav>
      </div>
    );
  }
}

const mapReduxStateToProps = ({ chartsData }) => ({ showQuickLinks: chartsData.results.length > 0 })

export default connect(mapReduxStateToProps)(SideBar);
