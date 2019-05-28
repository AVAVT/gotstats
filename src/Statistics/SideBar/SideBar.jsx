import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SearchBox from './SearchBox';
import QuickLinks from './QuickLinks';

import { connect } from "react-redux";
import DatePicker from './DatePicker';

class SideBar extends Component {
  static propTypes = {
    scrollToElem: PropTypes.func.isRequired,
    showQuickLinks: PropTypes.bool,
    showDatePicker: PropTypes.bool,
  }

  render() {
    const quickLinks = this.props.showQuickLinks ? (
      <div className="navi hidden-sm hidden-xs">
        <hr />
        <QuickLinks scrollToElem={this.props.scrollToElem} />
      </div>
    ) : null;
    const datePicker = this.props.showDatePicker ? (
      <div className="hidden-sm hidden-xs">
        <hr />
        <DatePicker />
      </div>
    ) : null;

    return (
      <div className="col-lg-3 col-md-4 order-md-2 sidebar">
        <nav className="side_nav sticky-top">
          <SearchBox />
          {quickLinks}
          {datePicker}
        </nav>
      </div>
    );
  }
}
const mapReduxStateToProps = ({ chartsData, games }) => ({ showQuickLinks: chartsData.length > 0, showDatePicker: games.results.length > 0 })
export default connect(mapReduxStateToProps)(SideBar);
